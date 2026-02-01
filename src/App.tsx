import { useMemo, useState } from "react";
import seqRaw from "./content/sequence.fr.json";
import { Sequence } from "./types";
import Header from "./components/Header";
import StudentFlow from "./pages/StudentFlow";
import TeacherFlow from "./pages/TeacherFlow";
import { getTeacherPin, setTeacherPin } from "./utils/storage";

type Mode = "student" | "teacher";

export default function App() {
  const seq = useMemo(() => seqRaw as Sequence, []);
  const [mode, setMode] = useState<Mode>("student");
  const [teacherUnlocked, setTeacherUnlocked] = useState(false);

  const currentPin = getTeacherPin();
  if (!currentPin) setTeacherPin(seq.meta.teacherPinDefault);

  return (
    <div className="container">
      <Header
        title={seq.meta.appTitle}
        mode={mode}
        onSetMode={(m) => {
          setMode(m);
          if (m === "teacher") setTeacherUnlocked(false);
        }}
      />

      {mode === "student" ? (
        <StudentFlow seq={seq} onGoTeacher={() => setMode("teacher")} />
      ) : (
        <TeacherFlow
          seq={seq}
          unlocked={teacherUnlocked}
          onUnlock={() => setTeacherUnlocked(true)}
          onBack={() => setMode("student")}
        />
      )}
    </div>
  );
}
