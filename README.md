# Skul SL

Free, offline-first study app for students in Sierra Leone: Primary (NPSE), JSS (BECE), SSS (WASSCE), Technical & Vocational, and University.

## What is inside
- 47 topics across 5 levels, 235 original practice questions (lesson + quiz per topic, shuffled every time)
- Timed exam practice, FSRS spaced-repetition flashcards, streaks, notes, read-aloud
- Tools: WASSCE/BECE grade calculator, GPA/CGPA calculator, "score I need", Pomodoro timer, exam countdown, offline calculator (no `eval`)
- Explore (Wikipedia, free dictionary, Project Gutenberg: no API keys), free library, university hub with scholarships
- AI tutor on free tiers (Gemini / Groq); falls back to offline lesson search when there is no key or no internet
- Installable PWA with a service worker; "Save everything for offline" button
- No accounts, no database: progress is stored on the student's phone

## Run
```
npm install
npm run dev            # http://localhost:3000
npm test               # content + grade + calculator unit tests
npm run build && npx next start -p 3200 && node tests/e2e.mjs   # browser checks (needs Edge)
```

## Optional AI tutor (all free tiers)
Copy `.env.example` to `.env.local` and add a key from https://aistudio.google.com/apikey and/or https://console.groq.com/keys.

## Adding content
Edit `src/content/<level>.ts`. Each topic needs 2+ lesson lines and 5+ questions; `npm test` checks the structure.
Have a teacher review new content before release.

## Free courses catalogue
`npm run import:courses` builds `public/courses/*.json` (≈30,000 entries): free-programming-books (CC BY 4.0), 33 GitHub course repositories,
all OpenStax textbooks, MIT OpenCourseWare and Coursera's public catalogue (the last two are links only). The `/courses` page loads one
source at a time; lists over 1.5 MB (Coursera) are downloaded only when chosen on their own.

## Security and quality
- `SECURITY.md` explains the protections (CSP, HSTS, hardened `/api/tutor`, validated localStorage) and how to report a problem.
- `npm test` (content, grades, calculator, resources, textbooks, global notes, courses), `npm run typecheck`, `npm run build`.
- `node tests/e2e.mjs` (56 browser checks incl. security headers and API abuse cases) and `node tests/a11y.mjs` (axe-core, 60 page views,
  light + dark) need a running production server and Edge; they borrow Playwright/axe from a sibling `deen-companion` checkout.
- GitHub Actions (`.github/workflows/ci.yml`) runs tests, type check, build and `npm audit`; Dependabot proposes updates weekly.
