import { cn } from "@/lib/cn";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path d="M4 18.5 12 4.5l8 14" fill="none" stroke="#00FF66" strokeWidth="1.6" />
        <path d="M7.4 14h9.2" stroke="#00FF66" strokeWidth="1.6" />
      </svg>
      <span className="font-display text-[15px] font-semibold tracking-[0.28em] text-white">
        AURA
      </span>
    </span>
  );
}
