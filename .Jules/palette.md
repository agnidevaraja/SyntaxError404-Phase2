# Palette's Journal - UX & Accessibility Critical Learnings

## 2025-05-18 - Modal Keyboard Dismissal & ARIA Dialog Semantics
**Learning:** Modal dialogs built using custom fixed overlays lack default screen reader announcement context and keyboard Escape key handling unless explicitly configured. Supplying `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` ensures screen readers properly encapsulate modal content, while registering a global `keydown` Escape event listener makes overlay dismissal natural for keyboard-only users.
**Action:** When adding or updating custom modal overlays in React, always attach `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and an `useEffect` hook listening for the `Escape` key.
