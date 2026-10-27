import { request } from "./api.js";

// YA IMPLEMENTADO — ejemplo de uso de request()
// Respuesta: { data: [ { id, nombre }, ... ] }
export const listarCategorias = () => request("/categorias");

/**
 * TODO [F1] Funciones de acceso a la API de equipos.
 * Todas deben usar request(); ninguna llama a fetch.
 */

// GET /equipos?page=<pagina>&per_page=<porPagina>
// Respuesta: { data: [...], links: {...}, meta: { current_page, last_page, from, to, total, ... } }
export const listarEquipos = (pagina = 1, porPagina = 6) => {
  return request(`/equipos?page=${pagina}&per_page=${porPagina}`, {
    method: "GET" // Aunque GET es el default, es buena práctica explicitarlo o se puede omitir el objeto de opciones
  });
};

// POST /equipos   -> 201 con el equipo creado | 422 con { message, errors }
export const crearEquipo = (datos) => {
  return request("/equipos", {
    method: "POST",
    body: datos
  });
};

// DELETE /equipos/<id>   -> 204 | 404 | 409 con { mensaje, codigo }
export const eliminarEquipo = (id) => {
  return request(`/equipos/${id}`, {
    method: "DELETE"
  });
};
