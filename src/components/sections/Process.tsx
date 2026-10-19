import { PROCESS } from "@/lib/content";
import SectionHead from "./SectionHead";

/** Editorial grid: each step hangs off a hairline, with a large light numeral. */
export default function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="sec">
      <SectionHead id="process-title" label={PROCESS.label} title={PROCESS.heading} />

      <ol className="wrap mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-3">
        {PROCESS.steps.map((s, i) => (
          <li key={s.name} className="step">
            <span className="step-num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-display text-[22px] font-medium tracking-[-0.02em]">
              <span className="sr-only">Step {i + 1}: </span>
              {s.name}
            </h3>
            <p className="mt-2 max-w-[34ch] text-[14px] leading-[22px] text-ink/65">{s.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
