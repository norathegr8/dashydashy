#!/usr/bin/env node

/**
 * AI Analysis Script
 * Reads scraped TikTok data, uses Claude API to:
 * 1. Extract the hook (first few lines of transcript/caption)
 * 2. Classify the hook type from the 8 categories
 * 3. Save enriched data to data/analyzed/
 */

import Anthropic from '@anthropic-ai/sdk';
import { config } from 'dotenv';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

config({ path: join(ROOT, '.env') });

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
if (!CLAUDE_API_KEY) {
  console.error('Missing CLAUDE_API_KEY in .env');
  process.exit(1);
}

const hookTypes = JSON.parse(
  readFileSync(join(ROOT, 'config', 'hook-types.json'), 'utf-8')
);

const HOOK_TYPE_LIST = hookTypes.hookTypes
  .map(h => `- "${h.id}": ${h.name} — ${h.description}`)
  .join('\n');

const anthropic = new Anthropic({ apiKey: CLAUDE_API_KEY });

async function classifyHook(video) {
  // Use first 200 chars of transcript as the primary hook source
  const transcriptOpener = video.transcript ? video.transcript.slice(0, 200) : '';
  const contentText = [
    transcriptOpener ? `SPOKEN OPENER (first 200 chars of transcript): ${transcriptOpener}` : '',
    video.caption ? `CAPTION: ${video.caption}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  if (!contentText.trim()) {
    return {
      hook: '',
      hookType: 'unknown',
      hookConfidence: 0,
      hookReasoning: 'No transcript or caption available',
    };
  }

  const prompt = `You are analyzing a TikTok video's opening hook for a content strategy dashboard.

Given the following video content, do two things:

1. **Extract the hook**: The hook is the verbal opener — the first 1-2 sentences the creator SAYS in the video. Use the SPOKEN OPENER (transcript) if available. Only fall back to the CAPTION if no transcript exists.

2. **Classify the hook type** from this list:
${HOOK_TYPE_LIST}

VIDEO CONTENT:
${contentText}

Respond in this exact JSON format (no markdown, no code blocks):
{"hook": "the extracted hook text", "hookType": "the_hook_type_id", "hookConfidence": 0.85, "hookReasoning": "brief explanation of why this hook type was chosen"}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].text.trim();
    // Try to parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      hook: '',
      hookType: 'unknown',
      hookConfidence: 0,
      hookReasoning: 'Failed to parse AI response',
    };
  } catch (err) {
    console.error(`  Error classifying video ${video.id}:`, err.message);
    return {
      hook: '',
      hookType: 'error',
      hookConfidence: 0,
      hookReasoning: `API error: ${err.message}`,
    };
  }
}

async function analyze() {
  const inputPath = join(ROOT, 'data', 'raw', 'tiktok-videos.json');
  let videos;

  try {
    videos = JSON.parse(readFileSync(inputPath, 'utf-8'));
  } catch {
    console.error(`No scraped data found at ${inputPath}. Run "npm run scrape" first.`);
    process.exit(1);
  }

  console.log(`Analyzing ${videos.length} videos with Claude API...`);

  const analyzed = [];
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    console.log(`  [${i + 1}/${videos.length}] Analyzing: ${video.caption?.slice(0, 50) || video.id}...`);

    const hookData = await classifyHook(video);

    analyzed.push({
      ...video,
      hook: hookData.hook,
      hookType: hookData.hookType,
      hookTypeConfirmed: false, // SMM can override
      hookConfidence: hookData.hookConfidence,
      hookReasoning: hookData.hookReasoning,
      _raw: undefined, // strip raw data for analyzed output
    });

    // Small delay to avoid rate limiting
    if (i < videos.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  mkdirSync(join(ROOT, 'data', 'analyzed'), { recursive: true });
  const outputPath = join(ROOT, 'data', 'analyzed', 'tiktok-analyzed.json');
  writeFileSync(outputPath, JSON.stringify(analyzed, null, 2));
  console.log(`Saved analyzed data to ${outputPath}`);

  // Print quick summary
  const hookCounts = {};
  analyzed.forEach(v => {
    hookCounts[v.hookType] = (hookCounts[v.hookType] || 0) + 1;
  });
  console.log('\nHook Type Distribution:');
  Object.entries(hookCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

  return analyzed;
}

analyze().catch(err => {
  console.error('Analysis failed:', err);
  process.exit(1);
});
