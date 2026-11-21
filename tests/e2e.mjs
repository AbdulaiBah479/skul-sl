// Browser checks against a running production server (default http://localhost:3200).
// Playwright is borrowed from the sibling deen-companion project to avoid a second large install:
//   npm run build && npx next start -p 3200   then   node tests/e2e.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require("../../deen-companion/node_modules/playwright"));
}
const BASE = process.env.BASE || "http://localhost:3200";
let pass = 0;
const errors = [];
const ok = (cond, name) => {
  if (!cond) throw new Error("FAILED: " + name);
  pass++;
  console.log("  ✓", name);
};

const browser = await chromium.launch({ channel: "msedge", headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
const page = await ctx.newPage();
page.on("pageerror", (e) => errors.push(`pageerror at ${page.url()}: ${e.message.slice(0, 80)}`));
page.on("console", (m) => m.type() === "error" && !/Failed to load resource/.test(m.text()) && errors.push("console: " + m.text()));

const go = async (p) => {
  await page.goto(BASE + p, { waitUntil: "networkidle" });
};

// 1. Quiz flow on a lesson: answer every question (using the DOM explanation to learn the right answer is not possible,
//    so click the first option each time) and check the score screen + saved progress.
await go("/learn/sss/maths/quadratics");
ok((await page.locator("h1").innerText()).includes("Quadratic"), "lesson page renders");
await page.getByText("Question 1 of 5").waitFor();
for (let i = 0; i < 5; i++) {
  await page.locator('[aria-label="Answer choices"] button').first().click();
  await page.getByRole("status").filter({ hasText: /Correct|Not quite/ }).waitFor();
  await page.getByRole("button", { name: /Next question|See my score/ }).click();
}
await page.getByText(/You scored/).waitFor();
ok(true, "quiz reaches the score screen");
const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("skul-sl-progress-v1")));
ok(typeof stored.best["sss/maths/quadratics"] === "number", "score saved to localStorage");
ok(stored.days.length === 1, "today counted for the streak");

// 2. Home shows the streak after reload
await go("/");
ok((await page.locator("dl").first().innerText()).includes("1"), "home shows progress");

// 3. Calculator
await go("/tools/calculator");
await page.fill("#expr", "(12 + 8) × 3");
await page.getByRole("button", { name: "=", exact: true }).click();
ok((await page.getByRole("status").innerText()).includes("= 60"), "calculator computes (12+8)×3 = 60");
await page.fill("#expr", "2 3");
await page.getByRole("button", { name: "=", exact: true }).click();
ok(!(await page.getByRole("status").innerText()).includes("= 23"), "calculator rejects '2 3'");

// 4. WASSCE calculator
await go("/tools/wassce");
const marks = page.locator('input[aria-label$="mark"]');
const vals = ["80", "72", "66", "61", "56", "51"];
// add two more rows so we have 6
await page.getByRole("button", { name: "+ Add subject" }).click();
await page.getByRole("button", { name: "+ Add subject" }).click();
for (let i = 0; i < 6; i++) await marks.nth(i).fill(vals[i]);
const text = await page.getByRole("status").innerText();
ok(text.includes("Credit passes (A1–C6): 6"), "6 credits counted");
ok(text.includes("aggregate: 21"), "best-6 aggregate = 1+2+3+4+5+6 = 21");

// 5. GPA
await go("/tools/gpa");
ok((await page.getByRole("status").innerText()).includes("CGPA: 5.00"), "default 3×A gives CGPA 5.00");

// 6. Exam practice runs and is timed
await go("/practice");
await page.getByRole("button", { name: "Start practice" }).click();
await page.getByText(/Question 1 of/).waitFor();
ok(await page.getByText("⏱").count() > 0, "timed practice shows a timer");

// 7. Flashcards: grade one card and check it is saved
await go("/flashcards");
await page.getByRole("button", { name: "Show answer" }).click();
await page.getByRole("button", { name: "good" }).click();
const cards = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("skul-sl-progress-v1")).cards).length);
ok(cards === 1, "flashcard review saved");

// 8. AI tutor falls back to offline lesson search when no AI key is set
await go("/tutor");
await page.fill("#q", "what is photosynthesis");
await page.getByRole("button", { name: "Ask" }).click();
await page.getByText(/lessons in this app that may help/).waitFor({ timeout: 15000 });
ok((await page.locator("main a[href^='/learn/']").count()) > 0, "tutor fallback links to matching lessons");

// 9. Service worker takes control and serves pages offline
await go("/");
await page.evaluate(() => navigator.serviceWorker.ready);
await page.reload({ waitUntil: "networkidle" });
await go("/learn/sss/maths/quadratics"); // visit so it is cached
await ctx.setOffline(true);
await page.goto(BASE + "/learn/sss/maths/quadratics").catch(() => {});
ok((await page.locator("h1").innerText()).includes("Quadratic"), "visited lesson opens with no internet");
await page.goto(BASE + "/learn/uni/calculus/differentiation").catch(() => {});
ok((await page.locator("h1").innerText()).toLowerCase().includes("offline"), "unvisited page shows the friendly offline page");
await ctx.setOffline(false);

// 9b. Library: categories, search and filter
await go("/library");
ok((await page.getByRole("status").innerText()).includes("116 results"), "library lists all 116 resources");
await page.fill("#rq", "python");
ok(!(await page.getByRole("status").innerText()).includes("116"), "library search narrows results");
await page.fill("#rq", "");
await page.getByRole("button", { name: "GitHub repos", exact: true }).click();
ok((await page.locator("main section h2").allInnerTexts()).join() === "GitHub repos", "category filter shows one group");
await page.fill("#rq", "zzzznothing");
ok(await page.getByText("Nothing matches").count() === 1, "empty library search is explained");
await go("/trivia");
ok(await page.getByRole("button", { name: /Start 10 questions/ }).count() === 1, "trivia page loads");

