import { EvidenceItem } from "../types";

export function scoreClassification(
  evidence: EvidenceItem[],
  picked: Record<string, "observation" | "interpretation" | "conclusion">
) {
  let correct = 0;
  for (const e of evidence) {
    if (picked[e.id] === e.kind) correct += 1;
  }
  return { correct, total: evidence.length };
}

export function scoreChain(target: string[], placed: string[]) {
  const total = target.length;
  let correct = 0;
  for (let i = 0; i < total; i++) if (placed[i] === target[i]) correct += 1;
  return { correct, total };
}

export function scoreJustification(text: string, expected: string[], avoid: string[]) {
  const t = text.toLowerCase();
  const hits = expected.filter(k => t.includes(k.toLowerCase())).length;
  const misses = avoid.filter(k => t.includes(k.toLowerCase())).length;

  let note = "À renforcer";
  if (hits >= Math.max(2, Math.floor(expected.length / 2)) && misses === 0) note = "Satisfaisant";
  if (hits >= Math.max(3, Math.floor((2 * expected.length) / 3)) && misses === 0) note = "Très solide";

  return { hits, misses, note };
}

export function overallScore(parts: {
  classify?: { correct: number; total: number };
  chain?: { correct: number; total: number };
  justify?: { hits: number; misses: number };
}) {
  const c = parts.classify ? (parts.classify.correct / Math.max(1, parts.classify.total)) : 0;
  const ch = parts.chain ? (parts.chain.correct / Math.max(1, parts.chain.total)) : 0;
  const j = parts.justify ? Math.max(0, (parts.justify.hits - parts.justify.misses) / 4) : 0;

  const score = 100 * (0.4 * c + 0.4 * ch + 0.2 * Math.min(1, j));
  return Math.round(score);
}
