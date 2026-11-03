# Cardio-Diabetic Brand Desk

A static website for pharma brand teams. Search any cardio-diabetic molecule or fixed-dose combination to see:

- the top 10 brands in India, ranked by last-year revenue, with their available doses
- the specialists to target, by priority
- interactive tools: a strength gap finder, a field-force planner and a 12-month launch timeline you can play
- a **Build our brand plan** button that downloads a designed PDF brand plan

No server, no database and no AI service. Everything runs in the browser, so it also works offline once downloaded.

## Deploy on GitHub Pages (5 minutes)

1. Create a new repository on GitHub, for example `brand-desk`.
2. Upload every file and folder from this package to the repository root (drag and drop on the GitHub web page works), then commit.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
5. After a minute your site is live at `https://<your-username>.github.io/brand-desk/`.

To use it offline, open `index.html` directly in Chrome or Edge.

## Updating the market data

All data lives in **`assets/js/data.js`**. Edit it on GitHub (pencil icon), commit, and the website updates for everyone.

Each brand looks like this:

```js
{ brand: "Telma", company: "Glenmark", doses: ["20 mg", "40 mg", "80 mg"], revenue_cr: 512, period: "MAT Mar 2026" }
```

- `revenue_cr` is last-year revenue in ₹ crore from your AWACS / PharmaTrac / Pharmarack MAT report. Use `null` if unknown.
- Brands are ranked by `revenue_cr`, highest first. Only the top 10 are shown.
- To add a new molecule, copy an existing block and set `cls` to one of: `SGLT2`, `DPP4`, `SUMET`, `BIG`, `ARB`, `CCB`, `BB`, `STATIN`, `ARNI`, `ANTIPLT`, `GLITAZAR`, `MRA`, `OTHER`. The class decides which specialists are shown and how the brand plan is written.

### Quick import (one browser only)

Use **Import revenue CSV** on the site to try new numbers without editing code. The format is in `data/brand-revenue-template.csv` (doses separated by `;`). Imported rows are saved only in that browser.

## Files

```
index.html                      page
assets/css/style.css            design
assets/fonts/                   Instrument Sans (self-hosted, SIL Open Font Licence) so the site looks right offline
assets/js/data.js               market data (edit this)
assets/js/plan.js               specialist rules, brand-plan rules, PDF layout
assets/js/app.js                search, list, modal, CSV import
assets/js/interact.js           animations, gap finder, field-force planner, timeline player, live preview
assets/vendor/jspdf.umd.min.js  PDF library (jsPDF 2.5.1, MIT licence)
data/brand-revenue-template.csv CSV import template
```

## What the brand plan PDF contains

Five to six pages, built mostly from charts rather than paragraphs, with one type scale throughout:

- Cover with an at-a-glance strip (brands in market, benchmark, revenue or strengths, positioning)
- Executive summary as three short cards: the market, our play, who we target
- Market landscape: stat tiles, revenue bar chart and revenue-share bar (shown only when two or more brands have revenue), and a strength-coverage matrix showing which brand sells which strength, with our launch range as the last row
- Positioning statement, target patient and benchmark card
- Key messages and differentiation levers as cards
- Specialist targeting: field-effort split chart, priority and calls a month per specialty
- 12-month plan as a Gantt timeline, colour-coded by workstream
- KPI target trajectory chart and KPI table, risk heat map, compliance note

Columns are never left blank: revenue appears only as a chart when there is enough data to compare, and the brand table shows strengths, which every brand has.

## Notes

- Built-in brand lists contain well-established brands only. Built-in revenue is filled only where a public figure exists (Glycomet-GP, MAT Aug 2025). Add the rest from your licensed audit data.
- The brand plan is a rule-based starting draft for internal planning. Keep all promotion within UCPMP 2024.
