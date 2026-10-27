<?php

namespace Database\Factories;

use App\Models\Categoria;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipoFactory extends Factory
{
    public const NOMBRES = [
        'Laptop Dell Latitude 5440',
        'Laptop Lenovo ThinkPad E14',
        'MacBook Air M3',
        'Proyector Epson PowerLite X49',
        'Proyector BenQ MW560',
        'Pantalla interactiva Samsung 65"',
        'Cámara Canon EOS R50',
        'Micrófono inalámbrico Shure BLX24',
        'Parlante JBL EON710',
        'Switch Cisco Catalyst 1000 24p',
        'Router MikroTik hAP ax²',
        'Access point Ubiquiti U6 Lite',
        'Kit Arduino Uno R4',
        'Raspberry Pi 5 8 GB',
        'Multímetro Fluke 117',
        'Osciloscopio Rigol DS1054Z',
        'Tablet Samsung Galaxy Tab S9 FE',
        'Monitor LG UltraWide 29"',
        'Disco externo WD 2 TB',
        'Probador de cable Fluke MicroScanner2',
    ];

    public function definition(): array
    {
        return [
            'codigo'            => fake()->unique()->numerify('EQ-####'),
            'nombre'            => fake()->randomElement(self::NOMBRES),
            'categoria_id'      => Categoria::factory(),
            'estado'            => 'disponible',
            'fecha_adquisicion' => fake()->dateTimeBetween('-4 years', '-1 week')->format('Y-m-d'),
            'costo_interno'     => fake()->randomFloat(2, 45000, 1500000),
        ];
    }

    public function prestado(): static
    {
        return $this->state(fn () => ['estado' => 'prestado']);
    }

    public function enMantenimiento(): static
    {
        return $this->state(fn () => ['estado' => 'mantenimiento']);
    }
}
