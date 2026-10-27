"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Button } from "@/components/button";
import { ColorSwatches } from "@/components/color-swatches";
import { useStudio } from "@/components/providers";
import { SectionLabel } from "@/components/section-label";
import { colorways, quickSpecs } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

export function ColorCustomizer() {
  const { colorway, colorId, openBooking } = useStudio();

  useEffect(() => {
    colorways.forEach((color) => {
      const image = new window.Image();
      image.src = color.image;
    });
  }, []);

  return (
    <section id="studio" className="relative scroll-mt-20 overflow-hidden bg-[#050505] px-5 py-24 md:px-8 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,102,0.045)_1px,transparent_1px)] bg-[size:84px_84px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_74%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <SectionLabel index="01" label="Live Studio" />
          <h2 className="font-display text-[clamp(2.4rem,5vw,4.6rem)] font-semibold leading-[0.94] tracking-[-0.045em] text-white">
            Choose the night it wears.
          </h2>
          <p className="mt-4 max-w-xl text-[#A1A1AA]">
            Four finishes. One architecture. The studio light, floor flare, and LED underglow follow the colorway.
          </p>
        </div>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1fr_280px] lg:gap-12">
          <div className="relative">
            {colorways.map((color) => (
              <div
                key={color.id}
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-700"
                style={{
                  background: `radial-gradient(circle, ${color.glow}, transparent 68%)`,
                  opacity: color.id === colorId ? 1 : 0,
                }}
              />
            ))}
            <div
              className="pointer-events-none absolute bottom-[6%] left-1/2 h-16 w-[72%] -translate-x-1/2 rounded-full blur-2xl transition-all duration-700"
              style={{ background: colorway.glow }}
            />
            <div className="relative h-[min(62vh,640px)]">
              <AnimatePresence>
                <motion.img
                  key={colorway.id}
                  src={colorway.image}
                  alt={`AURA Pulse in ${colorway.name}`}
                  initial={{ opacity: 0, scaleX: colorway.mirror ? -0.985 : 0.985, scaleY: 0.985 }}
                  animate={{ opacity: 1, scaleX: colorway.mirror ? -1 : 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleX: colorway.mirror ? -1.015 : 1.015, scaleY: 1.015 }}
                  transition={{ duration: 0.55, ease }}
                  className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_28px_40px_rgba(0,0,0,0.55)]"
                  data-color={colorway.id}
                />
              </AnimatePresence>
            </div>
            <div className="mt-2 flex items-end justify-between gap-4" aria-live="polite">
              <div>
                <p className="font-display text-3xl tracking-[-0.04em] text-white">{colorway.name}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#A1A1AA]">{colorway.finish}</p>
              </div>
              <p className="font-mono text-xs text-[#00FF66]">{colorway.hex}</p>
            </div>
          </div>
          <ColorSwatches variant="rail" />
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-[#00FF66]/20 bg-black/60 backdrop-blur-2xl">
          <div className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {quickSpecs.map((spec) => (
              <div key={spec.label} className="px-6 py-5 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#A1A1AA]">{spec.label}</p>
                <p className="mt-1 font-display text-2xl text-white">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          <Button onClick={() => openBooking("reserve")}>Reserve for ₹999</Button>
          <Button variant="secondary" onClick={() => openBooking("testride")}>
            Book a Free Home Test Ride
          </Button>
        </div>
      </div>
    </section>
  );
}
