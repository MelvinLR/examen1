// YA IMPLEMENTADO
// La URL base se toma del archivo .env (variable VITE_API_URL).
export const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export const TIEMPO_MAXIMO_MS = 8000;
