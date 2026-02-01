import { EvidenceItem, EvidenceKind } from "../types";
import { useMemo } from "react";

const LABELS: Record<EvidenceKind, string> = {
  observation: "Observation",
  interpretation: "Interprétation",
  conclusion: "Conclusion"
};

export default function EvidenceCard(props: {
  title: string;
  instructions: string;
  evidence: EvidenceItem[];
  saved?: any;
  onChange: (state: { picked: Record<string, EvidenceKind> }) => void;
}) {
  const { title, instructions, evidence, saved, onChange } = props;

  const picked = (saved?.picked ?? {}) as Record<string, EvidenceKind>;

  const progress = useMemo(() => {
    const done = Object.keys(picked).length;
    return { done, total: evidence.length };
  }, [picked, evidence.length]);

  function setPick(id: string, kind: EvidenceKind) {
    onChange({ picked: { ...picked, [id]: kind } });
  }

  return (
    <div>
      <div className="h1">{title}</div>
      <p className="small" style={{ whiteSpace: "pre-wrap" }}>{instructions}</p>
      <div className="badge">Cartes classées : <strong>{progress.done}</strong> / {progress.total}</div>

      <hr />

      <div className="grid">
        {evidence.map((e) => (
          <div key={e.id} className="card" style={{ background: "rgba(0,0,0,0.14)" }}>
            <div className="cardTitle">
              <div>
                <div style={{ fontWeight: 800 }}>{e.title}</div>
                <div className="small" style={{ whiteSpace: "pre-wrap" }}>{e.text}</div>
                {e.hint ? <div className="small" style={{ marginTop: 8 }}>Indice : {e.hint}</div> : null}
              </div>
              <span className="badge">{picked[e.id] ? LABELS[picked[e.id]] : "À classer"}</span>
            </div>

            <div className="row" style={{ marginTop: 10 }}>
              {(["observation", "interpretation", "conclusion"] as EvidenceKind[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setPick(e.id, k)}
                  style={{ flex: "1 1 120px" }}
                >
                  {LABELS[k]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
