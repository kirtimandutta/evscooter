export function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[#00FF66]">
      <span>{index}</span>
      <span className="h-px w-8 bg-[#00FF66]/60" />
      <span>{label}</span>
    </div>
  );
}
