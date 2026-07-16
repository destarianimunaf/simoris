<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KodeKlasifikasi;
use Illuminate\Http\Request;

class KodeKlasifikasiController extends Controller
{
    public function index()
    {
        return response()->json(
            KodeKlasifikasi::where('aktif', true)->orderBy('kode')->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode'  => ['required', 'string', 'max:30', 'unique:kode_klasifikasis,kode'],
            'nama'  => ['required', 'string', 'max:150'],
            'warna' => ['nullable', 'string', 'max:20'],
        ]);

        $kode = KodeKlasifikasi::create($validated);

        return response()->json($kode, 201);
    }

    public function update(Request $request, KodeKlasifikasi $kodeKlasifikasi)
    {
        $validated = $request->validate([
            'kode'  => ['sometimes', 'string', 'max:30', 'unique:kode_klasifikasis,kode,' . $kodeKlasifikasi->id],
            'nama'  => ['sometimes', 'string', 'max:150'],
            'warna' => ['nullable', 'string', 'max:20'],
            'aktif' => ['sometimes', 'boolean'],
        ]);

        $kodeKlasifikasi->update($validated);

        return response()->json($kodeKlasifikasi);
    }

    public function destroy(KodeKlasifikasi $kodeKlasifikasi)
    {
        // nonaktifkan saja, jangan hard delete, supaya riwayat surat lama tetap valid
        $kodeKlasifikasi->update(['aktif' => false]);

        return response()->json(['message' => 'Kode klasifikasi dinonaktifkan.']);
    }
}
