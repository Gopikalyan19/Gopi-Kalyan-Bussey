"use client";

import { useEffect, useState } from "react";
import { MenuButton } from "@/components/ui/buttons";
import { PERSON } from "@/lib/content";

/**
 * Floating nav. Hidden at the very top so the hero stays clean, slides in once the page
 * is scrolled a little. Keyboard users can always reach it: focusing it reveals it (CSS).
 */
export default function StickyNav() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setShow(window.scrollY > 120);
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
    <nav
      aria-label="Primary"
      className={`sticky-nav fixed left-1/2 top-[12px] z-50 flex h-[46px] w-[296px] max-w-[calc(100%-32px)] items-center justify-between rounded-[9px] bg-white pl-4 pr-[5px] shadow-[0_6px_24px_-12px_rgba(0,0,0,.25)] ${show ? "is-visible" : ""}`}
    >
      <a href="#home" className="focus-ring rounded-sm font-display text-[16px] font-semibold tracking-[-0.01em] text-ink">
        {PERSON.name}
      </a>
      <MenuButton />
    </nav>
  );
}
