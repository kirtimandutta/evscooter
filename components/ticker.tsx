export function Ticker({ value }: { value: string }) {
  return (
    <span className="inline-flex items-end tabular-nums" aria-label={value}>
      <span aria-hidden className="inline-flex">
        {value.split("").map((char, index) => (
          <span key={`${index}-${char}`} className="inline-block h-[1.05em] overflow-hidden">
            <span className="tick-char inline-block">{char}</span>
          </span>
        ))}
      </span>
    </span>
  );
}
