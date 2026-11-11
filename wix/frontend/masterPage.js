// masterPage.js (Código del sitio — todas las páginas)
// Elementos (en header/global, "Mostrar en todas las páginas"):
//   #exitIntent  → Custom Element tag "exit-intent"
//   #txtEnvio    → Texto barra superior   ·  #barEnvio → Progress Bar (opcional)
import wixWindowFrontend from 'wix-window-frontend';
import wixEcomFrontend from 'wix-ecom-frontend';
import { local } from 'wix-storage-frontend';
import { currentMember } from 'wix-members-frontend';
import { resumenCarrito } from 'backend/carrito.web';

const SIETE_DIAS = 7 * 24 * 3600 * 1000;

$w.onReady(async () => {
  pintarEnvio();
  wixEcomFrontend.onCartChange(pintarEnvio);
  armarSalida();
});

async function pintarEnvio() {
  if (!$w('#txtEnvio').id) return;
  const r = await resumenCarrito();
  $w('#txtEnvio').text = r.envioGratis
    ? '✓ Tu pedido tiene ENVÍO GRATIS en Lima'
    : r.subtotal > 0
      ? `Te faltan S/ ${r.falta.toFixed(2)} para ENVÍO GRATIS`
      : `ENVÍO GRATIS en Lima desde S/ ${r.umbral}`;
  if ($w('#barEnvio').id) { $w('#barEnvio').targetValue = 100; $w('#barEnvio').value = r.progreso; }
}

async function armarSalida() {
  if (wixWindowFrontend.rendering.env !== 'browser') return;
  const visto = Number(local.getItem('sd_exit_ts') || 0);
  if (Date.now() - visto < SIETE_DIAS || local.getItem('sd_lead')) return;
  if (await currentMember.getMember().catch(() => null)) return; // miembros: no interrumpir

  $w('#exitIntent').on('salida', async ({ detail }) => {
    local.setItem('sd_exit_ts', String(Date.now()));
    const r = await resumenCarrito();
    // Con carrito: recordar envío gratis. Sin carrito: captar lead.
    wixWindowFrontend.openLightbox('Salida', { ...detail, carrito: r });
  });
}
