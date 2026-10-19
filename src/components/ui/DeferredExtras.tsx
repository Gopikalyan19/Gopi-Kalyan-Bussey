"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Nice-to-have extras, split into their own chunks so they don't compete with the page's
// first render and hydration. Until they load, the normal system cursor is used.
const Cursor = dynamic(() => import("./Cursor"), { ssr: false });
const HamsterPet = dynamic(() => import("./HamsterPet"), { ssr: false });

/** Loads the custom cursor and Shiro once the browser is idle (or on the first interaction). */
export default function DeferredExtras() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setReady(true);
      window.removeEventListener("pointermove", go);
      window.removeEventListener("pointerdown", go);
    };
    window.addEventListener("pointermove", go, { passive: true });
    window.addEventListener("pointerdown", go, { passive: true });
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if ("requestIdleCallback" in window) idle = window.requestIdleCallback(go, { timeout: 3000 });
    else timer = setTimeout(go, 1500);
    return () => {
      window.removeEventListener("pointermove", go);
      window.removeEventListener("pointerdown", go);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, []);

  if (!ready) return null;
  return (
    <>
      <HamsterPet />
      <Cursor />
    </>
  );
}
