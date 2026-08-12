const accents: Record<string, string> = { People: "var(--person)", Projects: "var(--project)", Tasks: "var(--task)", Technologies: "var(--technology)" };
export default function StatCard({ label, value, delay = 0 }: { label: string; value: number | null; delay?: number }) {
  return <div className="card group min-h-[132px] p-5 motion-safe:animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
    <div className="flex items-start justify-between"><p className="eyebrow">{label}</p><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accents[label] ?? "#C86647" }} /></div>
    <p className="mt-5 text-[34px] font-semibold leading-9 tracking-[-.03em] text-ink-900 tabular-nums">{value === null ? <span className="skeleton inline-block h-8 w-14 rounded" /> : value.toLocaleString()}</p>
    <p className="mt-1 text-[13px] text-ink-600">{label.toLowerCase()} in your graph</p>
  </div>;
}
