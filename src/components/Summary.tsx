export default function Summary(props: { title: string; statement: string[] }) {
  const { title, statement } = props;
  return (
    <div>
      <div className="h1">{title}</div>
      <div className="card" style={{ background: "rgba(0,0,0,0.12)" }}>
        <ul>
          {statement.map((s, i) => (
            <li key={i} style={{ marginBottom: 8 }}>{s}</li>
          ))}
        </ul>
      </div>
      <div className="small">
        Conseil : copie/colle cette trace écrite dans ton cahier, puis ajoute un schéma cellule → noyau → chromosomes → ADN.
      </div>
    </div>
  );
}
