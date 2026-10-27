// YA IMPLEMENTADO
// Error que representa una respuesta HTTP no exitosa de la API.
//   err.status -> código de estado (401, 404, 409, 422, 500...)
//   err.datos  -> cuerpo JSON de la respuesta ({ message, errors } o { mensaje, codigo })
export class ErrorApi extends Error {
  constructor(status, datos = {}) {
    super(datos.mensaje ?? datos.message ?? `Error HTTP ${status}`);
    this.name = "ErrorApi";
    this.status = status;
    this.datos = datos;
  }
}
