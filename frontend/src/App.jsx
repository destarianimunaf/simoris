import { useEffect, useState, useCallback } from 'react'
import api from './api/axios'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import SuratTable from './components/SuratTable'
import SuratFormModal from './components/SuratFormModal'

export default function App() {
  const [surats, setSurats] = useState([])
  const [kodeList, setKodeList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [kodeFilter, setKodeFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSurat, setEditingSurat] = useState(null)
  const [toast, setToast] = useState('')

  const loadSurats = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/surats', {
        params: { search: search || undefined, kode_klasifikasi_id: kodeFilter || undefined, per_page: 50 },
      })
      setSurats(res.data.data)
    } finally {
      setLoading(false)
    }
  }, [search, kodeFilter])

  useEffect(() => {
    api.get('/kode-klasifikasis').then((res) => setKodeList(res.data))
  }, [])

  useEffect(() => {
    const timer = setTimeout(loadSurats, 250)
    return () => clearTimeout(timer)
  }, [loadSurats])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function handleTambah() {
    setEditingSurat(null)
    setModalOpen(true)
  }

  function handleEdit(surat) {
    setEditingSurat(surat)
    setModalOpen(true)
  }

  async function handleDelete(surat) {
    if (!confirm(`Hapus surat ${surat.nomor_surat}? Tindakan ini tidak dapat dibatalkan.`)) return
    await api.delete(`/surats/${surat.id}`)
    showToast('Surat berhasil dihapus.')
    loadSurats()
  }

  function handleSaved() {
    setModalOpen(false)
    showToast(editingSurat ? 'Perubahan tersimpan.' : 'Nomor surat baru berhasil diterbitkan.')
    loadSurats()
  }

  return (
    <div className="min-h-screen bg-paper">
      <Header totalSurat={surats.length} onTambah={handleTambah} />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <FilterBar
          search={search} setSearch={setSearch}
          kodeList={kodeList} kodeFilter={kodeFilter} setKodeFilter={setKodeFilter}
        />
        <SuratTable data={surats} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
      </main>

      <SuratFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        kodeList={kodeList}
        editingSurat={editingSurat}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 bg-ink-900 text-white text-sm font-medium px-4 py-3 rounded-lg shadow-card">
          {toast}
        </div>
      )}
    </div>
  )
}
