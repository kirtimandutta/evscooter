"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { ColorSwatches } from "@/components/color-swatches";
import { useStudio } from "@/components/providers";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { asset } from "@/lib/asset";
import { auraOsChips, colorways, heroChapters, telemetry } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;
const chapterStops = [0.06, 0.4, 0.72, 0.93];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function phase(progress: number, start: number, end: number, feather = 0.08) {
  const fadeIn = start <= 0.001 ? 1 : clamp((progress - start) / feather, 0, 1);
  const fadeOut = clamp((end - progress) / feather, 0, 1);
  return Math.min(fadeIn, fadeOut);
}

function easeOut(value: number) {
  const t = clamp(value, 0, 1);
  return 1 - (1 - t) ** 3;
}

function setOpacity(node: HTMLElement | null, value: number) {
  if (node) node.style.opacity = String(value);
}

function CountUp({ to, decimals }: { to: number; decimals: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setValue(to * (1 - (1 - t) ** 3));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [decimals, to]);

  return <>{decimals ? value.toFixed(decimals) : Math.round(value)}</>;
}

export function Hero() {
  const { colorway, openBooking, scrollTo, lenisReady } = useStudio();
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bikeRef = useRef<HTMLImageElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const energyRef = useRef<HTMLDivElement>(null);
  const chassisRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLDivElement>(null);
  const streaksRef = useRef<HTMLDivElement>(null);
  const ledRef = useRef<HTMLDivElement>(null);
  const engineeringRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const underglowRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef(0);
  const milestoneRef = useRef(0);
  const applyRef = useRef<(progress: number) => void>(() => {});
  const [milestone, setMilestone] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playsInline = true;

    let seeking = false;
    const arm = () => {
      if (seeking || !Number.isFinite(video.duration) || video.duration <= 0) return;
      video.pause();
      // A zero seek keeps the poster painted. Nudge into the first battery frame.
      const next = Math.min(video.duration * 0.999, Math.max(0.08, progressRef.current * video.duration));
      const reveal = () => {
        video.removeAttribute("poster");
        setVideoReady(true);
      };
      if (video.readyState >= 2 && Math.abs(video.currentTime - next) < 0.04) {
        reveal();
        return;
      }
      seeking = true;
      const onSeeked = () => {
        seeking = false;
        video.removeEventListener("seeked", onSeeked);
        reveal();
      };
      video.addEventListener("seeked", onSeeked);
      try {
        video.currentTime = next;
      } catch {
        seeking = false;
        video.removeEventListener("seeked", onSeeked);
      }
    };

    arm();
    video.addEventListener("loadedmetadata", arm);
    video.addEventListener("loadeddata", arm);
    return () => {
      video.removeEventListener("loadedmetadata", arm);
      video.removeEventListener("loadeddata", arm);
    };
  }, []);

  useEffect(() => {
    if (!lenisReady || reduced) return;
    const track = trackRef.current;
    if (!track) return;

    let alive = true;
    let ctx: { revert: () => void } | undefined;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (!alive) return;
      gsap.registerPlugin(ScrollTrigger);

      const apply = (progress: number) => {
        const p = clamp(progress, 0, 1);
        progressRef.current = p;
        const next = p < 0.225 ? 0 : p < 0.575 ? 1 : p < 0.85 ? 2 : 3;
        if (next !== milestoneRef.current) {
          milestoneRef.current = next;
          setMilestone(next);
        }

        if (pctRef.current) {
          pctRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
        }
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
        if (railRef.current) railRef.current.style.transform = `scaleY(${p})`;

        const zoom = easeOut(Math.min(1, p / 0.85));
        const scale = 1.72 - 0.72 * zoom;
        const originY = 66 - 14 * zoom;
        if (bikeRef.current) {
          bikeRef.current.style.transformOrigin = `50% ${originY}%`;
          bikeRef.current.style.transform = `translate3d(0,0,0) scale(${scale})`;
        }

        const dock = phase(p, 0.84, 1.25, 0.08);
        const energy = phase(p, 0, 0.3);
        const chassis = phase(p, 0.18, 0.64);
        const speed = phase(p, 0.56, 0.9);

        setOpacity(energyRef.current, energy);
        setOpacity(chassisRef.current, chassis);
        setOpacity(speedRef.current, speed);
        setOpacity(engineeringRef.current, 1 - dock);
        setOpacity(productRef.current, dock);
        setOpacity(underglowRef.current, Math.max(speed * 0.65, dock));
        setOpacity(glowRef.current, 0.28 + energy * 0.45 + speed * 0.4);
        setOpacity(stageRef.current, dock);
        setOpacity(ledRef.current, clamp((p - 0.58) / 0.12, 0, 1) * (1 - dock));
        if (ledRef.current) ledRef.current.style.transform = `scaleX(${clamp((p - 0.58) / 0.18, 0, 1)})`;
        if (streaksRef.current) streaksRef.current.style.transform = `translate3d(${-18 - p * 36}%, 0, 0)`;
        if (chassisRef.current) chassisRef.current.style.setProperty("--lock", String(clamp((p - 0.22) / 0.28, 0, 1)));

        const video = videoRef.current;
        if (video && video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0) {
          const nextTime = Math.min(video.duration * 0.999, Math.max(0.08, p * video.duration));
          if (Math.abs(video.currentTime - nextTime) > 0.034) video.currentTime = nextTime;
          if (!video.paused) video.pause();
          video.style.opacity = String(1 - dock);
        }
      };

      applyRef.current = apply;
      ctx = gsap.context(() => {
        const trigger = ScrollTrigger.create({
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
          onUpdate: (self) => apply(self.progress),
        });
        apply(trigger.progress);
      }, track);

      if (!alive) ctx?.revert();
    })();

    return () => {
      alive = false;
      ctx?.revert();
      applyRef.current = () => {};
    };
  }, [lenisReady, reduced]);

  useLayoutEffect(() => {
    applyRef.current(progressRef.current);
  });

  const jumpTo = (progress: number) => {
    const track = trackRef.current;
    if (!track) return;
    const start = track.getBoundingClientRect().top + window.scrollY;
    const distance = track.offsetHeight - window.innerHeight;
    scrollTo(start + distance * progress);
  };

  const armVideo = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    video.pause();
    const next = Math.min(video.duration * 0.999, Math.max(0.08, progressRef.current * video.duration));
    try {
      video.currentTime = next;
    } catch {
      /* Seek can reject before the buffer arrives. */
    }
  };

  if (reduced) {
    return (
      <section id="hero" className="relative min-h-screen bg-[#050505] px-6 pb-20 pt-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#00FF66]">
              {heroChapters[0].badge}
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.045em] text-white">
              {heroChapters[0].title}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-[#A1A1AA]">{heroChapters[0].body}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => openBooking("reserve")}>Reserve for ₹999</Button>
              <Button variant="secondary" onClick={() => scrollTo("#studio")}>
                Book a Free Home Test Ride
              </Button>
            </div>
          </div>
          <img
            src={colorway.image}
            alt={`AURA Pulse in ${colorway.name}`}
            className={`w-full object-contain ${colorway.mirror ? "-scale-x-100" : ""}`}
          />
        </div>
      </section>
    );
  }

  const chapter = heroChapters[milestone] ?? heroChapters[0];

  return (
    <section id="hero" ref={trackRef} data-milestone={milestone} className="relative h-[350vh] bg-[#050505]">
      <video
        ref={videoRef}
        className="sticky top-0 z-0 h-screen w-full object-cover will-change-transform"
        src={asset("/videos/aura-pulse-neongreen-banner.mp4")}
        poster={asset("/images/scooter-cyber-neon.png")}
        muted
        playsInline
        preload="auto"
        aria-hidden
        onLoadedData={armVideo}
        onError={() => setVideoReady(false)}
      />

      <div className="sticky top-0 z-10 -mt-[100vh] h-screen w-full overflow-hidden">
        <div
          className={`absolute inset-0 bg-[#050505] transition-opacity duration-700 ${videoReady ? "opacity-0" : "opacity-100"}`}
          aria-hidden
        >
          <div
            ref={glowRef}
            className="absolute left-1/2 top-[48%] h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
            style={{ background: "rgba(0,255,102,0.22)" }}
          />
          <div ref={engineeringRef} className="absolute inset-0">
            <img
              ref={bikeRef}
              src={asset("/images/scooter-cyber-neon.png")}
              alt=""
              fetchPriority="high"
              className="absolute inset-0 h-full w-full origin-[50%_66%] scale-[1.72] object-contain will-change-transform"
            />
            <div ref={energyRef} className="pointer-events-none absolute left-[28%] top-[46%] w-[44%] mix-blend-screen">
              <svg viewBox="0 0 320 90" className="w-full overflow-visible">
                {Array.from({ length: 8 }).map((_, index) => (
                  <rect
                    key={index}
                    x={18 + index * 36}
                    y={22}
                    width="22"
                    height="46"
                    rx="4"
                    fill="#00FF66"
                    opacity={0.35 + (index % 3) * 0.15}
                    className="animate-cell"
                    style={{ animationDelay: `${index * 0.12}s` }}
                  />
                ))}
                <path
                  d="M10 45 H310"
                  fill="none"
                  stroke="#A3E635"
                  strokeWidth="1.4"
                  className="energy-arc"
                />
              </svg>
            </div>
            <div ref={chassisRef} className="pointer-events-none absolute inset-[18%_12%] opacity-0" style={{ ["--lock" as string]: 0 }}>
              {[0, 1, 2, 3].map((line) => (
                <span
                  key={line}
                  className="absolute h-px bg-[#00FF66] shadow-[0_0_12px_#00FF66]"
                  style={{
                    top: `${16 + line * 22}%`,
                    left: 0,
                    right: 0,
                    opacity: "var(--lock)",
                    transform: `translateX(calc((1 - var(--lock)) * ${line % 2 === 0 ? 48 : -48}px))`,
                  }}
                />
              ))}
            </div>
            <div ref={speedRef} className="pointer-events-none absolute inset-0 overflow-hidden opacity-0">
              <div ref={streaksRef} className="streaks absolute inset-y-[20%] -left-1/2 w-[220%]" />
            </div>
          </div>
          <div ref={ledRef} className="pointer-events-none absolute inset-x-0 top-[58%] h-px origin-center opacity-0">
            <div className="h-px w-full bg-[#00FF66] shadow-[0_0_22px_6px_rgba(0,255,102,0.9)]" />
          </div>
          <div ref={productRef} className="absolute inset-0 opacity-0">
            <img
              key={colorway.id}
              src={colorway.image}
              alt=""
              className={`soft-in h-full w-full object-contain ${colorway.mirror ? "-scale-x-100" : ""}`}
            />
          </div>
          <div ref={underglowRef} className="pointer-events-none absolute bottom-[10%] left-1/2 h-24 w-[68%] -translate-x-1/2 rounded-full opacity-0 blur-3xl">
            {colorwaysGlow(colorway.id, colorway.glow)}
          </div>
        </div>

        <div ref={stageRef} className="pointer-events-none absolute inset-0 opacity-0">
          {colorways.map((color) => (
            <div
              key={color.id}
              className="absolute left-1/2 top-[22%] h-[42vh] w-[min(86vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] transition-opacity duration-700"
              style={{
                background: `radial-gradient(circle, ${color.glow}, transparent 68%)`,
                opacity: color.id === colorway.id ? 0.95 : 0,
              }}
            />
          ))}
          {colorways.map((color) => (
            <img
              key={color.id}
              src={color.image}
              alt=""
              className={`absolute inset-x-0 top-[6%] h-[46%] w-full object-contain transition-opacity duration-700 md:top-[8%] md:h-[58%] ${
                color.id === colorway.id ? "opacity-100" : "opacity-0"
              } ${color.mirror ? "-scale-x-100" : ""}`}
            />
          ))}
          <div
            className="absolute left-1/2 top-[42%] h-16 w-[58%] -translate-x-1/2 rounded-full blur-3xl transition-colors duration-700 md:top-[52%]"
            style={{ background: colorway.glow }}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/55 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[min(560px,48%)] bg-gradient-to-r from-[#050505]/85 via-[#050505]/35 to-transparent md:block" />

        <div className="absolute left-0 right-0 top-[72px] h-px bg-white/10">
          <div ref={barRef} className="h-full origin-left bg-[#00FF66] shadow-[0_0_12px_#00FF66]" style={{ transform: "scaleX(0)" }} />
        </div>

        <div className="absolute right-5 top-24 font-mono text-[11px] tracking-[0.24em] text-[#A1A1AA] md:right-10">
          SCRUB <span ref={pctRef} className="text-[#00FF66]">000</span>
        </div>

        <ol className="absolute right-8 top-1/2 z-20 hidden -translate-y-1/2 lg:block">
          <span className="absolute left-0 top-1 h-40 w-px bg-white/15" />
          <span ref={railRef} className="absolute left-0 top-1 h-40 w-px origin-top bg-[#00FF66]" style={{ transform: "scaleY(0)" }} />
          {["Torque", "Aero", "AuraOS", "Dock"].map((label, index) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => jumpTo(chapterStops[index])}
                className={`relative block py-3 pl-5 text-left font-mono text-[10px] uppercase tracking-[0.22em] ${
                  milestone === index ? "text-[#00FF66]" : "text-white/35 hover:text-white/70"
                }`}
                aria-current={milestone === index ? "step" : undefined}
              >
                0{index + 1} {label}
              </button>
            </li>
          ))}
        </ol>

        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end p-5 pb-8 sm:p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-3xl">
            <AnimatePresence mode="wait">
              {milestone < 3 ? (
                <motion.div
                  key={milestone}
                  initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                  transition={{ duration: 0.5, ease }}
                >
                  <p className="inline-flex rounded-full border border-[#00FF66]/50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-[#00FF66] shadow-[0_0_18px_rgba(0,255,102,0.15)]">
                    {chapter.badge}
                  </p>
                  <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.35rem,5.5vw,5.15rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-white">
                    {chapter.title}
                  </h1>
                  {milestone === 0 && (
                    <p className="mt-5 max-w-xl text-base text-[#A1A1AA] sm:text-lg">{chapter.body}</p>
                  )}
                  {milestone === 1 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {telemetry.map((item) => (
                        <span
                          key={item.label}
                          className="rounded-full border border-[#00FF66]/30 bg-black/50 px-3 py-2 font-mono text-xs text-[#00FF66] shadow-[0_0_18px_rgba(0,255,102,0.16)] backdrop-blur-xl"
                        >
                          {item.label}{" "}
                          <CountUp to={item.value} decimals={item.decimals} />
                          {item.unit}
                        </span>
                      ))}
                    </div>
                  )}
                  {milestone === 2 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {auraOsChips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full border border-[#00FF66]/30 bg-black/50 px-3 py-2 font-mono text-xs text-[#00FF66] backdrop-blur-xl"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                  {milestone === 0 && (
                    <p className="mt-8 flex items-center gap-3 font-mono text-[10px] tracking-[0.28em] text-[#A1A1AA]">
                      <span className="h-px w-8 bg-[#00FF66]" />
                      SCROLL
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="dock"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.55, ease }}
                  className="pointer-events-auto rounded-[28px] border border-[#00FF66]/20 bg-black/60 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#00FF66]">04 / AURA Pulse</p>
                      <h2 className="mt-1 font-display text-2xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                        AURA Pulse
                      </h2>
                    </div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#A1A1AA]">Token ₹999</p>
                  </div>
                  <div className="mt-3 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
                    <ColorSwatches variant="dots" />
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-white">{colorway.name}</p>
                  </div>
                  <div className="mt-3 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:gap-3">
                    <Button onClick={() => openBooking("reserve")}>Reserve for ₹999</Button>
                    <Button variant="secondary" onClick={() => openBooking("testride")}>
                      Book a Free Home Test Ride
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollTo("#studio")}
                    className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#A1A1AA] hover:text-[#00FF66]"
                  >
                    Enter studio
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function colorwaysGlow(id: string, glow: string) {
  return <div className="h-full w-full rounded-full" style={{ background: id === "stealth" ? "rgba(0,255,102,0.35)" : glow }} />;
}
