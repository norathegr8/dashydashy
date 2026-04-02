---
name: signature-series
description: Suggest recurring signature series concepts based on content patterns. Use when the user says "suggest signature series", "signature series", "series ideas", "recurring series", or similar.
---

# Generate Signature Series

Analyze all of a creator's content to identify patterns and suggest 6 recurring series concepts they could own. Write the results into the analyzed JSON so the dashboard can display them.

## Process

1. Read `data/analyzed/tiktok-analyzed.json`
2. Read `config/hook-types.json` for hook type definitions
3. Analyze patterns across ALL videos:
   - **Content themes** — what topics come up repeatedly? (unboxing, events, tips, lifestyle, food, etc.)
   - **Hook type distribution** — which hooks does this creator naturally gravitate toward?
   - **Engagement patterns** — which themes + hook type combos drive the best metrics?
   - **Format patterns** — short vs long videos, solo vs collab, tutorial vs entertainment
   - **Unique differentiators** — what makes this creator different? (bilingual, specific niche, personality traits)
   - **Hashtag clusters** — what content categories do they self-identify with?
4. Based on the analysis, suggest **6 signature series** — recurring content formats the creator could commit to

## Data Structure

Add a `signatureSeries` array to the FIRST object in the analyzed JSON array. Structure:

```json
{
  "signatureSeries": [
    {
      "title": "Catchy series name",
      "description": "2-3 sentences explaining the series concept, format, and what makes it unique to this creator",
      "frequency": "Weekly, Bi-weekly, 2-3x per month, etc.",
      "hookType": "the primary hook type this series would use",
      "whyItWorks": "1-2 sentences explaining why this series fits this creator's strengths and audience, backed by their data",
      "tags": ["Tag1", "Tag2", "Tag3", "Tag4"]
    }
  ]
}
```

Exactly 6 series — this ensures an even grid layout in the dashboard.

## Guidelines for Series Suggestions

- **Ground every suggestion in data** — reference specific videos, engagement rates, or patterns that support the series idea
- **Mix content types** — include a mix of educational, entertaining, lifestyle, and community-building series
- **Vary hook types** — don't suggest all story-based or all list-based series
- **At least one should build on their top performer** — the content that already works
- **At least one should be experimental** — a new format or angle they haven't tried
- **Make titles memorable** — series names should be catchy and brandable (e.g. "Mafe's Content Ideas" not "Content Tips Series")
- **Consider posting frequency realistically** — a creator posting daily can handle more series than one posting 3x/week

## Output

After writing the file, print:
- The 6 series titles with their frequencies
- Key patterns identified that informed the suggestions
- Confirmation the data was written to the JSON
