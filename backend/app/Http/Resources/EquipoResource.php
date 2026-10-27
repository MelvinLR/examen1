<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * TODO [B4] Recurso de API de un equipo.
 *
 * La respuesta debe tener EXACTAMENTE esta forma (el front-end depende de ella):
 *
 * {
 *   "id": 1,
 *   "codigo": "EQ-0001",
 *   "nombre": "Laptop Dell Latitude 5440",
 *   "estado": "disponible",
 *   "fecha_adquisicion": "2026-09-15",
 *   "categoria": { "id": 1, "nombre": "Cómputo" }   <- solo si la relación está cargada
 * }
 *
 * costo_interno, created_at y updated_at NO deben aparecer.
 * Reutilice CategoriaResource para la categoría.
 */
class EquipoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // TODO
        return parent::toArray($request);
    }
}
