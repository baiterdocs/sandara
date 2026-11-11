// backend/config.js — valores de negocio. Editar aquí, nunca en el frontend.
export const MONEDA = 'PEN';
export const UMBRAL_ENVIO_GRATIS = 300;     // S/ — verificado en Ajustes > Envíos el 11/11/2026
export const MAX_UNIDADES_POR_PIEZA = 5;    // checkout bloquea >5 por pieza
export const CUPON_BIENVENIDA = 'BIENVENIDA10'; // crear en Marketing > Cupones antes de publicar
export const COL_LEADS = 'Leads';

// Secretos (Wix > Ajustes > Secrets Manager). Solo nombres; los valores viven en Wix.
export const SECRET = {
  META_PIXEL_ID: 'META_PIXEL_ID',
  META_CAPI_TOKEN: 'META_CAPI_TOKEN',
  META_TEST_CODE: 'META_TEST_EVENT_CODE',   // vacío en producción
  GOOGLE_CLIENT_ID: 'GOOGLE_CLIENT_ID',
  META_APP_ID: 'META_APP_ID',
  META_APP_SECRET: 'META_APP_SECRET',
};
