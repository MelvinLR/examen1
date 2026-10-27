// YA IMPLEMENTADO
// Muestra un aviso temporal en la región #mensajes (aria-live).
//   tipo: "exito" | "error" | "info"
export const mostrarMensaje = (tipo, texto, duracionMs = 4500) => {
  const contenedor = document.querySelector("#mensajes");
  const aviso = document.createElement("div");
  aviso.className = `mensaje mensaje-${tipo}`;
  aviso.textContent = texto;
  contenedor.append(aviso);
  setTimeout(() => aviso.remove(), duracionMs);
};
