# IF0009 · Examen I · Préstamo de Equipos

Universidad de Costa Rica · Sede de Guanacaste · II Ciclo 2026

Sistema para controlar el préstamo de equipos del laboratorio. El repositorio trae
**ya construida** la infraestructura (base de datos, autenticación, rutas, estructura
del front-end). Usted debe **completar** las capas marcadas con `TODO`.

```text
examen1/
├── backend/    API REST en Laravel 13 (PHP 8.4+)
└── frontend/   Cliente web en Vite + HTML + CSS + JavaScript (sin frameworks)
```

## 1. Puesta en marcha (≈15 min)

Requisitos: PHP **8.4 o superior**, Composer, Node.js 22 y Git.

```bash
# Back-end  → http://localhost:8000/api
cd backend
composer run setup        # instala, crea .env, genera clave, migra y siembra 25 equipos
php artisan serve
php artisan test          # 4 pruebas pasan, 3 quedan pendientes (son suyas)

# Front-end → http://localhost:5173   (en otra terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

**Credenciales:** `docente@ucr.ac.cr` · `Examen2026!`

### API simulada

Si su back-end todavía no responde, puede avanzar en el front-end contra una API
simulada que cumple el mismo contrato:

```bash
cd frontend
npm run mock              # http://localhost:3001/api
# en .env:  VITE_API_URL=http://localhost:3001/api   (y reinicie npm run dev)
```

## 2. Lo que usted debe completar

| Id | Archivo | Tarea |
|----|---------|-------|
| B1 | `backend/app/Http/Requests/GuardarEquipoRequest.php` | Validación con mensajes en español por campo |
| B2 | `backend/app/Services/EquipoService.php` | Listado, CRUD y reglas de negocio R1 y R2 |
| B3 | `backend/app/Http/Controllers/Api/EquipoController.php` | Controlador delgado con los códigos de estado del contrato |
| B4 | `backend/app/Http/Resources/EquipoResource.php` | Forma exacta de la respuesta |
| B5 | `backend/bootstrap/app.php` | Traducción de `ReglaNegocioException` a 409 |
| B6 | `backend/tests/Feature/EquipoApiTest.php` | Tres pruebas Pest |
| F1 | `frontend/src/modules/api.js` y `equipos.js` | Cliente HTTP único y funciones de la API |
| F2 | `frontend/src/components/listado.js` | Listado con plantilla y paginación |
| F3 | `frontend/src/components/formulario.js` | Registro con errores 422 por campo |
| F4 | `frontend/src/components/listado.js` | Eliminación con manejo del 409 |
| F5 | `frontend/src/styles/layout.css` | Maquetación responsiva |

Cada archivo describe en su comentario `TODO` exactamente lo que se espera.

## 3. Reglas

- No modifique los archivos marcados **YA IMPLEMENTADO**, ni `routes/api.php`, ni las migraciones.
- Haga *commit* y *push* con frecuencia. Se califica el último *commit* enviado **antes de las 11:00 a. m.**
- Trabajo individual. Puede consultar cualquier material, incluidas herramientas de inteligencia
  artificial. No se permite comunicarse con otras personas.
- El front-end se califica contra **su** back-end; si este no responde, contra la API simulada.
- **Usted responde por cada línea de este repositorio**, la haya escrito usted o una herramienta.
  A las 11:00 se entrega la Parte B (en papel, sin computadora), con preguntas sobre su propio código.
  Lea y entienda lo que envía.
