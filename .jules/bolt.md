## 2026-09-27 - Bundle Size Bottleneck with Large Static Charting Libraries

**Learning:** Static top-level imports of heavy libraries like `plotly.js-dist-min` (~6MB) include the entire library in the initial entry bundle (`index.js`), drastically slowing down initial load time for all users even if they don't view charts immediately.
**Action:** Use dynamic `import('plotly.js-dist-min')` inside `useEffect` / `React.lazy` to code-split heavy visualization libraries into separate async chunks loaded only when needed.

## 2026-09-27 - Route-Level Code Splitting for SPA Views

**Learning:** Importing all route views and modal components statically in the root `App.tsx` forces the browser to download and parse unused views (e.g., facilitator portal or subject learning pages) when a user visits the landing page.
**Action:** Use `React.lazy()` and `Suspense` for view components in single-page applications to split routes into on-demand chunks.
