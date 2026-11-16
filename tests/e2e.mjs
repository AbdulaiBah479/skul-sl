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

// 10. No horizontal scroll at phone width on key pages
for (const p of ["/", "/learn", "/learn/sss/maths", "/tools/gpa", "/tools/wassce", "/library", "/tutor"]) {
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
