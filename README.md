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
