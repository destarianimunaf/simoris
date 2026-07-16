<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Counter;
use App\Models\Surat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SuratController extends Controller
{
    /**
     * Daftar surat, mendukung pencarian & filter kode klasifikasi.
     */
    public function index(Request $request)
    {
        $query = Surat::with('kodeKlasifikasi')->orderByDesc('nomor_urut');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('perihal', 'like', "%{$search}%")
                  ->orWhere('tujuan_surat', 'like', "%{$search}%")
                  ->orWhere('nomor_surat', 'like', "%{$search}%");
            });
        }

        if ($kodeId = $request->query('kode_klasifikasi_id')) {
            $query->where('kode_klasifikasi_id', $kodeId);
        }

        return response()->json(
            $query->paginate($request->integer('per_page', 15))
        );
    }

    /**
     * Inti dari SIMORIS: buat surat baru sekaligus generate nomor urut
     * paling belakang secara otomatis, aman dari race condition memakai
     * row locking pada tabel counters.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_klasifikasi_id' => ['required', 'exists:kode_klasifikasis,id'],
            'tujuan_surat'        => ['nullable', 'string', 'max:150'],
            'tanggal_surat'       => ['required', 'date'],
            'perihal'             => ['required', 'string', 'max:255'],
            'dibuat_oleh'         => ['nullable', 'string', 'max:100'],
        ]);

        $surat = DB::transaction(function () use ($validated) {
            // Kunci baris counter agar dua request bersamaan tidak
            // pernah mendapat nomor urut yang sama.
            $counter = Counter::where('nama', 'nomor_urut_surat')->lockForUpdate()->first();
            $nomorUrutBaru = $counter->nilai + 1;
            $counter->update(['nilai' => $nomorUrutBaru]);

            $kode = \App\Models\KodeKlasifikasi::findOrFail($validated['kode_klasifikasi_id']);
            $prefix = config('simoris.kode_instansi', 'W.9');
            $digit  = config('simoris.digit_nomor', 3);

            $nomorSurat = sprintf(
                '%s-%s-%s',
                $prefix,
                $kode->kode,
                str_pad($nomorUrutBaru, $digit, '0', STR_PAD_LEFT)
            );

            return Surat::create([
                'nomor_urut'           => $nomorUrutBaru,
                'kode_klasifikasi_id'  => $validated['kode_klasifikasi_id'],
                'nomor_surat'          => $nomorSurat,
                'tujuan_surat'         => $validated['tujuan_surat'] ?? null,
                'tanggal_surat'        => $validated['tanggal_surat'],
                'perihal'              => $validated['perihal'],
                'dibuat_oleh'          => $validated['dibuat_oleh'] ?? null,
            ]);
        });

        return response()->json($surat->load('kodeKlasifikasi'), 201);
    }

    /**
     * Update field surat yang BUKAN nomor (nomor surat tidak boleh
     * diubah manual demi menjaga urutan dan keaslian penomoran).
     */
    public function update(Request $request, Surat $surat)
    {
        $validated = $request->validate([
            'kode_klasifikasi_id' => ['sometimes', 'exists:kode_klasifikasis,id'],
            'tujuan_surat'        => ['nullable', 'string', 'max:150'],
            'tanggal_surat'       => ['sometimes', 'date'],
            'perihal'             => ['sometimes', 'string', 'max:255'],
            'dibuat_oleh'         => ['nullable', 'string', 'max:100'],
        ]);

        $surat->update($validated);

        return response()->json($surat->load('kodeKlasifikasi'));
    }

    public function destroy(Surat $surat)
    {
        $surat->delete();

        return response()->json(['message' => 'Surat dihapus.']);
    }

    /**
     * Dipakai frontend untuk menampilkan preview nomor surat berikutnya
     * SEBELUM tombol simpan ditekan, tanpa mengunci/menaikkan counter.
     */
    public function previewNomor(Request $request)
    {
        $request->validate(['kode_klasifikasi_id' => ['required', 'exists:kode_klasifikasis,id']]);

        $counter = Counter::where('nama', 'nomor_urut_surat')->first();
        $kode = \App\Models\KodeKlasifikasi::findOrFail($request->kode_klasifikasi_id);
        $prefix = config('simoris.kode_instansi', 'W.9');
        $digit  = config('simoris.digit_nomor', 3);

        $nomorSurat = sprintf(
            '%s-%s-%s',
            $prefix,
            $kode->kode,
            str_pad($counter->nilai + 1, $digit, '0', STR_PAD_LEFT)
        );

        return response()->json(['preview' => $nomorSurat]);
    }
}
