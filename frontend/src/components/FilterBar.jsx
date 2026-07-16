export default function FilterBar({ search, setSearch, kodeList, kodeFilter, setKodeFilter }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400"
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0a7 7 0 10-9.9-9.9 7 7 0 009.9 9.9z" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari perihal, tujuan, atau nomor surat..."
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-ink-100 bg-white text-sm focus:border-ink-600 focus:ring-1 focus:ring-ink-600 outline-none"
        />
      </div>

      <select
        value={kodeFilter}
        onChange={(e) => setKodeFilter(e.target.value)}
        className="px-3 py-2.5 rounded-lg border border-ink-100 bg-white text-sm focus:border-ink-600 focus:ring-1 focus:ring-ink-600 outline-none sm:w-64"
      >
        <option value="">Semua kode klasifikasi</option>
        {kodeList.map((k) => (
          <option key={k.id} value={k.id}>
            {k.kode} — {k.nama}
          </option>
        ))}
      </select>
    </div>
  )
}
