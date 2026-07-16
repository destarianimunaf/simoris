<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KodeKlasifikasi extends Model
{
    use HasFactory;

    protected $fillable = ['kode', 'nama', 'warna', 'aktif'];

    protected $casts = [
        'aktif' => 'boolean',
    ];

    public function surats()
    {
        return $this->hasMany(Surat::class);
    }
}
