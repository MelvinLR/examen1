<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

/*
| Todas las pruebas de tests/Feature usan la base SQLite en memoria
| (ver phpunit.xml) y se ejecutan sobre una base limpia.
*/

pest()->extend(Tests\TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');
