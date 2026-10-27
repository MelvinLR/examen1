<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GuardarEquipoRequest;
use App\Models\Equipo;
use App\Services\EquipoService;
use Illuminate\Http\Request;

/**
 * TODO [B3] Controlador delgado: recibe, delega en el servicio y responde.
 *
 *  - Ningún método supera 15 líneas.
 *  - Ninguna regla de negocio vive aquí.
 *  - Nunca devuelva el modelo directo: use EquipoResource.
 *
 * Contrato que debe cumplir:
 *
 *  GET    /api/equipos?page=&per_page=&q=&estado=  200  colección paginada con data, links y meta
 *                                                       per_page por omisión 10, tope máximo 50
 *  GET    /api/equipos/{id}                        200  | 404
 *  POST   /api/equipos                             201 + encabezado Location | 422
 *  PUT    /api/equipos/{id}                        200  | 404 | 422
 *  DELETE /api/equipos/{id}                        204  | 404 | 409 (R1)
 *  POST   /api/equipos/{id}/prestamo               200  | 404 | 409 (R2)
 */
class EquipoController extends Controller
{
    public function __construct(private EquipoService $service)
    {
    }

    public function index(Request $request)
    {
        abort(501, 'Pendiente de implementar');
    }

    public function show(Equipo $equipo)
    {
        abort(501, 'Pendiente de implementar');
    }

    public function store(GuardarEquipoRequest $request)
    {
        abort(501, 'Pendiente de implementar');
    }

    public function update(GuardarEquipoRequest $request, Equipo $equipo)
    {
        abort(501, 'Pendiente de implementar');
    }

    public function destroy(Equipo $equipo)
    {
        abort(501, 'Pendiente de implementar');
    }

    public function prestar(Equipo $equipo)
    {
        abort(501, 'Pendiente de implementar');
    }
}
