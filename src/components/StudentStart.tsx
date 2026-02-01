import { useState } from "react";
import { StudentIdentity } from "../types";

export default function StudentStart(props: { onStart: (s: StudentIdentity) => void }) {
  const { onStart } = props;
  const [group, setGroup] = useState("3e");
  const [nameOrCode, setNameOrCode] = useState("");

  return (
    <div className="row">
      <div className="col">
        <div className="small">Classe / groupe (optionnel)</div>
        <input value={group} onChange={(e) => setGroup(e.target.value)} placeholder="ex : 3e2" />
      </div>
      <div className="col">
        <div className="small">Prénom ou code</div>
        <input
          value={nameOrCode}
          onChange={(e) => setNameOrCode(e.target.value)}
          placeholder="ex : Yann / E12"
        />
      </div>
      <div className="col" style={{ alignSelf: "end" }}>
        <button
          onClick={() => onStart({ group: group.trim() || undefined, nameOrCode: nameOrCode.trim() })}
          disabled={!nameOrCode.trim()}
          style={{ width: "100%" }}
        >
          Commencer
        </button>
      </div>
    </div>
  );
}
