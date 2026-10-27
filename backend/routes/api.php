<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\EquipoController;
use Illuminate\Support\Facades\Route;

/*
| Rutas YA DECLARADAS. No las modifique: el front-end y las pruebas
| de calificación dependen de estos nombres y métodos.
*/

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:10,1')
    ->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/categorias', [CategoriaController::class, 'index'])->name('categorias.index');

    Route::apiResource('equipos', EquipoController::class);

    Route::post('/equipos/{equipo}/prestamo', [EquipoController::class, 'prestar'])
        ->name('equipos.prestar');
});
