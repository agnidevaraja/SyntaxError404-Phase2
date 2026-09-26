# Outstand - Adaptive Learning and Conceptual Remediation Platform

> HackMysuru 1.0 - Phase 2
> Team SyntaxError404

| Submission links | Architecture | Constraints | Setup | AI usage | Limitations |
|---|---|---|---|---|---|
| [resource.md](./resource.md) | [docs/architecture.md](./docs/architecture.md) | [docs/constraints.md](./docs/constraints.md) | [docs/setup.md](./docs/setup.md) | [ai.md](./ai.md) | [docs/limitations.md](./docs/limitations.md) |

---

## 1. Problem Understanding

**Chosen sub-problem:** Personalized Remediation and Diagnostic Feedback in Secondary STEM and Social Sciences

- **The gap we saw:** As 10th graders, we notice that standard tests only give students a single number at the end, like 65% or 80%. They never explain why you missed a question or what specific misconception caused you to pick the wrong option. In a normal classroom of 35 students, our teachers also have no way of knowing who is quietly hesitating on a concept until exam day when it is already too late.
- **Why it matters:** When students fall behind on foundational concepts like stoichiometry in chemistry or price equilibrium in economics, everything that comes next feels impossible. Students lose confidence, develop subject anxiety, and get stuck doing repetitive generic worksheets that never target their actual learning bottleneck.
- **Why we chose this over the others:** We live this problem every single day in school. Most study platforms just throw flashcards or long videos at you without identifying whether your issue is a math calculation trap, an intuitive misunderstanding, or a missing prerequisite.
- **What solved looks like for us:** A student takes a quick 10-question diagnostic test, the system tracks their hesitation and identifies their exact conceptual trap, builds an instant custom learning deck with analogies and step-by-step routines, and gives their teacher a live dashboard with clear pedagogical intervention advice.

## 2. Target Users & School Context

| User | Their situation | What they need from us |
|---|---|---|
| Grade 9 and 10 Students | Overwhelmed by exam syllabus, hesitant to ask doubts in big classes, preparing for board exams or competitions | Targeted diagnosis of weak topics, easy real-world analogies, step-by-step routines, and curated competitions |
| Subject Teachers / Facilitators | Managing 30 to 40 students per batch with limited time to grade daily work or give 1-on-1 feedback | Real-time roster visibility, silent hesitation alerts, concise AI diagnostic advice, and direct private chat |
| School Academic Coordinators | Need visibility into class-wide curriculum mastery and progress across academic terms | Aggregated topic mastery curves and structured syllabus alignment |

**Local context we designed for:** Indian school curriculum requirements (CBSE, ICSE, and Cambridge IGCSE standards for 9th and 10th grade), mixed connectivity in school computer labs, diverse learning speeds, and varying levels of academic confidence.

## 3. Solution Overview

Outstand is an intelligent learning portal that diagnoses conceptual roadblocks, builds adaptive remediation packages, and connects students with their teachers in real time.

**Core flow:**
1. A student logs in and takes a 10-question diagnostic assessment in Chemistry or Economics. While they answer, the app measures response timing and flags questions where they hesitated.
2. The system analyzes errors, maps them to a sequenced 5-node Concept Knowledge Graph, and unlocks a tailored study space with custom presentation slides, real-world analogies, and guided practice exercises.
3. If a student struggles on a practice question, they can click "Break It Down with AI" to generate an everyday analogy, a worked solution, and an interactive checkpoint question using the Google Gemini API.
4. Meanwhile, the teacher sees a real-time cohort dashboard updated through Cloud Firestore. The dashboard highlights students with high hesitation, provides a 4-line AI advisory breakdown, and lets the teacher paste action plans directly into a 1-on-1 private intervention chat.

## 4. Architecture

A React 19 single page application powered by Vite, Tailwind CSS, Google Gemini 2.5 Flash, Firebase Authentication, and Cloud Firestore real-time listeners.

Diagram, components, data model and APIs: **[docs/architecture.md](./docs/architecture.md)**

## 5. Tech Stack & AI Usage

**Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Firebase Auth, Cloud Firestore, Google Gemini API via @google/genai SDK (full details in [docs/architecture.md](./docs/architecture.md#tech-stack))

**AI tools used in development:** Antigravity IDE, Claude, and Gemini for scaffolding code, debugging TypeScript types, and styling components.
**AI inside the product:** Google Gemini 2.5 Flash for the Facilitator 4-Line Diagnostic Advisory Engine, the Adaptive Concept Explainer, and the Verified Opportunities Hub.

Full disclosure: **[ai.md](./ai.md)**

## 6. Decision Log (Summary)

- **Chose:** Cloud Firestore real-time listeners (onSnapshot) over polling a custom REST backend.
- **Because:** It gives instantaneous roster updates and 1-on-1 chat syncing without needing a complex backend server running during hackathon demonstrations.
- **First thing to break at city scale:** Gemini API rate limits and token costs if thousands of students click "Break It Down with AI" simultaneously. We addressed this by building rich local pedagogical fallbacks for every unit.

Full decision log: **[resource.md](./resource.md#4-submission-artifacts-google-drive)**

## 7. Setup & Run

```bash
git clone https://github.com/agnidevaraja/SyntaxError404-Phase2.git
cd SyntaxError404-Phase2/frontend
npm install
npm run dev
```

Open `http://localhost:3000` or `http://localhost:3001` in your browser.

Prerequisites, environment variables, demo accounts, and testing steps: **[docs/setup.md](./docs/setup.md)**

## 8. Known Limitations

- Chemistry and Economics are currently fully supported; additional subjects like Physics and Mathematics are still in syllabus definition.
- Automated chemical equation formatting uses standard text inputs rather than a custom LaTeX/formula keyboard.
- Native mobile push notifications are not yet implemented; alerts are delivered in-app via real-time banners and Firestore listeners.

Full list, edge cases, and scaling roadmap: **[docs/limitations.md](./docs/limitations.md)**

---

## Team

| Name | Role | GitHub |
|---|---|---|
| Achalesh Ramana Kiral Kooloth (Lead) | Full Stack Architecture & AI Integration | @agnidevaraja |
| Panav K Bysani | Frontend Engineering, Curriculum Mapping & UI Design | @panavkbysani2011-jpg |

## License

MIT License. You retain full ownership of your code.
