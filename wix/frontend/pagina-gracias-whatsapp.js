// Página de agradecimiento — botón "Enviar constancia por WhatsApp" con el nº de pedido y el total.
// Elementos: #thankYouPage1 (widget de Wix), #btnWhatsAppPedido (botón de la franja superior)
// El botón ya tiene un enlace fijo a wa.me como respaldo; este código lo personaliza con el pedido.
const WHATSAPP = '51949209933';

$w.onReady(async () => {
  const btn = $w('#btnWhatsAppPedido');
  let msg = 'Hola Sandara, acabo de hacer un pedido en la web. Te envío mi constancia de pago.';
  try {
    const o = await $w('#thankYouPage1').getOrder();
    if (o) {
      const total = Number(o.totals?.total ?? 0).toFixed(2);
      const nombre = o.billingInfo?.firstName ? `, soy ${o.billingInfo.firstName}` : '';
      msg = `Hola Sandara${nombre}. Acabo de hacer el pedido #${o.number} por S/ ${total}. Te envío mi constancia de pago.`;
    }
  } catch (e) { /* sin pedido: se usa el mensaje genérico */ }
  btn.link = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  btn.target = '_blank';
});
