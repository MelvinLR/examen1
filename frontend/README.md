# Front-end · Préstamo de Equipos

Vite · HTML · CSS · JavaScript ES Modules (sin frameworks)

Instrucciones completas en el [README principal](../README.md).

```bash
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
npm run mock       # API simulada en http://localhost:3001/api
```

## Estructura

```text
src/
├── main.js                  YA IMPLEMENTADO · arranque y cambio de vistas
├── modules/
│   ├── config.js            YA IMPLEMENTADO · URL base y tiempo máximo
│   ├── errores.js           YA IMPLEMENTADO · clase ErrorApi
│   ├── auth.js              YA IMPLEMENTADO · inicio y cierre de sesión
│   ├── api.js               TODO [F1] · cliente HTTP único
│   └── equipos.js           TODO [F1] · funciones de la API de equipos
├── components/
│   ├── mensajes.js          YA IMPLEMENTADO · avisos temporales
│   ├── listado.js           TODO [F2] [F4] · listado, paginación y eliminación
│   └── formulario.js        TODO [F3] · registro de equipos
└── styles/
    ├── base.css             YA IMPLEMENTADO · tokens y componentes
    └── layout.css           TODO [F5] · maquetación responsiva
```
