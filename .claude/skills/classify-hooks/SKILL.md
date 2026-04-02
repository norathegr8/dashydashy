---
name: classify-hooks
description: Classify TikTok video hooks from scraped data. Use when the user says "classify the hooks", "analyze hooks", "run hook analysis", or similar.
---

# Classify Hooks

Read `data/raw/tiktok-videos.json` and classify the verbal hook for each video. Write the result to `data/analyzed/tiktok-analyzed.json`.

## Hook Types

Reference `config/hook-types.json` for the full list. The 8 types are:

- **question** — Opens with a direct question to the viewer
- **shock_contrarian** — Surprising or provocative statement to grab attention
- **story** — Starts with a narrative setup
- **insight** — Leads with a takeaway or lesson
- **authority** — Establishes credibility upfront
- **confession** — Personal admission or vulnerability
- **list** — Numbered or structured format
- **pattern_interrupt** — Unexpected opening that breaks viewer expectations

## Process

1. Read all videos from `data/raw/tiktok-videos.json`
2. For each video, look at the first 200 characters of the `transcript` field. If transcript is empty, fall back to the `caption` field
3. Extract the **hook** — the first 1-2 sentences of the spoken opener (what grabs attention)
4. Classify the hook into one of the 8 types above
5. Add these fields to each video object:
   - `hook` (string) — the extracted hook text
   - `hookType` (string) — one of: question, shock_contrarian, story, insight, authority, confession, list, pattern_interrupt, unknown
   - `hookTypeConfirmed` (boolean) — set to `false`
   - `hookConfidence` (float 0-1) — your confidence in the classification
   - `hookReasoning` (string) — brief explanation of why this type was chosen
6. Keep ALL existing fields from the raw data intact — only add the 5 hook fields
7. Write the full array to `data/analyzed/tiktok-analyzed.json`

## Output

After writing the file, print a summary:
- Total videos classified
- Hook type distribution (count per type)
- Top 3 hooks by engagement rate with their types

## Important

- The hook is what the creator SAYS, not the caption text
- Caption is only a fallback when there is no transcript
- If both transcript and caption are empty, set hookType to "unknown"
