import { ArrowUpRight } from "@/components/icons";
import { EXPERIENCE, PERSON } from "@/lib/content";
import SectionHead from "./SectionHead";

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="sec">
      <SectionHead id="experience-title" label={EXPERIENCE.label} title={EXPERIENCE.heading} />
      <ol className="wrap mt-12 overflow-hidden rounded-[14px] bg-white">
        {EXPERIENCE.items.map((x) => (
          <li key={x.company} className="xp-row">
            <span className="pill-dark justify-self-start">{x.role}</span>
            <span>
              <span className="xp-role">{x.company}</span>
              <span className="xp-desc">{x.description}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-6 text-center">
        <a href={PERSON.linkedin} target="_blank" rel="noreferrer" className="btn-dark">
          {EXPERIENCE.cta} <ArrowUpRight className="h-[12px] w-[12px]" />
        </a>
      </div>
    </section>
  );
}
