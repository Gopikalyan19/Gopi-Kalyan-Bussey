import { ImageResponse } from "next/og";
import { HERO, PERSON } from "@/lib/content";

/** Link preview card (LinkedIn, WhatsApp, X…), generated at build time. */
export const alt = `${PERSON.name} — ${PERSON.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#ededed", color: "#0e0e0e" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28 }}>
          <div style={{ width: 14, height: 14, borderRadius: 9999, background: "#22a35a" }} />
          {PERSON.title}
        </div>
        <div style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>{HERO.headline}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30 }}>
          <span style={{ fontWeight: 600 }}>{PERSON.name}</span>
          <span style={{ color: "rgba(14,14,14,0.55)" }}>Portfolio</span>
        </div>
      </div>
    ),
    size,
  );
}
