// Página de producto (Wix Stores).
// Elementos: #productPage1 (widget), #btnComprarAhora, #txtErrCompra, #ddOpcion (opcional), #btnOtraDireccion,
//            #txtEnvioProd, #txtConfianza, #btnWhatsApp
import wixSeoFrontend from 'wix-seo-frontend';
import wixWindowFrontend from 'wix-window-frontend';
import wixEcomFrontend from 'wix-ecom-frontend';
import { resumenCarrito } from 'backend/carrito.web';
import { crearCompraDirecta } from 'backend/compra-rapida.web';
import { leerDatos } from 'public/datos-cliente';
import { currentMember } from 'wix-members-frontend';

const SITIO = 'https://www.sandara.pe';
const WHATSAPP = '51949209933'; // verificado en instrucciones de pago de Wix

const imgUrl = (m) => {
  const src = String(m || '');
  if (/^https:\/\//i.test(src)) return src;
  const id = /^wix:image:\/\/v1\/([^/]+)/.exec(src)?.[1];
  return id ? `https://static.wixstatic.com/media/${id}` : undefined;
};
const sinHtml = (h) => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
let producto;

$w.onReady(async () => {
  producto = await $w('#productPage1').getProduct();
  const p = producto;
  const url = SITIO + p.productPageUrl;

  // 1. SEO
  wixSeoFrontend.setStructuredData([{
    '@context': 'https://schema.org', '@type': 'Product',
    name: p.name, description: sinHtml(p.description).slice(0, 5000),
    image: [p.mainMedia, ...(p.mediaItems || []).map((m) => m.src)].map(imgUrl).filter(Boolean),
    sku: p.sku && p.sku !== 'undefined' ? p.sku : p._id,
    brand: { '@type': 'Brand', name: 'Sandara' }, url,
    offers: {
      '@type': 'Offer', url, priceCurrency: p.currency || 'PEN',
      price: Number(p.discountedPrice ?? p.price).toFixed(2),
      availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'Sandara', url: SITIO },
      shippingDetails: { '@type': 'OfferShippingDetails', shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'PE' } },
    },
  }]).catch(() => {});

  // Usar los selectores nativos para conservar todas las opciones y sus combinaciones.
  try { $w('#ddOpcion').collapse(); } catch (e) { /* El selector antiguo es opcional. */ }

  // 3. Comprar ahora
  $w('#txtErrCompra').collapse();
  if (!p.inStock) { $w('#btnComprarAhora').label = 'AGOTADO · AVÍSAME'; $w('#btnComprarAhora').link = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Avísame cuando vuelva: ' + p.name)}`; }
  else {
    $w('#btnComprarAhora').label = `COMPRAR AHORA · ${p.formattedDiscountedPrice || p.formattedPrice}`;
    $w('#btnComprarAhora').onClick(() => comprarAhora(false));
  }
  // Clientes con datos guardados: atajo para cambiar dirección sin perder el 1-clic
  if (leerDatos() && p.inStock) { $w('#btnOtraDireccion').expand(); $w('#btnOtraDireccion').onClick(() => comprarAhora(true)); }
  else $w('#btnOtraDireccion').collapse();

  // 4. Confianza + envío + WhatsApp
  $w('#txtConfianza').text = 'Yape y Plin · Empaque Sandara · Entrega coordinada por WhatsApp';
  const r = await resumenCarrito();
  $w('#txtEnvioProd').text = r.disponible && r.envioGratis ? 'Tu pedido ya tiene envío gratis' : `Envío gratis en Lima desde S/ ${r.umbral}`;
  $w('#btnWhatsApp').link = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola Sandara, me interesa: ${p.name} (${url})`)}`;
  $w('#btnWhatsApp').target = '_blank';
});

function errorSuave(msg) {
  $w('#txtErrCompra').text = msg;
  $w('#txtErrCompra').expand();
  $w('#btnComprarAhora').enable();
}

async function comprarAhora(forzarHoja) {
  $w('#btnComprarAhora').disable();
  $w('#btnComprarAhora').label = 'PREPARANDO TU PAGO…';

  try {
  const opciones = await $w('#productPage1').getSelectedChoices();
  const cantidad = await $w('#productPage1').getQuantity();
  for (const [clave, opcion] of Object.entries(producto.productOptions || {})) {
    if (!opciones?.[opcion.name || clave]) { errorSuave(`Selecciona ${opcion.name || clave} en la ficha.`); return; }
  }
  const guardados = forzarHoja ? null : leerDatos();
  const base = { productId: producto._id, opciones, cantidad };
  const hoja = (error) => wixWindowFrontend.openLightbox('CompraExpress',
    { ...base, error, nombre: producto.name, precio: producto.formattedDiscountedPrice || producto.formattedPrice, imagen: imgUrl(producto.mainMedia) });

  // Cliente que ya compró en este dispositivo → directo al pago con todo prellenado (2 clics)
  // Cliente nuevo → hoja rápida de datos con autocompletado (3 clics)
  // Miembro con sesión → Wix prellena desde su libreta de direcciones
  const miembro = !forzarHoja && !guardados && await currentMember.getMember().catch(() => null);
  let res = guardados ? await crearCompraDirecta({ ...base, datos: guardados })
          : miembro ? await crearCompraDirecta(base)
          : await hoja();
  if (guardados && res && !res.ok && res.campo !== 'producto') res = await hoja(res.error); // datos viejos → corregir en la hoja

  if (res?.ok && res.checkoutId) {
    await wixEcomFrontend.navigateToCheckoutPage(res.checkoutId, { skipDeliveryStep: false, hideContinueBrowsingButton: true });
    return;
  }
  $w('#btnComprarAhora').label = `COMPRAR AHORA · ${producto.formattedDiscountedPrice || producto.formattedPrice}`;
  if (res && !res.ok) errorSuave(res.error);
  else $w('#btnComprarAhora').enable(); // cerró la hoja sin terminar
  } catch (e) {
    errorSuave('No pudimos preparar tu pago. Intenta de nuevo.');
  } finally {
    $w('#btnComprarAhora').label = `COMPRAR AHORA · ${producto.formattedDiscountedPrice || producto.formattedPrice}`;
    $w('#btnComprarAhora').enable();
  }
}
