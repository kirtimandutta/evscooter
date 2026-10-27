"use client";

import { motion } from "framer-motion";
import { useId, useMemo, useState } from "react";
import { Ticker } from "@/components/ticker";
import { SectionLabel } from "@/components/section-label";
import { COST_ASSUMPTIONS, projectCosts } from "@/lib/calculator";
import { rideModes, type RideModeId } from "@/lib/data";
import { inr } from "@/lib/format";
import { cn, glass } from "@/lib/cn";

export function SavingsCalculator() {
  const [daily, setDaily] = useState(50);
  const [petrol, setPetrol] = useState(105);
  const [mode, setMode] = useState<RideModeId>("eco");
  const distanceId = useId();
  const petrolId = useId();

  const active = rideModes.find((item) => item.id === mode) ?? rideModes[0];
  const result = useMemo(() => projectCosts(daily, petrol, active.range), [active.range, daily, petrol]);
  const petrolWidth = 100;
  const electricWidth = Math.max(4, (result.electricAnnual / result.petrolAnnual) * 100);
  const treesLabel = result.trees >= 10 ? String(Math.round(result.trees)) : result.trees.toFixed(1);

  return (
    <section id="range" className="scroll-mt-20 bg-[#0A0A0A] px-5 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="02" label="Range Lab" />
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <h2 className="font-display text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[0.94] tracking-[-0.045em] text-white">
              What the petrol scooter keeps costing.
            </h2>
            <p className="mt-4 max-w-md text-[#A1A1AA]">
              Set the commute and the pump price. AURA Pulse answers with three years of current, and the carbon that stays in the ground.
            </p>
          </div>
          <p className="font-mono text-[11px] leading-relaxed tracking-wide text-[#A1A1AA] lg:text-right">
            Versus a {COST_ASSUMPTIONS.petrolKmPerLiter} km/l petrol scooter · ₹{COST_ASSUMPTIONS.gridRate.toFixed(2)}/kWh grid ·{" "}
            {COST_ASSUMPTIONS.ridingDays} riding days · {COST_ASSUMPTIONS.packKwh} kWh pack
          </p>
        </div>

        <div className={cn(glass, "mt-10 grid gap-10 rounded-[28px] p-5 sm:p-8 lg:grid-cols-2 lg:p-10")}>
          <div>
            <label htmlFor={distanceId} className="flex items-end justify-between gap-4">
              <span className="text-sm text-white">Daily Commute Distance</span>
              <span className="font-mono text-sm tabular-nums text-[#00FF66]">{daily} km</span>
            </label>
            <div className="relative mt-4 h-6">
              <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-white/10" />
              <div
                className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-[#00FF66] shadow-[0_0_12px_#00FF66]"
                style={{ width: `${((daily - 5) / 115) * 100}%` }}
              />
              <input
                id={distanceId}
                className="aura-range absolute inset-0"
                type="range"
                min={5}
                max={120}
                step={1}
                value={daily}
                data-lenis-prevent
                aria-valuemin={5}
                aria-valuemax={120}
                aria-valuenow={daily}
                onChange={(event) => setDaily(Number(event.target.value))}
              />
            </div>
            <div className="mt-1 flex justify-between font-mono text-[10px] tracking-[0.14em] text-[#A1A1AA]">
              <span>5 km</span>
              <span>120 km</span>
            </div>

            <label htmlFor={petrolId} className="mt-8 flex items-end justify-between gap-4">
              <span className="text-sm text-white">Current Petrol Price</span>
              <span className="font-mono text-sm tabular-nums text-[#00FF66]">₹{petrol}/L</span>
            </label>
            <div className="relative mt-4 h-6">
              <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-white/10" />
              <div
                className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-[#00FF66] shadow-[0_0_12px_#00FF66]"
                style={{ width: `${((petrol - 80) / 40) * 100}%` }}
              />
              <input
                id={petrolId}
                className="aura-range absolute inset-0"
                type="range"
                min={80}
                max={120}
                step={1}
                value={petrol}
                data-lenis-prevent
                aria-valuemin={80}
                aria-valuemax={120}
                aria-valuenow={petrol}
                onChange={(event) => setPetrol(Number(event.target.value))}
              />
            </div>
            <div className="mt-1 flex justify-between font-mono text-[10px] tracking-[0.14em] text-[#A1A1AA]">
              <span>₹80</span>
              <span>₹120</span>
            </div>

            <div className="mt-8 grid gap-2" role="group" aria-label="Ride mode">
              {rideModes.map((item) => {
                const selected = item.id === mode;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setMode(item.id)}
                    className={cn(
                      "rounded-full border px-4 py-3 text-left font-mono text-[12px] tracking-wide transition duration-300",
                      selected
                        ? "border-[#00FF66] bg-[#00FF66] font-bold text-black shadow-[0_0_22px_rgba(0,255,102,0.28)]"
                        : "border-white/10 text-[#A1A1AA] hover:border-[#00FF66]/50",
                    )}
                  >
                    {item.chip}
                  </button>
                );
              })}
            </div>
            {result.chargesPerDay > 1 && (
              <p className="mt-4 font-mono text-[11px] leading-relaxed text-[#A3E635]">
                This commute is longer than the {active.range} km charge in this mode. Plan a top-up.
              </p>
            )}
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#A1A1AA]">Total 3-Year Savings</p>
              <p
                className="mt-3 font-display text-[clamp(2.6rem,5vw,4.4rem)] font-semibold leading-none tracking-[-0.045em] text-[#00FF66] drop-shadow-[0_0_22px_rgba(0,255,102,0.35)]"
                aria-live="polite"
                data-savings={Math.round(result.savings3)}
              >
                <Ticker value={inr(result.savings3)} />
                <span className="ml-3 align-middle text-[0.42em] tracking-normal">Saved</span>
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="mb-2 flex items-baseline justify-between gap-4">
                  <span className="text-sm text-[#A1A1AA]">Annual Petrol Cost</span>
                  <span className="font-mono text-lg tabular-nums text-white">{inr(result.petrolAnnual)}</span>
                </div>
                <div className="h-px bg-white/10">
                  <motion.div className="h-px bg-white/70" initial={false} animate={{ width: `${petrolWidth}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-baseline justify-between gap-4">
                  <span className="text-sm text-[#A1A1AA]">Aura Electric Cost</span>
                  <span className="font-mono text-lg tabular-nums text-[#00FF66]">{inr(result.electricAnnual)}</span>
                </div>
                <div className="h-px bg-white/10">
                  <motion.div
                    className="h-px bg-[#00FF66] shadow-[0_0_12px_#00FF66]"
                    initial={false}
                    animate={{ width: `${electricWidth}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#00FF66]/20 bg-black/40 px-4 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A1A1AA]">Trees planted equivalent</p>
                <p className="mt-2 font-display text-3xl text-[#A3E635]">
                  {treesLabel} <span className="text-base text-[#A1A1AA]">Trees/yr</span>
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A1A1AA]">Annual distance</p>
                <p className="mt-2 font-display text-3xl text-white">
                  {new Intl.NumberFormat("en-IN").format(result.annualKm)}
                  <span className="text-base text-[#A1A1AA]"> km</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
