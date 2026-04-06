# TikTok Creator Dashboard

A content intelligence dashboard that analyzes any TikTok creator's content — their hooks, engagement patterns, and growth opportunities. Built for social media managers using Claude Code.

## What You Get

| Section | What It Shows |
|---------|--------------|
| **Content Library** | Recent videos with metrics, transcripts, and AI-classified hooks |
| **Top Performing** | Best content ranked by engagement rate |
| **Hook Strategy** | Which opening hooks drive the most views, saves, and shares |
| **Content Ideas** | 25 spin-off ideas based on the top 5 performing videos |
| **Signature Series** | 6 recurring series concepts tailored to the creator's strengths |

---

## Before You Start

Make sure you have these three things:

1. **Claude Code desktop app** — [Download here](https://claude.ai/download). Install it like any other app.
2. **Apify connected in Claude Code** — Apify is the tool that scrapes TikTok. You need to connect it in Claude Code's settings under MCP connectors. If you haven't done this yet, ask Claude Code: "help me connect Apify".
3. **Node.js** — [Download here](https://nodejs.org). Click the big green LTS button and install it. This is needed to run the dashboard in your browser.

---

## Setup (Do This Once)

### Step 1: Download this project

On this GitHub page, click the green **Code** button, then click **Download ZIP**.

A file called `dashydashy-main.zip` will download to your **Downloads** folder.

### Step 2: Unzip and move the folder

1. Go to your **Downloads** folder
2. Double-click `dashydashy-main.zip` to unzip it
3. You'll see a folder called `dashydashy-main`
4. **Drag this folder to your Desktop** (or anywhere you'll remember — Documents works too)
5. You can rename it if you want (e.g. "TikTok Dashboard")

### Step 3: Open it in Claude Code

1. Open the **Claude Code desktop app**
2. Click **Open Project** (or go to File > Open Folder)
3. Navigate to your **Desktop** (or wherever you put the folder)
4. Select the `dashydashy-main` folder and click **Open**

You should now see the project open in Claude Code.

### Step 4: Install dependencies

In the Claude Code chat, type:

```
run npm install
```

Wait for it to finish. You only need to do this once.

---

## Analyze a Creator

In the Claude Code chat, type:

```
analyze @username, last 20 videos
```

Replace `@username` with the TikTok creator you want to analyze. For example:

```
analyze @lana.k.social, last 20 videos
```

Want more videos? Just change the number:

```
analyze @lana.k.social, last 50 videos
```

Claude will take a few minutes to:
1. Scrape the creator's TikTok videos
2. Fetch spoken transcripts from each video
3. Classify each video's opening hook into one of 8 types
4. Generate 25 content spin-off ideas
5. Suggest 6 signature series concepts
6. Start the dashboard

### View the dashboard

When Claude says it's done, open your web browser (Chrome, Safari, etc.) and go to:

**http://localhost:3456**

Your dashboard is ready! Click through the 5 tabs on the left sidebar to explore.

---

## Analyzing a Different Creator

Want to run this for another client? Just type:

```
analyze @newusername, last 20 videos
```

Claude will clear the old data and start fresh for the new creator.

---

## Sharing the Dashboard with Your Client

Every time you analyze a creator, Claude automatically updates a folder in your project called **`upload-this-to-github`**. That folder has everything your client needs — you just upload it to a new GitHub repo and turn on GitHub Pages.

### Step 1: Create a GitHub account (if you don't have one)

Go to [github.com](https://github.com) and sign up. It's free.

### Step 2: Create a new repository

1. Click the **+** button in the top right corner of GitHub
2. Click **New repository**
3. Name it something like `lana-dashboard` (use your client's name)
4. Set it to **Public** (required for free GitHub Pages)
5. Click **Create repository**

### Step 3: Upload the files

1. On the new repo page, click **uploading an existing file**
2. Open the **`upload-this-to-github`** folder inside your project
3. Drag the **two folders inside it** into GitHub's upload area:
   - `dashboard`
   - `data`
4. Click **Commit changes**

> ⚠️ Drag the folders *inside* `upload-this-to-github`, not the `upload-this-to-github` folder itself.

### Step 4: Enable GitHub Pages

1. Go to your repo's **Settings** tab
2. In the left sidebar, click **Pages**
3. Under "Source", select **main** branch
4. Under "Folder", select **/ (root)**
5. Click **Save**
6. Wait 1–2 minutes for it to deploy

### Step 5: Share the link

Your client's dashboard will be live at:

**https://yourusername.github.io/lana-dashboard/dashboard/**

Send this link to your client. They can open it from any browser — no installs, no login needed.

### Updating the dashboard

When you re-run the analysis for the same client, Claude will automatically update `upload-this-to-github` again. Just go back to your GitHub repo, click **Add file → Upload files**, and re-upload the `data` folder from inside `upload-this-to-github`. The site will update within a few minutes.

---

## Re-running Parts Separately

Already ran the full analysis but want to regenerate just one section? Type any of these:

| What to type | What it does |
|---|---|
| `classify the hooks` | Re-classify all video hooks |
| `generate content ideas` | Regenerate the 25 spin-off ideas |
| `suggest signature series` | Regenerate the 6 series concepts |

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

## Troubleshooting

**"No Data Yet" on the dashboard?**
You need to run the analysis first. Type `analyze @username, last 20 videos` in Claude Code.

**Dashboard won't load at localhost:3456?**
Type `npm start` in Claude Code to restart the server.

**Apify scrape failing?**
Make sure Apify is connected in Claude Code. Type "help me connect Apify" if you're not sure.

**"node not found" or "npm not found" errors?**
You need to install Node.js. Download it from [nodejs.org](https://nodejs.org).

---

## Cost

- **Apify**: ~$0.25-0.50 per scrape (20 videos)
- **Claude Code**: Included in your subscription
- **Total per client**: Under $1
