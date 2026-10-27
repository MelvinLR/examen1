<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Toda respuesta bajo /api es JSON (401, 403, 404, 422...)
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // ---------------------------------------------------------------
        // TODO [B5] Manejo centralizado de errores
        //
        // Traduzca App\Exceptions\ReglaNegocioException a una respuesta
        // JSON con código 409 y el cuerpo:
        //
        //     { "mensaje": "<mensaje de la excepción>", "codigo": "REGLA_NEGOCIO" }
        //
        // Además, evite que estas excepciones se registren en la bitácora:
        // no son errores del sistema, son reglas del dominio.
        // ---------------------------------------------------------------
    })->create();
