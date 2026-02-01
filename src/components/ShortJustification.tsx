import { useMemo } from "react";

export default function ShortJustification(props: {
  title: string;
  prompt: string;
  rubric: { expected: string[]; avoid: string[] };
  saved?: any;
  onChange: (state: { text: string }) => void;
}) {
  const { title, prompt, rubric, saved, onChange } = props;
  const text = (saved?.text ?? "") as string;

  const feedback = useMemo(() => {
    const t = text.toLowerCase();
    const hits = rubric.expected.filter(k => t.includes(k.toLowerCase()));
    const misses = rubric.avoid.filter(k => t.includes(k.toLowerCase()));
    return { hits, misses };
  }, [text, rubric]);

  return (
    <div>
      <div className="h1">{title}</div>
      <p className="small" style={{ whiteSpace: "pre-wrap" }}>{prompt}</p>

      <textarea
        rows={8}
        value={text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="Écris ici…"
      />

      <hr />

      <div className="row">
        <div className="col card" style={{ background: "rgba(0,0,0,0.12)" }}>
          <div style={{ fontWeight: 800 }}>Indicateurs (aide)</div>
          <div className="small">Mots-clés repérés : <span className="ok">{feedback.hits.join(", ") || "aucun"}</span></div>
          <div className="small">Formulations à éviter repérées : <span className="bad">{feedback.misses.join(", ") || "aucune"}</span></div>
          <div className="small" style={{ marginTop: 8 }}>
            Attendu : citer au moins deux indices (ex. chromosomes dans le noyau, ADN dans les chromosomes) et expliciter le lien logique.
          </div>
        </div>

        <div className="col card" style={{ background: "rgba(0,0,0,0.12)" }}>
          <div style={{ fontWeight: 800 }}>Mots-clés attendus</div>
          <div className="small">{rubric.expected.join(" • ")}</div>
          <div style={{ height: 10 }} />
          <div style={{ fontWeight: 800 }}>À éviter</div>
          <div className="small">{rubric.avoid.join(" • ")}</div>
        </div>
      </div>
    </div>
  );
}
