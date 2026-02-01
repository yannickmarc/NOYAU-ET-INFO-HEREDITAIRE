import { Attempt } from "../types";

function esc(s: string) {
  const v = (s ?? "").toString();
  if (/[",\n]/.test(v)) return `"${v.replaceAll('"', '""')}"`;
  return v;
}

export function attemptsToCSV(attempts: Attempt[]) {
  const header = [
    "date_debut",
    "date_fin",
    "classe_groupe",
    "eleve",
    "score_global",
    "classif_correct",
    "classif_total",
    "chaine_correct",
    "chaine_total",
    "justif_hits",
    "justif_misses",
    "justif_note"
  ];
  const lines = [header.join(",")];

  for (const a of attempts) {
    lines.push([
      esc(a.startedAtISO),
      esc(a.finishedAtISO ?? ""),
      esc(a.student.group ?? ""),
      esc(a.student.nameOrCode),
      esc(a.score.overall),
      esc(a.score.classify.correct),
      esc(a.score.classify.total),
      esc(a.score.chain.correct),
      esc(a.score.chain.total),
      esc(a.score.justify.hits),
      esc(a.score.justify.misses),
      esc(a.score.justify.note)
    ].join(","));
  }
  return lines.join("\n");
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
