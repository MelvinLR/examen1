// =========================================================================
// API SIMULADA — YA IMPLEMENTADA
//
// Reproduce el contrato de la API Laravel para que el front-end pueda
// desarrollarse y calificarse aunque el back-end no esté terminado.
//
//   npm run mock          -> http://localhost:3001/api
//   Usuario: docente@ucr.ac.cr  ·  Contraseña: Examen2026!
//
// Los datos viven en memoria: se reinician al detener el servidor.
// No requiere dependencias (solo Node.js).
// =========================================================================
import { createServer } from "node:http";

const PUERTO = Number(process.env.PORT ?? 3001);
const TOKEN = "mock-token-if0009";
const ESTADOS = ["disponible", "prestado", "mantenimiento"];

const categorias = [
  { id: 1, nombre: "Cómputo" },
  { id: 2, nombre: "Audiovisual" },
  { id: 3, nombre: "Redes" },
  { id: 4, nombre: "Electrónica" },
];

const NOMBRES = [
  "Laptop Dell Latitude 5440", "Laptop Lenovo ThinkPad E14", "MacBook Air M3",
  "Proyector Epson PowerLite X49", "Proyector BenQ MW560", 'Pantalla interactiva Samsung 65"',
  "Cámara Canon EOS R50", "Micrófono inalámbrico Shure BLX24", "Parlante JBL EON710",
  "Switch Cisco Catalyst 1000 24p", "Router MikroTik hAP ax²", "Access point Ubiquiti U6 Lite",
  "Kit Arduino Uno R4", "Raspberry Pi 5 8 GB", "Multímetro Fluke 117", "Osciloscopio Rigol DS1054Z",
  "Tablet Samsung Galaxy Tab S9 FE", 'Monitor LG UltraWide 29"', "Disco externo WD 2 TB",
  "Probador de cable Fluke MicroScanner2",
];
const CATALOGO = { 1: [0, 1, 2, 16, 17, 18], 2: [3, 4, 5, 6, 7, 8], 3: [9, 10, 11, 19], 4: [12, 13, 14, 15] };

// Mismos datos que el DatabaseSeeder de Laravel
const equipos = [];
let n = 1;
fuera: for (let vuelta = 0; vuelta < 2; vuelta++) {
  for (const [cat, indices] of Object.entries(CATALOGO)) {
    for (const i of indices) {
      if (n > 25) break fuera;
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - 30 * n);
      equipos.push({
        id: n,
        codigo: `EQ-${String(n).padStart(4, "0")}`,
        nombre: NOMBRES[i],
        categoria_id: Number(cat),
        estado: n % 5 === 0 ? "prestado" : n % 7 === 0 ? "mantenimiento" : "disponible",
        fecha_adquisicion: fecha.toISOString().slice(0, 10),
      });
      n++;
    }
  }
}
let siguienteId = equipos.length + 1;

// ---------- utilidades ----------
const recurso = (e) => ({
  id: e.id,
  codigo: e.codigo,
  nombre: e.nombre,
  estado: e.estado,
  fecha_adquisicion: e.fecha_adquisicion,
  categoria: categorias.find((c) => c.id === e.categoria_id) ?? null,
});

const enviar = (res, status, cuerpo, extras = {}) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "Location",
    ...extras,
  });
  res.end(cuerpo === undefined ? "" : JSON.stringify(cuerpo));
};

const leerCuerpo = (req) =>
  new Promise((resolve) => {
    let datos = "";
    req.on("data", (trozo) => (datos += trozo));
    req.on("end", () => {
      try { resolve(datos ? JSON.parse(datos) : {}); } catch { resolve(null); }
    });
  });

const hoy = () => new Date().toISOString().slice(0, 10);

