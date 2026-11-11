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

const imgUrl = (m) => { const id = String(m || '').split('/')[3]; return id ? `https://static.wixstatic.com/media/${id}` : undefined; };
const sinHtml = (h) => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
let producto, opcionNombre;

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

  // 2. Opción (talla/medida) sin salir de la página
  const opts = Object.values(p.productOptions || {});
  if (opts.length && $w('#ddOpcion').id) {
    opcionNombre = opts[0].name;
    $w('#ddOpcion').placeholder = `Elige ${opcionNombre.toLowerCase()}`;
    $w('#ddOpcion').options = opts[0].choices
      .filter((c) => c.visible !== false)
      .map((c) => ({ label: c.inStock === false ? `${c.description} · agotado` : c.description, value: c.description }));
    $w('#ddOpcion').onChange(() => $w('#txtErrCompra').collapse());
    $w('#ddOpcion').expand();
  } else if ($w('#ddOpcion').id) { $w('#ddOpcion').collapse(); }

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
  $w('#txtEnvioProd').text = r.envioGratis ? 'Tu pedido ya tiene envío gratis' : `Envío gratis en Lima desde S/ ${r.umbral}`;
  $w('#btnWhatsApp').link = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola Sandara, me interesa: ${p.name} (${url})`)}`;
  $w('#btnWhatsApp').target = '_blank';
});

function errorSuave(msg) {
  $w('#txtErrCompra').text = msg;
  $w('#txtErrCompra').expand();
  $w('#btnComprarAhora').enable();
}

async function comprarAhora(forzarHoja) {
  const opciones = {};
  if (opcionNombre) {
    if (!$w('#ddOpcion').value) { errorSuave(`Elige tu ${opcionNombre.toLowerCase()} y listo 🙂`); $w('#ddOpcion').focus(); return; }
    opciones[opcionNombre] = $w('#ddOpcion').value;
  }
  $w('#btnComprarAhora').disable();
  $w('#btnComprarAhora').label = 'PREPARANDO TU PAGO…';

  const guardados = forzarHoja ? null : leerDatos();
  const base = { productId: producto._id, opciones, cantidad: 1 };
  const hoja = (error) => wixWindowFrontend.openLightbox('CompraExpress',
    { ...base, error, nombre: producto.name, precio: producto.formattedPrice, imagen: imgUrl(producto.mainMedia) });

  // Cliente que ya compró en este dispositivo → directo al pago con todo prellenado (2 clics)
  // Cliente nuevo → hoja rápida de datos con autocompletado (3 clics)
  // Miembro con sesión → Wix prellena desde su libreta de direcciones
  const miembro = !forzarHoja && !guardados && await currentMember.getMember().catch(() => null);
  let res = guardados ? await crearCompraDirecta({ ...base, datos: guardados })
          : miembro ? await crearCompraDirecta(base)
          : await hoja();
  if (guardados && !res.ok && res.campo !== 'producto') res = await hoja(res.error); // datos viejos → corregir en la hoja

  if (res?.ok && res.checkoutId) {
    await wixEcomFrontend.navigateToCheckoutPage(res.checkoutId, { skipDeliveryStep: !miembro, hideContinueBrowsingButton: true });
    return;
  }
  $w('#btnComprarAhora').label = `COMPRAR AHORA · ${producto.formattedDiscountedPrice || producto.formattedPrice}`;
  if (res && !res.ok) errorSuave(res.error);
  else $w('#btnComprarAhora').enable(); // cerró la hoja sin terminar
}
