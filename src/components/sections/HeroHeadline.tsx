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
          <span className="hero-word" style={{ "--i": i } as CSSProperties}>
            {w}
            {i === words.length - 1 && <span className="hl-dot" />}
          </span>{" "}
        </span>
      ))}
    </h1>
  );
}
