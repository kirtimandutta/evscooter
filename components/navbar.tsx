"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { useStudio } from "@/components/providers";
import { Wordmark } from "@/components/wordmark";
import { cn } from "@/lib/cn";

const links = [
  { href: "#hero", label: "Pulse" },
  { href: "#studio", label: "Studio" },
  { href: "#range", label: "Range" },
  { href: "#xray", label: "Systems" },
];

export function Navbar() {
  const { openBooking, scrollTo, setScrollLocked } = useStudio();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setScrollLocked("nav", open);
  }, [open, setScrollLocked]);

  const go = (href: string) => {
    setOpen(false);
    scrollTo(href);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition duration-300",
        scrolled || open
          ? "border-b border-[#00FF66]/15 bg-black/70 backdrop-blur-2xl"
          : "bg-gradient-to-b from-black/80 to-transparent",
      )}
    >
      <a
        href="#studio"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-[#00FF66] focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to studio
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-[72px] md:px-8">
        <button type="button" onClick={() => go("#hero")} className="rounded-full" aria-label="AURA MOTORS home">
          <Wordmark />
        </button>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => go(link.href)}
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#A1A1AA] transition hover:text-[#00FF66]"
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button className="hidden px-5 py-2.5 sm:inline-flex" onClick={() => openBooking("reserve")}>
            Reserve for ₹999
          </Button>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-[#050505] px-6 py-6 md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => go(link.href)}
                className="py-3 text-left font-display text-3xl text-white"
              >
                {link.label}
              </button>
            ))}
            <Button className="mt-4" onClick={() => { setOpen(false); openBooking("reserve"); }}>
              Reserve for ₹999
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
