// backend/secretos.js — lectura de secretos con permisos elevados (no exportar a frontend).
import { secrets } from 'wix-secrets-backend.v2';
import { elevate } from 'wix-auth';

const leer = elevate(secrets.getSecretValue);
const cache = new Map();

export async function secreto(nombre) {
  if (cache.has(nombre)) return cache.get(nombre);
  try {
    const { value } = await leer(nombre);
    cache.set(nombre, value || '');
    return value || '';
  } catch (e) {
    return '';
  }
}
