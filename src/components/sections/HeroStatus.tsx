"use client";

import { useEffect, useState } from "react";
import { HERO, PERSON } from "@/lib/content";

/** "It's 11:42 pm in India · Gopi's probably …": Gopi's local time, refreshed every 30s. */
export default function HeroStatus({ className = "" }: { className?: string }) {
  // Rendered only after mount: the server can't know the visitor's "now", and a guess would mismatch.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const parts = now ? new Intl.DateTimeFormat("en-US", { timeZone: HERO.timeZone, hour: "numeric", minute: "2-digit", hourCycle: "h23" }).formatToParts(now) : [];
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const time = now?.toLocaleTimeString("en-US", { timeZone: HERO.timeZone, hour: "numeric", minute: "2-digit" }).toLowerCase();
  const status = [...HERO.status].reverse().find((s) => hour >= s.from)?.text;

  return (
    <p className={`min-h-[20px] font-display text-[13px] text-ink/50 transition-opacity duration-500 ${now ? "opacity-100" : "opacity-0"} ${className}`}>
      {now && (
        <>
          It&apos;s <span className="tabular-nums text-ink/75">{time}</span> in India · {PERSON.name.split(" ")[0]}&apos;s {status}
        </>
      )}
    </p>
  );
}
