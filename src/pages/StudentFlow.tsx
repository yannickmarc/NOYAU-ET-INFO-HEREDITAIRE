import { useMemo, useState } from "react";
import { Attempt, Sequence, StudentIdentity, Step } from "../types";
import StudentStart from "../components/StudentStart";
import Stepper from "../components/Stepper";
import { overallScore, scoreChain, scoreClassification, scoreJustification } from "../utils/scoring";
import { addAttempt, updateAttempt } from "../utils/storage";

function uid() {
  return Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

export default function StudentFlow(props: { seq: Sequence; onGoTeacher: () => void }) {
  const { seq, onGoTeacher } = props;

  const steps = useMemo(() => seq.steps, [seq]);

  const [identity, setIdentity] = useState<StudentIdentity | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);

  const [index, setIndex] = useState(0);

  function startSession(student: StudentIdentity) {
    const a: Attempt = {
      id: uid(),
      startedAtISO: new Date().toISOString(),
      student,
      stepStates: {},
      score: {
        classify: { correct: 0, total: 1 },
        chain: { correct: 0, total: 1 },
        justify: { hits: 0, misses: 0, note: "" },
        overall: 0
      }
    };
    setIdentity(student);
    setAttempt(a);
    addAttempt(a);
    setIndex(0);
  }

  function saveStepState(stepId: string, state: any) {
    if (!attempt) return;
    const updated: Attempt = {
      ...attempt,
      stepStates: { ...attempt.stepStates, [stepId]: state }
    };

    const classifyStep = steps.find(s => s.type === "classify") as Extract<Step, { type: "classify" }> | undefined;
    const chainStep = steps.find(s => s.type === "chain") as Extract<Step, { type: "chain" }> | undefined;
    const justifyStep = steps.find(s => s.type === "justify") as Extract<Step, { type: "justify" }> | undefined;

    const classifyState = updated.stepStates[classifyStep?.id ?? ""] as any;
    const chainState = updated.stepStates[chainStep?.id ?? ""] as any;
    const justifyState = updated.stepStates[justifyStep?.id ?? ""] as any;

    const classifyScore = classifyStep && classifyState?.picked
      ? scoreClassification(classifyStep.evidence, classifyState.picked)
      : updated.score.classify;

    const chainScore = chainStep && Array.isArray(chainState?.placed)
      ? scoreChain(chainStep.target, chainState.placed)
      : updated.score.chain;

    const justifyScore = justifyStep && typeof justifyState?.text === "string"
      ? scoreJustification(justifyState.text, justifyStep.rubric.expected, justifyStep.rubric.avoid)
      : updated.score.justify;

    const overall = overallScore({ classify: classifyScore, chain: chainScore, justify: justifyScore });

    updated.score = { classify: classifyScore, chain: chainScore, justify: justifyScore, overall };

    setAttempt(updated);
    updateAttempt(updated);
  }

  function finish() {
    if (!attempt) return;
    const done: Attempt = { ...attempt, finishedAtISO: new Date().toISOString() };
    setAttempt(done);
    updateAttempt(done);
  }

  if (!identity || !attempt) {
    return (
      <div className="grid">
        <div className="card">
          <div className="h1">Démarrer</div>
          <div className="small">
            Cette activité te guide pour construire le raisonnement : noyau → chromosomes → ADN → information héréditaire.
          </div>
          <hr />
          <StudentStart onStart={startSession} />
          <hr />
          <button onClick={onGoTeacher}>Accès enseignant</button>
        </div>

        <div className="card">
          <div className="h1">Organisation conseillée</div>
          <ul className="small">
            <li>Séance 1 : tri des preuves + chaîne logique.</li>
            <li>Séance 2 : justification + trace écrite + reprise.</li>
          </ul>
          <div className="small">
            Astuce : utilisez un code élève si vous ne souhaitez pas saisir les prénoms.
          </div>
        </div>
      </div>
    );
  }

  const step = steps[index];

  return (
    <div className="card">
      <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
        <span className="badge">
          Élève : <strong>{identity.nameOrCode}</strong>
          {identity.group ? <> • <span>{identity.group}</span></> : null}
        </span>
        <span className="badge">
          Score actuel : <strong>{attempt.score.overall}</strong> / 100
        </span>
      </div>

      <hr />

      <Stepper
        steps={steps}
        index={index}
        step={step}
        attempt={attempt}
        onSaveState={saveStepState}
      />

      <hr />

      <div className="footerNav">
        <button
          onClick={() => setIndex(i => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          Précédent
        </button>

        <span className="small">
          Étape <span className="kbd">{index + 1}</span> / {steps.length}
        </span>

        {index < steps.length - 1 ? (
          <button onClick={() => setIndex(i => Math.min(steps.length - 1, i + 1))}>
            Suivant
          </button>
        ) : (
          <button onClick={finish}>Terminer</button>
        )}
      </div>
    </div>
  );
}
