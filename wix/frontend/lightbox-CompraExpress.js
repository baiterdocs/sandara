// Lightbox "CompraExpress" — hoja de datos en una pantalla (móvil: 100% ancho, anclada abajo).
// Elementos: #imgProd #txtProd #txtPrecio
//   #inEmail #txtEmail   · #inNombre #txtNombre · #inCel #txtCel
//   #addrDireccion (Address Input, filtro de país: Perú) #txtDireccion · #inReferencia (opcional)
//   #chkRecordar · #btnPagar · #btnCerrar · #txtGeneral
// Cada #txtX es el mensaje bajo su campo. Solo paleta de marca: el estado se comunica con
// icono + peso + borde (no con color), y aparece con fundido suave (global.css → .sd-*).
import wixWindowFrontend from 'wix-window-frontend';
import { crearCompraDirecta } from 'backend/compra-rapida.web';
import { guardarDatos, borrarDatos, leerDatos, RX_EMAIL, celular, formatoCelular, sugerirEmail } from 'public/datos-cliente';

const ctx = wixWindowFrontend.lightbox.getContext() || {};
const MARCA = { charcoal: '#2F2E2E', graphite: '#605E5E', mist: '#F6F6F6', borde: '#8C8A87' };
const INPUT = { email: '#inEmail', nombre: '#inNombre', cel: '#inCel', direccion: '#addrDireccion' };
const ICONO = { ayuda: '', ok: '✓&nbsp;&nbsp;', mal: '!&nbsp;&nbsp;' };
const escapar = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ultimo = {};
const AYUDA = {
  email: 'Te enviamos aquí la confirmación',
  nombre: 'Como figura en tu DNI, para la entrega',
  cel: 'Para coordinar la entrega por WhatsApp',
  direccion: 'Empieza a escribir y elige de la lista',
};
const tocado = {};
let tm;

$w.onReady(() => {
  $w('#txtProd').text = ctx.nombre || '';
  $w('#txtPrecio').text = ctx.precio || '';
  if (ctx.imagen) $w('#imgProd').src = ctx.imagen;
  $w('#txtGeneral').collapse();
  $w('#chkRecordar').checked = false;
  for (const k of Object.keys(AYUDA)) msg(k, AYUDA[k], 'ayuda');

  // Prellenar si hay datos guardados (cambio de dirección o datos que el servidor rechazó)
  const g = leerDatos();
  if (g) {
    $w('#inEmail').value = g.email || '';
    $w('#inNombre').value = [g.nombre, g.apellido].filter(Boolean).join(' ');
    $w('#inCel').value = formatoCelular(g.celular);
    if (g.direccion?.formatted) $w('#addrDireccion').value = g.direccion;
    $w('#inReferencia').value = g.direccion?.referencia || '';
    ['email', 'nombre', 'cel', 'direccion'].forEach((k) => validar(k, true));
  }
  if (ctx.error) { $w('#txtGeneral').text = ctx.error; $w('#txtGeneral').expand(); }

  $w('#inEmail').onInput(() => vivo('email'));
  $w('#inNombre').onInput(() => vivo('nombre'));
  $w('#inCel').onInput(() => {
    const f = formatoCelular($w('#inCel').value);           // 987654321 → 987 654 321
    if (f !== $w('#inCel').value) $w('#inCel').value = f;
    vivo('cel');
  });
  $w('#addrDireccion').onChange(() => { tocado.direccion = true; validar('direccion'); });
  for (const [id, k] of [['#inEmail', 'email'], ['#inNombre', 'nombre'], ['#inCel', 'cel']]) {
    $w(id).onBlur(() => { tocado[k] = true; validar(k); });
  }
  $w('#txtEmail').onClick(() => { const s = sugerirEmail($w('#inEmail').value); if (s) { $w('#inEmail').value = s; validar('email'); } });
  $w('#btnPagar').onClick(pagar);
  $w('#btnCerrar').onClick(() => wixWindowFrontend.lightbox.close(null));
});

const TXT = { email: '#txtEmail', nombre: '#txtNombre', cel: '#txtCel', direccion: '#txtDireccion' };
function msg(k, texto, tipo) {
  const el = $w(TXT[k]);
  const peso = tipo === 'mal' ? 600 : 400;
  const color = tipo === 'mal' ? MARCA.charcoal : MARCA.graphite;
  const html = `<p style="font-family:'Josefin Sans',sans-serif;font-size:14px;line-height:1.4;font-weight:${peso};color:${color}">${ICONO[tipo]}${texto}</p>`;
  estadoCampo(k, tipo);
  if (ultimo[k] === html) return;
  ultimo[k] = html;
  // Fundido de 220 ms (sin pop-ups, sin sacudidas); respeta "reducir movimiento" del sistema vía global.css
  el.hide('fade', { duration: 120 }).then(() => { el.html = html; return el.show('fade', { duration: 220 }); });
}

