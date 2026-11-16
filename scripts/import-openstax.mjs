// Imports openly licensed OpenStax textbooks (from their public GitHub repos) and converts them into Skul SL lessons.
//   node scripts/import-openstax.mjs                 # all books in BOOKS
//   node scripts/import-openstax.mjs prealgebra-2e   # one book
// Output (committed): src/content/books/<id>/toc.json, src/content/books/<id>/t/<topic>.json, public/qbank/*.json
// Raw downloads are cached in .cache/openstax (git-ignored), so re-runs are fast and offline-friendly.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, ".cache", "openstax");
const OUT = path.join(ROOT, "src", "content", "books");

// level/subject say where the book appears in the app. New subjects are created from subjectTitle/emoji.
export const BOOKS = [
  { id: "concepts-biology", repo: "osbooks-biology-bundle", collection: "concepts-biology", level: "sss", subject: "biology", subjectTitle: "Biology", emoji: "🧬", title: "Concepts of Biology", url: "https://openstax.org/details/books/concepts-biology" },
  { id: "principles-economics-3e", repo: "osbooks-principles-economics-bundle", collection: "principles-economics-3e", level: "sss", subject: "economics", subjectTitle: "Economics", emoji: "📈", title: "Principles of Economics 3e", url: "https://openstax.org/details/books/principles-economics-3e" },
  { id: "physics", repo: "osbooks-physics", collection: "physics", level: "sss", subject: "physics", subjectTitle: "Physics", emoji: "⚡", title: "Physics", url: "https://openstax.org/details/books/physics" },
  { id: "prealgebra-2e", repo: "osbooks-prealgebra-bundle", collection: "prealgebra-2e", level: "jss", subject: "maths", subjectTitle: "Mathematics", emoji: "📐", title: "Prealgebra 2e", url: "https://openstax.org/details/books/prealgebra-2e" },
  { id: "entrepreneurship", repo: "osbooks-entrepreneurship", collection: "entrepreneurship", level: "tech", subject: "business", subjectTitle: "Entrepreneurship", emoji: "🏪", title: "Entrepreneurship", url: "https://openstax.org/details/books/entrepreneurship" },
  { id: "college-success-2e", repo: "osbooks-college-success-bundle", collection: "college-success-2e", level: "uni", subject: "study-skills", subjectTitle: "Study & Exam Skills", emoji: "🧠", title: "College Success 2e", url: "https://openstax.org/details/books/college-success-2e" },
  { id: "elementary-algebra-2e", repo: "osbooks-prealgebra-bundle", collection: "elementary-algebra-2e", level: "sss", subject: "maths", subjectTitle: "Core Mathematics", emoji: "🧮", title: "Elementary Algebra 2e", url: "https://openstax.org/details/books/elementary-algebra-2e" },
  { id: "algebra-trigonometry-2e", repo: "osbooks-college-algebra-bundle", collection: "algebra-and-trigonometry-2e", level: "sss", subject: "maths", subjectTitle: "Core Mathematics", emoji: "🧮", title: "Algebra and Trigonometry 2e", url: "https://openstax.org/details/books/algebra-and-trigonometry-2e" },
  { id: "chemistry-2e", repo: "osbooks-chemistry-bundle", collection: "chemistry-2e", level: "sss", subject: "chemistry", subjectTitle: "Chemistry", emoji: "⚗️", title: "Chemistry 2e", url: "https://openstax.org/details/books/chemistry-2e" },
  { id: "workplace-software-skills", repo: "osbooks-workplace-software-skills", collection: "workplace-software-skills", level: "tech", subject: "digital", subjectTitle: "Digital Skills", emoji: "🖥️", title: "Workplace Software and Skills", url: "https://openstax.org/details/books/workplace-software-skills" },
  { id: "anatomy-physiology-2e", repo: "osbooks-anatomy-physiology", collection: "anatomy-and-physiology-2e", level: "uni", subject: "health-sciences", subjectTitle: "Health Sciences Foundations", emoji: "🩺", title: "Anatomy and Physiology 2e", url: "https://openstax.org/details/books/anatomy-and-physiology-2e" },
  { id: "microbiology", repo: "osbooks-microbiology", collection: "microbiology", level: "uni", subject: "health-sciences", subjectTitle: "Health Sciences Foundations", emoji: "🩺", title: "Microbiology", url: "https://openstax.org/details/books/microbiology" },
  { id: "psychology-2e", repo: "osbooks-psychology", collection: "psychology-2e", level: "uni", subject: "psychology", subjectTitle: "Psychology", emoji: "🧠", title: "Psychology 2e", url: "https://openstax.org/details/books/psychology-2e" },
  { id: "introduction-business-2e", repo: "osbooks-introduction-business", collection: "introduction-business-2e", level: "uni", subject: "economics-biz", subjectTitle: "Economics & Business Foundations", emoji: "🏦", title: "Introduction to Business 2e", url: "https://openstax.org/details/books/introduction-business-2e" },
  { id: "introductory-statistics-2e", repo: "osbooks-introductory-statistics-bundle", collection: "introductory-statistics-2e", level: "uni", subject: "statistics", subjectTitle: "Statistics", emoji: "📊", title: "Introductory Statistics 2e", url: "https://openstax.org/details/books/introductory-statistics-2e" },
  { id: "calculus-volume-1", repo: "osbooks-calculus-bundle", collection: "calculus-volume-1", level: "uni", subject: "calculus", subjectTitle: "Calculus & Engineering Maths", emoji: "∫", title: "Calculus Volume 1", url: "https://openstax.org/details/books/calculus-volume-1" },
  { id: "writing-guide", repo: "osbooks-writing-guide", collection: "writing-guide", level: "uni", subject: "academic-writing", subjectTitle: "Academic Writing", emoji: "✍️", title: "Writing Guide with Handbook", url: "https://openstax.org/details/books/writing-guide" },
];

