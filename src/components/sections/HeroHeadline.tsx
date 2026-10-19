import type { CSSProperties } from "react";
import { HERO } from "@/lib/content";

/**
 * Hero headline: words fade up one after another on load, and the full stop is a small
 * red dot. Screen readers get the plain sentence; reduced motion shows it static.
 */
export default function HeroHeadline({ className = "" }: { className?: string }) {
  const words = HERO.headline.replace(/\.$/, "").split(" ");

  return (
    <h1 aria-label={HERO.headline} className={className}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          {/* First four words carry the claim; the rest drop to a lighter weight in soft grey. */}
          <span className={`hero-word ${i >= 4 ? "font-light text-ink/45" : ""}`} style={{ "--i": i } as CSSProperties}>
            {w}
            {i === words.length - 1 && <span className="hl-dot" />}
          </span>{" "}
        </span>
      ))}
    </h1>
  );
}
