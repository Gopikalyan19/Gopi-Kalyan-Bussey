"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { CONTACT_PAGE, MAILTO, MENU_LINKS, PERSON } from "@/lib/content";
import { useUI } from "./UIProvider";
import { useDialog } from "./useDialog";

export default function MenuOverlay() {
  const { close } = useUI();
  const ref = useDialog<HTMLDivElement>(() => close());

  const router = useRouter();
  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    close(false);
    const hash = href.slice(href.indexOf("#"));
    const target = window.location.pathname === "/" ? document.querySelector(hash) : null;
    // Wait for the scroll lock to lift, then scroll (same page) or navigate home to the section.
    requestAnimationFrame(() => {
      if (target) {
        target.scrollIntoView({ block: "start" });
        history.replaceState(null, "", hash);
      } else router.push(href);
    });
  };

  return (
    <div ref={ref} id="menu" role="dialog" aria-modal="true" aria-label="Site menu" className="menu fixed inset-0 z-100 flex flex-col overflow-y-auto bg-page px-4 pb-10 pt-4">
      <div className="mx-auto flex h-[46px] w-full max-w-[296px] shrink-0 items-center justify-between rounded-[9px] bg-white pl-4 pr-[5px]">
        <span className="font-display text-[16px] font-semibold tracking-[-0.01em]">{PERSON.name}</span>
        <button type="button" onClick={() => close()} className="focus-ring h-[36px] rounded-[7px] bg-ink px-[18px] font-display text-[12px] font-medium text-white">
          Close
        </button>
      </div>
      <ul className="menu-links mx-auto mt-[6vh] flex flex-col items-center gap-1 font-display text-[40px] font-medium leading-[1.15] tracking-[-0.03em] sm:text-[64px]">
        {MENU_LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="menu-link" onClick={(e) => go(e, l.href)}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-auto flex w-full max-w-[640px] flex-col items-center gap-4 pt-12 text-center font-display text-[14px] sm:flex-row sm:justify-center sm:gap-8">
        <a href={MAILTO.plain} className="menu-link">
          {PERSON.email}
        </a>
        <a href={`tel:${PERSON.phone.replace(/\s/g, "")}`} className="menu-link">
          {PERSON.phone}
        </a>
        <a href={PERSON.linkedin} target="_blank" rel="noreferrer" className="menu-link">
          LinkedIn
        </a>
        <a href={CONTACT_PAGE} className="menu-link">
          Mail Me
        </a>
      </div>
    </div>
  );
}
