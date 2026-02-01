export default function Header(props: {
  title: string;
  mode: "student" | "teacher";
  onSetMode: (m: "student" | "teacher") => void;
}) {
  const { title, mode, onSetMode } = props;

  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="cardTitle">
        <div>
          <div className="h1">{title}</div>
          <div className="h2">iPad • 3ᵉ • Raisonnement guidé • Export enseignant</div>
        </div>
        <div className="row" style={{ alignItems: "center", justifyContent: "flex-end" }}>
          <span className="badge">
            Mode : <strong>{mode === "student" ? "Élève" : "Enseignant"}</strong>
          </span>
          <button onClick={() => onSetMode(mode === "student" ? "teacher" : "student")}>
            Basculer
          </button>
        </div>
      </div>
    </div>
  );
}
