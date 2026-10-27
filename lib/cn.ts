export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const glass =
  "bg-black/60 backdrop-blur-2xl border border-[#00FF66]/20";

export const glassHover =
  "transition-colors duration-300 hover:border-[#00FF66]/50";
