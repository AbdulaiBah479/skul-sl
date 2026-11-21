// Builds the free-course catalogue shown on /courses.
//   node scripts/import-courses.mjs            (all sources)     node scripts/import-courses.mjs fpb coursera
// Sources (all public, no API key):
//   fpb       GitHub: EbookFoundation/free-programming-books  courses/free-courses-en.md   (CC BY 4.0)
//   openstax  OpenStax public CMS API: every free textbook
//   coursera  Coursera public catalogue API (links only; many courses can be audited free, check each page)
//   ocw       MIT OpenCourseWare sitemap (links only; courses are CC BY-NC-SA)
// Output: public/courses/<source>.json  (compact rows [title, url, category, note]) and public/courses/index.json.
// Raw downloads are cached in .cache/courses (git-ignored).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, ".cache", "courses");
const OUT = path.join(ROOT, "public", "courses");
const UA = "SkulSL-educational-importer/1.0 (free education app)";
fs.mkdirSync(CACHE, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

let last = 0;
async function get(url, cacheName, { json = false, gapMs = 300 } = {}) {
  const f = path.join(CACHE, cacheName);
  if (fs.existsSync(f)) { const t = fs.readFileSync(f, "utf8"); return json ? JSON.parse(t) : t; }
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      const wait = last + gapMs - Date.now();
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      last = Date.now();
      const r = await fetch(url, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(60000) });
      if (r.status === 429) { await new Promise((x) => setTimeout(x, 5000 * attempt)); continue; }
      if (!r.ok) throw new Error("HTTP " + r.status);
      const t = await r.text();
      fs.writeFileSync(f, t);
      return json ? JSON.parse(t) : t;
    } catch (e) {
      if (attempt === 6) throw e;
      await new Promise((x) => setTimeout(x, 2000 * attempt));
    }
  }
}

const clean = (s) => s.replace(/\s+/g, " ").trim();
const okUrl = (u) => /^https?:\/\/[^\s]+$/.test(u);
const title = (s) => clean(s).replace(/\b\w/g, (c) => c.toUpperCase());

// ---------------------------------------------------------------- free-programming-books
async function fpb() {
  const md = await get("https://raw.githubusercontent.com/EbookFoundation/free-programming-books/main/courses/free-courses-en.md", "fpb-courses-en.md");
  const rows = [];
  let h2 = "", h3 = "";
  for (const line of md.split("\n")) {
    const h = line.match(/^(#{2,4})\s+(.+?)\s*$/);
    if (h) {
      const name = clean(h[2].replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/<[^>]+>/g, ""));
      if (/^index$/i.test(name)) continue;
      if (h[1].length <= 3) { h2 = name; h3 = ""; } else h3 = name;
      continue;
    }
    const m = line.match(/^\s*[*-]\s+\[([^\]]+)\]\(\s*(https?:\/\/[^)\s]+)\s*\)\s*(?:[-–—:]\s*(.*))?$/);
    if (!m || !h2) continue;
    rows.push([clean(m[1]), m[2], h3 ? `${h2} › ${h3}` : h2, clean((m[3] || "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")).slice(0, 140)]);
  }
  return {
    id: "fpb", name: "Free Programming Books: courses", about: "Hand-picked free courses from the open Free Programming Books list on GitHub (English).",
    url: "https://github.com/EbookFoundation/free-programming-books", licence: "CC BY 4.0", licenceUrl: "https://creativecommons.org/licenses/by/4.0/", rows,
  };
}

// ---------------------------------------------------------------- OpenStax (all free textbooks)
async function openstax() {
  const rows = [];
  for (let start = 0; start < 1000; start += 50) {
    const j = await get(`https://openstax.org/apps/cms/api/v2/pages/?type=books.Book&fields=title,book_state&limit=50&offset=${start}`, `openstax-${start}.json`, { json: true });
    for (const it of j.items ?? []) {
      if (it.book_state && it.book_state !== "live") continue;
      rows.push([clean(it.title), it.meta.html_url || `https://openstax.org/details/books/${it.meta.slug}`, "Textbook", "Free textbook"]);
    }
    if (!j.items || j.items.length < 50) break;
  }
  return { id: "openstax", name: "OpenStax free textbooks", about: "Every free, peer-reviewed textbook from OpenStax (Rice University).", url: "https://openstax.org/subjects", licence: "Mostly CC BY 4.0", licenceUrl: "https://openstax.org/openstax-licensing", rows };
}

// ---------------------------------------------------------------- Coursera public catalogue
async function coursera() {
  const rows = [];
  const seen = new Set();
  for (let start = 0; start < 60000; start += 100) {
    const j = await get(`https://api.coursera.org/api/courses.v1?fields=name,slug,domainTypes&limit=100&start=${start}`, `coursera-${start}.json`, { json: true, gapMs: 500 });
    for (const c of j.elements ?? []) {
      if (!c.slug || !c.name || seen.has(c.slug)) continue;
      seen.add(c.slug);
      const dom = c.domainTypes?.[0]?.domainId;
      rows.push([clean(c.name), `https://www.coursera.org/learn/${c.slug}`, dom ? title(dom.replace(/-/g, " ")) : "Course", ""]);
    }
    if (!j.elements || j.elements.length < 100) break;
  }
  return { id: "coursera", name: "Coursera catalogue", about: "Courses from Coursera's public catalogue. On each course page look for “Audit the course” or apply for financial aid; a certificate costs extra.", url: "https://www.coursera.org", licence: "Links only", licenceUrl: "https://www.coursera.org", rows };
}

