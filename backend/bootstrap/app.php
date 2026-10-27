<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use App\Exceptions\ReglaNegocioException; // Importación necesaria

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
        // ---------------------------------------------------------------
        
        // 1. Evitar que la excepción se registre en la bitácora (logs)
        $exceptions->dontReport(ReglaNegocioException::class);

        // 2. Renderizar la excepción como una respuesta JSON 409
        $exceptions->render(function (ReglaNegocioException $e, Request $request) {
            return response()->json([
                'mensaje' => $e->getMessage(),
                'codigo' => 'REGLA_NEGOCIO'
            ], 409);
        });
    })->create();
