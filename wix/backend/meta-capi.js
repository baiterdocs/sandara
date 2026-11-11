// backend/meta-capi.js — Meta Conversions API (servidor). Solo importable desde backend.
import { fetch } from 'wix-fetch';
import crypto from 'crypto';
import { secreto } from 'backend/secretos';
import { SECRET, MONEDA } from 'backend/config';

const GRAPH = 'https://graph.facebook.com/v21.0'; // actualizar a la versión vigente del Graph API
const sha = (v) => crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex');

/**
 * evento: { nombre, id, url, email?, telefono?, fbp?, fbc?, ua?, valor?, contenidos? }
 * id = event_id para deduplicar con el Pixel del navegador.
 */
export async function enviarEventoMeta(evento) {
  const [pixel, token, test] = await Promise.all([
    secreto(SECRET.META_PIXEL_ID), secreto(SECRET.META_CAPI_TOKEN), secreto(SECRET.META_TEST_CODE),
  ]);
  if (!pixel || !token) return { ok: false, motivo: 'sin-credenciales' };

  const user_data = {};
  if (evento.email) user_data.em = [sha(evento.email)];
  if (evento.telefono) user_data.ph = [sha('51' + evento.telefono)];
  if (evento.fbp) user_data.fbp = evento.fbp;
  if (evento.fbc) user_data.fbc = evento.fbc;
  if (evento.ua) user_data.client_user_agent = evento.ua;
  user_data.country = [sha('pe')];

  const data = [{
    event_name: evento.nombre,
    event_time: Math.floor(Date.now() / 1000),
    event_id: String(evento.id),
    action_source: 'website',
    event_source_url: evento.url || 'https://www.sandara.pe/',
    user_data,
    custom_data: evento.valor != null ? {
      currency: MONEDA, value: Number(evento.valor),
      content_type: 'product', contents: evento.contenidos || [],
    } : undefined,
  }];

  const body = { data, access_token: token };
  if (test) body.test_event_code = test;

  const r = await fetch(`${GRAPH}/${pixel}/events`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { ok: r.ok, status: r.status };
}
