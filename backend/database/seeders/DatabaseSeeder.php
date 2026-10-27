<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Equipo;
use App\Models\User;
use Database\Factories\EquipoFactory;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name'     => 'Docente IF0009',
            'email'    => 'docente@ucr.ac.cr',
            'password' => 'Examen2026!',
        ]);

        $categorias = collect(['Cómputo', 'Audiovisual', 'Redes', 'Electrónica'])
            ->map(fn (string $nombre) => Categoria::create(['nombre' => $nombre]));

        // Nombre => categoría (índice en $categorias)
        $catalogo = [
            0 => [0, 1, 2, 16, 17, 18],
            1 => [3, 4, 5, 6, 7, 8],
            2 => [9, 10, 11, 19],
            3 => [12, 13, 14, 15],
        ];

        $n = 1;
        foreach (range(1, 2) as $vuelta) {
            foreach ($catalogo as $cat => $indices) {
                foreach ($indices as $i) {
                    if ($n > 25) {
                        break 3;
                    }

                    Equipo::create([
                        'codigo'            => sprintf('EQ-%04d', $n),
                        'nombre'            => EquipoFactory::NOMBRES[$i],
                        'categoria_id'      => $categorias[$cat]->id,
                        // Mezcla de estados para poder probar las reglas de negocio
                        'estado'            => match (true) {
                            $n % 5 === 0 => 'prestado',
                            $n % 7 === 0 => 'mantenimiento',
                            default      => 'disponible',
                        },
                        'fecha_adquisicion' => now()->subDays(30 * $n)->toDateString(),
                        'costo_interno'     => 50000 + ($n * 23750),
                    ]);
                    $n++;
                }
            }
        }
    }
}
