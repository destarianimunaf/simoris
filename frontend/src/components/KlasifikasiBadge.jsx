const WARNA_MAP = {
  blue: 'bg-ink-100 text-ink-800',
  emerald: 'bg-emerald-100 text-emerald-800',
  amber: 'bg-amber-100 text-amber-800',
  violet: 'bg-violet-100 text-violet-800',
  slate: 'bg-slate-100 text-slate-700',
}

export default function KlasifikasiBadge({ kode }) {
  if (!kode) return <span className="text-ink-400 text-sm">—</span>
  const cls = WARNA_MAP[kode.warna] || WARNA_MAP.slate
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {kode.kode}
    </span>
  )
}
