// backend/validar.js — validaciones compartidas (la verdad está en el backend).
export const RX_EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;

export function limpiarEmail(v) {
  return String(v || '').trim().toLowerCase().slice(0, 254);
}

// Celular Perú: 9 dígitos que empiezan en 9. Acepta +51 / 51 / espacios / guiones.
export function limpiarCelular(v) {
  const d = String(v || '').replace(/\D/g, '').replace(/^51(?=9\d{8}$)/, '');
  return /^9\d{8}$/.test(d) ? d : '';
}

export function texto(v, max = 120) {
  return String(v || '').replace(/[<>]/g, '').trim().slice(0, max);
}
