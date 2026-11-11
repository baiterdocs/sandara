// public/pixel-eventos.js — eventos de navegador que la integración nativa de Wix NO envía.
// Requiere: Marketing Integrations > Meta Pixel & CAPI conectado (ya cubre PageView, ViewContent,
// AddToCart, InitiateCheckout, Purchase). No pegar el código base del Pixel a mano: duplicaría todo.
// Instalar el paquete "@wix/site" desde Packages & Apps del editor.
import { analytics } from '@wix/site';

// Clic en WhatsApp (intención de compra conversacional)
export const trackWhatsApp = (producto) =>
  analytics.trackEvent('CustomEvent', {
    eventCategory: 'contacto', eventAction: 'whatsapp', eventLabel: producto || 'general',
  });

// Clic en "Unirme al canal" / Instagram
export const trackCanal = (canal) =>
  analytics.trackEvent('CustomEvent', { eventCategory: 'comunidad', eventAction: canal });

// Uso: import { trackWhatsApp } from 'public/pixel-eventos';
//      $w('#btnWhatsApp').onClick(() => trackWhatsApp(p.name));
// Lead NO se envía desde aquí: va solo por CAPI en backend/leads.web.js (evita doble conteo).
