// YA IMPLEMENTADO — punto de entrada. Conecta las vistas con los módulos.
import "./styles/base.css";
import "./styles/layout.css";

import { haySesion, iniciarSesion, cerrarSesion, nombreUsuario } from "./modules/auth.js";
import { iniciarListado, cargarPagina } from "./components/listado.js";
import { iniciarFormulario } from "./components/formulario.js";
import { mostrarMensaje } from "./components/mensajes.js";

const $vistaLogin = document.querySelector("#vista-login");
const $vistaApp = document.querySelector("#vista-app");
const $sesion = document.querySelector("#sesion");
const $formLogin = document.querySelector("#form-login");

const mostrarApp = () => {
  $vistaLogin.hidden = true;
  $vistaApp.hidden = false;
  $sesion.hidden = false;
  document.querySelector("#usuario-nombre").textContent = nombreUsuario();

  iniciarFormulario({ alGuardar: () => cargarPagina(1) });
  iniciarListado();
};

const mostrarLogin = () => {
  $vistaApp.hidden = true;
  $sesion.hidden = true;
  $vistaLogin.hidden = false;
  $formLogin.querySelector("input").focus();
};

$formLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  $formLogin.querySelectorAll("[data-error]").forEach(($p) => ($p.textContent = ""));

  const datos = new FormData($formLogin);
  try {
    await iniciarSesion(datos.get("email"), datos.get("password"));
    mostrarApp();
  } catch (error) {
    if (error.status === 422) {
      for (const [campo, [mensaje]] of Object.entries(error.datos.errors ?? {})) {
        const $error = $formLogin.querySelector(`[data-error="${campo}"]`);
        if ($error) $error.textContent = mensaje;
      }
    } else {
      mostrarMensaje("error", "No fue posible conectar con la API. ¿Está en ejecución?");
    }
  }
});

document.querySelector("#btn-salir").addEventListener("click", async () => {
  await cerrarSesion();
  window.location.reload();
});

haySesion() ? mostrarApp() : mostrarLogin();
