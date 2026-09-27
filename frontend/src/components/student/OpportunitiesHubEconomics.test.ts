// @ts-ignore
import { expect, test } from 'bun:test';
import { fetchCuratedEconomicsOpportunities } from '../../services/economicsOpportunitiesService';

test('baseline timing for fetchCuratedEconomicsOpportunities with 700ms delay vs direct', async () => {
  const context = {
    studentName: 'Demo Student',
    diagnosticScore: 8,
    totalQuestions: 10,
    isPerfectScore: false,
    weakTopics: [],
    focusTopic: 'Scarcity',
    completedTasksCount: 0,
    totalTasksCount: 0,
  };

  const startWithDelay = performance.now();
  const [itemsWithDelay] = await Promise.all([
    fetchCuratedEconomicsOpportunities(context),
    new Promise((resolve) => setTimeout(resolve, 700)),
  ]);
  const durationWithDelay = performance.now() - startWithDelay;

  const startDirect = performance.now();
  const itemsDirect = await fetchCuratedEconomicsOpportunities(context);
  const durationDirect = performance.now() - startDirect;

  console.log(`With artificial delay: ${durationWithDelay.toFixed(2)}ms`);
  console.log(`Direct fetch: ${durationDirect.toFixed(2)}ms`);

  expect(itemsWithDelay).toEqual(itemsDirect);
  expect(durationWithDelay).toBeGreaterThanOrEqual(700);
});
