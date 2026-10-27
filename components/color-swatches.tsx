"use client";

import { colorways, type ColorId } from "@/lib/data";
import { cn } from "@/lib/cn";
import { useStudio } from "@/components/providers";
import type { KeyboardEvent } from "react";

export function ColorSwatches({ variant = "rail" }: { variant?: "rail" | "dots" | "cards" }) {
  const { colorId, setColorId } = useStudio();

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const index = colorways.findIndex((color) => color.id === colorId);
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next = colorways[(index + direction + colorways.length) % colorways.length];
    setColorId(next.id);
  };

  if (variant === "dots") {
    return (
      <div role="radiogroup" aria-label="Colorway" className="flex items-center gap-2.5" onKeyDown={onKeyDown}>
        {colorways.map((color) => {
          const active = color.id === colorId;
          return (
            <button
              key={color.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={color.name}
              title={color.name}
              onClick={() => setColorId(color.id)}
              className={cn(
                "h-9 w-9 rounded-full border transition duration-300",
                active
                  ? "border-[#00FF66] shadow-[0_0_16px_#00FF66]"
                  : "border-white/25 hover:border-[#00FF66]/70",
              )}
              style={{ background: color.swatch }}
            />
          );
        })}
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div role="radiogroup" aria-label="Colorway" className="grid grid-cols-2 gap-2" onKeyDown={onKeyDown}>
        {colorways.map((color) => {
          const active = color.id === colorId;
          return (
            <button
              key={color.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setColorId(color.id as ColorId)}
              className={cn(
                "rounded-2xl border p-2 text-left transition duration-300",
                active
                  ? "border-[#00FF66] bg-[#00FF66]/10 shadow-[0_0_18px_rgba(0,255,102,0.18)]"
                  : "border-white/10 bg-white/[0.03] hover:border-[#00FF66]/40",
              )}
            >
              <span className="block h-16 overflow-hidden rounded-xl bg-black">
                <img src={color.image} alt="" className={`h-full w-full object-contain ${color.mirror ? "-scale-x-100" : ""}`} />
              </span>
              <span className="mt-2 block text-sm text-white">{color.name}</span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#A1A1AA]">
                {color.hex}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Finish"
      className="grid grid-cols-2 gap-2 lg:flex lg:flex-col"
      onKeyDown={onKeyDown}
    >
      {colorways.map((color) => {
        const active = color.id === colorId;
        return (
          <button
            key={color.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setColorId(color.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-full border px-2 py-2 pr-3 text-left transition duration-300",
              active
                ? "border-[#00FF66]/70 bg-[#00FF66]/10"
                : "border-white/10 bg-black/40 hover:border-[#00FF66]/40",
            )}
          >
            <span
              className={cn(
                "h-10 w-10 shrink-0 rounded-full border",
                active ? "border-[#00FF66] shadow-[0_0_14px_#00FF66]" : "border-white/15",
              )}
              style={{ background: color.swatch }}
            />
            <span>
              <span className="block text-sm text-white">{color.name}</span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#A1A1AA]">
                {color.hex}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
