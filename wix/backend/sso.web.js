// backend/sso.web.js — SSO propio (Google / Meta). Verifica el token en servidor ANTES de emitir sesión.
// Apple: usar el login social nativo de Wix (Ajustes > Miembros > Registro e inicio de sesión).
import { Permissions, webMethod } from 'wix-web-module';
import { authentication } from 'wix-members-backend';
import { fetch } from 'wix-fetch';
import { secreto } from 'backend/secretos';
import { SECRET } from 'backend/config';
import { RX_EMAIL, limpiarEmail } from 'backend/validar';

const FALLO = { ok: false, error: 'No pudimos verificar tu cuenta.' };
const tokenValido = (t) => typeof t === 'string' && t.length > 20 && t.length < 4096;

async function sesionPara(email) {
  email = limpiarEmail(email);
  if (!RX_EMAIL.test(email)) return FALLO;
  const sessionToken = await authentication.generateSessionToken(email); // crea miembro si no existe
  return { ok: true, sessionToken };
}

// Google Identity Services → credential (ID token JWT)
export const loginGoogle = webMethod(Permissions.Anyone, async (idToken) => {
  if (!tokenValido(idToken)) return FALLO;
  try {
    const clientId = await secreto(SECRET.GOOGLE_CLIENT_ID);
    const r = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken));
    if (!r.ok) return FALLO;
    const c = await r.json();
    const ahora = Math.floor(Date.now() / 1000);
    const valido = c.aud === clientId
      && ['accounts.google.com', 'https://accounts.google.com'].includes(c.iss)
      && String(c.email_verified) === 'true'
      && Number(c.exp) > ahora;
    return valido ? await sesionPara(c.email) : FALLO;
  } catch (e) { return FALLO; }
});

// Facebook Login (JS SDK) → accessToken de usuario
export const loginMeta = webMethod(Permissions.Anyone, async (accessToken) => {
  if (!tokenValido(accessToken)) return FALLO;
  try {
    const [appId, appSecret] = await Promise.all([secreto(SECRET.META_APP_ID), secreto(SECRET.META_APP_SECRET)]);
    const app = `${appId}|${appSecret}`;
    const dbg = await (await fetch(`https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(app)}`)).json();
    const d = dbg?.data;
    if (!d?.is_valid || String(d.app_id) !== String(appId)) return FALLO;
    const yo = await (await fetch(`https://graph.facebook.com/me?fields=email&access_token=${encodeURIComponent(accessToken)}`)).json();
    return yo?.email ? await sesionPara(yo.email) : { ok: false, error: 'Tu cuenta de Facebook no comparte un correo.' };
  } catch (e) { return FALLO; }
});
