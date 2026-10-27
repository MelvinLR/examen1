<?php

namespace App\Services;

use App\Exceptions\ReglaNegocioException;
use App\Models\Equipo;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * TODO [B2] Capa de negocio de equipos.
 *
 * Esta clase NO conoce HTTP: no use request(), response(), abort() ni códigos
 * de estado aquí. Cuando una regla del dominio lo impida, lance
 * ReglaNegocioException con un mensaje en español.
 *
 * Reglas de negocio exigidas:
 *  R1. No se puede eliminar un equipo que está prestado.
 *      Mensaje: "No se puede eliminar un equipo prestado."
 *  R2. Solo se puede prestar un equipo disponible.
 *      - Si está en mantenimiento: "No se puede prestar un equipo en mantenimiento."
 *      - Si ya está prestado:     "El equipo ya se encuentra prestado."
 */
class EquipoService
{
    /**
     * Listado paginado con la categoría cargada de forma anticipada (sin N+1),
     * ordenado por código. Filtros opcionales:
     *  - $q:      busca en código o nombre (coincidencia parcial)
     *  - $estado: filtra por estado exacto
     */
    public function listar(?string $q, ?string $estado, int $porPagina): LengthAwarePaginator
    {
        // TODO
    }

    public function crear(array $datos): Equipo
    {
        // TODO: devuelva el equipo con la categoría cargada
    }

    public function actualizar(Equipo $equipo, array $datos): Equipo
    {
        // TODO: devuelva el equipo actualizado con la categoría cargada
    }

    public function eliminar(Equipo $equipo): void
    {
        // TODO: aplique R1
    }

    public function prestar(Equipo $equipo): Equipo
    {
        // TODO: aplique R2 y cambie el estado a "prestado"
    }
}
