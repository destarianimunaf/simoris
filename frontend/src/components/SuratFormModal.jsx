import { useEffect, useState } from 'react'
import api from '../api/axios'

const KOSONG = {
  kode_klasifikasi_id: '',
  tujuan_surat: '',
  tanggal_surat: new Date().toISOString().slice(0, 10),
  perihal: '',
  dibuat_oleh: '',
}

export default function SuratFormModal({ open, onClose, onSaved, kodeList, editingSurat }) {
  const [form, setForm] = useState(KOSONG)
  const [preview, setPreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isEdit = Boolean(editingSurat)

  useEffect(() => {
    if (editingSurat) {
      setForm({
        kode_klasifikasi_id: editingSurat.kode_klasifikasi_id,
        tujuan_surat: editingSurat.tujuan_surat || '',
        tanggal_surat: editingSurat.tanggal_surat?.slice(0, 10) || KOSONG.tanggal_surat,
        perihal: editingSurat.perihal,
        dibuat_oleh: editingSurat.dibuat_oleh || '',
      })
      setPreview(editingSurat.nomor_surat)
    } else {
      setForm(KOSONG)
      setPreview('')
    }
    setError('')
  }, [editingSurat, open])

  useEffect(() => {
    if (isEdit || !form.kode_klasifikasi_id) return
    const timer = setTimeout(() => {
      api
        .get('/surats-preview-nomor', { params: { kode_klasifikasi_id: form.kode_klasifikasi_id } })
        .then((res) => setPreview(res.data.preview))
        .catch(() => setPreview(''))
    }, 150)
    return () => clearTimeout(timer)
  }, [form.kode_klasifikasi_id, isEdit])

  if (!open) return null

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await api.put(`/surats/${editingSurat.id}`, form)
      } else {
        await api.post('/surats', form)
      }
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan surat. Periksa kembali isian Anda.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-ink-100 flex items-center justify-between">
          <h2 className="font-bold text-ink-900">{isEdit ? 'Ubah Surat' : 'Terbitkan Nomor Baru'}</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-900 text-xl leading-none">×</button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="bg-paper stamp-border rounded-lg px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-ink-600 font-medium">
              {isEdit ? 'Nomor surat (tidak dapat diubah)' : 'Nomor surat akan menjadi'}
            </span>
            <span className="font-mono font-bold text-ink-900">{preview || '—'}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1.5">Kode Klasifikasi</label>
            <select
              required
              value={form.kode_klasifikasi_id}
              onChange={(e) => setForm({ ...form, kode_klasifikasi_id: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-ink-100 text-sm focus:border-ink-600 focus:ring-1 focus:ring-ink-600 outline-none"
            >
              <option value="" disabled>Pilih kode klasifikasi...</option>
              {kodeList.map((k) => (
                <option key={k.id} value={k.id}>{k.kode} — {k.nama}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-600 mb-1.5">Tanggal Surat</label>
              <input
                type="date" required
                value={form.tanggal_surat}
                onChange={(e) => setForm({ ...form, tanggal_surat: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-ink-100 text-sm focus:border-ink-600 focus:ring-1 focus:ring-ink-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-600 mb-1.5">Tujuan Surat</label>
              <input
                value={form.tujuan_surat}
                onChange={(e) => setForm({ ...form, tujuan_surat: e.target.value })}
                placeholder="Nama/bagian tujuan"
                className="w-full px-3 py-2.5 rounded-lg border border-ink-100 text-sm focus:border-ink-600 focus:ring-1 focus:ring-ink-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1.5">Perihal</label>
            <input
              required
              value={form.perihal}
              onChange={(e) => setForm({ ...form, perihal: e.target.value })}
              placeholder="Contoh: PAK Cory / Surat Undangan Rapat"
              className="w-full px-3 py-2.5 rounded-lg border border-ink-100 text-sm focus:border-ink-600 focus:ring-1 focus:ring-ink-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1.5">Dibuat oleh (opsional)</label>
            <input
              value={form.dibuat_oleh}
              onChange={(e) => setForm({ ...form, dibuat_oleh: e.target.value })}
              placeholder="Nama petugas"
              className="w-full px-3 py-2.5 rounded-lg border border-ink-100 text-sm focus:border-ink-600 focus:ring-1 focus:ring-ink-600 outline-none"
            />
          </div>

          {error && <p className="text-red-600 text-xs font-medium">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-ink-100 text-ink-700 font-semibold text-sm hover:bg-ink-50"
            >
              Batal
            </button>
            <button
              type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-ink-900 text-white font-semibold text-sm hover:bg-ink-800 disabled:opacity-60"
            >
              {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Terbitkan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
