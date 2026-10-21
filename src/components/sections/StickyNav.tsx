"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { ArrowUpRight } from "@/components/icons";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { MenuButton } from "@/components/ui/buttons";
import { PERSON } from "@/lib/content";

/**
 * One header for the whole page. At the top it sits flat, aligned with the content; once the
 * page scrolls it morphs into a compact frosted pill. It tucks away while scrolling down and
 * returns on any scroll up. Keyboard focus always reveals it (CSS :focus-within).
 * Sub-pages pass `back` to show a return link in place of the name.
 */
export default function StickyNav({ back }: { back?: { href: string; label: string } }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let raf = 0;
    let lastY = window.scrollY;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      // Ignore tiny jitters; only hide once well past the hero.
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 600);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""} ${hidden ? "is-hidden" : ""}`}>
      <nav aria-label="Primary" className="site-nav-bar">
        {back ? (
          <Link href={back.href} className="focus-ring inline-flex items-center gap-2 rounded-sm font-display text-[14px] font-medium text-ink/70 transition-colors hover:text-ink">
            <ArrowUpRight className="h-[12px] w-[12px] -rotate-135" /> {back.label}
          </Link>
        ) : (
          <a href="#top" aria-label={`${PERSON.brand}, back to top`} className="focus-ring rounded-sm">
            <Logo />
          </a>
        )}
        <span className="flex items-center gap-2">
          <ThemeToggle />
          <MenuButton />
        </span>
      </nav>
    </header>
  );
}
