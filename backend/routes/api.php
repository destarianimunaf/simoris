<?php

use App\Http\Controllers\Api\KodeKlasifikasiController;
use App\Http\Controllers\Api\SuratController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - SIMORIS
|--------------------------------------------------------------------------
| Tambahkan file ini ke routes/api.php pada instalasi Laravel Anda.
*/

Route::get('/surats', [SuratController::class, 'index']);
Route::post('/surats', [SuratController::class, 'store']);
Route::put('/surats/{surat}', [SuratController::class, 'update']);
Route::delete('/surats/{surat}', [SuratController::class, 'destroy']);
Route::get('/surats-preview-nomor', [SuratController::class, 'previewNomor']);

Route::get('/kode-klasifikasis', [KodeKlasifikasiController::class, 'index']);
Route::post('/kode-klasifikasis', [KodeKlasifikasiController::class, 'store']);
Route::put('/kode-klasifikasis/{kodeKlasifikasi}', [KodeKlasifikasiController::class, 'update']);
Route::delete('/kode-klasifikasis/{kodeKlasifikasi}', [KodeKlasifikasiController::class, 'destroy']);
