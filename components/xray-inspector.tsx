"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { SectionLabel } from "@/components/section-label";
import { asset } from "@/lib/asset";
import { hotspots, type Hotspot } from "@/lib/data";
import { cn, glass } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

export function XRayInspector() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = hotspots.find((spot) => spot.id === activeId) ?? null;

  const select = (id: string) => setActiveId((current) => (current === id ? null : id));
  const cycle = (direction: number) => {
    const index = hotspots.findIndex((spot) => spot.id === activeId);
    const next = hotspots[(index + direction + hotspots.length) % hotspots.length];
    setActiveId(next.id);
  };

  return (
    <section id="xray" className="scroll-mt-20 bg-[#050505] px-5 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <SectionLabel index="03" label="X-Ray" />
          <h2 className="font-display text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[0.94] tracking-[-0.045em] text-white">
            Open the shell.
          </h2>
          <p className="mt-4 text-[#A1A1AA]">
            Four systems under the skin. Tap a node — the camera pushes in, and the brief slides out.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div>
            <div className="overflow-hidden rounded-[28px] border border-[#00FF66]/20 bg-black">
              <motion.div
                className="relative"
                animate={{ scale: active ? 1.42 : 1 }}
                style={{ transformOrigin: active ? `${active.x}% ${active.y}%` : "50% 54%" }}
                transition={{ type: "spring", stiffness: 80, damping: 18 }}
              >
                <img
                  src={asset("/images/scooter-cyber-neon.png")}
                  alt="AURA Pulse side profile with system nodes"
                  className="block h-auto w-full select-none"
                />
                <div className="absolute inset-0">
                  {active && (
                    <>
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,102,0.08)_1px,transparent_1px)] bg-[size:42px_42px] mix-blend-screen" />
                      <motion.div
                        className="pointer-events-none absolute"
                        initial={false}
                        animate={{
                          left: `${active.box.x}%`,
                          top: `${active.box.y}%`,
                          width: `${active.box.w}%`,
                          height: `${active.box.h}%`,
                        }}
                        transition={{ type: "spring", stiffness: 140, damping: 22 }}
                      >
                        <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-[#00FF66] shadow-[0_0_12px_#00FF66]" />
                        <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-[#00FF66] shadow-[0_0_12px_#00FF66]" />
                        <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-[#00FF66] shadow-[0_0_12px_#00FF66]" />
                        <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[#00FF66] shadow-[0_0_12px_#00FF66]" />
                      </motion.div>
                    </>
                  )}
                  {hotspots.map((spot) => {
                    const on = spot.id === activeId;
                    return (
                      <button
                        key={spot.id}
                        type="button"
                        aria-expanded={on}
                        aria-controls="xray-drawer"
                        onClick={() => select(spot.id)}
                        className="absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
                        style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                      >
                        <span className="absolute h-8 w-8 animate-ping rounded-full bg-[#00FF66]/40" />
                        <span
                          className={cn(
                            "relative h-3.5 w-3.5 rounded-full bg-[#00FF66] shadow-[0_0_12px_#00FF66]",
                            on && "scale-125",
                          )}
                        />
                        <span
                          className={cn(
                            "absolute whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-[#00FF66]",
                            spot.x > 58 ? "right-8" : "left-8",
                          )}
                        >
                          {spot.index}
                        </span>
                        <span className="sr-only">{spot.title}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {hotspots.map((spot) => {
                const on = spot.id === activeId;
                return (
                  <button
                    key={spot.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => select(spot.id)}
                    className={cn(
                      "rounded-2xl border px-3 py-3 text-left transition duration-300",
                      on ? "border-[#00FF66] bg-[#00FF66]/10" : "border-white/10 bg-black/40 hover:border-[#00FF66]/40",
                    )}
                  >
                    <span className="font-mono text-[10px] tracking-[0.16em] text-[#00FF66]">{spot.index}</span>
                    <span className="mt-1 block text-sm text-white">{spot.node}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-h-[280px]">
            <AnimatePresence mode="wait">
              {active ? (
                <Drawer key={active.id} spot={active} onClose={() => setActiveId(null)} onCycle={cycle} />
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(glass, "rounded-[28px] p-6 text-[#A1A1AA]")}
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#00FF66]">Standby</p>
                  <p className="mt-3 font-display text-3xl text-white">Select a node.</p>
                  <p className="mt-3 text-sm leading-relaxed">
                    Floorboard pack, rear hub motor, AuraOS cluster, and the dual-disc brake circuit.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Drawer({
  spot,
  onClose,
  onCycle,
}: {
  spot: Hotspot;
  onClose: () => void;
  onCycle: (direction: number) => void;
}) {
  return (
    <motion.aside
      id="xray-drawer"
      role="region"
      aria-label={spot.title}
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.45, ease }}
      className={cn(glass, "rounded-[28px] p-6")}
      data-lenis-prevent
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00FF66]">
          {spot.index} / {spot.node}
        </p>
        <button type="button" onClick={onClose} className="rounded-full p-1 text-[#A1A1AA] hover:text-white" aria-label="Close system detail">
          <X size={16} />
        </button>
      </div>
      <h3 className="mt-4 font-display text-3xl leading-[1.05] tracking-[-0.04em] text-white">{spot.title}</h3>
      <p className="mt-3 text-sm text-[#A3E635]">{spot.summary}</p>
      <p className="mt-4 text-sm leading-relaxed text-[#A1A1AA]">{spot.body}</p>
      <dl className="mt-6">
        {spot.specs.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4 border-b border-white/10 py-2.5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A1A1AA]">{label}</dt>
            <dd className="text-right text-sm text-white">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex gap-2">
        <button type="button" onClick={() => onCycle(-1)} className="rounded-full border border-white/15 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white hover:border-[#00FF66]">
          Prev
        </button>
        <button type="button" onClick={() => onCycle(1)} className="rounded-full border border-[#00FF66]/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#00FF66] hover:border-[#00FF66]">
          Next
        </button>
      </div>
    </motion.aside>
  );
}
