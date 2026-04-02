---
name: analyze-creator
description: Full end-to-end TikTok creator analysis. Use when the user says "analyze a creator", "analyze @username", "run the dashboard for @username", "scrape and analyze", or wants to analyze a TikTok profile. This is the master skill that runs the full pipeline.
---

# Analyze Creator — Full Pipeline

This skill runs the entire TikTok Creator Dashboard pipeline end-to-end: scrape, transcripts, hook classification, content ideas, and signature series.

## Step 1: Get the inputs

Parse the user's message for:
- **TikTok username** — look for @username or just a username
- **Number of videos** — look for a number like "last 30 videos", "20 videos", etc.

If the username is missing, ask: "What TikTok username do you want to analyze?"
If the video count is missing, ask: "How many recent videos should I pull? (e.g. 20, 50, 100)"

Strip the @ symbol if present. Only proceed once you have both values.

## Step 2: Scrape via Apify

Use the Apify MCP tool `call-actor` with:
- actor: `clockworks/tiktok-scraper`
- input:
  ```json
  {
    "profiles": ["<username>"],
    "resultsPerPage": <video_count>,
    "profileScrapeSections": ["videos"],
    "profileSorting": "latest",
    "shouldDownloadCovers": true,
    "downloadSubtitlesOptions": "DOWNLOAD_AND_TRANSCRIBE_VIDEOS_WITHOUT_SUBTITLES",
    "excludePinnedPosts": true
  }
  ```

After the run completes, use `get-actor-output` to fetch the full dataset.

## Step 3: Normalize and save raw data

For each video item from Apify, normalize to this structure and write to `data/raw/tiktok-videos.json`:

```json
{
  "id": "video id",
  "url": "webVideoUrl",
  "caption": "text field (full caption with emojis)",
  "createTime": "createTimeISO",
  "author": {
    "username": "authorMeta.name",
    "displayName": "authorMeta.nickName",
    "avatar": "authorMeta.avatar",
    "followers": "authorMeta.fans"
  },
  "metrics": {
    "views": "playCount",
    "likes": "diggCount",
    "comments": "commentCount",
    "shares": "shareCount",
    "saves": "collectCount"
  },
  "coverUrl": "videoMeta.coverUrl",
  "transcript": "",
  "subtitlesUrl": "first English downloadLink from videoMeta.subtitleLinks array",
  "musicTitle": "musicMeta.musicName",
  "duration": "videoMeta.duration",
  "hashtags": ["from hashtags array, filter empty strings"]
}
```

Note: Apify may return nested objects OR dot-notation keys (e.g. `videoMeta.coverUrl` as a top-level key). Handle both formats.

Create `data/raw/` directory with `mkdir -p` before writing.

## Step 4: Fetch VTT transcripts

For each video that has a `subtitlesUrl`, fetch the VTT file and parse it into plain text:
- Skip WEBVTT headers, NOTE lines, Kind/Language lines
- Skip empty lines, cue numbers (digits only), timestamp lines (contain -->)
- Strip HTML tags like `<c>`, `</c>`
- Deduplicate consecutive identical lines
- Join with spaces

Write transcripts back into each video's `transcript` field in `data/raw/tiktok-videos.json`.

You can use a Node.js script via Bash for this (run with `export PATH="/usr/local/bin:$PATH"`), or fetch each VTT URL individually.

## Step 5: Classify hooks

Follow the instructions in `.claude/skills/classify-hooks/SKILL.md`:
- For each video, extract the hook from the first 200 chars of transcript (fall back to caption)
- Classify into one of the 8 hook types from `config/hook-types.json`
- Add hook, hookType, hookTypeConfirmed, hookConfidence, hookReasoning fields
- Write to `data/analyzed/tiktok-analyzed.json`

Create `data/analyzed/` directory with `mkdir -p` before writing.

## Step 6: Generate content ideas

Follow the instructions in `.claude/skills/content-ideas/SKILL.md`:
- Rank videos by engagement rate: (likes + comments + saves + shares) / views
- Take top 5
- Generate 5 spin-off ideas per video (25 total)
- Add `contentIdeas` array to the first object in the analyzed JSON
- Write back to `data/analyzed/tiktok-analyzed.json`

## Step 7: Generate signature series

Follow the instructions in `.claude/skills/signature-series/SKILL.md`:
- Analyze all content for patterns (themes, hook types, engagement, formats)
- Suggest exactly 6 recurring series
- Add `signatureSeries` array to the first object in the analyzed JSON
- Write back to `data/analyzed/tiktok-analyzed.json`

## Step 8: Start the dashboard

Run the dashboard server:
```bash
export PATH="/usr/local/bin:$PATH" && cd "<project_root>" && nohup node scripts/serve.js > /dev/null 2>&1 &
```

Tell the user: "Your dashboard is ready at http://localhost:3456"

## Output

After completing all steps, give the user a summary:
- Creator name and follower count
- Number of videos scraped
- Number of transcripts fetched
- Hook type distribution
- Top 3 videos by engagement rate
- The 6 signature series titles
- Link to the dashboard

## Important notes

- Always create directories before writing files (`mkdir -p`)
- Use `export PATH="/usr/local/bin:$PATH"` before any node/npm commands in Bash
- If the Apify scrape fails, tell the user to check their Apify connection
- If a step fails, report the error and continue with remaining steps where possible
- Kill any existing process on port 3456 before starting the server: `kill $(lsof -ti:3456) 2>/dev/null`
