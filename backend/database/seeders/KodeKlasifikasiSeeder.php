<?php

namespace Database\Seeders;

use App\Models\KodeKlasifikasi;
use Illuminate\Database\Seeder;

class KodeKlasifikasiSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['kode' => 'KP.10.02', 'nama' => 'Kepegawaian - PAK/Konversi/Akumulasi', 'warna' => 'blue'],
            ['kode' => 'UM.01.01', 'nama' => 'Umum - Laporan & Koordinasi', 'warna' => 'emerald'],
            ['kode' => 'PB.02.03', 'nama' => 'Pengadaan Barang & Jasa', 'warna' => 'amber'],
            ['kode' => 'KI.08.03', 'nama' => 'Komunikasi & Informasi - Undangan', 'warna' => 'violet'],
        ];

        foreach ($data as $item) {
            KodeKlasifikasi::updateOrCreate(['kode' => $item['kode']], $item);
        }
    }
}
