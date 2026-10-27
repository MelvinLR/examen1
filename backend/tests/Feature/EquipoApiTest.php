<?php

use App\Models\Categoria;
use App\Models\Equipo;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

/*
| TODO [B6] Escriba las tres pruebas. Cada una debe verificar el código
| de estado Y algo más (estructura, encabezado, mensaje o estado de la base).
|
| Quite el ->todo() de cada prueba al implementarla.
| Ejecute:  php artisan test --filter=EquipoApi
*/

beforeEach(function () {
    Sanctum::actingAs(User::factory()->create());
});

it('crea un equipo y responde 201 con el encabezado Location', function () {
    $categoria = Categoria::factory()->create();

    $payload = [
        'codigo' => 'EQ-1234',
        'nombre' => 'Impresora Epson L4260',
        'categoria_id' => $categoria->id,
        'estado' => 'disponible',
        'fecha_adquisicion' => now()->format('Y-m-d'),
        'costo_interno' => 250000,
    ];

    $response = $this->postJson('/api/equipos', $payload);

    $response->assertStatus(201);
    
    // Verificamos que el equipo exista en base de datos
    $this->assertDatabaseHas('equipos', [
        'codigo' => 'EQ-1234',
    ]);

    // Extraemos el ID del equipo recién creado para verificar el Location
    $equipoId = $response->json('data.id');
    $response->assertHeader('Location', route('equipos.show', $equipoId));
});

it('rechaza un equipo con datos inválidos y responde 422 con errores por campo', function () {
    $payloadInvalido = [
        'codigo' => 'CODIGO-MALO', // Falla regex y tamaño
        'nombre' => 'A',           // Falla min:3
        // Falta categoria_id
        'estado' => 'prestado',    // Falla in:disponible,mantenimiento
        'fecha_adquisicion' => now()->addDays(2)->format('Y-m-d'), // Falla before_or_equal:today
        'costo_interno' => -500,   // Falla min:0
    ];

    $response = $this->postJson('/api/equipos', $payloadInvalido);

    $response->assertStatus(422)
             ->assertJsonValidationErrors([
                 'codigo',
                 'nombre',
                 'categoria_id',
                 'estado',
                 'fecha_adquisicion',
                 'costo_interno',
             ]);
});

it('impide eliminar un equipo prestado y responde 409', function () {
    // Necesitamos crear un equipo prestado usando el factory o DB directamente
    $equipo = Equipo::factory()->create([
        'estado' => 'prestado',
    ]);

    $response = $this->deleteJson('/api/equipos/' . $equipo->id);

    $response->assertStatus(409)
             ->assertJsonFragment([
                 'codigo' => 'REGLA_NEGOCIO',
                 'mensaje' => 'No se puede eliminar un equipo prestado.',
             ]);

    // Verificamos que el equipo no haya sido borrado de la base de datos
    $this->assertDatabaseHas('equipos', [
        'id' => $equipo->id,
        'estado' => 'prestado',
    ]);
});