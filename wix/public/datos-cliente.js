// public/datos-cliente.js — "Recordar mis datos en este dispositivo" (opt-in, 90 días).
// Solo contacto y dirección de envío; nunca pagos. La interfaz debe conectar borrarDatos() a un control para olvidar los datos.
import { local } from 'wix-storage-frontend';

const KEY = 'sd_datos';
const TTL = 90 * 24 * 3600 * 1000;

export function leerDatos() {
  try {
    const v = JSON.parse(local.getItem(KEY) || 'null');
    if (!v || !Number.isFinite(v.t) || v.t > Date.now() || !v.d || Date.now() - v.t > TTL) { local.removeItem(KEY); return null; }
    return v.d;
  } catch (e) { return null; }
}
export const guardarDatos = (d) => {
  try { local.setItem(KEY, JSON.stringify({ t: Date.now(), d })); return true; }
  catch (e) { return false; } // El almacenamiento bloqueado no debe impedir la compra.
};
export const borrarDatos = () => local.removeItem(KEY);

// Validaciones amables (mismas reglas que backend/validar.js)
export const RX_EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;
export const celular = (v) => {
  const d = String(v || '').replace(/\D/g, '').replace(/^51(?=9\d{8}$)/, '');
  return /^9\d{8}$/.test(d) ? d : '';
};
export const formatoCelular = (v) => {
  const d = String(v || '').replace(/\D/g, '').replace(/^51/, '').slice(0, 9);
  return d.replace(/^(\d{3})(\d{0,3})(\d{0,3}).*/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '));
};
const DOMINIOS = { 'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmail.co': 'gmail.com', 'hotmal.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com', 'outlok.com': 'outlook.com', 'yahoo.co': 'yahoo.com' };
export const sugerirEmail = (v) => {
  const [u, dom] = String(v || '').trim().toLowerCase().split('@');
  return u && DOMINIOS[dom] ? `${u}@${DOMINIOS[dom]}` : '';
};
