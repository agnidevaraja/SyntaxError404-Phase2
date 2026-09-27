# AI Usage Disclosure

[Back to README](./README.md)

AI tools are fully permitted at HackMysuru 1.0, and disclosing their role in both building the platform and powering user features is mandatory. As 10th graders, we believe in being completely transparent about every tool we used and every model running in our application.

---

## Summary

| Question | Answer |
|---|---|
| Did we use AI tools during development? | Yes |
| Does our product use AI/ML at runtime? | Yes |
| Roughly how much of the code was AI-assisted? | Around 35% of frontend scaffolding and styling, 25% of service boilerplates, 0% of diagnostic scoring and dependency logic |
| Can every team member explain the AI-assisted code? | Yes, every team member has reviewed and can explain all components |

---

## 1. AI Tools Used During Development

| Tool | Model / plan | Used by | What we used it for |
|---|---|---|---|
| Google AI Studio | Gemini 3.8 Flash | Team SyntaxError404 | Initial build platform for prototyping components, testing prompts, and scaffolding early UI layouts |
| Google Antigravity IDE | Gemini 3.8 Flash | Team SyntaxError404 | Later build platform for interactive coding, terminal execution, refactoring, multi-file editing, and debugging TypeScript types |

## 2. Where AI Helped in the Codebase

| Area / file | Level of AI help | What a human did |
|---|---|---|
| `frontend/src/components/student/` | Medium: Scaffolding JSX cards and Tailwind responsive layouts | Defined the 5-question diagnostic flows, idle hesitation listeners, and state machine transitions |
| `frontend/src/components/facilitator/` | Medium: Layout design for roster cards and telemetry badges | Programmed the real-time Firestore listeners, hesitation thresholds, and chat drawer logic |
| `frontend/src/services/aiAdvisoryService.ts` | High: Prompt formatting and SDK invocation | Designed the strict 4-line diagnostic format and implemented local pedagogical fallbacks |
| `frontend/src/services/conceptExplainerService.ts` | High: Structured output JSON parsing | Formulated the 3-step worked problem structure and Gentner analogy boundary mapping |
| `frontend/src/services/*Opportunities*.ts` | High: Structured JSON schema and prompt search | Designed verified 2026 competition benchmarks, eligibility tiers, and dynamic search prompts |
| `frontend/src/data/diagnosticQuestions.ts` | None | Written by hand based on real Grade 9 Chemistry and Economics curriculum standards |
| `frontend/src/data/mockEconomicsData.ts` | None | Authored by hand to represent realistic student misconception clusters and syllabus units |
| Documentation files (`.md`) | Low: Structure and formatting | All content, reflections, trade-offs, and explanations written by our team |

## 3. AI Inside the Product (Runtime)

| Model / API | What it does in our product | Hosted where | Trained / fine-tuned by us? |
|---|---|---|---|
| Google Gemini 3.8 Flash *(fallback: 2.5 Flash)* | Facilitator AI Advisory: analyzes student diagnostic performance and hesitation to output a 4-line intervention plan | Google AI Cloud | Prompt-engineered with strict pedagogical rules |
| Google Gemini 3.8 Flash *(fallback: 2.5 Flash)* | Adaptive Concept Explainer: creates visual analogies, 3-step worked solutions, and checkpoint questions | Google AI Cloud | Prompt-engineered with JSON schema constraints |
| Google Gemini 3.8 Flash | Student Hub & Subject Opportunities: custom AI prompt search and ranks verified 2026 competitions & Olympiads | Google AI Cloud | Prompt-engineered with JSON schema constraints (`VITE_GEMINI_OPPORTUNITIES_API_KEY`) |

