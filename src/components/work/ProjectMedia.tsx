import Image from "next/image";
import type { Project } from "@/lib/content";

/**
 * Project visual: the screenshot or logo when one exists (optimised and lazy-loaded via
 * next/image), otherwise a monogram tile in the project's colour so the grid never waits
 * on imagery.
 */
export default function ProjectMedia({ project, sizes, priority = false, large = false }: { project: Project; sizes: string; priority?: boolean; large?: boolean }) {
  const contain = project.imageFit === "contain";
  // Logos sit inside an inset box. `inset` percentages are taken from the card's own
  // width *and* height, so the logo keeps its room on wide, short cards too.
  const inset = project.imageInset ?? "6%";

  return (
    <div className="absolute inset-0" style={{ background: project.bg }}>
      {project.image ? (
        contain ? (
          <div className="absolute" style={{ inset: large ? `calc(${inset} + 6%)` : inset }}>
            <Image src={project.image} alt="" fill sizes={sizes} priority={priority} className="card-media object-contain" />
          </div>
        ) : (
          <Image
            src={project.image}
            alt=""
            fill
            sizes={sizes}
            priority={priority}
            className="card-media object-cover"
            style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
          />
        )
      ) : (
        <div className="monogram-tile card-media absolute inset-0 grid place-items-center" aria-hidden="true">
          <span className={`select-none font-display font-medium tracking-[-0.05em] text-white/25 ${large ? "text-[clamp(96px,16vw,200px)]" : "text-[clamp(72px,11vw,150px)]"}`}>
            {project.monogram}
          </span>
        </div>
      )}
    </div>
  );
}
