export type EvidenceKind = "observation" | "interpretation" | "conclusion";

export type EvidenceItem = {
  id: string;
  title: string;
  text: string;
  kind: EvidenceKind;
  hint?: string;
};

export type ChainItem = {
  id: string;
  label: string;
};

export type Step =
  | { type: "intro"; id: string; title: string; prompt: string }
  | { type: "classify"; id: string; title: string; instructions: string; evidence: EvidenceItem[] }
  | { type: "chain"; id: string; title: string; instructions: string; bank: ChainItem[]; target: string[] }
  | { type: "justify"; id: string; title: string; prompt: string; rubric: { expected: string[]; avoid: string[] } }
  | { type: "summary"; id: string; title: string; statement: string[] };

export type Sequence = {
  meta: {
    appTitle: string;
    teacherPinDefault: string;
    sessionTargetMinutes: number;
    version: string;
  };
  steps: Step[];
};

export type StudentIdentity = {
  group?: string;
  nameOrCode: string;
};

export type Attempt = {
  id: string;
  startedAtISO: string;
  finishedAtISO?: string;
  student: StudentIdentity;
  stepStates: Record<string, any>;
  score: {
    classify: { correct: number; total: number };
    chain: { correct: number; total: number };
    justify: { hits: number; misses: number; note: string };
    overall: number;
  };
};
