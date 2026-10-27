# Back-end · API de Préstamo de Equipos

Laravel 13 · PHP 8.4+ · Sanctum · Pest · SQLite

Instrucciones completas en el [README principal](../README.md).

```bash
composer run setup     # primera vez
php artisan serve      # http://localhost:8000/api
php artisan test
```

## Contrato de la API

Todas las rutas, salvo `POST /api/login`, exigen `Authorization: Bearer <token>`.

| Método | Ruta | Respuestas |
|--------|------|------------|
| POST | `/api/login` | 200 `{ token, usuario }` · 422 |
| POST | `/api/logout` | 204 |
| GET | `/api/categorias` | 200 `{ data: [{ id, nombre }] }` |
| GET | `/api/equipos?page=&per_page=&q=&estado=` | 200 `{ data, links, meta }` (por omisión 10, tope 50) |
| GET | `/api/equipos/{id}` | 200 · 404 |
| POST | `/api/equipos` | 201 + `Location` · 422 |
| PUT | `/api/equipos/{id}` | 200 · 404 · 422 |
| DELETE | `/api/equipos/{id}` | 204 · 404 · 409 |
| POST | `/api/equipos/{id}/prestamo` | 200 · 404 · 409 |

Un equipo se representa así:

```json
{
  "id": 1,
  "codigo": "EQ-0001",
  "nombre": "Laptop Dell Latitude 5440",
  "estado": "disponible",
  "fecha_adquisicion": "2026-09-15",
  "categoria": { "id": 1, "nombre": "Cómputo" }
}
```

Un error de regla de negocio (409):

```json
{ "mensaje": "No se puede eliminar un equipo prestado.", "codigo": "REGLA_NEGOCIO" }
```
