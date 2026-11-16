// Adds "Global notes" (a trimmed Wikipedia article, CC BY-SA 4.0) to every topic that has a clearly matching article.
//   node --import ./tests/register-ts.mjs --experimental-strip-types --no-warnings scripts/enrich-wikipedia.mjs
// Output: src/content/extra/<level>__<subject>__<topic>.json  (committed). Raw API answers are cached in .cache/wiki.
// A match is accepted only when the article title shares a word with the topic title (or the curated search term), and
// the page is not a disambiguation page, so wrong articles are skipped rather than shown.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { LEVELS } from "../src/content/index.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, ".cache", "wiki");
const OUT = path.join(ROOT, "src", "content", "extra");
const BOOKS = path.join(ROOT, "src", "content", "books");
const MAX_CHARS = 9000;
const UA = "SkulSL-educational-importer/1.0 (free education app)";

// What to search for on the hand-written topics (their own titles are fine for most, these sharpen the rest).
const HAND = {
  "primary/maths/place-value": "Positional notation", "primary/maths/fractions": "Fraction", "primary/maths/money-time": "Leone",
  "primary/english/parts-of-speech": "Part of speech", "primary/english/punctuation": "Punctuation",
  "primary/science/living-things": "Life", "primary/science/health-hygiene": "Hygiene", "primary/social/our-country": "Sierra Leone",
  "jss/maths/algebra-basics": "Algebra", "jss/maths/percentages": "Percentage", "jss/maths/geometry-basics": "Geometry",
  "jss/english/tenses": "Grammatical tense", "jss/english/letter-essay": "Essay", "jss/science/cells-photosynthesis": "Photosynthesis",
  "jss/science/matter-states": "State of matter", "jss/science/energy-forces": "Energy", "jss/social/citizenship": "Citizenship",
  "jss/business/needs-wants-trade": "Scarcity",
  "sss/maths/quadratics": "Quadratic equation", "sss/maths/indices-logs": "Logarithm", "sss/maths/probability": "Probability",
  "sss/english/summary-comprehension": "Reading comprehension", "sss/english/grammar-tenses-concord": "Subject–verb agreement",
  "sss/biology/genetics": "Genetics", "sss/biology/ecology": "Food chain", "sss/chemistry/atomic-bonding": "Chemical bond",
  "sss/chemistry/acids-bases": "Acid–base reaction", "sss/physics/motion": "Newton's laws of motion", "sss/physics/electricity": "Ohm's law",
  "sss/economics/demand-supply": "Supply and demand", "sss/government/constitution-democracy": "Constitution", "sss/ict/computer-basics": "Computer hardware",
  "sss/geography/map-skills-climate": "Climate of Sierra Leone",
  "tech/digital/office-skills": "Spreadsheet", "tech/digital/web-basics": "Phishing", "tech/business/small-business": "Small business",
  "tech/agriculture/crops-soil": "Soil fertility", "tech/electrical/electrical-safety": "Electrical safety", "tech/health/first-aid": "First aid",
  "uni/study-skills/effective-study": "Spaced repetition", "uni/study-skills/academic-writing": "Plagiarism", "uni/study-skills/research-methods": "Research design",
  "uni/statistics/descriptive-stats": "Descriptive statistics", "uni/computing/programming-basics": "Computer programming",
  "uni/calculus/differentiation": "Derivative", "uni/economics-biz/macro-basics": "Macroeconomics", "uni/health-sciences/public-health": "Public health",
};

const GENERIC = /^(introduction|summary|overview|review|key terms|preface|conclusion|chapter|test|practice|index|references|further reading|glossary)\b/i;
const CUT = /^(see also|references|external links|further reading|notes|bibliography|sources|citations|footnotes|gallery|footnotes and references|explanatory notes|general references|works cited|publications|awards|in popular culture|in fiction|in media)$/i;
const stop = new Set("the a an and or of to in on is are was were for with from as at by be do does how what why when which into using use basic basics introduction".split(" "));
const stem = (w) => w.toLowerCase().replace(/(ies)$/, "y").replace(/(es|s)$/, "");
const toWords = (s) => (s.toLowerCase().match(/[a-z]{3,}/g) || []).filter((w) => !stop.has(w)).map(stem);

// One shared gate so all workers together stay under ~3 requests a second.
let pauseUntil = 0, lastCall = 0;
async function politeGap() {
  for (;;) {
    const now = Date.now();
    const at = Math.max(pauseUntil, lastCall + 350);
    if (now >= at) { lastCall = now; return; }
    await new Promise((x) => setTimeout(x, at - now));
  }
}