- **Accuracy we measured:** In our manual evaluations across 20 synthetic student profiles with varying error clusters, the Gemini 4-line advisory correctly identified the underlying misconception in 19 out of 20 test runs (95% diagnostic precision).
- **What happens when the model is wrong or unavailable:** If the API key is missing, network is offline, or the response fails JSON parsing, the system immediately falls back to pre-authored pedagogical packages curated for that exact unit or Gemini 2.5 Flash fallback. The student or teacher is never left with an empty screen or error code.
- **Does it work offline?** The live Gemini API call requires internet connectivity. However, all curriculum units include complete offline fallbacks with analogies and worked steps.
- **Student data sent to third parties:** Only anonymized academic performance signals (such as "Student scored 4/5 in Stoichiometry, missed questions 3 and 4 on limiting reagents, hesitated 9 seconds") are sent in the prompt. No student passwords, emails, or personal identification details are ever transmitted to the LLM.
- **Cost at scale:** Using Gemini 3.8 Flash costs fractions of a cent per diagnostic evaluation (approximately 0.0003 dollars per student breakdown), making it highly economical for public school rollouts.

## 4. Key Prompts

### Prompt 1: Facilitator 4-Line Diagnostic Advisory
```text
You are an expert high school academic facilitator analyzing a Grade 9 student roadblock.
Analyze the following student performance:
- Subject: ${subject}
- Focus Topic: ${strugglingTopic}
- Score: ${recentScore} / 5
- Hesitation Signal: ${hesitationLevel}
- Specific Errors / Context: ${studentContext}

Respond in EXACTLY 4 lines. No markdown headers, no bullet points, no introductory pleasantries.
Line 1: Concise diagnosis of the root conceptual roadblock.
Line 2: Why this misconception is occurring based on their errors and hesitation.
Line 3: Immediate pedagogical action step for the facilitator in 1-on-1 chat.
Line 4: Specific question or practice angle to pose to the student right now.
```
*Why this prompt matters:* Teachers do not have time to read long paragraphs between classes. The strict 4-line constraint forces the AI to be concise, diagnostic, and immediately actionable.

### Prompt 2: Student Adaptive Concept Explainer
```text
You are a brilliant and empathetic high school science and economics educator.
Break down the topic "${topic}" for a student who is struggling with: "${struggleContext}".
Explain the concept intuitively without overwhelming jargon.
Return a valid JSON object with:
- visualAnalogy: A vivid, everyday analogy a 15-year-old immediately understands.
- workedExample: An object with problemStatement and 3 numbered steps.
- checkpointQuestion: An interactive question with 4 options, correctIndex, and explanation.
```
*Why this prompt matters:* It shifts the AI from writing generic textbook prose to creating an active learning cycle: intuition first, concrete steps second, and verification third.

## 5. How We Verified AI Output

- **Pedagogical sanity checks:** We tested generated chemistry analogies against real scientific boundaries (for instance, ensuring a baking analogy for limiting reactants clearly explains that atoms cannot be split like cups of flour).
- **Format enforcement:** In `aiAdvisoryService.ts`, we implemented post-processing logic that trims the output to exactly 4 non-empty lines, preventing conversational chatter or preamble from cluttering the teacher card.
- **Structured JSON validation:** In `conceptExplainerService.ts`, we wrapped JSON parsing in defensive try-catch blocks with type verification, ensuring that missing keys immediately route to the fallback package rather than throwing runtime errors.

## 6. What We Deliberately Did Not Use AI For

- **Diagnostic scoring and grading:** Diagnostic score computation, percentage calculations, and weak unit identification are calculated deterministically in TypeScript code. We never ask an LLM to "grade" multiple choice answers.
- **Concept Knowledge Graph topology:** The prerequisite sequence linking Node 1 (Atomic Structure / Scarcity) through Node 5 (Equilibrium) was designed by our team based on curriculum standards, not hallucinated by an AI.
- **Hesitation telemetry tracking:** The 7-second idle detection loop is an algorithmic browser event listener.
- **Decision logs and team reflections:** All documents, architectural trade-offs, and self-assessments were written directly by our team.

---

**Declaration:** We confirm this disclosure is complete and accurate. Every team member can explain all the code and AI integrations in this repository.

**Signed:** Achalesh Ramana Kiral Kooloth on behalf of Team SyntaxError404
**Date:** 26 September 2026
