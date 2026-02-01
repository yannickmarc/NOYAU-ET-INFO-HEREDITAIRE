import { useMemo, useState } from "react";
import { Sequence } from "../types";
import TeacherPanel from "../components/TeacherPanel";
import { getTeacherPin } from "../utils/storage";

export default function TeacherFlow(props: {
  seq: Sequence;
  unlocked: boolean;
  onUnlock: () => void;
  onBack: () => void;
}) {
  const { unlocked, onUnlock, onBack } = props;

  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const currentPin = useMemo(() => getTeacherPin(), []);

  function check() {
    if (pin.trim() === currentPin) {
      setError(null);
      onUnlock();
    } else {
      setError("Code incorrect.");
    }
  }

  if (!unlocked) {
    return (
      <div className="card">
        <div className="h1">Accès enseignant</div>
        <div className="small">Saisis le code PIN pour consulter les résultats et exporter en CSV.</div>
        <hr />
        <div className="row">
          <div className="col">
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN (par défaut : 1234)"
              inputMode="numeric"
            />
            {error ? <div className="small bad" style={{ marginTop: 8 }}>{error}</div> : null}
          </div>
          <div className="col" style={{ alignSelf: "end" }}>
            <button onClick={check} style={{ width: "100%" }}>Déverrouiller</button>
          </div>
        </div>
        <hr />
        <button onClick={onBack}>Retour</button>
      </div>
    );
  }

  return (
    <TeacherPanel onBack={onBack} />
  );
}
