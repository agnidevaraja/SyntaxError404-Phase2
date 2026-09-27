# The Five Hard Constraints

[Back to README](../README.md)

This document explains how Outstand addresses the five core operational and reliability constraints within an educational diagnostic platform.

| # | Constraint | Status in Outstand | Verification |
|---|---|---|---|
| 1 | Fake, spam and harassment reports | Handled | Built-in chat sanitization, student authentication, and role separation |
| 2 | Unclear jurisdiction | Handled | Multi-subject routing between Chemistry and Economics facilitators |
| 3 | Prioritisation beyond "most votes" | Handled | Composite risk scoring using hesitation time and misconception severity |
| 4 | Bad input (duplicate, wrong answers, malformed text) | Handled | Strict calculation normalization, fuzzy matching, and validation bounds |
| 5 | Works without internet | Handled | Offline slide decks, local curriculum sets, and local pedagogical fallbacks |

---

## 1. Fake, spam and harassment reports

- **Approach:** In a school environment, harassment or spam manifests through inappropriate messages in 1-on-1 chats or attempts by students to modify teacher notes. We enforce role-based access control where students can only message their assigned subject facilitators. All messages sent through `sendPersonalizedMessage` require an authenticated UID, preventing anonymous impersonation. Furthermore, teacher advisory prompts sent to Gemini are strictly structured system prompts that ignore student prompt injection attempts.
- **Anonymity trade-off:** Diagnostic assessments allow students to test their knowledge without public embarrassment, preserving psychological safety. However, inside the teacher dashboard, the student identity is tied to their authenticated profile so teachers can intervene personally.
- **Code:** `frontend/src/services/firestoreService.ts` and `frontend/src/components/common/PersonalizedChatView.tsx`

## 2. Unclear jurisdiction

- **Approach:** In secondary school, students often do not know whether a question belongs to Chemistry, Physics, or Economics (for example, energy in chemical reactions versus economic opportunity cost of renewable energy). Outstand resolves this through explicit subject scoping and sequenced concept dependency nodes.
- **What happens in a boundary case:** Each diagnostic question is strictly assigned to a unique concept node and subject. If a student initiates an inquiry in the Chemistry space, it routes directly to Dr. Eleanor Vance. If the student asks a question in Economics, it routes to Prof. Arthur Sterling. The Sequenced Concept Knowledge Graph explicitly shows prerequisite links across units, preventing confusion about which topic needs review first.
- **Code:** `frontend/src/components/common/ConceptKnowledgeGraph.tsx` and `frontend/src/context/AppContext.tsx`

## 3. Prioritisation

- **Formula / rules:** Unlike simple forum platforms that prioritize whoever complains the loudest or gets the most upvotes, Outstand calculates a teacher attention priority score:
  `Priority = (Hesitation Level Weight) + (Repeat Question Errors * 2) + (Diagnostic Score Deficit * 1.5)`
- **Why not simply "most votes":** The quietest students who spend 15 seconds staring at a stoichiometry question without answering are often the ones who need teacher help the most, but they rarely raise their hand in class. By surfacing silent hesitation directly on the facilitator roster cards with high-contrast alert badges, teachers can reach out to struggling students before they fall behind.
- **Code:** `frontend/src/components/facilitator/FacilitatorPortal.tsx` and `frontend/src/services/firestoreService.ts`

## 4. Bad input

| Input | What our system does |
|---|---|
| Incomplete / skipped quiz question | Prevents empty quiz submission until the student selects an option, providing clear feedback on the unanswered question. |
| Malformed calculation input | Practice answers accept diverse formats (such as "6.0", "6 mol", or "6") by running text normalization that strips whitespace, units, and punctuation before evaluating correctness. |
| Inactivity on assessment | Tracks idle seconds in the background. If a student is inactive for 7 seconds, it automatically logs a hesitation alert without crashing or interrupting the quiz. |
| Duplicate chat messages | Chat submission automatically disables the send button while the request is in flight and clears the input only after the message is logged in Firestore. |
| Missing or invalid Gemini API key | Transparently switches to high-quality local pedagogical fallbacks without throwing uncaught exceptions or breaking the UI. |

## 5. Offline operation

- **What works offline:** 
  - Complete curriculum navigation across all units in Chemistry and Economics.
  - Interactive Concept Knowledge Graph rendering and prerequisite exploration.
  - Tailored presentation slide decks and slide outline viewers.
  - Core mental models, Gentner Structure-Mapping analogy boundary cards, and golden solving routines.
  - Pre-seeded targeted practice micro-exercises and instant solution explanations.
  - Concept Explainer and Opportunities Hub fallbacks providing curated, verified real-world programs.
- **How session state is maintained:** During an outage, all active session state (selected answers, hesitation timers, navigation position, diagnostic progress) is held in-memory within React Context. This means a student can continue interacting with loaded content without interruption. However, Firestore does not automatically queue complex document writes (such as diagnostic submissions, progress telemetry updates, or chat messages) for later replay. Without a service worker background sync layer configured, any Firestore write attempted while fully offline will silently fail and would need to be re-triggered once connectivity is restored.
- **What does not work offline:** Live real-time two-way chat updates with other users and dynamic live Gemini generative model calls (which gracefully fall back to local curriculum packages).
- **How to test:** Open Chrome DevTools, switch the Network tab to "Offline", and navigate through the personalized learning space and practice problems as described in [setup.md](./setup.md#testing-offline-mode).
