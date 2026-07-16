<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surats', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('nomor_urut')->unique(); // nomor urut global, sumber "nomor paling belakang"
            $table->foreignId('kode_klasifikasi_id')->constrained('kode_klasifikasis');
            $table->string('nomor_surat', 60)->unique();     // hasil generate, contoh: W.9-KP.10.02-001
            $table->string('tujuan_surat', 150)->nullable();
            $table->date('tanggal_surat');
            $table->string('perihal', 255);
            $table->string('dibuat_oleh', 100)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surats');
    }
};
