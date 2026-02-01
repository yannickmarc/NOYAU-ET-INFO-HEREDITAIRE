import { useMemo, useState } from "react";
import { clearAttempts, listAttempts, setTeacherPin } from "../utils/storage";
import { attemptsToCSV, downloadTextFile } from "../utils/csv";

export default function TeacherPanel(props: { onBack: () => void }) {
  const { onBack } = props;
  const [pin, setPin] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const attempts = useMemo(() => listAttempts(), [refreshKey]);

  function exportCSV() {
    const csv = attemptsToCSV(attempts);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadTextFile(`resultats_svt_noyau_${stamp}.csv`, csv);
  }

  function purge() {
    clearAttempts();
    setRefreshKey(k => k + 1);
  }

  function changePin() {
    const p = pin.trim();
    if (p.length < 4) return;
    setTeacherPin(p);
    setPin("");
    alert("PIN modifié.");
  }

  return (
    <div className="card">
      <div className="h1">Tableau de bord enseignant</div>
      <div className="small">
        Les données sont stockées localement sur cet iPad (localStorage).
      </div>

      <hr />

      <div className="row">
        <button onClick={exportCSV} disabled={attempts.length === 0}>Exporter CSV</button>
        <button onClick={purge} disabled={attempts.length === 0}>Effacer les résultats</button>
        <button onClick={onBack}>Retour élève</button>
      </div>

      <hr />

      <div className="row">
        <div className="col">
          <div className="small">Changer le PIN (≥ 4 chiffres)</div>
          <input value={pin} onChange={(e) => setPin(e.target.value)} inputMode="numeric" placeholder="Nouveau PIN" />
        </div>
        <div className="col" style={{ alignSelf: "end" }}>
          <button onClick={changePin} disabled={pin.trim().length < 4} style={{ width: "100%" }}>
            Modifier le PIN
          </button>
        </div>
      </div>

      <hr />

      <div className="h1">Résultats</div>
      {attempts.length === 0 ? (
        <div className="small">Aucun résultat pour le moment.</div>
      ) : (
        <div className="card" style={{ background: "rgba(0,0,0,0.12)" }}>
          {attempts.slice(0, 50).map((a) => (
            <div key={a.id} style={{ padding: 10, borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <strong>{a.student.nameOrCode}</strong>
                  {a.student.group ? <span className="small"> • {a.student.group}</span> : null}
                  <div className="small">Début : {a.startedAtISO}</div>
                  {a.finishedAtISO ? <div className="small">Fin : {a.finishedAtISO}</div> : <div className="small warn">Non terminé</div>}
                </div>
                <div>
                  <div className="badge">Score : <strong>{a.score.overall}</strong> / 100</div>
                  <div className="small">Tri : {a.score.classify.correct}/{a.score.classify.total} • Chaîne : {a.score.chain.correct}/{a.score.chain.total}</div>
                  <div className="small">Justif : {a.score.justify.note} (hits {a.score.justify.hits}, misses {a.score.justify.misses})</div>
                </div>
              </div>
            </div>
          ))}
          <div className="small" style={{ padding: 10 }}>
            Affichage limité aux 50 derniers essais (l’export CSV contient tout).
          </div>
        </div>
      )}
    </div>
  );
}
