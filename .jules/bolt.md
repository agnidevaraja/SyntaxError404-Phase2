## 2026-09-27 - Bundle Size Bottleneck with Large Static Charting Libraries

**Learning:** Static top-level imports of heavy libraries like `plotly.js-dist-min` (~6MB) include the entire library in the initial entry bundle (`index.js`), drastically slowing down initial load time for all users even if they don't view charts immediately.
**Action:** Use dynamic `import('plotly.js-dist-min')` inside `useEffect` / `React.lazy` to code-split heavy visualization libraries into separate async chunks loaded only when needed.
