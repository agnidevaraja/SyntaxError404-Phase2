// @ts-ignore
import { describe, test, expect } from 'bun:test';
import { CURRICULUM_CONCEPT_NODES } from '../data/diagnosticQuestions';

describe('Lookup Performance Benchmark', () => {
  test('measures array.find vs Map.get over 1,000,000 iterations', () => {
    const testUnitIds = ['unit-1', 'unit-2', 'unit-3', 'unit-4', 'unit-5', 'non-existent-unit'];
    const iterations = 1000000;

    // Baseline: Array.find
    const startFind = performance.now();
    for (let i = 0; i < iterations; i++) {
      const uid = testUnitIds[i % testUnitIds.length];
      const node = CURRICULUM_CONCEPT_NODES.find((n) => n.unitId === uid);
    }
    const endFind = performance.now();
    const findTime = endFind - startFind;

    // Map Lookup
    const map = new Map(CURRICULUM_CONCEPT_NODES.map((n) => [n.unitId, n]));
    const startMap = performance.now();
    for (let i = 0; i < iterations; i++) {
      const uid = testUnitIds[i % testUnitIds.length];
      const node = map.get(uid);
    }
    const endMap = performance.now();
    const mapTime = endMap - startMap;

    console.log(`\n=== BENCHMARK RESULTS (${iterations.toLocaleString()} iterations) ===`);
    console.log(`Array.find time: ${findTime.toFixed(3)} ms`);
    console.log(`Map.get time:    ${mapTime.toFixed(3)} ms`);
    console.log(`Speedup factor:  ${(findTime / mapTime).toFixed(2)}x faster`);
    console.log(`=========================================\n`);

    expect(mapTime).toBeLessThan(findTime);
  });
});