const validarEquipo = (d, idActual = null) => {
  const errores = {};
  const agregar = (campo, msg) => (errores[campo] ??= []).push(msg);

  if (!d.codigo) agregar("codigo", "El código es obligatorio.");
  else if (!/^EQ-\d{4}$/.test(d.codigo)) agregar("codigo", "El código debe tener el formato EQ-0000.");
  else if (equipos.some((e) => e.codigo === d.codigo && e.id !== idActual))
    agregar("codigo", "Ya existe un equipo con ese código.");

  if (!d.nombre) agregar("nombre", "El nombre es obligatorio.");
  else if (String(d.nombre).length < 3) agregar("nombre", "El nombre debe tener al menos 3 caracteres.");
  else if (String(d.nombre).length > 120) agregar("nombre", "El nombre no puede superar 120 caracteres.");

  if (d.categoria_id === undefined || d.categoria_id === null || d.categoria_id === "")
    agregar("categoria_id", "La categoría es obligatoria.");
  else if (!categorias.some((c) => c.id === Number(d.categoria_id)))
    agregar("categoria_id", "La categoría seleccionada no existe.");

  if (d.estado !== undefined && d.estado !== null && !["disponible", "mantenimiento"].includes(d.estado))
    agregar("estado", "El estado solo puede ser disponible o mantenimiento.");

  if (!d.fecha_adquisicion) agregar("fecha_adquisicion", "La fecha de adquisición es obligatoria.");
  else if (Number.isNaN(Date.parse(d.fecha_adquisicion))) agregar("fecha_adquisicion", "La fecha de adquisición no es válida.");
  else if (d.fecha_adquisicion > hoy()) agregar("fecha_adquisicion", "La fecha de adquisición no puede ser futura.");

  if (d.costo_interno === undefined || d.costo_interno === null || d.costo_interno === "")
    agregar("costo_interno", "El costo es obligatorio.");
  else if (Number.isNaN(Number(d.costo_interno))) agregar("costo_interno", "El costo debe ser un número.");
  else if (Number(d.costo_interno) < 0) agregar("costo_interno", "El costo no puede ser negativo.");

  return errores;
};

const errorValidacion = (res, errores) => {
  const [primero] = Object.values(errores);
  const extra = Object.values(errores).flat().length - 1;
  enviar(res, 422, {
    message: primero[0] + (extra > 0 ? ` (and ${extra} more error${extra > 1 ? "s" : ""})` : ""),
    errors: errores,
  });
};

const paginar = (lista, url, base) => {
  const porPagina = Math.max(1, Math.min(Number(url.searchParams.get("per_page") ?? 10) || 10, 50));
  const total = lista.length;
  const ultima = Math.max(1, Math.ceil(total / porPagina));
  const pagina = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
  const desde = (pagina - 1) * porPagina;
  const datos = lista.slice(desde, desde + porPagina);
  const enlace = (p) => (p >= 1 && p <= ultima ? `${base}?page=${p}` : null);

  return {
    data: datos.map(recurso),
    links: { first: enlace(1), last: enlace(ultima), prev: enlace(pagina - 1), next: enlace(pagina + 1) },
    meta: {
      current_page: pagina,
      from: datos.length ? desde + 1 : null,
      last_page: ultima,
      path: base,
      per_page: porPagina,
      to: datos.length ? desde + datos.length : null,
      total,
    },
  };
};