// ---------------------------------------------------------------- XML (small, tolerant)
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENT[e.toLowerCase()] ?? m;
  });

export function parseXml(src) {
  const root = { name: "#root", attrs: {}, kids: [] };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<!\[CDATA\[([\s\S]*?)\]\]>|<\?[\s\S]*?\?>|<!DOCTYPE[^>]*>|<\/([^\s>]+)\s*>|<([^\s/>]+)((?:\s+[^\s=>/]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(src))) {
    const top = stack[stack.length - 1];
    if (m[1] !== undefined) top.kids.push(m[1]);
    else if (m[2] !== undefined) {
      if (stack.length > 1) stack.pop();
    } else if (m[3] !== undefined) {
      const attrs = {};
      for (const a of m[4].matchAll(/([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) attrs[a[1].replace(/^.*:/, "")] = decode(a[2] ?? a[3]);
      const node = { name: m[3].replace(/^.*:/, ""), attrs, kids: [] };
      top.kids.push(node);
      if (!m[5]) stack.push(node);
    } else if (m[6] !== undefined) top.kids.push(decode(m[6]));
  }
  return root;
}
const isEl = (n) => typeof n === "object";
const kids = (n, name) => n.kids.filter((k) => isEl(k) && (!name || k.name === name));
const first = (n, name) => kids(n, name)[0];
const textOf = (n) => (typeof n === "string" ? n : n.kids.map(textOf).join(""));

// ---------------------------------------------------------------- math (MathML -> readable text)
const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "+": "⁺", "−": "⁻", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾", n: "ⁿ", i: "ⁱ", x: "ˣ" };
const SUB = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉", "+": "₊", "−": "₋", "-": "₋", "=": "₌", "(": "₍", ")": "₎" };
const mapAll = (s, map) => (s && [...s].every((c) => map[c]) ? [...s].map((c) => map[c]).join("") : null);
const sup = (s) => mapAll(s, SUP) ?? (s.length === 1 ? "^" + s : "^(" + s + ")");
const sub = (s) => mapAll(s, SUB) ?? "_" + (s.length === 1 ? s : "(" + s + ")");
const OPS = new Set(["+", "−", "-", "=", "<", ">", "≤", "≥", "≠", "×", "÷", "·", "≈", "→", "⇒", "±"]);

function mml(n) {
  if (typeof n === "string") return n.trim();
  const k = n.kids.filter((x) => typeof x !== "string" || x.trim());
  const j = (list) => joinTokens(list.map(mml));
  switch (n.name) {
    case "mi": case "mn": case "mtext": case "ms": return textOf(n).trim();
    case "mo": return textOf(n).trim();
    case "mspace": return " ";
    case "mfrac": {
      const [a, b] = k.map((x) => stripFr(mml(x)));
      const simple = (s) => /^[\w.−-]+$/.test(s);
      return FR + `${simple(a) ? a : "(" + a + ")"}/${simple(b) ? b : "(" + b + ")"}`;
    }
    case "msup": return mml(k[0]) + sup(mml(k[1]));
    case "msub": return mml(k[0]) + sub(mml(k[1]));
    case "msubsup": return mml(k[0]) + sub(mml(k[1])) + sup(mml(k[2]));
    case "msqrt": { const s = j(k); return /^[\w.]+$/.test(s) ? "√" + s : "√(" + s + ")"; }
    case "mroot": return `${mml(k[1])}√(${mml(k[0])})`;
    case "mover": case "munder": return mml(k[0]);
    case "munderover": return mml(k[0]);
    case "mfenced": {
      const open = n.attrs.open ?? "(", close = n.attrs.close ?? ")", sep = n.attrs.separators ?? ",";
      return open + k.map(mml).join(sep + " ") + close;
    }
    case "mtable": return k.map((r) => (r.kids ? kidsText(r) : "")).join("; ");
    case "mtr": case "mtd": return kidsText(n);
    case "annotation": case "annotation-xml": return "";
    default: return j(k);
  }
}
const kidsText = (n) => joinTokens(n.kids.filter((x) => isEl(x) || x.trim()).map(mml));
const FR = "\u{E000}"; // marks a fraction so it can be bracketed when it sits next to other terms
const stripFr = (s) => (s === undefined ? s : s.split(FR).join(""));
function joinTokens(tokens) {
  let out = "";
  const live = tokens.filter(Boolean);
  tokens.forEach((t, i) => {
    if (!t) return;
    const prev = tokens.slice(0, i).filter(Boolean).pop();
    if (t.startsWith(FR)) {
      // "1/6x" would read as 1/(6x), so a fraction beside other terms gets brackets: (1/6)x
      const next = tokens.slice(i + 1).filter(Boolean)[0];
      const p = stripFr(prev), n = stripFr(next);
      const nearTerm = (n !== undefined && !OPS.has(n) && n !== ")" && n !== ",") || (p !== undefined && !OPS.has(p) && p !== "(" && p !== ",");
      out += live.length > 1 && nearTerm ? "(" + t.slice(1) + ")" : t.slice(1);
      return;
    }
    if (OPS.has(t)) {
      const unary = prev === undefined || OPS.has(stripFr(prev)) || prev === "(" || prev === ",";
      out += unary && (t === "−" || t === "-" || t === "+" || t === "±") ? t : ` ${t} `;
    } else out += t;
  });
  return stripFr(out).replace(/\s+/g, " ").trim();
}

// ---------------------------------------------------------------- CNXML -> lesson lines
function inline(n) {
  if (typeof n === "string") return n;
  switch (n.name) {
    case "math": return " " + mml(n) + " ";
    case "sub": return sub(n.kids.map(inline).join("").trim());
    case "sup": return sup(n.kids.map(inline).join("").trim());
    case "footnote": case "media": case "figure": case "image": case "metadata": return "";
    case "newline": case "space": return " ";
    case "link": return n.kids.length ? n.kids.map(inline).join("") : "";
    case "quote": return "“" + n.kids.map(inline).join("") + "”";
    case "equation": return " " + n.kids.map(inline).join("") + " ";
    case "list": return " " + listItems(n).join("; ") + " ";
    default: return n.kids.map(inline).join("");
  }
}
const clean = (s) => s.replace(/\(\s*\)/g, "").replace(/\s+/g, " ").replace(/\s+([,.;:!?)])/g, "$1").replace(/\(\s+/g, "(").trim();
const text = (n) => clean(inline(n));

function listItems(list) {
  const en = (list.attrs["list-type"] || "") === "enumerated";
  return kids(list, "item").map((it, i) => (en ? `${i + 1}. ` : "") + clean(inline(it)));
}

const SKIP_NOTE = new Set(["visual-connection", "link-to-learning", "interactive", "everyday-connection-video"]);
const SKIP_SECTION = new Set(["multiple-choice", "free-response", "critical-thinking", "visual-exercise", "references", "further-research", "practice-makes-perfect", "everyday-math", "writing-exercises", "self-check", "chapter-review", "review-questions", "test-prep"]);

function exerciseLines(c, out, depth) {
  const p = first(c, "problem"), sol = first(c, "solution");
  if (p) { const pl = []; for (const x of kids(p)) block(x, pl, depth + 1); if (pl.length) out.push("Problem: " + pl.join(" ")); }
  if (sol) { const sl = []; for (const x of kids(sol)) block(x, sl, depth + 1); if (sl.length) out.push("Solution: " + sl.join(" ")); }
}

function block(n, out, depth) {
  if (typeof n === "string") return;
  switch (n.name) {
    case "title": case "label": case "metadata": case "abstract": case "figure": case "media": case "footnote": case "exercise": case "commentary": case "image": return;
    case "para": { const t = text(n); if (t) out.push(t); return; }
    case "equation": { const t = text(n); if (t) out.push(t); return; }
    case "list": for (const it of listItems(n)) if (it.trim()) out.push("- " + it); return;
    case "table": {
      const cap = first(n, "title") || first(n, "caption");
      if (cap && text(cap)) out.push(text(cap));
      const rows = [];
      (function walk(x) { for (const c of kids(x)) { if (c.name === "row") rows.push(kids(c, "entry").map(text).join(" | ")); else walk(c); } })(n);
      for (const r of rows.slice(0, 30)) if (r.replace(/[ |]/g, "")) out.push("- " + r);
      return;
    }
    case "section": {
      const cls = n.attrs.class || "";
      if (SKIP_SECTION.has(cls) || /exercise|review-questions|multiple-choice|free-response/.test(cls)) return;
      const t = first(n, "title");
      const inner = [];
      for (const c of kids(n)) block(c, inner, depth + 1);
      if (!inner.length) return; // no heading without content
      if (t && text(t)) out.push((depth <= 1 ? "## " : "### ") + text(t));
      out.push(...inner);
      return;
    }
    case "note": {
      if (SKIP_NOTE.has(n.attrs.class || "")) return;
      const t = first(n, "title") || first(n, "label");
      const inner = [];
      for (const c of kids(n)) { if (c.name === "exercise") exerciseLines(c, inner, depth + 1); else block(c, inner, depth + 1); }
      if (!inner.length) return;
      if (t && text(t)) out.push("### " + text(t));
      out.push(...inner);
      return;
    }
    case "example": {
      const t = first(n, "title");
      const inner = [];
      for (const c of kids(n)) { if (c.name === "exercise") exerciseLines(c, inner, depth + 1); else block(c, inner, depth + 1); }
      if (!inner.length) return;
      out.push("### Example" + (t && text(t) ? ": " + text(t) : ""));
      out.push(...inner);
      return;
    }
    case "definition": {
      const term = first(n, "term"), meaning = first(n, "meaning");
      if (term && meaning) out.push(`- ${text(term)}: ${text(meaning)}`);
      return;
    }
    case "glossary": {
      const defs = kids(n, "definition");
      if (!defs.length) return;
      out.push("## Key terms");
      for (const d of defs) block(d, out, depth + 1);
      return;
    }
    default: for (const c of kids(n)) block(c, out, depth);
  }
}

// ---------------------------------------------------------------- exercises
function exercises(doc) {
  const mcq = [], self = [];
  (function walk(n, inMc) {
    if (typeof n === "string") return;
    const mc = inMc || /multiple-choice|true-false/.test(n.attrs.class || "");
    if (n.name === "exercise") {
      const p = first(n, "problem"), s = first(n, "solution");
      if (!p) return;
      const list = kids(p, "list")[0];
      const stem = kids(p, "para").map(text).filter(Boolean).join(" ");
      const sol = s ? clean(inline(s)).replace(/^\s*(answer|solution)[:.]?\s*/i, "") : "";
      if (mc && list && stem) {
        const options = kids(list, "item").map((i) => clean(inline(i)));
        const letter = (sol.match(/^\(?([A-Ea-e])\)?[.\s]*$/) || sol.match(/\b([A-E])\b/) || [])[1];
        const idx = letter ? letter.toUpperCase().charCodeAt(0) - 65 : -1;
        if (options.length >= 2 && options.length <= 5 && idx >= 0 && idx < options.length && new Set(options).size === options.length && options.every(Boolean))
          mcq.push({ q: stem, options, answer: idx, why: `The correct answer is: ${options[idx]}. Re-read the lesson above to see why.` });
      } else if (!mc) {
        const q = clean(inline(p));
        if (q.length > 15 && q.length < 500 && sol.length > 8 && sol.length < 900) self.push({ q, a: sol });
      }
      return;
    }
    for (const c of kids(n)) walk(c, mc);
  })(doc, false);
  return { mcq, self };
}

function glossaryTerms(doc) {
  const out = [];
  (function walk(n) {
    if (typeof n === "string") return;
    if (n.name === "definition") {
      const t = first(n, "term"), m = first(n, "meaning");
      if (t && m) {
        const term = text(t), meaning = text(m);
        if (term && term.length <= 60 && meaning.length >= 20 && meaning.length <= 240 && !out.some((o) => o.term === term)) out.push({ term, meaning });
      }
      return;
    }
    for (const c of kids(n)) walk(c);
  })(doc);
  return out;
}
function seeded(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  let a = h >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// ---------------------------------------------------------------- fetch with cache
async function fetchText(url, file) {
  if (fs.existsSync(file)) return fs.readFileSync(file, "utf8");
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(60000), headers: { "user-agent": "skul-sl-importer" } });
      if (r.status === 404) return null;
      if (!r.ok) throw new Error("HTTP " + r.status);
      const t = await r.text();
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, t);
      return t;
    } catch (e) {
      if (attempt === 4) throw e;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
}

const slug = (s) => s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "topic";

function readCollection(xml) {
  const doc = parseXml(xml);
  const col = first(doc, "collection");
  const meta = first(col, "metadata");
  const license = meta ? first(meta, "license") : null;
  const chapters = [];
  (function walk(content, unit) {
    const direct = kids(content, "module");
    const subs = kids(content, "subcollection");
    if (direct.length && unit !== undefined) chapters.push({ unit, title: unit, ids: direct.map((m) => m.attrs.document) });
    for (const s of subs) {
      const title = text(first(s, "title"));
      const inner = first(s, "content");
      if (kids(inner, "subcollection").length) walk(inner, title);
      else chapters.push({ unit: null, title, ids: kids(inner, "module").map((m) => m.attrs.document) });
    }
  })(first(col, "content"), undefined);
  return { chapters, license: license ? { name: text(license), url: license.attrs.url } : null, authors: col.attrs.authors };
}

async function importBook(b) {
  console.log(`\n== ${b.title}`);
  const base = `https://raw.githubusercontent.com/openstax/${b.repo}/main`;
  const colXml = await fetchText(`${base}/collections/${b.collection}.collection.xml`, path.join(CACHE, b.repo, `${b.collection}.collection.xml`));
  if (!colXml) throw new Error("collection not found: " + b.collection);
  const { chapters, license, authors } = readCollection(colXml);
  const ids = chapters.flatMap((c) => c.ids);
  console.log(`   ${chapters.length} chapters, ${ids.length} modules`);

  const mods = new Map();
  let next = 0, done = 0;
  async function worker() {
    while (next < ids.length) {
      const id = ids[next++];
      try {
        const xml = await fetchText(`${base}/modules/${id}/index.cnxml`, path.join(CACHE, b.repo, "modules", id + ".cnxml"));
        if (xml) mods.set(id, xml);
      } catch (e) { console.log("   ! " + id + " " + e.message); }
      if (++done % 50 === 0) console.log(`   downloaded ${done}/${ids.length}`);
    }
  }
  await Promise.all(Array.from({ length: 8 }, worker));

  const outDir = path.join(OUT, b.id);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(outDir, "t"), { recursive: true });

  const toc = { id: b.id, title: b.title, level: b.level, subject: b.subject, subjectTitle: b.subjectTitle, emoji: b.emoji, url: b.url, authors: (authors || "").replace(/\s*,\s*/g, ", ").trim(), license, publisher: "OpenStax", chapters: [] };
  const bank = [];
  const used = new Set();
  let topics = 0, qs = 0, selfs = 0, skipped = 0, generated = 0;
  const pending = []; // topics are written after the whole book is read, so glossary quizzes can use terms from every chapter
  const bookTerms = [];
  chapters.forEach((ch, ci) => {
    for (const id of ch.ids) {
      const xml = mods.get(id);
      if (!xml) { skipped++; continue; }
      const doc = first(parseXml(xml), "document");
      if (!doc) { skipped++; continue; }
      let title = text(first(doc, "title") || { kids: [] });
      if (/^introduction$/i.test(title)) title = "Introduction: " + ch.title;
      if (!title || /^(preface|about openstax|index|answer key|references|key terms|chapter review)$/i.test(title) || /^answer key/i.test(title)) { skipped++; continue; }
      const content = first(doc, "content");
      const lines = [];
      if (content) for (const c of kids(content)) block(c, lines, 1);
      const { mcq, self } = exercises(doc);
      if (lines.join(" ").length < 120 && !mcq.length) { skipped++; continue; }
      let tid = slug(title); if (used.has(tid)) tid += "-" + id; used.add(tid);
      const terms = glossaryTerms(doc);
      for (const t of terms) bookTerms.push({ ...t, ci });
      pending.push({ ci, ch, tid, title, topic: { id: tid, title, lesson: lines, questions: mcq.slice(0, 12), ...(self.length ? { selfCheck: self.slice(0, 8) } : {}) }, terms });
    }
  });

  // Glossary quizzes: "Which term matches this definition?" with distractors from the same chapter (or book) — only where the
  // textbook gave no multiple-choice questions of its own.
  for (const p of pending) {
    if (p.topic.questions.length >= 5 || !p.terms.length) continue;
    const sameChapter = bookTerms.filter((t) => t.ci === p.ci);
    for (const t of p.terms.slice(0, 6)) {
      const rng = seeded(t.term + p.tid);
      const pool = (sameChapter.length >= 8 ? sameChapter : bookTerms).filter((x) => x.term.toLowerCase() !== t.term.toLowerCase());
      const uniq = [...new Map(pool.map((x) => [x.term.toLowerCase(), x.term])).values()];
      if (uniq.length < 3) continue;
      const wrong = [];
      while (wrong.length < 3) { const c = uniq[Math.floor(rng() * uniq.length)]; if (!wrong.includes(c)) wrong.push(c); }
      const options = [...wrong]; options.splice(Math.floor(rng() * 4), 0, t.term);
      p.topic.questions.push({ q: `Which term matches this definition? “${t.meaning}”`, options, answer: options.indexOf(t.term), why: `${t.term}: ${t.meaning}` });
      generated++;
    }
  }

  const byChapter = new Map();
  for (const p of pending) {
    fs.writeFileSync(path.join(outDir, "t", p.tid + ".json"), JSON.stringify(p.topic));
    if (!byChapter.has(p.ci)) byChapter.set(p.ci, { unit: p.ch.unit, title: p.ch.title, topics: [] });
    byChapter.get(p.ci).topics.push({ id: p.tid, title: p.title });
    topics++; qs += p.topic.questions.length; selfs += p.topic.selfCheck?.length ?? 0;
    const key = `${b.level}/${b.subject}/${p.tid}`;
    for (const q of p.topic.questions) bank.push({ k: key, ...q });
    for (const s of p.topic.selfCheck ?? []) bank.push({ k: key, card: s });
  }
  toc.chapters = [...byChapter.entries()].sort((a, b) => a[0] - b[0]).map(([, v]) => v);
  fs.writeFileSync(path.join(outDir, "toc.json"), JSON.stringify(toc));
  console.log(`   ${topics} topics, ${qs} questions (${generated} from glossary terms), ${selfs} self-check Q&As (${skipped} modules skipped)`);
  return { b, toc, bank };
}

// ---------------------------------------------------------------- main
const only = process.argv.slice(2);
const results = [];
for (const b of BOOKS.filter((x) => !only.length || only.includes(x.id))) results.push(await importBook(b));

// Per-book question banks for the client (kept out of the main JS bundle)
const qdir = path.join(ROOT, "public", "qbank");
fs.mkdirSync(qdir, { recursive: true });
for (const { b, bank } of results) fs.writeFileSync(path.join(qdir, b.id + ".json"), JSON.stringify(bank));
// index of all imported topics (for progress + offline saving)
const indexFile = path.join(qdir, "index.json");
let index = {};
try { index = JSON.parse(fs.readFileSync(indexFile, "utf8")); } catch {}
for (const { b, toc } of results) {
  index[b.id] = { level: b.level, subject: b.subject, title: b.title, topics: toc.chapters.flatMap((c) => c.topics.map((t) => [t.id, t.title])) };
}
fs.writeFileSync(indexFile, JSON.stringify(index));
console.log("\nDone.");
