"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { colorways, getColorway, type ColorId } from "@/lib/data";

type BookingIntent = "reserve" | "testride";

type LenisLike = {
  raf: (time: number) => void;
  on: (event: "scroll", callback: () => void) => void;
  destroy: () => void;
  scrollTo: (
    target: string | number | HTMLElement,
    options?: { offset?: number; duration?: number },
  ) => void;
  stop: () => void;
  start: () => void;
};

type StudioContextValue = {
  colorId: ColorId;
  setColorId: (id: ColorId) => void;
  colorway: (typeof colorways)[number];
  bookingOpen: boolean;
  bookingIntent: BookingIntent;
  openBooking: (intent?: BookingIntent) => void;
  closeBooking: () => void;
  scrollTo: (target: string | number) => void;
  setScrollLocked: (id: string, locked: boolean) => void;
  lenisReady: boolean;
};

const StudioContext = createContext<StudioContextValue | null>(null);

export function useStudio() {
  const value = useContext(StudioContext);
  if (!value) throw new Error("useStudio must be used within Providers");
  return value;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [colorId, setColorId] = useState<ColorId>("cyber-neon");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingIntent, setBookingIntent] = useState<BookingIntent>("reserve");
  const [lenisReady, setLenisReady] = useState(false);
  const lenisRef = useRef<LenisLike | null>(null);
  const locks = useRef(new Set<string>());

  const setScrollLocked = useCallback((id: string, locked: boolean) => {
    if (locked) locks.current.add(id);
    else locks.current.delete(id);
    const shouldLock = locks.current.size > 0;
    document.body.style.overflow = shouldLock ? "hidden" : "";
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (shouldLock) lenis.stop();
    else lenis.start();
  }, []);

  useEffect(() => {
    let alive = true;
    let removeTicker: (() => void) | undefined;
    let instance: LenisLike | undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLenisReady(true);
      return () => {
        alive = false;
      };
    }

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }, lenisMod] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("@studio-freight/lenis"),
      ]);
      if (!alive) return;

      const Lenis = lenisMod.default;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        syncTouch: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.05,
      });

      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      removeTicker = () => {
        gsap.ticker.remove(ticker);
      };
      instance = lenis as LenisLike;
      lenisRef.current = instance;
      if (locks.current.size > 0) instance.stop();
      setLenisReady(true);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    })();

    return () => {
      alive = false;
      removeTicker?.();
      instance?.destroy();
      lenisRef.current = null;
      setLenisReady(false);
    };
  }, []);

  useEffect(() => {
    setScrollLocked("booking", bookingOpen);
  }, [bookingOpen, setScrollLocked]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const lenis = lenisRef.current;
      if (!lenis || !document.querySelector(href)) return;
      event.preventDefault();
      lenis.scrollTo(href, { offset: 0, duration: 1.15 });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const scrollTo = useCallback((target: string | number) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset: 0, duration: 1.15 });
      return;
    }
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "smooth" });
      return;
    }
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const openBooking = useCallback((intent: BookingIntent = "reserve") => {
    setBookingIntent(intent);
    setBookingOpen(true);
  }, []);

  const closeBooking = useCallback(() => setBookingOpen(false), []);

  const value = useMemo<StudioContextValue>(
    () => ({
      colorId,
      setColorId,
      colorway: getColorway(colorId),
      bookingOpen,
      bookingIntent,
      openBooking,
      closeBooking,
      scrollTo,
      setScrollLocked,
      lenisReady,
    }),
    [
      bookingIntent,
      bookingOpen,
      closeBooking,
      colorId,
      lenisReady,
      openBooking,
      scrollTo,
      setScrollLocked,
    ],
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}
