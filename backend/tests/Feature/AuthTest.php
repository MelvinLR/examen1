<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;

/*
| PRUEBAS DE EJEMPLO — ya pasan. Úselas como referencia de sintaxis.
*/

it('emite un token con credenciales válidas', function () {
    User::factory()->create([
        'email'    => 'ana@ucr.ac.cr',
        'password' => 'Secreta123!',
    ]);

    $this->postJson('/api/login', [
        'email'    => 'ana@ucr.ac.cr',
        'password' => 'Secreta123!',
    ])
        ->assertOk()
        ->assertJsonStructure(['token', 'usuario' => ['id', 'nombre']]);
});

it('rechaza credenciales incorrectas sin revelar si la cuenta existe', function () {
    $this->postJson('/api/login', [
        'email'    => 'nadie@ucr.ac.cr',
        'password' => 'loquesea',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

it('exige token para consultar la API', function () {
    $this->getJson('/api/categorias')->assertUnauthorized();
});

it('lista categorías con un token válido', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->getJson('/api/categorias')
        ->assertOk()
        ->assertJsonStructure(['data']);
});