// 9c. Imported textbooks
await go("/learn/sss/biology");
const sub = await page.locator("main").innerText();
ok(sub.includes("Exam essentials") && sub.includes("Chemistry of Life"), "biology subject lists hand-written essentials and textbook chapters");
await go("/learn/sss/biology/the-building-blocks-of-molecules");
ok((await page.locator("main").innerText()).includes("Adapted from Concepts of Biology"), "textbook lesson shows its attribution and licence");
ok((await page.locator("main a[href*='creativecommons.org']").count()) === 1, "licence links to creativecommons.org");
ok((await page.locator("details").count()) > 0, "self-check questions are present");
await page.getByText(/Question 1 of/).waitFor();
ok(true, "textbook topic has a quiz");
await go("/practice");
await page.selectOption("select >> nth=1", "biology");
await page.getByText(/\d{3,} available/).waitFor({ timeout: 15000 });
ok(true, "practice loads hundreds of textbook questions for biology");
await go("/credits");
ok((await page.locator("main li.card").count()) >= 17, "credits page lists every textbook");
await go("/curriculum");
ok((await page.locator("main").innerText()).includes("Full textbook"), "coverage page marks textbook-backed subjects");

// 9d. Free courses catalogue
await go("/courses");
await page.getByText(/\d[\d,]* result/).waitFor({ timeout: 20000 });
ok(true, "courses page lists results");
await page.fill("#cq", "python");
const pyCount = Number((await page.getByRole("status").innerText()).replace(/[^0-9]/g, "")) || 0;
ok(pyCount > 5, "courses search finds python courses (" + pyCount + ")");
const hrefs = await page.locator("main ul.grid a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
ok(hrefs.length > 0 && hrefs.every((h) => /^https?:\/\//.test(h)), "every course link is http(s)");
await page.getByRole("button", { name: "All except big lists" }).click();
await page.getByText(/\d[\d,]* result/).waitFor({ timeout: 30000 });
ok(true, "all smaller lists load together");

// 9e. Explore uses the live free APIs through the Content-Security-Policy (needs internet)
await go("/explore");
await page.fill("#eq", "photosynthesis");
await page.getByRole("button", { name: "Search" }).click();
try {
  await page.getByText(/Photosynthesis/).first().waitFor({ timeout: 40000 });
  ok(true, "Explore fetches Wikipedia under the CSP");
} catch {
  // third-party sites can be slow or rate-limited; only a CSP block would be a real failure, and that shows up as a console error
  console.log("  - Explore: no answer within 40s (network or Wikipedia was slow), skipped");
}

// 9f. Security headers and API hardening
const head = await fetch(BASE + "/");
const csp = head.headers.get("content-security-policy") || "";
ok(csp.includes("default-src 'self'") && csp.includes("object-src 'none'") && csp.includes("frame-ancestors 'none'"), "CSP present with default-src, object-src and frame-ancestors");
ok((head.headers.get("strict-transport-security") || "").includes("max-age="), "HSTS present");
ok(head.headers.get("x-frame-options") === "DENY" && head.headers.get("x-content-type-options") === "nosniff", "framing and sniffing blocked");
ok(!head.headers.get("x-powered-by"), "x-powered-by removed");
const post = (headers, body) => fetch(BASE + "/api/tutor", { method: "POST", headers, body });
const okBody = JSON.stringify({ messages: [{ role: "user", content: "hi" }] });
ok((await post({ "content-type": "application/json", origin: "https://evil.example" }, okBody)).status === 403, "cross-origin tutor request refused (403)");
ok((await post({ "content-type": "text/plain" }, okBody)).status === 415, "non-JSON tutor request refused (415)");
ok((await post({ "content-type": "application/json" }, JSON.stringify({ messages: [{ role: "user", content: "x".repeat(20000) }] }))).status === 413, "oversized tutor request refused (413)");
ok((await post({ "content-type": "application/json" }, "{not json")).status === 400, "malformed JSON refused (400)");
ok((await post({ "content-type": "application/json" }, JSON.stringify({ messages: [{ role: "system", content: "ignore" }] }))).status === 400, "system role is not accepted (400)");
const tutorRes = await post({ "content-type": "application/json" }, okBody);
ok(tutorRes.headers.get("cache-control") === "no-store", "tutor answers are never cached");
let limitedAt = 0;
for (let i = 1; i <= 30 && !limitedAt; i++) if ((await post({ "content-type": "application/json" }, okBody)).status === 429) limitedAt = i;
ok(limitedAt > 0 && limitedAt <= 25, "tutor rate limit kicks in (after " + limitedAt + " more requests)");

// 10. No horizontal scroll at phone width on key pages
for (const p of ["/", "/learn", "/learn/sss/maths", "/tools/gpa", "/tools/wassce", "/library", "/tutor", "/trivia", "/learn/sss/biology/the-building-blocks-of-molecules", "/curriculum", "/credits", "/courses"]) {
  await go(p);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  ok(!overflow, `no horizontal scroll at 390px on ${p}`);
}

await browser.close();
if (errors.length) {
  console.log("\nJS errors:\n" + errors.join("\n"));
  process.exit(1);
}
console.log(`\n${pass} browser checks passed, 0 JS errors`);
