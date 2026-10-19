import Image from "next/image";
import logo from "@/assets/logo.png";
import { PERSON } from "@/lib/content";

/**
 * Opening intro (home page, every load): the doodle pops in, the studio name rises, a line
 * fills, then the whole screen slides up. Pure CSS timing, so it can never get stuck; the
 * page renders underneath the whole time. Reduced motion skips it (the global rule
 * collapses its animations to zero).
 */
export default function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-inner">
        <Image src={logo} alt="" width={84} height={84} priority className="intro-logo" />
        <p className="intro-name">{PERSON.brand}</p>
        <span className="intro-line">
          <span />
        </span>
        <p className="intro-note">loading the cuteness…</p>
      </div>
    </div>
  );
}
