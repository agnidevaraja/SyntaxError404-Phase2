
## OpportunitiesHub Promise Delay Removal (September 2026)
- **Issue**: `frontend/src/components/student/OpportunitiesHub.tsx` wrapped `fetchCuratedOpportunities` in a `Promise.all` with a `setTimeout(resolve, 700)` artificial delay.
- **Fix**: Replaced `Promise.all` and `setTimeout` with a direct `await fetchCuratedOpportunities(performanceContext)`.
- **Impact**: Reduced loading time from ~701.79ms down to ~0.04ms (virtual instantaneous response in mock environment).
