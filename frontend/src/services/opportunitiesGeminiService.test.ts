import { sanitizeUrl } from './opportunitiesGeminiService';

// Bun test runner global definitions
declare global {
  function describe(name: string, fn: () => void): void;
  function test(name: string, fn: () => void): void;
  const expect: (actual: any) => {
    toBe: (expected: any) => void;
  };
}

describe('sanitizeUrl Security Tests', () => {
  test('allows valid http and https URLs', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
    expect(sanitizeUrl('http://example.com/path?query=1')).toBe('http://example.com/path?query=1');
  });

  test('blocks javascript: URLs and falls back to safe default', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
    expect(sanitizeUrl('JAVASCRIPT:alert(document.cookie)', 'https://fallback.com')).toBe('https://fallback.com');
  });

  test('blocks data: and vbscript: URLs', () => {
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#');
    expect(sanitizeUrl('vbscript:msgbox("XSS")')).toBe('#');
  });

  test('handles null, undefined, or empty values safely', () => {
    expect(sanitizeUrl(undefined)).toBe('#');
    expect(sanitizeUrl('')).toBe('#');
    expect(sanitizeUrl('   ')).toBe('#');
  });
});
