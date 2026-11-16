import { NextResponse } from "next/server";

// AI tutor. Uses FREE-tier providers when a key is set in the environment (GEMINI_API_KEY and/or GROQ_API_KEY).
// With no key it answers 503 and the app falls back to its offline lesson search. Nothing here is required for the app to work.

const SYSTEM = `You are Skul SL, a patient, friendly tutor for students in Sierra Leone, from primary school to university.
- Explain in simple English with short sentences. Use examples from everyday life in Sierra Leone (markets, leones, rice farming, Freetown) when it helps.
- Give the steps for maths and science problems, and check the answer.
- Help the student understand; do not just give answers to graded take-home work without explaining.
- If you are not sure, say so. Never invent facts, dates, laws or exam rules.
- For health, legal or money problems, give general information only and advise seeing a qualified person or clinic.
- Keep answers under 250 words unless asked for more.`;

const MAX_Q = 1200;
const hits = new Map<string, { n: number; t: number }>();
const LIMIT = 20; // questions per IP per 10 minutes (free tiers are small, so protect them)

function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 600_000) {
    hits.set(ip, { n: 1, t: now });
    if (hits.size > 5000) for (const [k, v] of hits) if (now - v.t > 600_000) hits.delete(k);
    return false;
  }
  h.n++;
  return h.n > LIMIT;
}

type Msg = { role: "user" | "assistant"; content: string };

async function gemini(msgs: Msg[], signal: AbortSignal): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("no gemini key");
  const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: msgs.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      generationConfig: { maxOutputTokens: 700, temperature: 0.4 },
    }),
    signal,
  });
  if (!res.ok) throw new Error("gemini " + res.status);
  const j = await res.json();
  const text = j?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("");
  if (!text) throw new Error("gemini empty");
  return text;
}

async function groq(msgs: Msg[], signal: AbortSignal): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("no groq key");
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      messages: [{ role: "system", content: SYSTEM }, ...msgs],
      max_tokens: 700,
      temperature: 0.4,
    }),
    signal,
  });
  if (!res.ok) throw new Error("groq " + res.status);
  const j = await res.json();
  const text = j?.choices?.[0]?.message?.content;
  if (!text) throw new Error("groq empty");
  return text;
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  if (limited(ip)) return NextResponse.json({ error: "Too many questions. Please wait a few minutes." }, { status: 429 });

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const raw = Array.isArray(body.messages) ? body.messages : [];
  const msgs: Msg[] = raw
    .filter((m): m is Msg => !!m && typeof m === "object" && (m as Msg).role !== undefined && typeof (m as Msg).content === "string" && ["user", "assistant"].includes((m as Msg).role))
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_Q) }));
  if (!msgs.length || msgs[msgs.length - 1].role !== "user" || !msgs[msgs.length - 1].content.trim()) {
    return NextResponse.json({ error: "Ask a question first." }, { status: 400 });
  }
  if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "The AI tutor is not switched on yet.", offline: true }, { status: 503 });
  }

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 25_000);
  try {
    for (const provider of [gemini, groq]) {
      try {
        const text = await provider(msgs, ctl.signal);
        return NextResponse.json({ answer: text });
      } catch {
        /* try the next free provider */
      }
    }
    return NextResponse.json({ error: "The tutor is busy. Please try again in a moment.", offline: true }, { status: 503 });
  } finally {
    clearTimeout(timer);
  }
}
