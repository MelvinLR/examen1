<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoriaResource;
use App\Models\Categoria;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * YA IMPLEMENTADO — úselo como modelo de referencia:
 * controlador delgado que devuelve un recurso de API, nunca el modelo directo.
 */
class CategoriaController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return CategoriaResource::collection(
            Categoria::orderBy('nombre')->get()
        );
    }
}
