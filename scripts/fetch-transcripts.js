#!/usr/bin/env node

/**
 * Fetch VTT subtitle files and parse them into plain text transcripts.
 * Reads subtitlesUrl from the raw scraped data — no hardcoded URLs.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function parseVTT(vttText) {
  const lines = vttText.split('\n');
  const textLines = [];
  let inCue = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === 'WEBVTT' || trimmed.startsWith('NOTE') || trimmed.startsWith('Kind:') || trimmed.startsWith('Language:')) continue;
    if (trimmed === '') { inCue = false; continue; }
    if (trimmed.match(/^\d+$/)) continue;
    if (trimmed.match(/\d{2}:\d{2}[\.:]\d{2,3}\s*-->/)) { inCue = true; continue; }

    if (inCue) {
      const clean = trimmed.replace(/<[^>]+>/g, '').trim();
      if (clean && !textLines.includes(clean)) {
        textLines.push(clean);
      }
    }
  }

  return textLines.join(' ');
}

async function fetchTranscripts() {
  const rawPath = join(ROOT, 'data', 'raw', 'tiktok-videos.json');
  let videos;

  try {
    videos = JSON.parse(readFileSync(rawPath, 'utf-8'));
  } catch {
    console.error(`No scraped data found at ${rawPath}. Run "npm run scrape" first.`);
    process.exit(1);
  }

  console.log(`Fetching transcripts for ${videos.length} videos...`);

  let fetched = 0;
  let skipped = 0;
  let failed = 0;

  for (const video of videos) {
    if (!video.subtitlesUrl) {
      skipped++;
      continue;
    }

    try {
      const res = await fetch(video.subtitlesUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const vttText = await res.text();
      video.transcript = parseVTT(vttText);
      fetched++;
      console.log(`  [${fetched}] ${video.id}: ${video.transcript.slice(0, 60)}...`);
    } catch (err) {
      console.error(`  [fail] ${video.id}: ${err.message}`);
      failed++;
    }
  }

  writeFileSync(rawPath, JSON.stringify(videos, null, 2));
  console.log(`\nDone: ${fetched} transcripts fetched, ${skipped} skipped (no VTT), ${failed} failed`);
}

fetchTranscripts();
