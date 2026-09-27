"use client";

import { useEffect, useRef } from "react";

/** The hamster's name. */
const NAME = "Shiro";

/**
 * Shiro — a pixel-art hamster that lives on the page like a desktop pet.
 * Hand-drawn below as a 22×17 pixel map (mirrored from the left half), rendered as crisp SVG rects.
 *   K outline · O orange fur · P pink · C cream belly · E eye (blinks) · . empty
 */
const LEFT_HALF = [
  "..KK....KKK",
  ".KOOK.KKOOO",
  ".KPPOKOOOOO",
  ".KPPOOOOOOO",
  "..KKOOOOOOO",
  "...KOOOEOOO",
  "..KOOOOEOCC",
  ".KCCCCCCCCP",
  "KOCCCCCCCCC",
  "KOOCCCCCPKC",
  "KOOCCCCPPKC",
  "KOCCCCCKKCC",
  "KCCCCCCCCCC",
  ".KCCCCCCCCC",
  "..KCCCCCCCC",
  "...KKPPKKKK",
  "....KK.....",
];
const ROWS = LEFT_HALF.map((half) => half + [...half].reverse().join(""));
const COLORS: Record<string, string> = { K: "#1a1a1a", E: "#1a1a1a", O: "#f9b35b", P: "#f7b1aa", C: "#fde8d6" };
const W = ROWS[0].length;
const H = ROWS.length;
const SCALE = 2.2;
const PET_W = W * SCALE;
const PET_H = H * SCALE;

const PIXELS = ROWS.flatMap((row, y) =>
  [...row].flatMap((ch, x) => (ch === "." ? [] : [{ x, y, fill: COLORS[ch], eye: ch === "E" }])),
);

/** Where the pet settles relative to the pointer when following. */
const OFFSET = { x: 24, y: 32 };

/*
 * Behaviour (a small state machine, ticked every frame):
 *   follow   – trots after the pointer.
 *   wander   – pointer idle: strolls to a random spot on screen…
 *   pause    – …stops to sniff, then decides what to do next.
 *   zoomies  – runs quick laps around a spot.
 *   flee     – shy moment: runs away from the cursor, then comes back with a heart.
 *   sleep    – idle for a long time: closes its eyes and snoozes until the pointer moves.
 * Plus one-off tricks (spin, jump, wiggle), petting on click, and a hop on fast scrolls.
 */
type Mode = "follow" | "wander" | "pause" | "zoomies" | "flee" | "sleep";

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

