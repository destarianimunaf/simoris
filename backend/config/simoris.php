<?php

// Salin baris ini ke dalam file config/app.php milik Laravel Anda,
// atau letakkan file ini langsung di folder config/simoris.php lalu jalankan `php artisan config:cache`.

return [

    // Kode singkat instansi yang muncul di depan setiap nomor surat.
    // Contoh: "W.9" akan menghasilkan nomor "W.9-KP.10.02-001"
    'kode_instansi' => env('INSTANSI_KODE', 'W.9'),

    // Jumlah digit padding nomor urut, 3 => 001, 4 => 0001
    'digit_nomor' => env('INSTANSI_DIGIT_NOMOR', 3),

];
