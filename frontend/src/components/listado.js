import { listarEquipos, eliminarEquipo } from "../modules/equipos.js";
import { mostrarMensaje } from "./mensajes.js";

const POR_PAGINA = 6;

const $lista = document.querySelector("#lista-equipos");
const $plantilla = document.querySelector("#tpl-equipo");
const $resumen = document.querySelector("#resumen");
const $paginaActual = document.querySelector("#pagina-actual");
const $btnAnterior = document.querySelector("#btn-anterior");
const $btnSiguiente = document.querySelector("#btn-siguiente");

let paginaActual = 1;
let ultimaPagina = 1;

// YA IMPLEMENTADO — "2026-09-15" -> "15 set 2026"
export const formatearFecha = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("es-CR", { day: "numeric", month: "short", year: "numeric" });

/**
 * TODO [F2] Listado y paginación.
 */
export const cargarPagina = async (pagina = 1) => {
  $lista.setAttribute("aria-busy", "true");

  try {
    const respuesta = await listarEquipos(pagina, POR_PAGINA);
    const { data: equipos, meta } = respuesta;

    $lista.innerHTML = ""; // Vaciar lista antes de renderizar

    if (equipos.length === 0) {
      const $liVacio = document.createElement("li");
      $liVacio.className = "vacio";
      $liVacio.textContent = "No hay equipos registrados.";
      $lista.appendChild($liVacio);
      
      // Limpiar textos de resumen si no hay datos
      $resumen.textContent = "";
      $paginaActual.textContent = "";
      $btnAnterior.disabled = true;
      $btnSiguiente.disabled = true;
    } else {
      const fragmento = document.createDocumentFragment();

      equipos.forEach((equipo) => {
        // Clonar el contenido de la plantilla
        const clon = $plantilla.content.cloneNode(true);
        const $li = clon.querySelector("li");
        
        $li.dataset.id = equipo.id;

        // Asignar los datos usando estrictamente textContent por seguridad
        clon.querySelector(".codigo").textContent = equipo.codigo;
        clon.querySelector(".nombre").textContent = equipo.nombre;
        clon.querySelector(".categoria").textContent = equipo.categoria.nombre;
        clon.querySelector(".fecha").textContent = formatearFecha(equipo.fecha_adquisicion);
        
        const $estado = clon.querySelector(".estado");
        $estado.textContent = equipo.estado;
        $estado.dataset.estado = equipo.estado;

        fragmento.appendChild(clon);
      });

      $lista.appendChild(fragmento);

      // Actualizar metadatos de paginación
      paginaActual = meta.current_page;
      ultimaPagina = meta.last_page;

      $resumen.textContent = `Mostrando ${meta.from}–${meta.to} de ${meta.total}`;
      $paginaActual.textContent = `Página ${paginaActual} de ${ultimaPagina}`;

      // Deshabilitar botones en los extremos
      $btnAnterior.disabled = (paginaActual === 1);
      $btnSiguiente.disabled = (paginaActual === ultimaPagina);
    }
  } catch (error) {
    mostrarMensaje("error", error.message || "No se pudo cargar la lista de equipos.");
  } finally {
    $lista.removeAttribute("aria-busy");
  }
};

/**
 * TODO [F4] Eliminación con manejo de reglas de negocio.
 */
const alHacerClicEnLista = async (evento) => {
  const btnEliminar = evento.target.closest(".btn-eliminar");
  
  if (!btnEliminar) return; // Salir si el clic no fue en un botón de eliminar (delegación)

  const $li = btnEliminar.closest("li");
  const id = $li.dataset.id;
  
  const confirmado = confirm("¿Estás seguro de que deseas eliminar este equipo?");
  if (!confirmado) return;

  try {
    await eliminarEquipo(id);
    mostrarMensaje("exito", "Equipo eliminado.");

    // Manejo inteligente de la paginación post-eliminación
    const cantidadEnPantalla = $lista.querySelectorAll("li:not(.vacio)").length;
    
    if (cantidadEnPantalla === 1 && paginaActual > 1) {
      // Si era el último en la pantalla y no es la primera página, retroceder.
      cargarPagina(paginaActual - 1);
    } else {
      cargarPagina(paginaActual);
    }

  } catch (error) {
    // Si la API devolvió 409, el cuerpo JSON estará en error.datos gracias a ErrorApi
    if (error.status === 409 && error.datos?.mensaje) {
      mostrarMensaje("error", error.datos.mensaje);
    } else {
      mostrarMensaje("error", "No se pudo eliminar el equipo.");
    }
  }
};

// Parcialmente implementado: complete el TODO de los botones de paginación.
export const iniciarListado = () => {
  $lista.addEventListener("click", alHacerClicEnLista);

  // TODO [F2] Conecte #btn-anterior y #btn-siguiente con cargarPagina()
  $btnAnterior.addEventListener("click", () => {
    if (paginaActual > 1) {
      cargarPagina(paginaActual - 1);
    }
  });

  $btnSiguiente.addEventListener("click", () => {
    if (paginaActual < ultimaPagina) {
      cargarPagina(paginaActual + 1);
    }
  });

  cargarPagina(1);
};