export default function HamsterPet() {
  // Shiro the hamster.
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const actRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    // Touch devices: no cursor to follow, so Shiro follows taps and drags instead.
    const touch = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const root = rootRef.current!;
    root.classList.toggle("is-touch", touch);
    const body = bodyRef.current!;
    const act = actRef.current!;
    const bubble = bubbleRef.current!;

    const pos = { x: -200, y: -200 };
    const target = { x: -200, y: -200 };
    const pointer = { x: -200, y: -200 };
    let mode: Mode = "follow";
    let modeUntil = 0;
    let lastPointerAt = performance.now();
    let nextShyCheck = performance.now() + 8000;
    let nextScrollHop = 0;
    let started = false;
    let tilt = 0;
    let raf = 0;
    let zoom = { cx: 0, cy: 0, angle: 0, r: 40 };
    let bubbleTimer: ReturnType<typeof setTimeout> | undefined;
    let busyUntil = 0; // while a trick plays, the pet stands still

    // ---- helpers --------------------------------------------------------
    const clampToView = (x: number, y: number) => ({
      x: Math.min(Math.max(x, 12), window.innerWidth - PET_W - 12),
      y: Math.min(Math.max(y, 68), window.innerHeight - PET_H - 12), // stay below the floating nav
    });
    const setTarget = (x: number, y: number) => Object.assign(target, clampToView(x, y));
    const center = () => ({ x: pos.x + PET_W / 2, y: pos.y + PET_H / 2 });
    /** Cursor resting on the hamster (following mode only): it holds still to be petted. */
    let hovered = false;
    const updateHover = () => {
      const c = center();
      hovered = !touch && mode === "follow" && Math.hypot(pointer.x - c.x, pointer.y - c.y) < 40;
      root.classList.toggle("is-hovered", hovered);
      if (hovered) Object.assign(target, { x: pos.x, y: pos.y });
    };

    const say = (text: string, ms = 1400) => {
      bubble.textContent = text;
      bubble.classList.add("is-on");
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => bubble.classList.remove("is-on"), ms);
    };

    const trick = (kind: "spin" | "jump" | "wiggle" | "flip" | "giggle") => {
      const ease = "cubic-bezier(0.2, 0.8, 0.2, 1)";
      const frames: Record<typeof kind, Keyframe[]> = {
        spin: [{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }],
        jump: [
          { transform: "translateY(0) scale(1, 1)" },
          { transform: "translateY(2px) scale(1.15, 0.85)", offset: 0.15 },
          { transform: "translateY(-26px) scale(0.9, 1.1)", offset: 0.5 },
          { transform: "translateY(0) scale(1.1, 0.9)", offset: 0.85 },
          { transform: "translateY(0) scale(1, 1)" },
        ],
        wiggle: [
          { transform: "rotate(0)" },
          { transform: "rotate(-10deg)" },
          { transform: "rotate(10deg)" },
          { transform: "rotate(-6deg)" },
          { transform: "rotate(0)" },
        ],
        flip: [
          { transform: "translateY(0) rotate(0)" },
          { transform: "translateY(-30px) rotate(-180deg)", offset: 0.5 },
          { transform: "translateY(0) rotate(-360deg)" },
        ],
        // Quick squishy shake — a giggle.
        giggle: [
          { transform: "none" },
          { transform: "translate(-2px, -2px) rotate(-7deg) scale(1.05, 0.95)" },
          { transform: "translate(2px, 0) rotate(7deg) scale(0.95, 1.05)" },
          { transform: "translate(-2px, -3px) rotate(-6deg) scale(1.05, 0.95)" },
          { transform: "translate(2px, 0) rotate(6deg) scale(0.95, 1.05)" },
          { transform: "translate(-1px, -2px) rotate(-3deg)" },
          { transform: "none" },
        ],
      };
      const duration = { spin: 650, jump: 600, wiggle: 700, flip: 750, giggle: 650 }[kind];
      act.animate(frames[kind], { duration, easing: kind === "wiggle" ? "ease-in-out" : ease });
      busyUntil = performance.now() + duration;
    };

    const setMode = (m: Mode, duration = 0) => {
      mode = m;
      modeUntil = performance.now() + duration;
      root.dataset.mode = m;
      root.classList.toggle("is-sleeping", m === "sleep");
    };

    const wanderSomewhere = () => {
      // Mostly short strolls, sometimes a trip across the screen.
      const far = Math.random() < 0.3;
      const range = far ? 1 : 0.25;
      setTarget(pos.x + rand(-1, 1) * window.innerWidth * range, pos.y + rand(-1, 1) * window.innerHeight * range);
      setMode("wander");
      if (Math.random() < 0.25) say(pick(["♪", "…", "hm?", "sniff"]), 1100);
    };

    let sulky = false; // set when it ran off because it was tickled too much
    let sulkTimer: ReturnType<typeof setTimeout> | undefined;
    const flee = (ms = 2200, shout?: string) => {
      const c = center();
      let dx = c.x - pointer.x;
      let dy = c.y - pointer.y;
      const d = Math.hypot(dx, dy) || 1;
      dx /= d;
      dy /= d;
      const dist = rand(220, 340);
      let t = clampToView(pos.x + dx * dist, pos.y + dy * dist);
      // Cornered? Dodge sideways instead.
      if (Math.hypot(t.x - pos.x, t.y - pos.y) < 80) t = clampToView(pos.x - dy * dist, pos.y + dx * dist);
      Object.assign(target, t);
      setMode("flee", ms);
      say(shout ?? pick(["!", "eek!", "!!"]), shout ? 1300 : 900);
    };

    /** Pointer has been still for a while: choose something to do. */
    const decide = () => {
      const r = Math.random();
      if (r < 0.5) wanderSomewhere();
      else if (r < 0.68) {
        zoom = { cx: pos.x, cy: pos.y, angle: 0, r: rand(30, 60) };
        setMode("zoomies", rand(1400, 2200));
        say("zoom!", 900);
      } else if (r < 0.88) {
        trick(pick(["spin", "jump", "wiggle", "flip"]));
        setMode("pause", rand(900, 1600));
      } else {
        setMode("pause", rand(1500, 3000));
        trick("wiggle");
      }
    };

    // ---- main loop ------------------------------------------------------
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const idle = now - lastPointerAt;
      let maxSpeed = 0;

      switch (mode) {
        case "follow": {
          updateHover();
          if (!hovered) setTarget(pointer.x + OFFSET.x, pointer.y + OFFSET.y);
          maxSpeed = 14;
          if (idle > 3500 && Math.hypot(target.x - pos.x, target.y - pos.y) < 3) decide();
          break;
        }
        case "wander":
          maxSpeed = 3.2;
          if (Math.hypot(target.x - pos.x, target.y - pos.y) < 2) {
            setMode("pause", rand(700, 2200));
            if (Math.random() < 0.4) trick("wiggle");
          }
          break;
        case "pause":
          if (now > modeUntil) {
            if (idle > 16000) {
              setMode("sleep");
              say("z", 800);
            } else decide();
          }
          break;
        case "zoomies":
          maxSpeed = 11;
          zoom.angle += 0.14;
          setTarget(zoom.cx + Math.cos(zoom.angle) * zoom.r * 1.6, zoom.cy + Math.sin(zoom.angle) * zoom.r);
          if (now > modeUntil) setMode("pause", 900);
          break;
        case "flee":
          maxSpeed = 16;
          if (now > modeUntil) {
            setMode("follow");
            if (sulky) {
              // Comes back pouting, then forgives you.
              sulky = false;
              root.classList.remove("is-blushing");
              say(pick(["hmph!", "hmph.", "…"]), 1300);
              clearTimeout(sulkTimer);
              sulkTimer = setTimeout(() => mode !== "sleep" && say("…♥", 1200), 1500);
            } else say("♥", 1200);
          }
          break;
        case "sleep":
          break;
      }
      if (now < busyUntil) maxSpeed = 0;

      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const dist = Math.hypot(dx, dy);
      const step = Math.min(dist * 0.12, maxSpeed);
      if (dist > 0.5 && step > 0) {
        pos.x += (dx / dist) * step;
        pos.y += (dy / dist) * step;
      }
      const moving = step > 0.8;
      tilt += ((moving ? Math.max(-16, Math.min(16, (dx / (dist || 1)) * step * 1.6)) : 0) - tilt) * 0.15;

      root.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
      body.style.rotate = `${tilt.toFixed(2)}deg`;
      root.classList.toggle("is-walking", moving);
      root.classList.toggle("is-running", moving && step > 9);
    };

    // ---- input ----------------------------------------------------------
    const begin = (x: number, y: number) => {
      // First sighting: pop in next to the pointer.
      started = true;
      pos.x = x + OFFSET.x;
      pos.y = y + OFFSET.y + 12;
      root.classList.add("is-active");
      say(`hi, I'm ${NAME}!`, 2200);
      raf = requestAnimationFrame(tick);
    };

    /** The user did something at (x, y): a mouse move, a tap, or a drag. */
    const activity = (x: number, y: number, el: Element | null, isTouch: boolean) => {
      const now = performance.now();
      const wasIdle = now - lastPointerAt > 3500;
      lastPointerAt = now;
      pointer.x = x;
      pointer.y = y;

      if (!started) begin(x, y);
      root.classList.add("is-active");

      const c = center();
      const near = Math.hypot(c.x - x, c.y - y) < 90;

      if (mode === "sleep") {
        setMode("follow");
        trick("jump");
        say("!", 900);
      } else if (mode === "wander" || mode === "pause" || mode === "zoomies") {
        // Coming back to a pet that was off doing its own thing.
        if (Math.random() < (isTouch && near ? 0.5 : 0.35)) flee();
        else {
          setMode("follow");
          if (wasIdle) say(pick(["hi!", "♥", "!"]), 1000);
        }
      } else if (mode === "follow" && isTouch && near && Math.random() < 0.45) {
        // A finger landing right next to it is scary.
        flee(rand(1400, 2200));
      } else if (mode === "follow" && !isTouch && !hovered && now > nextShyCheck) {
        // Every so often it gets shy and plays keep-away.
        nextShyCheck = now + rand(6000, 12000);
        if (near && Math.random() < 0.3) flee(rand(1600, 2600));
      }

      updateHover();
      const overCard = el?.closest?.('[data-cursor="view"]');
      root.classList.toggle("is-excited", !!overCard && mode === "follow");
    };

    const onMove = (e: PointerEvent) => {
      // Mouse: always. Touch/pen: only while dragging (finger down).
      if (e.pointerType === "mouse" || e.buttons > 0) activity(e.clientX, e.clientY, e.target as Element | null, e.pointerType !== "mouse");
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") activity(e.clientX, e.clientY, e.target as Element | null, true);
    };

    // Clicking the hamster pets it. While hovered it takes pointer events itself (see CSS),
    // so the click doesn't also hit whatever is underneath.
    // Tickle meter: quick repeated pats escalate from happy → giggling → blushing → runs away.
    let tickles = 0;
    let lastPetAt = 0;
    let lastEscapeAt = -Infinity;
    let blushTimer: ReturnType<typeof setTimeout> | undefined;
    const onPet = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation(); // a pat isn't a tap on the page (so it doesn't scare it off by itself)
      const now = performance.now();
      lastPointerAt = now;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (mode === "sleep") setMode("follow");

      // Pats more than ~1.3s apart start the count over.
      tickles = now - lastPetAt < 1300 ? tickles + 1 : 1;
      lastPetAt = now;
      // Recently escaped? It's less patient this time.
      const limit = now - lastEscapeAt < 8000 ? 3 : 5;

      if (tickles >= limit) {
        tickles = 0;
        lastEscapeAt = now;
        sulky = true;
        root.classList.add("is-blushing");
        flee(rand(1800, 2600), limit === 3 ? pick(["not again!", "noo!"]) : pick(["okay stop!!", "nope!", "enough!"]));
        return;
      }
      if (tickles === limit - 1) {
        trick("giggle");
        root.classList.add("is-blushing");
        clearTimeout(blushTimer);
        blushTimer = setTimeout(() => !sulky && root.classList.remove("is-blushing"), 2200);
        say(pick(["that tickles!", "hehehe!", "hihihi"]), 1300);
      } else if (tickles >= 3) {
        trick("giggle");
        say(pick(["hehehe", "hehe!", "kyaa~"]), 1100);
      } else {
        trick(Math.random() < 0.7 ? "jump" : "flip");
        say(pick(["♥", "♥♥", "hehe", `${NAME} ♥`]), 1200);
      }
    };

    // A fast scroll makes it hop along.
    let lastY = window.scrollY;
    const onScroll = () => {
      const now = performance.now();
      const delta = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      if (!started || mode === "sleep" || now < nextScrollHop || delta < 60) return;
      nextScrollHop = now + 1600;
      trick("jump");
      if (Math.random() < 0.35) say(pick(["wee!", "whoa", "!"]), 900);
    };

    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") root.classList.remove("is-active");
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!document.hidden && started) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    root.addEventListener("pointerdown", onPet);

    // On touch devices there's no cursor to meet, so Shiro turns up by itself in the corner.
    let intro: ReturnType<typeof setTimeout> | undefined;
    if (touch) {
      intro = setTimeout(() => {
        if (started) return;
        const x = window.innerWidth - PET_W - OFFSET.x - 28;
        const y = window.innerHeight - PET_H - OFFSET.y - 90;
        pointer.x = x;
        pointer.y = y;
        lastPointerAt = performance.now();
        begin(x, y);
      }, 1200);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(bubbleTimer);
      clearTimeout(intro);
      clearTimeout(sulkTimer);
      clearTimeout(blushTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointerdown", onPet);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={rootRef} className="pet" aria-hidden="true">
      <div ref={bodyRef} className="pet-body">
        <span className="pet-heart">♥</span>
        <span ref={bubbleRef} className="pet-bubble" />
        <span className="pet-zzz">
          <i>z</i>
          <i>z</i>
          <i>z</i>
        </span>
        <div ref={actRef} className="pet-act">
          <svg className="pet-svg" viewBox={`0 0 ${W} ${H}`} width={PET_W} height={PET_H} shapeRendering="crispEdges">
            {PIXELS.map((p) => (
              <rect key={`${p.x}-${p.y}`} x={p.x} y={p.y} width={1.02} height={1.02} fill={p.fill} className={p.eye ? "pet-eye" : undefined} />
            ))}
            {/* Blush cheeks (shown while tickled). */}
            <g className="pet-blush">
              <rect x={4} y={7} width={3} height={1.02} fill="#f58f8c" />
              <rect x={15} y={7} width={3} height={1.02} fill="#f58f8c" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
