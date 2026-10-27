<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * TODO [B1] Validación declarativa de creación y actualización de equipos.
 *
 * Se usa tanto en store() como en update(). Reglas exigidas:
 *
 *  - codigo            obligatorio, texto, máx. 20, formato EQ-0000 (EQ- y 4 dígitos),
 *                      único en la tabla equipos (al actualizar, debe ignorar el equipo actual)
 *  - nombre            obligatorio, texto, entre 3 y 120 caracteres
 *  - categoria_id      obligatorio, entero, debe existir en la tabla categorias
 *  - estado            opcional; si viene, solo puede ser "disponible" o "mantenimiento"
 *                      ("prestado" solo se asigna mediante el endpoint de préstamo)
 *  - fecha_adquisicion obligatoria, fecha válida, no puede ser futura
 *  - costo_interno     obligatorio, numérico, mayor o igual a 0
 *
 * Todos los mensajes deben estar en español y asociados a cada campo.
 * Pista: el equipo que se está actualizando está disponible en $this->route('equipo').
 */
class GuardarEquipoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // TODO
        ];
    }

    public function messages(): array
    {
        return [
            // TODO
        ];
    }
}
