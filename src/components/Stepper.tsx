import { Attempt, Step } from "../types";
import EvidenceCard from "./EvidenceCard";
import DragDropChain from "./DragDropChain";
import ShortJustification from "./ShortJustification";
import Summary from "./Summary";

export default function Stepper(props: {
  steps: Step[];
  index: number;
  step: Step;
  attempt: Attempt;
  onSaveState: (stepId: string, state: any) => void;
}) {
  const { step, attempt, onSaveState } = props;

  const saved = attempt.stepStates[step.id];

  if (step.type === "intro") {
    return (
      <div>
        <div className="h1">{step.title}</div>
        <p className="small" style={{ whiteSpace: "pre-wrap" }}>{step.prompt}</p>
      </div>
    );
  }

  if (step.type === "classify") {
    return (
      <EvidenceCard
        title={step.title}
        instructions={step.instructions}
        evidence={step.evidence}
        saved={saved}
        onChange={(state) => onSaveState(step.id, state)}
      />
    );
  }

  if (step.type === "chain") {
    return (
      <DragDropChain
        title={step.title}
        instructions={step.instructions}
        bank={step.bank}
        target={step.target}
        saved={saved}
        onChange={(state) => onSaveState(step.id, state)}
      />
    );
  }

  if (step.type === "justify") {
    return (
      <ShortJustification
        title={step.title}
        prompt={step.prompt}
        rubric={step.rubric}
        saved={saved}
        onChange={(state) => onSaveState(step.id, state)}
      />
    );
  }

  return <Summary title={step.title} statement={step.statement} />;
}
