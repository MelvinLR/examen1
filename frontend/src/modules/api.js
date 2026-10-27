import { BASE_URL, TIEMPO_MAXIMO_MS } from "./config.js";
import { ErrorApi } from "./errores.js";
import { obtenerToken, olvidarSesion } from "./auth.js";

/**
 * TODO [F1] Cliente HTTP único de la aplicación.
 *
 * request(ruta, opciones) debe:
 *  1. Construir la URL como BASE_URL + ruta   (ej. request("/equipos?page=2"))
 *  2. Enviar siempre "Accept: application/json".
 *  3. Si hay token, enviar "Authorization: Bearer <token>" (nunca en la URL).
 *  4. Si opciones.body es un objeto, enviarlo como JSON
 *     ("Content-Type: application/json" + JSON.stringify).
 *  5. Cancelar la petición si tarda más de TIEMPO_MAXIMO_MS (AbortController).
 *  6. Si la respuesta es 204, devolver null.
 *  7. Si response.ok es false, lanzar new ErrorApi(response.status, cuerpoJson).
 *     Si el estado es 401, además llamar a olvidarSesion() y recargar la página.
 *  8. En cualquier otro caso, devolver el cuerpo JSON.
 *
 * Ningún otro archivo debe llamar a fetch directamente (salvo auth.js, ya hecho).
 */
export const request = async (ruta, opciones = {}) => {
  // 1. Construir la URL
  const url = `${BASE_URL}${ruta}`;

  // 2 y 3. Preparar encabezados obligatorios y de autenticación
  const headers = new Headers(opciones.headers || {});
  headers.set("Accept", "application/json");

  const token = obtenerToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // 4. Si hay cuerpo y es un objeto, serializarlo y setear el Content-Type
  let body = opciones.body;
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  // 5. Configurar el AbortController para el límite de tiempo
  const controller = new AbortController();
  const idTiempo = setTimeout(() => controller.abort(), TIEMPO_MAXIMO_MS);

  // Armar la configuración final para fetch
  const fetchOptions = {
    ...opciones,
    headers,
    body,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, fetchOptions);
    
    // 6. Manejo especial para 204 No Content
    if (response.status === 204) {
      return null;
    }

    // Intentar extraer el cuerpo JSON (asumiendo que las demás respuestas devuelven JSON)
    let cuerpoJson;
    try {
      cuerpoJson = await response.json();
    } catch (e) {
      cuerpoJson = null; 
    }

    // 7. Manejo de respuestas no exitosas (4xx, 5xx)
    if (!response.ok) {
      if (response.status === 401) {
        olvidarSesion();
        window.location.reload();
      }
      throw new ErrorApi(response.status, cuerpoJson);
    }

    // 8. Caso exitoso (200, 201, etc.)
    return cuerpoJson;

  } finally {
    // Limpiar el timeout siempre, ya sea que la petición falle o tenga éxito
    clearTimeout(idTiempo);
  }
};