async function api(params, name) {
  const file = path.join(CACHE, crypto.createHash("md5").update(name).digest("hex") + ".json");
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8"));
  const url = "https://en.wikipedia.org/w/api.php?" + new URLSearchParams({ format: "json", action: "query", redirects: "1", ...params });
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      await politeGap();
      const r = await fetch(url, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(45000) });
      if (r.status === 429) {
        // Wikimedia asks clients to slow down: honour Retry-After and back off for everyone
        const wait = Math.min(120, Number(r.headers.get("retry-after")) || 10 * attempt);
        console.log(`  rate limited, waiting ${wait}s`);
        pauseUntil = Date.now() + wait * 1000;
        continue;
      }
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json();
      fs.mkdirSync(CACHE, { recursive: true });
      fs.writeFileSync(file, JSON.stringify(j));
      return j;
    } catch (e) {
      if (attempt === 4) return null;
      await new Promise((x) => setTimeout(x, 1500 * attempt));
    }
  }
}

function format(extract) {
  const lines = extract.replace(/\r/g, "").split("\n");
  const out = [];
  let skipping = false;
  let chars = 0;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const h = line.match(/^(=+)\s*(.*?)\s*\1$/);
    if (h) {
      const level = h[1].length;
      skipping = CUT.test(h[2]);
      if (skipping) continue;
      if (chars > MAX_CHARS) break;
      out.push((level <= 2 ? "## " : "### ") + h[2]);
      continue;
    }
    if (skipping) continue;
    if (/^\{\\displaystyle/.test(line) || line.length < 3) continue;
    const clean = line.replace(/\{\\displaystyle[^}]*\}/g, "").replace(/\s{2,}/g, " ").trim();
    if (!clean) continue;
    if (chars + clean.length > MAX_CHARS && chars > MAX_CHARS * 0.6) break;
    out.push(clean);
    chars += clean.length;
  }
  // drop headings with no text under them
  return out.filter((l, i) => !(/^#{2,3} /.test(l) && (i === out.length - 1 || /^#{2,3} /.test(out[i + 1]) && !(l.startsWith("## ") && out[i + 1].startsWith("### ")))));
}

async function lookup(queryTitle, hint) {
  const qWords = toWords(queryTitle);
  if (!qWords.length) return null;
  const j = await api(
    { generator: "search", gsrsearch: hint ? `${queryTitle} ${hint}` : queryTitle, gsrlimit: "1", prop: "extracts|pageprops|info", inprop: "url", explaintext: "1", exlimit: "1", exsectionformat: "wiki" },
    `s:${queryTitle}|${hint}`
  );
  const page = j?.query?.pages ? Object.values(j.query.pages)[0] : null;
  if (!page?.extract || page.pageprops?.disambiguation !== undefined) return null;
  const tWords = toWords(page.title);
  const overlap = qWords.filter((w) => tWords.includes(w)).length;
  // The article title must be mostly contained in the topic title (so "Sweat gland" is not accepted for "The Thyroid Gland"),
  // and the topic must share at least half of its own key words with it.
  if (!overlap || overlap / qWords.length < 0.5 || overlap / tWords.length < 0.67) return null;
  const lines = format(page.extract);
  if (lines.join(" ").length < 700) return null;
  return { title: page.title, url: page.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}`, lines };
}

// ---------------------------------------------------------------- topics
const jobs = [];
for (const l of LEVELS)
  for (const s of l.subjects)
    for (const t of s.topics) jobs.push({ level: l.id, subject: s.id, topic: t.id, query: HAND[`${l.id}/${s.id}/${t.id}`] ?? t.title, hint: "" });
for (const d of fs.existsSync(BOOKS) ? fs.readdirSync(BOOKS) : []) {
  const toc = JSON.parse(fs.readFileSync(path.join(BOOKS, d, "toc.json"), "utf8"));
  for (const ch of toc.chapters)
    for (const t of ch.topics) {
      if (GENERIC.test(t.title)) continue;
      jobs.push({ level: toc.level, subject: toc.subject, topic: t.id, query: t.title, hint: toc.subjectTitle.split(/[&,]/)[0].trim() });
    }
}
console.log(`${jobs.length} topics to look up`);

fs.mkdirSync(OUT, { recursive: true });
let next = 0, found = 0, skipped = 0, done = 0;
const seen = new Map(); // article -> how many topics already use it (cap repeats so one article is not pasted everywhere)
async function worker() {
  while (next < jobs.length) {
    const j = jobs[next++];
    const file = path.join(OUT, `${j.level}__${j.subject}__${j.topic}.json`);
    try {
      const r = await lookup(j.query, j.hint);
      if (r && (seen.get(r.title) ?? 0) < 3) {
        seen.set(r.title, (seen.get(r.title) ?? 0) + 1);
        fs.writeFileSync(file, JSON.stringify({ source: "Wikipedia", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", title: r.title, url: r.url, lines: r.lines }));
        found++;
      } else { skipped++; fs.rmSync(file, { force: true }); }
    } catch { skipped++; }
    if (++done % 100 === 0) console.log(`  ${done}/${jobs.length} (${found} matched)`);
  }
}
await Promise.all(Array.from({ length: 3 }, worker));
console.log(`Done: ${found} topics enriched, ${skipped} had no clear matching article`);
