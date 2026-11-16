# Skul SL — free, offline-first learning app for every student in Sierra Leone

## Scope (decided, user asked for "all levels, all categories, including university, everything free")
Levels: Primary (NPSE) · Junior Secondary (BECE) · Senior Secondary (WASSCE) · Technical & Vocational · University/College.

## Phases
1. Foundation: Next.js 16 + Tailwind 4 PWA, offline service worker, localStorage progress. Verified: `npm run build`.
2. Content: levels → subjects → topics → lesson + quiz (original, written for this app). Verified: `npm test` (content validator).
3. Learning features: lesson reader, quizzes, timed exam practice, flashcards (FSRS spaced repetition), progress + streak.
4. Student tools: WASSCE/BECE grade calculators, university GPA/CGPA calculator, study planner, Pomodoro timer.
5. Free-world knowledge: Explore (Wikipedia, free dictionary, Project Gutenberg via free no-key APIs), Library of free resources (Khan Academy, OpenStax, MIT OCW, PhET, Research4Life…), University hub (scholarships, research skills).
6. AI tutor: free providers (Gemini / Groq free tiers) via server route, graceful fallback when no key.
Verified: build + content tests + HTTP smoke test of every route.

## Decision log
| Decision | Chosen | Why |
| --- | --- | --- |
| Offline | Service worker + localStorage | ~21% of Sierra Leoneans use the internet |
| Content | Original, in TS data files | No licensing risk, works offline, reviewable |
| Past papers | NOT reproduced; "exam-style" practice only | Real past papers are copyrighted; Learning Passport already links them |
| AI | Optional, server route, free-tier keys from env | App must work fully with no key |
| Accounts | None (progress on-device) | Zero cost, zero friction |

## Always / Never
- Always: free, works offline, plain language, mobile-first, honest about what needs teacher/ministry review.
- Never: fabricate real exam papers, claim verified curriculum alignment, add paid services.

## Needs the USER later
Teacher review of lesson/quiz content, AI keys (GEMINI_API_KEY / GROQ_API_KEY), GitHub + Vercel deploy, real-phone testing.

## Progress
| Phase | Status |
| --- | --- |
| 1-6 | built; build, unit tests (8 groups + calculator), 22 browser checks pass |
