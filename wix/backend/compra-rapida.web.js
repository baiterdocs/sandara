// backend/compra-rapida.web.js — "Comprar ahora": crea un checkout directo (sin carrito) para invitados.
// Precio, stock y existencia los resuelve Wix en servidor; del cliente solo llegan ID, opción, cantidad y datos de envío.
import { Permissions, webMethod } from 'wix-web-module';
import { checkout } from 'wix-ecom-backend';
import wixData from 'wix-data';
import { RX_EMAIL, limpiarEmail, limpiarCelular, texto } from 'backend/validar';
import { MAX_UNIDADES_POR_PIEZA } from 'backend/config';

const STORES_APP_ID = '215238eb-22a5-4c36-9e7b-e7c08025e04e';
const RX_ID = /^[0-9a-f-]{36}$/i;
const ERR = (campo, error) => ({ ok: false, campo, error });

function direccion(d = {}) {
  const calle = [d.streetAddress?.name, d.streetAddress?.number].filter(Boolean).join(' ');
  const a = {
    country: 'PE',
    city: texto(d.city, 80),
    addressLine1: texto(calle || d.formatted, 200),
    addressLine2: texto(d.referencia, 120),
  };
  if (/^PE-[A-Z]{3}$/.test(d.subdivision || '')) a.subdivision = d.subdivision;
  if (/^\d{5}$/.test(d.postalCode || '')) a.postalCode = d.postalCode;
  return a;
}

/**
 * pedido: { productId, opciones?, cantidad?, datos?: { email, nombre, apellido, celular, direccion } }
 * Sin "datos" → checkout vacío (el cliente completa en la página de pago de Wix).
 */
export const crearCompraDirecta = webMethod(Permissions.Anyone, async (pedido = {}) => {
  // 1. Producto: ID válido, visible y con stock
  const productId = String(pedido.productId || '');
  if (!RX_ID.test(productId)) return ERR('producto', 'No encontramos esta pieza. Recarga la página.');
  const prod = await wixData.get('Stores/Products', productId).catch(() => null);
  if (!prod || prod.visible === false) return ERR('producto', 'Esta pieza ya no está disponible.');
  if (prod.inStock === false) return ERR('producto', 'Se agotó justo ahora. Escríbenos y te avisamos.');

  const cantidad = Math.min(Math.max(parseInt(pedido.cantidad, 10) || 1, 1), MAX_UNIDADES_POR_PIEZA);
  const opciones = {};
  for (const [k, v] of Object.entries(pedido.opciones || {}).slice(0, 3)) opciones[texto(k, 40)] = texto(v, 60);

  const options = {
    channelType: 'WEB',
    lineItems: [{
      quantity: cantidad,
      catalogReference: {
        appId: STORES_APP_ID,
        catalogItemId: productId,
        ...(Object.keys(opciones).length ? { options: opciones } : {}),
      },
    }],
  };

  // 2. Datos opcionales del invitado (prellenan el checkout; nada se guarda en nuestra base)
  const d = pedido.datos;
  if (d) {
    const email = limpiarEmail(d.email);
    const celular = limpiarCelular(d.celular);
    if (!RX_EMAIL.test(email)) return ERR('email', 'Revisa tu correo, parece incompleto.');
    if (!celular) return ERR('celular', 'Tu celular debe tener 9 dígitos y empezar con 9.');
    if (!texto(d.nombre, 60)) return ERR('nombre', '¿Cómo te llamas?');
    const address = direccion(d.direccion);
    if (!address.addressLine1 || !address.city) return ERR('direccion', 'Elige tu dirección de la lista para que llegue sin problemas.');

    const contactDetails = { firstName: texto(d.nombre, 60), lastName: texto(d.apellido, 60), phone: '+51' + celular };
    options.checkoutInfo = {
      buyerInfo: { email },
      shippingInfo: { shippingDestination: { address, contactDetails } },
      billingInfo: { address, contactDetails },
    };
    if (d.nota) options.checkoutInfo.buyerNote = texto(d.nota, 200);
  }

  try {
    const c = await checkout.createCheckout(options);
    return { ok: true, checkoutId: c._id };
  } catch (e) {
    return ERR('producto', 'No pudimos preparar tu pago. Intenta de nuevo en un momento.');
  }
});
