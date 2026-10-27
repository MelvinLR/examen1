<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
        // Si el parámetro de la ruta es un modelo 'equipo' o un ID
        $equipoId = $this->route('equipo') ? $this->route('equipo')->id ?? $this->route('equipo') : null;

        return [
            'codigo' => [
                'required',
                'string',
                'max:20',
                'regex:/^EQ-\d{4}$/',
                Rule::unique('equipos', 'codigo')->ignore($equipoId),
            ],
            'nombre' => [
                'required',
                'string',
                'min:3',
                'max:120',
            ],
            'categoria_id' => [
                'required',
                'integer',
                'exists:categorias,id',
            ],
            'estado' => [
                'nullable',
                Rule::in(['disponible', 'mantenimiento']),
            ],
            'fecha_adquisicion' => [
                'required',
                'date',
                'before_or_equal:today',
            ],
            'costo_interno' => [
                'required',
                'numeric',
                'min:0',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'codigo.required' => 'El código es obligatorio.',
            'codigo.string' => 'El código debe ser una cadena de texto.',
            'codigo.max' => 'El código no debe superar los 20 caracteres.',
            'codigo.regex' => 'El código debe tener el formato EQ-0000 (EQ- seguido de 4 dígitos).',
            'codigo.unique' => 'El código ya está registrado en el sistema.',

            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.string' => 'El nombre debe ser una cadena de texto.',
            'nombre.min' => 'El nombre debe tener al menos 3 caracteres.',
            'nombre.max' => 'El nombre no debe superar los 120 caracteres.',

            'categoria_id.required' => 'La categoría es obligatoria.',
            'categoria_id.integer' => 'La categoría debe ser un número entero.',
            'categoria_id.exists' => 'La categoría seleccionada no existe.',

            'estado.in' => 'El estado solo puede ser disponible o mantenimiento.',

            'fecha_adquisicion.required' => 'La fecha de adquisición es obligatoria.',
            'fecha_adquisicion.date' => 'La fecha de adquisición debe ser una fecha válida.',
            'fecha_adquisicion.before_or_equal' => 'La fecha de adquisición no puede ser una fecha futura.',

            'costo_interno.required' => 'El costo interno es obligatorio.',
            'costo_interno.numeric' => 'El costo interno debe ser un valor numérico.',
            'costo_interno.min' => 'El costo interno debe ser mayor o igual a 0.',
        ];
    }
}