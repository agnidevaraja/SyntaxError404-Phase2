# Known Limitations and Future Scope

[Back to README](../README.md)

As 10th-grade builders, we want to be completely honest about what Outstand can and cannot do today. Building an adaptive diagnostic platform during a hackathon forced us to make deliberate scoping trade-offs.

## What Doesn't Work Yet

| Limitation | Why it exists | What we would do next |
|---|---|---|
| Limited to Chemistry and Economics | Building thorough pedagogical diagnostic banks and slide decks requires deep subject expertise for each unit. | Author standardized question banks for Mathematics, Physics, and Biology with subject teachers. |
| Handwritten equation input | Supporting handwriting recognition on touchscreens or stylus inputs requires specialized computer vision models. | Integrate an open-source math and chemical equation input palette with KaTeX rendering. |
| Native mobile push notifications | The current MVP is a responsive web application running in modern desktop and mobile browsers. | Package the app as a Progressive Web App (PWA) with service workers and web push notifications. |
| School LMS gradebook export | Integrating with school systems like Google Classroom or Canvas requires complex OAuth integrations and school admin approvals. | Build a simple CSV and PDF summary export for teachers to download weekly progress reports. |
| Automated audio read-aloud | Speech synthesis for non-English accents or scientific terminology requires tuned TTS voices. | Connect Web Speech API or multilingual TTS for students with reading difficulties. |

## Edge Cases We Don't Handle

- **Full offline Firestore write queuing**: If a student completely loses internet connectivity during a diagnostic assessment, the UI continues to function using in-memory React Context state, but background Firestore writes (progress telemetry, chat messages, diagnostic submissions) are not queued for later sync. We have not configured service worker background sync, so any writes attempted during a full outage are silently dropped and must be re-triggered once connectivity is restored.
- **Multiple devices logged in simultaneously as the same user**: While Firestore synchronization keeps documents consistent, active assessment timers on two separate devices could record conflicting hesitation telemetry if a student opens quizzes concurrently.
- **Browser tab switching during assessment**: We do not currently enforce strict fullscreen lockdown or anti-cheating tab detection because our goal is diagnostic learning and psychological safety, not high-stakes proctoring.
- **Extreme screen sizes below 320px width**: While the interface is fully responsive on standard smartphones, tablets, and laptops, extremely narrow feature phones will experience layout wrapping.

## Scaling to All of Mysuru Schools

| What breaks first | Rough numbers | Fix |
|---|---|---|
| Gemini API free-tier quotas | Around 15 requests per minute or 1,500 requests per day across students | Implement client-side caching of generated analogies, batch teacher analysis requests, and move to dedicated API quotas. |
| Firestore simultaneous document listeners | Over 10,000 active student connections simultaneously listening to progress updates | Segment cohorts by school and grade level using indexed subcollections and regional Firestore instances. |
| Client-side bundle size | If all Grade 6 to 12 subjects and video assets were bundled into one static build | Implement dynamic route-level code splitting using Vite so students only download packages for their enrolled subjects. |

## Roadmap

1. **Phase 1 (Current)**: High-precision 5-question diagnostic assessment with silent hesitation telemetry, the Autonomous 4-Modality Cognitive Adaptation Engine (analogical, visual, tactile, scaffolded learning styles), 5-node concept dependency graphs, the Facilitator Priority Triage Roster with 60-second re-teach radar and AI-powered 4-line diagnostic advisory, real-time 1-on-1 instructor chat, and interactive AI-powered opportunities search across Chemistry and Economics.
2. **Phase 2 (Next 3 Months)**: Add Grade 10 Physics and Mathematics modules, build a PWA offline cache with service worker background sync for Firestore writes, and provide one-click PDF report generation for parent-teacher conferences.
3. **Phase 3 (Next 6 Months)**: Pilot Outstand in 3 partner high schools in Mysuru and Bangalore, gathering teacher feedback on hesitation thresholds and curriculum alignment.
4. **Phase 4 (Long-Term)**: Add bilingual Kannada and English voice explanations, peer study rooms, and integration with state board and CBSE open educational resources.
