// YA IMPLEMENTADO — no forma parte de lo que se evalúa.
// Usa fetch directamente para que el inicio de sesión funcione
// aunque api.js todavía no esté terminado.
import { BASE_URL } from "./config.js";
import { ErrorApi } from "./errores.js";

const CLAVE_TOKEN = "examen1.token";
const CLAVE_USUARIO = "examen1.usuario";

export const obtenerToken = () => sessionStorage.getItem(CLAVE_TOKEN);

export const haySesion = () => Boolean(obtenerToken());

export const nombreUsuario = () => sessionStorage.getItem(CLAVE_USUARIO) ?? "";

export const iniciarSesion = async (email, password) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const datos = await response.json().catch(() => ({}));
  if (!response.ok) throw new ErrorApi(response.status, datos);

  sessionStorage.setItem(CLAVE_TOKEN, datos.token);
  sessionStorage.setItem(CLAVE_USUARIO, datos.usuario?.nombre ?? "");
  return datos.usuario;
};

export const cerrarSesion = async () => {
  try {
    await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      headers: { "Accept": "application/json", "Authorization": `Bearer ${obtenerToken()}` },
    });
  } finally {
    sessionStorage.removeItem(CLAVE_TOKEN);
    sessionStorage.removeItem(CLAVE_USUARIO);
  }
};

// Se llama cuando la API responde 401 (token vencido o revocado)
export const olvidarSesion = () => {
  sessionStorage.removeItem(CLAVE_TOKEN);
  sessionStorage.removeItem(CLAVE_USUARIO);
};
