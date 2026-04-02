---
name: content-ideas
description: Generate spin-off content ideas from top performing videos. Use when the user says "generate content ideas", "content ideas", "spin-off ideas", or similar.
---

# Generate Content Ideas

Read the analyzed data, identify the top 5 performing videos, and generate 5 spin-off content ideas for each. Write the results into the analyzed JSON so the dashboard can display them.

## Process

1. Read `data/analyzed/tiktok-analyzed.json`
2. Read `config/hook-types.json` for hook type definitions
3. Rank all videos by engagement rate: `(likes + comments + saves + shares) / views`
4. Take the **top 5** videos by engagement rate
5. For each of the 5 videos, generate **5 content ideas** that are inspired by the original but offer a fresh angle. Each idea should:
   - Have a different hook type than the original when possible (to diversify the creator's strategy)
   - Be actionable — the creator should be able to film it immediately
   - Include a suggested hook type from the 8 types
   - Be specific to the creator's niche and style (analyze their existing content for tone)

## Data Structure

Add a `contentIdeas` array to the FIRST object in the analyzed JSON array. Structure:

```json
{
  "contentIdeas": [
    {
      "sourceHook": "the original hook text from the top video",
      "sourceViews": 31700,
      "sourceLikes": 4248,
      "sourceHookType": "insight",
      "ideas": [
        {
          "title": "Short punchy title for the content idea",
          "description": "1-2 sentences explaining the concept and angle",
          "hookType": "list"
        }
      ]
    }
  ]
}
```

Each of the 5 groups has exactly 5 ideas — 25 ideas total.

## Guidelines for Generating Ideas

- **Vary the hook types** — if the original was a story hook, suggest ideas using question, list, authority, etc.
- **Keep the creator's voice** — analyze their captions and transcripts for tone (casual, energetic, bilingual, etc.)
- **Mix formats** — suggest a mix of short-form (7s skits), medium (30-60s), and long-form (2-3min) content
- **Make them saveable** — ideas that viewers would bookmark perform best (lists, tutorials, tips)
- **Include at least one series idea** per group — something that could become recurring

## Output

After writing the file, print:
- The 5 source videos used (hook + views)
- Count of ideas per hook type across all 25
- Confirmation the data was written to the JSON
