<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('counters', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 50)->unique(); // 'nomor_urut_surat'
            $table->unsignedInteger('nilai')->default(0);
            $table->timestamps();
        });

        // baris awal counter global, dikunci saat transaksi penomoran
        DB::table('counters')->insert([
            'nama' => 'nomor_urut_surat',
            'nilai' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('counters');
    }
};
