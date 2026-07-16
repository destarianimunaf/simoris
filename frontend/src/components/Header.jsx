export default function Header({ totalSurat, onTambah }) {
  return (
    <header className="bg-ink-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-segel/90 stamp-border flex items-center justify-center font-mono font-semibold text-sm text-ink-900">
            №
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">SIMORIS</h1>
            <p className="text-ink-100/80 text-xs mt-1">Sistem Penomoran Surat Otomatis</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          <div className="text-right">
            <p className="text-ink-100/70 text-xs">Surat tercatat</p>
            <p className="font-mono text-xl font-semibold">{String(totalSurat).padStart(3, '0')}</p>
          </div>
          <button
            onClick={onTambah}
            className="bg-segel hover:bg-segel/90 transition-colors text-ink-900 font-semibold text-sm px-4 py-2.5 rounded-lg shadow-card"
          >
            + Terbitkan Nomor Baru
          </button>
        </div>
      </div>
      <button
        onClick={onTambah}
        className="sm:hidden w-full bg-segel text-ink-900 font-semibold text-sm py-3"
      >
        + Terbitkan Nomor Baru
      </button>
    </header>
  )
}
