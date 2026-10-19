import { Fragment } from "react";
import { KEYWORDS, type HighlightTone } from "@/lib/content";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Renders `text`, wrapping any KEYWORDS it contains in a soft coloured highlight. */
export default function Highlight({ text, keywords = KEYWORDS }: { text: string; keywords?: [string, HighlightTone][] }) {
  const tones = new Map(keywords);
  const pattern = new RegExp(`(${keywords.map(([k]) => escape(k)).join("|")})`, "g");
  return (
    <>
      {text.split(pattern).map((part, i) => {
        const tone = tones.get(part);
        return tone ? (
          <mark key={i} className={`kw kw-${tone}`}>
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        );
      })}
    </>
  );
}
