"use client";

import { Button } from "@/components/button";
import { useStudio } from "@/components/providers";

export function Finale() {
  const { colorway, openBooking } = useStudio();

  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] px-5 py-28 md:px-8">
      <img
        src={colorway.image}
        alt=""
        className="pointer-events-none absolute left-1/2 top-1/2 w-[min(1100px,120%)] object-contain opacity-30"
        style={{ transform: `translate(-50%, -50%) scaleX(${colorway.mirror ? -1 : 1})` }}
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#00FF66]">AURA MOTORS</p>
        <h2 className="mt-4 font-display text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.88] tracking-[-0.05em] text-white">
          The city,
          <br />
          unplugged.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-[#A1A1AA]">
          {colorway.name} is on the stand. A ₹999 token holds the build and can schedule a home test ride.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={() => openBooking("reserve")}>Reserve for ₹999</Button>
          <Button variant="secondary" onClick={() => openBooking("testride")}>
            Book a Free Home Test Ride
          </Button>
        </div>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA]">
          6.8 kW · 4.2 kWh · 98 kg · AuraOS 3.0
        </p>
      </div>
    </section>
  );
}
