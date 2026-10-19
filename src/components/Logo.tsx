import Image from "next/image";
import logo from "@/assets/logo.png";
import { PERSON } from "@/lib/content";

/** Brand mark: the doodle avatar + the studio name. The avatar does a little head-tilt on hover. */
export default function Logo({ size = 30, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`logo inline-flex items-center gap-2 font-display text-[16px] font-semibold tracking-[-0.01em] text-ink ${className}`}>
      <Image src={logo} alt="" width={size} height={size} priority className="logo-mark" style={{ width: size, height: size }} />
      {PERSON.brand}
    </span>
  );
}
