// A small, safe calculator (no eval): + − × ÷ ^ % (as percent), brackets, unary minus, sqrt(), decimals.
type Tok = { t: "num"; v: number } | { t: "op"; v: string } | { t: "fn"; v: string } | { t: "(" } | { t: ")" };

function tokenize(src: string): Tok[] {
  // Spaces separate tokens but are never removed, so "2 3" is an error and not the number 23.
  const s = src.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").toLowerCase();
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
    } else if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const raw = s.slice(i, j);
      if ((raw.match(/\./g) || []).length > 1 || raw === ".") throw new Error("Bad number");
      out.push({ t: "num", v: Number(raw) });
      i = j;
    } else if ("+-*/^%".includes(c)) {
      out.push({ t: "op", v: c });
      i++;
    } else if (c === "(") {
      out.push({ t: "(" });
      i++;
    } else if (c === ")") {
      out.push({ t: ")" });
      i++;
    } else if (s.startsWith("sqrt", i)) {
      out.push({ t: "fn", v: "sqrt" });
      i += 4;
    } else throw new Error("Unexpected " + c);
  }
  return out;
}

export function evaluate(src: string): number {
  const toks = tokenize(src);
  let pos = 0;
  const peek = () => toks[pos];

  // expr := term (('+'|'-') term)*
  function expr(): number {
    let v = term();
    for (;;) {
      const t = peek();
      if (t && t.t === "op" && (t.v === "+" || t.v === "-")) {
        pos++;
        const r = term();
        v = t.v === "+" ? v + r : v - r;
      } else return v;
    }
  }
  // term := power (('*'|'/') power)*
  function term(): number {
    let v = power();
    for (;;) {
      const t = peek();
      if (t && t.t === "op" && (t.v === "*" || t.v === "/")) {
        pos++;
        const r = power();
        if (t.v === "/" && r === 0) throw new Error("Cannot divide by zero");
        v = t.v === "*" ? v * r : v / r;
      } else return v;
    }
  }
  // power := unary ('^' power)?   (right associative)
  function power(): number {
    const b = unary();
    const t = peek();
    if (t && t.t === "op" && t.v === "^") {
      pos++;
      return Math.pow(b, power());
    }
    return b;
  }
  function unary(): number {
    const t = peek();
    if (t && t.t === "op" && (t.v === "-" || t.v === "+")) {
      pos++;
      const v = unary();
      return t.v === "-" ? -v : v;
    }
    return postfix();
  }
  function postfix(): number {
    let v = atom();
    while (peek() && peek()!.t === "op" && (peek() as { v: string }).v === "%") {
      pos++;
      v = v / 100;
    }
    return v;
  }
  function atom(): number {
    const t = peek();
    if (!t) throw new Error("Incomplete");
    if (t.t === "num") {
      pos++;
      return t.v;
    }
    if (t.t === "fn") {
      pos++;
      if (!peek() || peek()!.t !== "(") throw new Error("sqrt needs brackets");
      const v = atom();
      if (v < 0) throw new Error("No square root of a negative number");
      return Math.sqrt(v);
    }
    if (t.t === "(") {
      pos++;
      const v = expr();
      if (!peek() || peek()!.t !== ")") throw new Error("Missing )");
      pos++;
      return v;
    }
    throw new Error("Unexpected symbol");
  }

  if (!toks.length) throw new Error("Empty");
  const v = expr();
  if (pos < toks.length) throw new Error("Unexpected symbol");
  if (!Number.isFinite(v)) throw new Error("Result too large");
  return v;
}

export function format(n: number): string {
  const r = Math.round(n * 1e10) / 1e10;
  return String(r);
}
