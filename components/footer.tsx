import { Wordmark } from "@/components/wordmark";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505] px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Wordmark />
          <p className="mt-3 max-w-sm text-sm text-[#A1A1AA]">
            AURA MOTORS · AURA Pulse. Electric architecture for the night commute.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA]" aria-label="Footer">
          <a href="#hero" className="hover:text-[#00FF66]">Pulse</a>
          <a href="#studio" className="hover:text-[#00FF66]">Studio</a>
          <a href="#range" className="hover:text-[#00FF66]">Range</a>
          <a href="#xray" className="hover:text-[#00FF66]">Systems</a>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-6xl font-mono text-[10px] tracking-wide text-white/35">
        © {new Date().getFullYear()} AURA MOTORS. Reserve token is refundable. Range follows the selected ride mode.
      </p>
    </footer>
  );
}
