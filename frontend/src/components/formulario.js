import { crearEquipo, listarCategorias } from "../modules/equipos.js";
import { mostrarMensaje } from "./mensajes.js";

const $form = document.querySelector("#form-equipo");
const $selectCategoria = document.querySelector("#categoria_id");
const $btnGuardar = document.querySelector("#btn-guardar");

/**
 * TODO [F3] Formulario de registro de equipos.
 */
export const iniciarFormulario = async ({ alGuardar }) => {
  // 1. Cargar el select de categorías
  try {
    const respuesta = await listarCategorias();
    const categorias = respuesta.data;

    // Crear un fragmento para no tocar el DOM en cada iteración
    const fragmento = document.createDocumentFragment();

    categorias.forEach((cat) => {
      const $opcion = document.createElement("option");
      $opcion.value = cat.id;
      $opcion.textContent = cat.nombre;
      fragmento.appendChild($opcion);
    });

    $selectCategoria.appendChild(fragmento);
  } catch (error) {
    mostrarMensaje("error", "No se pudieron cargar las categorías.");
  }

  // 2. Manejar el evento submit
  $form.addEventListener("submit", async (evento) => {
    // Evitar recarga de la página
    evento.preventDefault();

    // Limpiar errores visuales anteriores del DOM
    const $mensajesError = $form.querySelectorAll("[data-error]");
    const $camposInvalidos = $form.querySelectorAll('[aria-invalid="true"]');

    $mensajesError.forEach($p => $p.textContent = "");
    $camposInvalidos.forEach($campo => $campo.removeAttribute("aria-invalid"));

    // Guardar el estado original del botón
    const textoOriginalBoton = $btnGuardar.textContent;

    try {
      // Extraer datos usando FormData
      const formData = new FormData($form);
      const datos = Object.fromEntries(formData.entries());

      // Forzar conversiones de tipo exigidas por el contrato (en caso de que el backend valide el JSON)
      if (datos.categoria_id) {
        datos.categoria_id = Number(datos.categoria_id);
      }
      if (datos.costo_interno) {
        datos.costo_interno = Number(datos.costo_interno);
      }

      // Deshabilitar botón y cambiar feedback visual
      $btnGuardar.disabled = true;
      $btnGuardar.textContent = "Guardando…";

      // Llamar a la API
      const respuesta = await crearEquipo(datos);
      
      // Manejo de éxito
      $form.reset();
      mostrarMensaje("exito", `Equipo ${respuesta.data.codigo} registrado.`);
      alGuardar(); // Disparador para recargar la lista de equipos en app.js

    } catch (error) {
      // Manejo de validaciones 422 de Laravel
      if (error.status === 422 && error.datos?.errors) {
        const errores = error.datos.errors;
        
        for (const [campo, mensajes] of Object.entries(errores)) {
          const $pError = $form.querySelector(`[data-error="${campo}"]`);
          const $inputCampo = $form.querySelector(`[name="${campo}"]`);

          if ($pError) {
            $pError.textContent = mensajes[0]; // Mostrar siempre el primer mensaje de error
          }
          if ($inputCampo) {
            $inputCampo.setAttribute("aria-invalid", "true");
          }
        }
      } else {
        // Fallo general (500, problemas de red, etc)
        mostrarMensaje("error", error.message || "Ocurrió un error al guardar el equipo.");
      }
    } finally {
      // Rehabilitar y restaurar el texto del botón siempre
      $btnGuardar.disabled = false;
      $btnGuardar.textContent = textoOriginalBoton;
    }
  });
};