// ---------- servidor ----------
createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PUERTO}`);
  const base = `http://localhost:${PUERTO}/api/equipos`;
  const ruta = url.pathname.replace(/\/+$/, "");
  console.log(`${req.method} ${url.pathname}${url.search}`);

  if (req.method === "OPTIONS") {
    return enviar(res, 204, undefined, {
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Authorization,Content-Type,Accept",
    });
  }

  // Latencia artificial para poder observar los estados de carga
  await new Promise((r) => setTimeout(r, 350));

  if (req.method === "POST" && ruta === "/api/login") {
    const d = await leerCuerpo(req);
    if (!d) return enviar(res, 400, { message: "JSON mal formado." });
    const errores = {};
    if (!d.email) errores.email = ["El correo es obligatorio."];
    if (!d.password) errores.password = ["La contraseña es obligatoria."];
    if (Object.keys(errores).length) return errorValidacion(res, errores);
    if (d.email !== "docente@ucr.ac.cr" || d.password !== "Examen2026!")
      return errorValidacion(res, { email: ["Las credenciales proporcionadas son incorrectas."] });
    return enviar(res, 200, { token: TOKEN, usuario: { id: 1, nombre: "Docente IF0009" } });
  }

  if (req.headers.authorization !== `Bearer ${TOKEN}`) {
    return enviar(res, 401, { message: "Unauthenticated." });
  }

  if (req.method === "POST" && ruta === "/api/logout") return enviar(res, 204);

  if (req.method === "GET" && ruta === "/api/categorias") return enviar(res, 200, { data: categorias });

  if (ruta === "/api/equipos") {
    if (req.method === "GET") {
      const q = (url.searchParams.get("q") ?? "").toLowerCase();
      const estado = url.searchParams.get("estado");
      const filtrados = equipos
        .filter((e) => !q || e.codigo.toLowerCase().includes(q) || e.nombre.toLowerCase().includes(q))
        .filter((e) => !estado || e.estado === estado)
        .sort((a, b) => a.codigo.localeCompare(b.codigo));
      return enviar(res, 200, paginar(filtrados, url, base));
    }
    if (req.method === "POST") {
      const d = await leerCuerpo(req);
      if (!d) return enviar(res, 400, { message: "JSON mal formado." });
      const errores = validarEquipo(d);
      if (Object.keys(errores).length) return errorValidacion(res, errores);
      const nuevo = {
        id: siguienteId++,
        codigo: d.codigo,
        nombre: d.nombre,
        categoria_id: Number(d.categoria_id),
        estado: d.estado ?? "disponible",
        fecha_adquisicion: d.fecha_adquisicion,
      };
      equipos.push(nuevo);
      return enviar(res, 201, { data: recurso(nuevo) }, { Location: `${base}/${nuevo.id}` });
    }
  }

  const coincide = ruta.match(/^\/api\/equipos\/(\d+)(\/prestamo)?$/);
  if (coincide) {
    const equipo = equipos.find((e) => e.id === Number(coincide[1]));
    if (!equipo) return enviar(res, 404, { message: "Recurso no encontrado." });

    if (coincide[2] && req.method === "POST") {
      if (equipo.estado === "mantenimiento")
        return enviar(res, 409, { mensaje: "No se puede prestar un equipo en mantenimiento.", codigo: "REGLA_NEGOCIO" });
      if (equipo.estado === "prestado")
        return enviar(res, 409, { mensaje: "El equipo ya se encuentra prestado.", codigo: "REGLA_NEGOCIO" });
      equipo.estado = "prestado";
      return enviar(res, 200, { data: recurso(equipo) });
    }
    if (!coincide[2] && req.method === "GET") return enviar(res, 200, { data: recurso(equipo) });
    if (!coincide[2] && req.method === "PUT") {
      const d = await leerCuerpo(req);
      if (!d) return enviar(res, 400, { message: "JSON mal formado." });
      const errores = validarEquipo(d, equipo.id);
      if (Object.keys(errores).length) return errorValidacion(res, errores);
      Object.assign(equipo, {
        codigo: d.codigo, nombre: d.nombre, categoria_id: Number(d.categoria_id),
        fecha_adquisicion: d.fecha_adquisicion, ...(d.estado ? { estado: d.estado } : {}),
      });
      return enviar(res, 200, { data: recurso(equipo) });
    }
    if (!coincide[2] && req.method === "DELETE") {
      if (equipo.estado === "prestado")
        return enviar(res, 409, { mensaje: "No se puede eliminar un equipo prestado.", codigo: "REGLA_NEGOCIO" });
      equipos.splice(equipos.indexOf(equipo), 1);
      return enviar(res, 204);
    }
  }

  return enviar(res, 404, { message: "Recurso no encontrado." });
}).listen(PUERTO, () => {
  console.log(`API simulada en http://localhost:${PUERTO}/api`);
  console.log(`Usuario: docente@ucr.ac.cr  ·  Contraseña: Examen2026!  ·  Estados: ${ESTADOS.join(", ")}`);
});
