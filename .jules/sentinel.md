# Sentinel Security Journal

## 2026-03-29 - AI-Generated Link XSS via Unsanitized URL Schemes
**Vulnerability:** AI search service (`searchOpportunitiesWithAI`) parsed LLM outputs containing `learnMoreUrl` and `registrationUrl` and passed them directly to UI anchor elements (`<a href={...}>`), creating an XSS risk if prompt injection or model outputs yielded `javascript:` or `data:` schemes.
**Learning:** External or AI-generated string fields used as hyperlink targets (`href`) must be treated as untrusted user input, as LLM outputs can be manipulated or hallucinate non-HTTP schemes.
**Prevention:** Validate and sanitize all dynamic URLs against an explicit `http://` / `https://` protocol allowlist before rendering them in `href` attributes.
