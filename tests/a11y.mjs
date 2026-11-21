// Accessibility audit with axe-core on the main pages, in light and dark mode at phone width.
//   npm run build && npx next start -p 3200   then   node tests/a11y.mjs
// Playwright and axe-core are borrowed from the sibling deen-companion project (no second large install).
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const load = (name) => {
  try { return require(name); } catch { return require("../../deen-companion/node_modules/" + name); }
};
const { chromium } = load("playwright");
const axeSource = (() => {
  try { return require("fs").readFileSync(require.resolve("axe-core/axe.min.js"), "utf8"); }
  catch { return require("fs").readFileSync(require.resolve("../../deen-companion/node_modules/axe-core/axe.min.js"), "utf8"); }
})();

const BASE = process.env.BASE || "http://localhost:3200";
const PAGES = [
  "/", "/learn", "/learn/sss", "/learn/sss/biology", "/learn/sss/biology/the-building-blocks-of-molecules", "/learn/sss/maths/quadratics",
  "/learn/primary/maths/place-value", "/learn/uni", "/practice", "/flashcards", "/tools", "/tools/wassce", "/tools/gpa", "/tools/target",
  "/tools/timer", "/tools/planner", "/tools/calculator", "/tutor", "/library", "/courses", "/explore", "/trivia", "/university", "/more",
  "/progress", "/install", "/about", "/credits", "/curriculum", "/offline",
];

let browser = await chromium.launch({ channel: "msedge", headless: true });
let failures = 0, checks = 0;

// Headless Edge occasionally dies on long runs, so each page view gets a fresh context and one retry with a fresh browser.
async function audit(p, scheme) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    let ctx;
    try {
      ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, colorScheme: scheme });
      const page = await ctx.newPage();
      await page.goto(BASE + p, { waitUntil: "networkidle", timeout: 45000 });
      await page.addScriptTag({ content: axeSource });
      const res = await page.evaluate(() => window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"] }));
      await ctx.close();
      return res.violations;
    } catch (e) {
      try { await ctx?.close(); } catch {}
      if (attempt === 3) throw e;
      try { await browser.close(); } catch {}
      browser = await chromium.launch({ channel: "msedge", headless: true });
    }
  }
}

for (const scheme of ["light", "dark"]) {
  for (const p of PAGES) {
    const violations = await audit(p, scheme);
    checks++;
    for (const v of violations) {
      failures++;
      console.log(`✗ [${scheme}] ${p}: ${v.id} (${v.impact}) ${v.help} — ${v.nodes.length} node(s), e.g. ${v.nodes[0].target.join(" ")}`);
    }
  }
}
await browser.close();
console.log(failures ? `
${failures} accessibility problem(s) on ${checks} page views` : `
${checks} page views (light + dark) have no axe violations`);
process.exit(failures ? 1 : 0);
