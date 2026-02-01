import { useMemo, useState } from "react";
import { ChainItem } from "../types";

export default function DragDropChain(props: {
  title: string;
  instructions: string;
  bank: ChainItem[];
  target: string[];
  saved?: any;
  onChange: (state: { placed: string[] }) => void;
}) {
  const { title, instructions, bank, target, saved, onChange } = props;

  const placed = ((saved?.placed ?? []) as string[]);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const placedSet = new Set(placed);
  const bankItems = useMemo(() => bank.filter(b => !placedSet.has(b.id)), [bank, placedSet]);

  function onDropZone() {
    if (!draggingId) return;
    if (placed.includes(draggingId)) return;
    const next = [...placed, draggingId];
    onChange({ placed: next });
    setDraggingId(null);
  }

  function removeAt(idx: number) {
    const next = placed.slice();
    next.splice(idx, 1);
    onChange({ placed: next });
  }

  function move(idx: number, dir: -1 | 1) {
    const next = placed.slice();
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    const tmp = next[idx];
    next[idx] = next[j];
    next[j] = tmp;
    onChange({ placed: next });
  }

  const targetLen = target.length;
  const done = placed.length;

  return (
    <div>
      <div className="h1">{title}</div>
      <p className="small" style={{ whiteSpace: "pre-wrap" }}>{instructions}</p>
      <div className="badge">Éléments placés : <strong>{done}</strong> / {targetLen}</div>

      <hr />

      <div className="row">
        <div className="col">
          <div className="small">Banque</div>
          <div className="dndZone">
            {bankItems.map((b) => (
              <span
                key={b.id}
                className="pill"
                draggable
                onDragStart={() => setDraggingId(b.id)}
                onDragEnd={() => setDraggingId(null)}
                title="Glisser-déposer"
              >
                {b.label}
              </span>
            ))}
            {bankItems.length === 0 ? <div className="small">Tout est placé.</div> : null}
          </div>
        </div>

        <div className="col">
          <div className="small">Chaîne (glisse ici)</div>
          <div
            className="dndZone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropZone}
          >
            {placed.length === 0 ? (
              <div className="small">Dépose ici les éléments dans l’ordre logique.</div>
            ) : null}

            {placed.map((id, idx) => {
              const item = bank.find(b => b.id === id);
              if (!item) return null;
              return (
                <div key={id} className="card" style={{ marginTop: 8, background: "rgba(255,255,255,0.04)" }}>
                  <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontWeight: 700 }}>
                      {idx + 1}. {item.label}
                    </div>
                    <div className="row" style={{ justifyContent: "flex-end" }}>
                      <button onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
                      <button onClick={() => move(idx, 1)} disabled={idx === placed.length - 1}>↓</button>
                      <button onClick={() => removeAt(idx)}>Retirer</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="small" style={{ marginTop: 10 }}>
            Conseil : tu peux réordonner avec ↑ ↓ si le glisser-déposer est délicat sur iPad.
          </div>
        </div>
      </div>
    </div>
  );
}
