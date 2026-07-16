<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Surat extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomor_urut',
        'kode_klasifikasi_id',
        'nomor_surat',
        'tujuan_surat',
        'tanggal_surat',
        'perihal',
        'dibuat_oleh',
    ];

    protected $casts = [
        'tanggal_surat' => 'date',
    ];

    public function kodeKlasifikasi()
    {
        return $this->belongsTo(KodeKlasifikasi::class);
    }
}
