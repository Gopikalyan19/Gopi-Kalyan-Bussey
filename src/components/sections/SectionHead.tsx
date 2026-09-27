export default function SectionHead({ id, label, title, sub }: { id: string; label?: string; title: string; sub?: string }) {
  return (
    <header className="sec-head">
      {label && <p className="sec-label">{label}</p>}
      <h2 id={id} className={`sec-title ${label ? "mt-3" : ""}`}>
        {title}
      </h2>
      {sub && <p className="sec-sub">{sub}</p>}
    </header>
  );
}
