# TikTok Creator Dashboard

A content intelligence dashboard that analyzes any TikTok creator's content — their hooks, engagement patterns, and growth opportunities. Built for social media managers using Claude Code.

## What You Get

| Section | What It Shows |
|---------|--------------|
| **Content Library** | Every video with metrics, transcripts, and AI-classified hooks |
| **Top Performing** | Best content ranked by engagement rate |
| **Hook Strategy** | Which opening hooks drive the most views, saves, and shares |
| **Content Ideas** | 25 spin-off ideas based on the top 5 performing videos |
| **Signature Series** | 6 recurring series concepts tailored to the creator's strengths |

## Quick Start

### 1. Clone this repo

```bash
git clone <this-repo>
cd tiktok-creator-dashboard
```

### 2. Run the setup script

```bash
bash setup.sh
```

This will:
- Check that Node.js is installed
- Ask for your **Apify API token** ([get one here](https://console.apify.com/account/integrations))
- Ask for the **TikTok username** you want to analyze
- Install dependencies

### 3. Scrape the creator's content

```bash
npm run pipeline
```

This pulls the creator's recent videos from TikTok and fetches spoken transcripts. Takes 1-2 minutes.

### 4. Analyze with Claude Code

Open this project in Claude Code and run these three commands:

```
classify the hooks
```
```
generate content ideas
```
```
suggest signature series
```

Claude will analyze the content and populate the dashboard data.

### 5. View the dashboard

```bash
npm start
```

Open **http://localhost:3456** in your browser.

---

## Setting Up for a Different Client

Just edit the `.env` file:

```
TIKTOK_PROFILES=new_username_here
VIDEOS_PER_PROFILE=20
```

Then run the pipeline and skills again:

```bash
npm run pipeline
```

Then in Claude Code:
```
classify the hooks
generate content ideas
suggest signature series
```

---

## Hook Types

The AI classifies every video's opening hook into one of 8 types:

| Type | What It Means |
|------|--------------|
| **Question** | Opens with a direct question to the viewer |
| **Shock/Contrarian** | Surprising or provocative statement |
| **Story** | Starts with a narrative setup |
| **Insight** | Leads with a takeaway or lesson |
| **Authority** | Establishes credibility upfront |
| **Confession** | Personal admission or vulnerability |
| **List** | Numbered or structured format |
| **Pattern Interrupt** | Unexpected opening that breaks expectations |

---

## What You Need

- **Node.js 18+** — [download here](https://nodejs.org)
- **Apify account** — [free tier works](https://apify.com) (for TikTok scraping)
- **Claude Code** — for AI analysis (no separate API key needed)

## Cost

- **Apify**: ~$0.25-0.50 per scrape (20 videos)
- **Claude Code**: Included in your subscription
- **Total per client**: Under $1

---

## Project Structure

```
tiktok-creator-dashboard/
├── setup.sh                  # Quick setup script
├── CLAUDE.md                 # Guide for Claude Code
├── .env.example              # Config template
├── config/
│   └── hook-types.json       # Hook type definitions
├── scripts/
│   ├── scrape.js             # TikTok scraper (Apify)
│   ├── fetch-transcripts.js  # VTT transcript parser
│   ├── analyze.js            # Hook classifier (optional, needs API key)
│   ├── pipeline.js           # Runs scrape + transcripts
│   └── serve.js              # Dashboard server
├── data/                     # Generated data (gitignored for client privacy)
├── dashboard/
│   └── index.html            # The dashboard
└── .claude/
    └── skills/               # Claude Code skills
        ├── classify-hooks/
        ├── content-ideas/
        └── signature-series/
```

## NPM Commands

| Command | What It Does |
|---------|-------------|
| `npm run pipeline` | Scrape TikTok + fetch transcripts |
| `npm run scrape` | Scrape only |
| `npm run fetch-transcripts` | Fetch transcripts only |
| `npm start` | Start dashboard at localhost:3456 |
