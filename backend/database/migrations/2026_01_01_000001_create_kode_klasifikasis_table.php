<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kode_klasifikasis', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 30)->unique();      // contoh: KP.10.02
            $table->string('nama', 150);                // contoh: Pengangkatan Calon PNS
            $table->string('warna', 20)->default('slate'); // untuk badge di UI
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kode_klasifikasis');
    }
};
