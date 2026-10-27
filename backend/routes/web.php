<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json([
    'api'    => 'Préstamo de Equipos — IF0009 Examen I',
    'estado' => 'en línea',
]));
