# TikTok Creator Dashboard

A content intelligence dashboard for TikTok creators. Scrapes videos, analyzes hooks, generates content ideas, and suggests signature series.

## Project structure

- `scripts/` — Node.js scripts for scraping and transcript fetching
- `dashboard/index.html` — the single-file dashboard UI
- `data/raw/` — scraped video data with transcripts
- `data/analyzed/` — AI-enriched data (hooks, ideas, series)
- `config/hook-types.json` — the 8 hook type definitions
- `.claude/skills/` — skills for analysis

## The main skill

**`analyze-creator`** is the master skill that runs the entire pipeline. The user can say:

- "analyze @username"
- "analyze the last 30 videos from @username"
- "run the dashboard for @username"

If the username or video count is missing, ask for them. The skill handles everything: scrape, transcripts, hook classification, content ideas, signature series, and starting the dashboard server.

## Individual skills

These can also be run separately after the pipeline:

- **classify-hooks** — reclassify hooks (e.g. after SMM reviews and wants a fresh pass)
- **content-ideas** — regenerate content ideas
- **signature-series** — regenerate series suggestions

## Prerequisites

- The user must have **Apify connected** as an MCP tool (for TikTok scraping)
- **Node.js 18+** must be installed (for the dashboard server and transcript fetching)
- Run `npm install` if `node_modules/` doesn't exist

## Important notes

- The dashboard reads from `data/analyzed/tiktok-analyzed.json`
- Hook classification uses the first 200 chars of the TRANSCRIPT (what they say), not the caption
- Caption is only a fallback when no transcript exists
- Content ideas and signature series are stored on the first object in the analyzed JSON array
- The dashboard is a single HTML file — all rendering is client-side JS
- Dashboard server runs at http://localhost:3456
