// backend/carrito.web.js — cálculos del carrito en servidor (precios nunca vienen del cliente).
import { Permissions, webMethod } from 'wix-web-module';
import { currentCart } from 'wix-ecom-backend';
import { UMBRAL_ENVIO_GRATIS } from 'backend/config';

const n = (x) => Number.parseFloat(x?.amount ?? 0) || 0;

// Barra de envío gratis + resumen. Llamar desde carrito, producto y masterPage.
export const resumenCarrito = webMethod(Permissions.Anyone, async () => {
  try {
    const t = await currentCart.estimateCurrentCartTotals();
    const subtotal = n(t?.priceSummary?.subtotal);
    const unidades = (t?.lineItems || []).reduce((s, li) => s + (li.quantity || 0), 0);
    const falta = Math.max(0, +(UMBRAL_ENVIO_GRATIS - subtotal).toFixed(2));
    return {
      unidades,
      subtotal,
      subtotalTxt: t?.priceSummary?.subtotal?.formattedAmount || 'S/ 0.00',
      umbral: UMBRAL_ENVIO_GRATIS,
      falta,
      progreso: Math.min(100, Math.round((subtotal / UMBRAL_ENVIO_GRATIS) * 100)),
      envioGratis: falta === 0 && subtotal > 0,
    };
  } catch (e) {
    // Carrito inexistente = vacío (primer visita).
    return { unidades: 0, subtotal: 0, subtotalTxt: 'S/ 0.00', umbral: UMBRAL_ENVIO_GRATIS,
             falta: UMBRAL_ENVIO_GRATIS, progreso: 0, envioGratis: false };
  }
});
