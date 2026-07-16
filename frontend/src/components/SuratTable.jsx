import KlasifikasiBadge from './KlasifikasiBadge'

function formatTanggal(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function SuratTable({ data, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-ink-100 shadow-card p-10 text-center text-ink-400 text-sm">
        Memuat data surat...
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="bg-white rounded-xl border border-ink-100 shadow-card p-10 text-center">
        <p className="text-ink-800 font-semibold">Belum ada surat tercatat</p>
        <p className="text-ink-400 text-sm mt-1">Terbitkan nomor baru untuk memulai pencatatan.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-ink-100 shadow-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-ink-50 text-ink-600 text-xs uppercase tracking-wide">
            <th className="text-left font-semibold px-4 py-3 w-14">No</th>
            <th className="text-left font-semibold px-4 py-3">Nomor Surat</th>
            <th className="text-left font-semibold px-4 py-3">Tanggal</th>
            <th className="text-left font-semibold px-4 py-3">Tujuan</th>
            <th className="text-left font-semibold px-4 py-3">Perihal</th>
            <th className="text-left font-semibold px-4 py-3">Klasifikasi</th>
            <th className="text-right font-semibold px-4 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100/70">
          {data.map((s) => (
            <tr key={s.id} className="hover:bg-paper/60 transition-colors">
              <td className="px-4 py-3 text-ink-400 font-mono">{s.nomor_urut}</td>
              <td className="px-4 py-3">
                <span className="font-mono font-semibold text-ink-900 bg-paper stamp-border rounded px-2 py-1 inline-block">
                  {s.nomor_surat}
                </span>
              </td>
              <td className="px-4 py-3 text-ink-600 whitespace-nowrap">{formatTanggal(s.tanggal_surat)}</td>
              <td className="px-4 py-3 text-ink-800">{s.tujuan_surat || '—'}</td>
              <td className="px-4 py-3 text-ink-800 max-w-xs truncate" title={s.perihal}>{s.perihal}</td>
              <td className="px-4 py-3"><KlasifikasiBadge kode={s.kode_klasifikasi} /></td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(s)}
                    className="text-ink-600 hover:text-ink-900 text-xs font-semibold px-2 py-1 rounded hover:bg-ink-50"
                  >
                    Ubah
                  </button>
                  <button
                    onClick={() => onDelete(s)}
                    className="text-red-600 hover:text-red-800 text-xs font-semibold px-2 py-1 rounded hover:bg-red-50"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
