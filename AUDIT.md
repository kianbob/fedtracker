# OpenFeds Site Audit — Feb 18, 2026

## Critical Bugs
1. **Agencies page renders empty** — web_fetch only returns footer. Likely client component not rendering or data loading issue.
2. **States page renders empty** — same issue, only footer visible
3. **Trends page renders empty** — same issue
4. **ALL CAPS names everywhere** — All 124 agencies, all occupations are in ALL CAPS. cleanAgencyName() exists but isn't consistently applied to data files.
5. **Suspicious salary data** — MATERIALS HANDLER at $299K, MISC TRANSPORTATION at $479K. Likely data quality issue (outliers or calculation errors in weighted avg).

## Design/UX Issues
6. **No page-specific titles** — All pages show "OpenFeds — Federal Workforce Data" (the layout default). Need unique titles per page.
7. **No sitemap.ts** — Missing sitemap for SEO
8. **No robots.ts** — Missing robots.txt
9. **No OG image** — No social preview image
10. **Agency names need Title Case** — "DEPARTMENT OF TREASURY" → "Department of the Treasury"
11. **Occupation names need Title Case** — "GENERAL ATTORNEY" → "General Attorney"
12. **Homepage agency cards are plain** — No visual hierarchy, no color accents
13. **No breadcrumbs** on detail pages
14. **No "DOGE" or timely angle** on the homepage — Missing the hook
15. **Layoffs page: only 381 RIFs** — Data only goes through March 2025, need to frame this clearly
16. **No disclaimer/data freshness banner**
17. **No search on homepage** — Should have quick agency search

## Missing Features
18. **No social sharing buttons**
19. **No RSS feed**
20. **No downloads page** — Should offer CSV downloads
21. **No "Compare Agencies" tool**
22. **No JSON-LD structured data**
23. **No internal linking between related content** (agency → related states, occupation → agencies)
