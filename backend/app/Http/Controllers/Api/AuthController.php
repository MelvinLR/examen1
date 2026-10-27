<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * YA IMPLEMENTADO — no forma parte de lo que se evalúa.
 */
class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $usuario = User::where('email', $request->email)->first();

        // Mensaje idéntico exista o no la cuenta: evita enumerar cuentas
        if (! $usuario || ! Hash::check($request->password, $usuario->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        $token = $usuario->createToken('examen', ['*'], now()->addHours(5));

        return response()->json([
            'token'   => $token->plainTextToken,
            'usuario' => ['id' => $usuario->id, 'nombre' => $usuario->name],
        ]);
    }

    public function logout(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }
}
