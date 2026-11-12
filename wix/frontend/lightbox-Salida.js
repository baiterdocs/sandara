// Lightbox "Salida" — pop-up de retención con validación en tiempo real.
// Elementos: #txtTitulo #txtSub #inEmail #inCel #chkAcepto #inWeb(honeypot, oculto/colapsado)
//            #txtErrEmail #txtErrCel #btnEnviar #boxForm #boxExito #txtCupon #btnCopiar #btnCerrar
import wixWindowFrontend from 'wix-window-frontend';
import { local } from 'wix-storage-frontend';
import { guardarLead } from 'backend/leads.web';

const RX_EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;
const celular = (v) => { const d = String(v).replace(/\D/g, '').replace(/^51(?=9\d{8}$)/, ''); return /^9\d{8}$/.test(d) ? d : ''; };
const ctx = wixWindowFrontend.lightbox.getContext() || {};
const tocado = { email: false, cel: false };
let t;

$w.onReady(() => {
  const c = ctx.carrito;
  if (c?.unidades > 0 && !c.envioGratis) {
    $w('#txtTitulo').text = '¿Te vas tan pronto?';
    $w('#txtSub').text = `Te faltan S/ ${c.falta.toFixed(2)} para envío gratis. Déjanos tu correo y consulta aquí tu código de 10% de descuento.`;
  } else {
    $w('#txtTitulo').text = 'Tu primera joya, 10% menos';
    $w('#txtSub').text = 'Déjanos tu correo y recibe tu código al instante.';
  }
  $w('#boxExito').collapse();
  $w('#txtErrEmail').collapse(); $w('#txtErrCel').collapse();
  $w('#btnEnviar').disable();

  $w('#inEmail').onInput(() => debounce(validar));
  $w('#inCel').onInput(() => debounce(validar));
  $w('#inEmail').onBlur(() => { tocado.email = true; validar(); });
  $w('#inCel').onBlur(() => { tocado.cel = true; validar(); });
  $w('#chkAcepto').onChange(validar);
  $w('#btnEnviar').onClick(enviar);
  $w('#btnCerrar').onClick(() => wixWindowFrontend.lightbox.close());
  $w('#btnCopiar').onClick(() => wixWindowFrontend.copyToClipboard($w('#txtCupon').text)
    .then(() => { $w('#btnCopiar').label = 'COPIADO ✓'; }));
});

function debounce(fn) { clearTimeout(t); t = setTimeout(fn, 250); }

function err(id, msg) {
  if (msg) { $w(id).text = msg; $w(id).expand(); } else { $w(id).collapse(); }
}

function validar() {
  const email = $w('#inEmail').value.trim();
  const cel = $w('#inCel').value.trim();
  const okEmail = RX_EMAIL.test(email);
  const okCel = !cel || !!celular(cel);
  err('#txtErrEmail', tocado.email && !okEmail ? 'Revisa tu correo (ej. nombre@gmail.com)' : '');
  err('#txtErrCel', tocado.cel && !okCel ? 'Celular de 9 dígitos que empiece en 9' : '');
  const ok = okEmail && okCel && $w('#chkAcepto').checked;
  ok ? $w('#btnEnviar').enable() : $w('#btnEnviar').disable();
  return ok;
}

async function enviar() {
  tocado.email = tocado.cel = true;
  if (!validar()) return;
  $w('#btnEnviar').disable(); $w('#btnEnviar').label = 'ENVIANDO…';
  const r = await guardarLead({
    email: $w('#inEmail').value, telefono: $w('#inCel').value,
    consentimiento: $w('#chkAcepto').checked, web: $w('#inWeb').value,
    origen: 'exit-' + (ctx.motivo || 'na'), url: ctx.url, fbp: ctx.fbp, fbc: ctx.fbc, ua: ctx.ua,
  }).catch(() => ({ ok: false, error: 'Sin conexión. Intenta otra vez.' }));

  if (!r.ok) {
    err(r.campo === 'telefono' ? '#txtErrCel' : '#txtErrEmail', r.error);
    $w('#btnEnviar').label = 'QUIERO MI 10%'; $w('#btnEnviar').enable();
    return;
  }
  try { local.setItem('sd_lead', '1'); } catch (e) { /* El código sigue disponible sin almacenamiento local. */ }
  $w('#txtCupon').text = r.cupon;
  $w('#boxForm').collapse(); $w('#boxExito').expand();
}
