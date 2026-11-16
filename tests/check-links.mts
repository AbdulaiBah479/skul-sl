// Visits every resource URL and reports the ones that do not answer. Needs internet (not part of `npm test`).
//   npm run check:links
import { RESOURCES, SCHOLARSHIPS } from "../src/lib/resources.ts";

const all = [...RESOURCES.map((r) => ({ name: r.name, url: r.url })), ...SCHOLARSHIPS.map((s) => ({ name: s.name, url: s.url }))];
const bad: string[] = [];
const soft: string[] = [];
let i = 0;

async function check(u: string) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const r = await fetch(u, { method, redirect: "follow", signal: AbortSignal.timeout(20000), headers: { "user-agent": "Mozilla/5.0 (link check)" } });
      if (r.status < 400) return r.status;
      if (r.status === 403 || r.status === 412 || r.status === 429 || r.status === 999) return r.status; // site blocks bots, but it exists
      if (method === "GET") return r.status;
    } catch (e) {
      if (method === "GET") throw e;
    }
  }
  return 0;
}

async function worker() {
  while (i < all.length) {
    const { name, url } = all[i++];
    try {
      const s = await check(url);
      if (s >= 400 && s !== 403 && s !== 412 && s !== 429 && s !== 999) bad.push(`${s} ${name} ${url}`);
      else if (s === 403 || s === 412 || s === 429 || s === 999) soft.push(`${s} ${name}`);
    } catch (e) {
      bad.push(`ERR ${name} ${url} (${e instanceof Error ? e.message : e})`);
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
console.log(`checked ${all.length} links`);
if (soft.length) console.log(`blocked bots (probably fine): ${soft.length}\n  ${soft.join("\n  ")}`);
if (bad.length) {
  console.log(`\nNOT WORKING (${bad.length}):\n  ${bad.join("\n  ")}`);
  process.exit(1);
}
console.log("all links answer");
