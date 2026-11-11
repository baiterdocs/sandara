// backend/events.js — eventos de Wix eCommerce.
// ⚠️ Activar ENVIAR_PURCHASE_CAPI solo si NO usas la integración nativa "Meta Pixel & CAPI" de Wix
//    (Marketing Integrations). Si la nativa está activa, Purchase ya se envía y esto lo duplicaría.
import { enviarEventoMeta } from 'backend/meta-capi';

const ENVIAR_PURCHASE_CAPI = false;

export function wixEcom_onOrderApproved(event) {
  if (!ENVIAR_PURCHASE_CAPI) return;
  const o = event.data.order;
  enviarEventoMeta({
    nombre: 'Purchase',
    id: `order_${o._id}`,                       // mismo id que el Pixel → deduplicado
    email: o.buyerInfo?.email,
    valor: o.priceSummary?.totalPrice?.amount,
    contenidos: (o.lineItems || []).map((li) => ({
      id: li.catalogReference?.catalogItemId, quantity: li.quantity,
    })),
  }).catch(() => {});
}
