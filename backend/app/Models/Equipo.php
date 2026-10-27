<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Equipo extends Model
{
    use HasFactory;

    public const ESTADOS = ['disponible', 'prestado', 'mantenimiento'];

    protected $fillable = [
        'codigo',
        'nombre',
        'categoria_id',
        'estado',
        'fecha_adquisicion',
        'costo_interno',
    ];

    // Dato interno de la institución: nunca debe salir en la API
    protected $hidden = ['costo_interno'];

    protected $attributes = [
        'estado' => 'disponible',
    ];

    protected function casts(): array
    {
        return [
            'fecha_adquisicion' => 'date',
            'costo_interno'     => 'decimal:2',
        ];
    }

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class);
    }
}
