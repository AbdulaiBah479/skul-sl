# Security

Skul SL is a static, offline-first web app with one small API route (`/api/tutor`). It has no accounts, no database and stores
progress only in the student's own browser (localStorage).

## Reporting a problem
Please use GitHub's **Report a vulnerability** button (Security tab of this repository) instead of a public issue.

## What is in place
- Content-Security-Policy (own scripts only; only the Wikipedia, dictionary, Gutendex and Open Trivia APIs may be called), HSTS,
  `X-Frame-Options: DENY`, `nosniff`, strict referrer and permissions policies (see `next.config.ts`).
- `/api/tutor`: same-origin only, JSON only, 16 KB body cap, per-visitor and global daily limits, no caching, provider errors never
  returned. API keys live only in server environment variables (never in the repo; `.env*` is git-ignored).
- No raw HTML is ever rendered; lesson text and third-party API answers are shown as plain text, and links/images from third-party
  APIs are accepted only from the expected https hosts.
- Everything read back from localStorage is validated before use.
- CI runs the tests, type check, build and `npm audit`; Dependabot proposes dependency updates weekly.

## Known limits
- Rate limits are kept in memory, so on serverless hosting they are best-effort per instance.
- Textbook and Wikipedia content comes from third parties under their own licences (see `/credits`).
