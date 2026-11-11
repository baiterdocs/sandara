// backend/leads.web.js — captura del pop-up de salida. Colección "Leads" con permisos SOLO admin.
import { Permissions, webMethod } from 'wix-web-module';
import wixData from 'wix-data';
import { RX_EMAIL, limpiarEmail, limpiarCelular, texto } from 'backend/validar';
import { enviarEventoMeta } from 'backend/meta-capi';
import { COL_LEADS, CUPON_BIENVENIDA } from 'backend/config';

const SYS = { suppressAuth: true };
const DIA = 24 * 3600 * 1000;

export const guardarLead = webMethod(Permissions.Anyone, async (entrada = {}) => {
  // 1. Validación servidor (el front puede ser manipulado)
  const email = limpiarEmail(entrada.email);
  const telefono = limpiarCelular(entrada.telefono);
  if (!RX_EMAIL.test(email)) return { ok: false, campo: 'email', error: 'Correo no válido' };
  if (entrada.telefono && !telefono) return { ok: false, campo: 'telefono', error: 'Celular no válido' };
  if (entrada.consentimiento !== true) return { ok: false, campo: 'consentimiento', error: 'Acepta para continuar' };
  if (entrada.web) return { ok: true, cupon: CUPON_BIENVENIDA }; // honeypot: bot, no guardar

  // 2. Anti-duplicado / anti-abuso: mismo correo en 24 h → devolver mismo resultado
  const previo = await wixData.query(COL_LEADS).eq('email', email).descending('_createdDate').limit(1).find(SYS);
  if (previo.items.length && Date.now() - new Date(previo.items[0]._createdDate).getTime() < DIA) {
    return { ok: true, cupon: CUPON_BIENVENIDA, repetido: true };
  }

  // 3. Guardar
  const item = await wixData.insert(COL_LEADS, {
    email,
    telefono,
    origen: texto(entrada.origen, 40) || 'exit-intent',
    pagina: texto(entrada.url, 300),
    consentimiento: true,
    utm: texto(entrada.utm, 200),
  }, SYS);

  // 4. Meta CAPI (Lead solo servidor → sin duplicado con navegador)
  enviarEventoMeta({
    nombre: 'Lead', id: `lead_${item._id}`, url: entrada.url,
    email, telefono, fbp: texto(entrada.fbp, 100), fbc: texto(entrada.fbc, 200), ua: texto(entrada.ua, 400),
  }).catch(() => {});

  return { ok: true, cupon: CUPON_BIENVENIDA };
});
