#!/usr/bin/env node

/**
 * Pipeline — scrapes TikTok videos and fetches transcripts.
 * Hook classification is done separately:
 *   - In Claude Code: ask Claude to "classify the hooks"
 *   - Or via script: npm run analyze (requires CLAUDE_API_KEY)
 */

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

console.log('=== TikTok Creator Dashboard Pipeline ===\n');

try {
  console.log('STEP 1: Scraping TikTok videos...\n');
  execSync('node scripts/scrape.js', { cwd: ROOT, stdio: 'inherit' });

  console.log('\n---\n');

  console.log('STEP 2: Fetching transcripts from VTT files...\n');
  execSync('node scripts/fetch-transcripts.js', { cwd: ROOT, stdio: 'inherit' });

  console.log('\n=== Pipeline complete! ===');
  console.log('Raw data with transcripts saved to data/raw/tiktok-videos.json');
  console.log('\nNext step — classify hooks:');
  console.log('  In Claude Code: ask "classify the hooks"');
  console.log('  Or run: npm run analyze (requires CLAUDE_API_KEY in .env)');
} catch (err) {
  console.error('\nPipeline failed:', err.message);
  process.exit(1);
}
