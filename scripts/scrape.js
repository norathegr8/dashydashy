#!/usr/bin/env node

/**
 * TikTok Scraper Script
 * Uses Apify's clockworks/tiktok-scraper to pull the last N videos
 * from specified TikTok profiles and save to JSON.
 */

import { ApifyClient } from 'apify-client';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

config({ path: join(ROOT, '.env') });

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const PROFILES = process.env.TIKTOK_PROFILES?.split(',').map(p => p.trim()) || [];
const VIDEOS_PER_PROFILE = parseInt(process.env.VIDEOS_PER_PROFILE || '20', 10);

if (!APIFY_TOKEN) {
  console.error('Missing APIFY_API_TOKEN in .env');
  process.exit(1);
}
if (PROFILES.length === 0) {
  console.error('Missing TIKTOK_PROFILES in .env');
  process.exit(1);
}

async function scrape() {
  const client = new ApifyClient({ token: APIFY_TOKEN });

  console.log(`Scraping last ${VIDEOS_PER_PROFILE} videos for profiles: ${PROFILES.join(', ')}`);

  const input = {
    profiles: PROFILES,
    resultsPerPage: VIDEOS_PER_PROFILE,
    profileScrapeSections: ['videos'],
    profileSorting: 'latest',
    shouldDownloadCovers: true,
    downloadSubtitlesOptions: 'DOWNLOAD_AND_TRANSCRIBE_VIDEOS_WITHOUT_SUBTITLES',
    excludePinnedPosts: false,
  };

  console.log('Starting Apify run (clockworks/tiktok-scraper)...');
  const run = await client.actor('clockworks/tiktok-scraper').call(input);
  console.log(`Run finished with status: ${run.status}`);

  if (run.status !== 'SUCCEEDED') {
    console.error('Apify run did not succeed:', run.status);
    process.exit(1);
  }

  // Fetch all items from the dataset
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  console.log(`Retrieved ${items.length} videos total`);

  // Extract the best VTT subtitle URL from Apify's subtitleLinks array
  function getSubtitleUrl(item) {
    const links = item.videoMeta?.subtitleLinks || [];
    // Prefer English ASR, then any English, then first available
    const engAsr = links.find(l => l.language?.startsWith('eng') && l.source === 'ASR');
    const eng = links.find(l => l.language?.startsWith('eng'));
    const any = links[0];
    const best = engAsr || eng || any;
    return best?.downloadLink || '';
  }

  // Normalize and clean the data
  const videos = items.map(item => ({
    id: item.id || item.videoId || '',
    url: item.webVideoUrl || item.url || '',
    caption: item.text || item.desc || '',
    createTime: item.createTimeISO || item.createTime || '',
    author: {
      username: item.authorMeta?.name || item.author?.uniqueId || '',
      displayName: item.authorMeta?.nickName || item.author?.nickname || '',
      avatar: item.authorMeta?.avatar || '',
      followers: item.authorMeta?.fans || 0,
    },
    metrics: {
      views: item.playCount ?? item.videoMeta?.playCount ?? 0,
      likes: item.diggCount ?? item.videoMeta?.diggCount ?? 0,
      comments: item.commentCount ?? item.videoMeta?.commentCount ?? 0,
      shares: item.shareCount ?? item.videoMeta?.shareCount ?? 0,
      saves: item.collectCount ?? item.videoMeta?.collectCount ?? 0,
    },
    coverUrl: item.coverUrl || item.videoMeta?.coverUrl || '',
    transcript: '',
    subtitlesUrl: getSubtitleUrl(item),
    musicTitle: item.musicMeta?.musicName || '',
    duration: item.videoMeta?.duration || item.duration || 0,
    hashtags: (item.hashtags || []).map(h => h.name || h).filter(Boolean),
  }));

  const withSubs = videos.filter(v => v.subtitlesUrl).length;
  console.log(`Found VTT subtitle links for ${withSubs}/${videos.length} videos`);

  // Save raw output
  mkdirSync(join(ROOT, 'data', 'raw'), { recursive: true });
  const outputPath = join(ROOT, 'data', 'raw', 'tiktok-videos.json');
  writeFileSync(outputPath, JSON.stringify(videos, null, 2));
  console.log(`Saved ${videos.length} videos to ${outputPath}`);

  return videos;
}

scrape().catch(err => {
  console.error('Scrape failed:', err);
  process.exit(1);
});
