import { PROCESS } from "@/lib/content";
import SectionHead from "./SectionHead";

export default function Process() {
  const total = PROCESS.steps.length;
  return (
    <section id="process" aria-labelledby="process-title" className="sec">
      <SectionHead id="process-title" label={PROCESS.label} title={PROCESS.heading} />

      <ol className="wrap mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PROCESS.steps.map((s, i) => {
          const last = i === total - 1;
          return (
            <li key={s.name} className={`process-card ${last ? "process-card--red" : ""}`}>
              <span className={`${last ? "pill-light" : "pill-dark"} self-start`}>Step {String(i + 1).padStart(2, "0")}</span>
              <h3 className="card-title mt-10">{s.name}</h3>
              <p className={`card-copy ${last ? "text-white/95" : ""}`}>{s.description}</p>
              <span className={`progress ${last ? "progress--light" : ""}`} aria-hidden="true">
                {PROCESS.steps.map((_, j) => (
                  <i key={j} className={j <= i ? "on" : ""} />
                ))}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
