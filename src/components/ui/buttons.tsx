"use client";

import type { ReactNode } from "react";
import { useUI } from "./UIProvider";

/** Small client islands so server components can use the shared UI actions. */

export function CopyButton({ text, className, children }: { text: string; className?: string; children: ReactNode }) {
  const { copyText } = useUI();
  return (
    <button type="button" onClick={() => copyText(text)} className={className}>
      {children}
    </button>
  );
}

export function MenuButton() {
  const { openMenu, menuOpen } = useUI();
  return (
    <button
      type="button"
      onClick={openMenu}
      aria-haspopup="dialog"
      aria-controls="menu"
      aria-expanded={menuOpen}
      className="focus-ring h-[36px] rounded-[7px] bg-ink px-[18px] font-display text-[12px] font-medium text-white transition-colors hover:bg-[#2b2b2b]"
    >
      Menu
    </button>
  );
}
