<?php

namespace App\Exceptions;

use RuntimeException;

/**
 * Se lanza desde la capa de servicio cuando una regla del dominio
 * impide la operación. La capa de servicio NO conoce HTTP: la traducción
 * a un código de estado se hace en un único lugar (bootstrap/app.php).
 */
class ReglaNegocioException extends RuntimeException
{
}