// ---------------------------------------------------------------- MIT OpenCourseWare
async function ocw() {
  const index = await get("https://ocw.mit.edu/sitemap.xml", "ocw-sitemap.xml");
  // The sitemap index already has one entry per course (https://ocw.mit.edu/courses/<slug>/sitemap.xml), so no child files are needed.
  const urls = new Set([...index.matchAll(/<loc>(https:\/\/ocw\.mit\.edu\/courses\/[a-z0-9-]+)\/sitemap\.xml<\/loc>/g)].map((m) => m[1]));
  const rows = [];
  for (const u of urls) {
    const slug = u.split("/").pop();
    if (/^(search|dept|topic)/.test(slug)) continue;
    let rest = slug;
    let term = "";
    const t = rest.match(/-(spring|fall|summer|january-iap|iap)-(\d{4})$/);
    if (t) { term = `${title(t[1].replace(/-/g, " "))} ${t[2]}`; rest = rest.slice(0, t.index); }
    const toks = rest.split("-");
    const code = [];
    if (/^[a-z]{1,4}$/.test(toks[0]) && /^\d/.test(toks[1] ?? "")) code.push(toks.shift().toUpperCase());
    while (toks.length && /^\d+[a-z]{0,3}$/.test(toks[0])) code.push(toks.shift().toUpperCase());
    if (!toks.length) continue;
    const name = title(toks.join(" "));
    rows.push([`${code.length ? code.join(".") + " " : ""}${name}${term ? " (" + term + ")" : ""}`, u + "/", "MIT course", ""]);
  }
  return { id: "ocw", name: "MIT OpenCourseWare", about: "Free course materials from MIT: lecture notes, assignments, exams and often video.", url: "https://ocw.mit.edu", licence: "CC BY-NC-SA 4.0", licenceUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/", rows };
}


// ---------------------------------------------------------------- GitHub repositories that ARE courses (or lists of courses)
const REPOS = [
  ["Web development", ["microsoft/Web-Dev-For-Beginners", "freeCodeCamp/freeCodeCamp", "TheOdinProject/curriculum", "kamranahmedse/developer-roadmap", "practical-tutorials/project-based-learning"]],
  ["Machine learning & AI", ["microsoft/ML-For-Beginners", "microsoft/AI-For-Beginners", "microsoft/generative-ai-for-beginners", "huggingface/course", "huggingface/deep-rl-class", "fastai/course22", "karpathy/nn-zero-to-hero", "mlabonne/llm-course", "d2l-ai/d2l-en", "dair-ai/ML-YouTube-Courses"]],
  ["Data science", ["microsoft/Data-Science-For-Beginners", "datasciencemasters/go", "ossu/data-science"]],
  ["Computer science", ["ossu/computer-science", "ossu/math", "Developer-Y/cs-video-courses", "prakhar1989/awesome-courses", "donnemartin/system-design-primer", "jwasham/coding-interview-university"]],
  ["Electronics & IoT", ["microsoft/IoT-For-Beginners", "microsoft/xr-development-for-beginners"]],
  ["Tools & open source", ["jlevy/the-art-of-command-line", "firstcontributions/first-contributions", "skills/introduction-to-github"]],
  ["Course lists", ["EbookFoundation/free-programming-books", "sindresorhus/awesome", "public-apis/public-apis", "ripienaar/free-for-dev"]],
];
async function repos() {
  const rows = [];
  for (const [category, list] of REPOS) {
    for (const full of list) {
      let r;
      try { r = await get(`https://api.github.com/repos/${full}`, `repo-${full.replace("/", "__")}.json`, { json: true, gapMs: 700 }); } catch { console.log("   ! skipped (not found): " + full); continue; }
      if (!r?.html_url) continue;
      const lic = r.license?.spdx_id && r.license.spdx_id !== "NOASSERTION" ? r.license.spdx_id : "no licence file";
      rows.push([`${r.full_name}: ${clean(r.description || r.name)}`.slice(0, 200), r.html_url, category, `GitHub · ${lic} · ${(r.stargazers_count || 0).toLocaleString()} stars`]);
    }
  }
  return { id: "repos", name: "GitHub course repositories", about: "Complete open courses and course lists that live on GitHub. Licences differ, so read each repository before reusing anything.", url: "https://github.com", licence: "Links only", licenceUrl: "https://github.com", rows };
}

const ALL = { fpb, repos, openstax, coursera, ocw };
const want = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(ALL);
let indexFile = path.join(OUT, "index.json");
let index = {};
try { index = JSON.parse(fs.readFileSync(indexFile, "utf8")); } catch {}

for (const id of want) {
  if (!ALL[id]) throw new Error("unknown source " + id);
  console.log(`\n== ${id}`);
  const src = await ALL[id]();
  // keep only well-formed, de-duplicated rows
  const seen = new Set();
  const rows = src.rows.filter(([t, u]) => t && okUrl(u) && !seen.has(u) && seen.add(u));
  fs.writeFileSync(path.join(OUT, id + ".json"), JSON.stringify(rows));
  const { rows: _r, ...meta } = src;
  index[id] = { ...meta, kb: Math.ceil(fs.statSync(path.join(OUT, id + ".json")).size / 1024), count: rows.length, categories: [...new Set(rows.map((r) => r[2].split(" › ")[0]))].length };
  console.log(`   ${rows.length} courses`);
}
fs.writeFileSync(indexFile, JSON.stringify(index));
console.log("\nDone.");