// Borde del campo: 1px gris (normal) · 2px charcoal + fondo niebla (corregir). Clases en global.css;
// si el editor no admite CSS personalizado, se aplica por estilo directo.
function estadoCampo(k, tipo) {
  const c = $w(INPUT[k]);
  try {
    c.customClassList.remove('sd-ok', 'sd-bad');
    if (tipo !== 'ayuda') c.customClassList.add(tipo === 'mal' ? 'sd-bad' : 'sd-ok');
  } catch (e) {
    c.style.borderColor = tipo === 'mal' ? MARCA.charcoal : MARCA.borde;
    c.style.borderWidth = tipo === 'mal' ? '2px' : '1px';
    c.style.backgroundColor = tipo === 'mal' ? MARCA.mist : '#FFFFFF';
  }
}

// Valida mientras escribe, pero solo muestra errores tras salir del campo (no regaña mientras teclea)
function vivo(k) { clearTimeout(tm); tm = setTimeout(() => validar(k, !tocado[k]), 300); }

function validar(k, silencioso = false) {
  let ok = true, texto = '';
  if (k === 'email') {
    const v = $w('#inEmail').value.trim();
    const s = sugerirEmail(v);
    ok = RX_EMAIL.test(v) && !s;
    texto = s ? `¿Quisiste decir <u>${escapar(s)}</u>? Toca para corregir` : ok ? 'Perfecto' : 'Revisa tu correo: debe verse como nombre@gmail.com';
  }
  if (k === 'nombre') {
    const v = $w('#inNombre').value.trim();
    ok = v.split(/\s+/).length >= 2 && v.length >= 5;
    texto = ok ? 'Gracias' : 'Escribe tu nombre y un apellido';
  }
  if (k === 'cel') {
    ok = !!celular($w('#inCel').value);
    texto = ok ? 'Listo' : 'Son 9 dígitos y empieza con 9 (ej. 987 654 321)';
  }
  if (k === 'direccion') {
    const a = $w('#addrDireccion').value || {};
    ok = !!(a.city && (a.streetAddress?.name || a.formatted));
    texto = ok ? `Entrega en ${escapar(a.city)}` : 'Elige una opción de la lista para que tu pedido llegue sin problemas';
  }
  if (ok) msg(k, texto, 'ok');
  else if (!silencioso) msg(k, texto, 'mal');
  return ok;
}

async function pagar() {
  ['email', 'nombre', 'cel', 'direccion'].forEach((k) => { tocado[k] = true; });
  const resultados = ['email', 'nombre', 'cel', 'direccion'].map((k) => [k, validar(k)]);
  const primerError = resultados.find(([, ok]) => !ok);
  if (primerError) {
    const foco = { email: '#inEmail', nombre: '#inNombre', cel: '#inCel', direccion: '#addrDireccion' }[primerError[0]];
    $w(foco).scrollTo().then(() => $w(foco).focus());
    return;
  }

  const [nombre, ...ap] = $w('#inNombre').value.trim().split(/\s+/);
  const datos = {
    email: $w('#inEmail').value.trim(),
    nombre, apellido: ap.join(' '),
    celular: celular($w('#inCel').value),
    direccion: { ...$w('#addrDireccion').value, referencia: $w('#inReferencia').value },
  };

  $w('#btnPagar').disable(); $w('#btnPagar').label = 'ABRIENDO PAGO SEGURO…';
  const r = await crearCompraDirecta({ productId: ctx.productId, opciones: ctx.opciones, cantidad: ctx.cantidad, datos })
    .catch(() => ({ ok: false, error: 'Se cortó la conexión. Toca de nuevo, tus datos siguen aquí.' }));

  if (!r.ok) {
    $w('#btnPagar').enable(); $w('#btnPagar').label = 'CONTINUAR AL PAGO';
    if (r.campo && AYUDA[r.campo === 'celular' ? 'cel' : r.campo]) msg(r.campo === 'celular' ? 'cel' : r.campo, r.error, 'mal');
    else { $w('#txtGeneral').text = r.error; $w('#txtGeneral').expand(); }
    return;
  }
  if ($w('#chkRecordar').checked) guardarDatos(datos);
  else borrarDatos();
  wixWindowFrontend.lightbox.close({ ...r, prellenado: true });
}
