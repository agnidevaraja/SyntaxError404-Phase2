# Palette's Journal - UX & Accessibility Critical Learnings

## 2025-05-18 - Modal Keyboard Dismissal & ARIA Dialog Semantics
**Learning:** Modal dialogs built using custom fixed overlays lack default screen reader announcement context and keyboard Escape key handling unless explicitly configured. Supplying `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` ensures screen readers properly encapsulate modal content, while registering a global `keydown` Escape event listener makes overlay dismissal natural for keyboard-only users.
**Action:** When adding or updating custom modal overlays in React, always attach `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and an `useEffect` hook listening for the `Escape` key.

## 2025-05-18 - Keyboard Focus-Visible Ring Architecture
**Learning:** Standard browser focus indicators can be subtle or obscured by card borders. Defining global `:focus-visible` ring outlines with explicit offset ensures high-contrast keyboard navigation visibility without interfering with mouse click focus states.
**Action:** Add CSS `:focus-visible` rules for `button`, `a`, `aria-label` controls, and inputs in root CSS stylesheets.

## 2025-05-18 - Hardware-Accelerated Micro-Animations & Tactile Spring Physics
**Learning:** CSS transitions utilizing cubic-bezier timing functions create natural spring-like tactile responsiveness on hover and press states without layout reflows or performance overhead.
**Action:** Use CSS transform transitions with spring cubic-bezier timing functions on `.btn-tactile` and `.card-hover` helper classes.
