// Service plugin: eCommerce Validations (Wix lo crea en backend/service-plugins/ecom-validations/<nombre>/).
// Pegar este contenido en el .js generado. En el -config.js poner validateInCart: true.
import { MAX_UNIDADES_POR_PIEZA } from 'backend/config';

export const getValidationViolations = async (options, context) => {
  const lineItems = options?.validationInfo?.lineItems || [];
  const esCarrito = options?.sourceInfo?.source === 'CART';
  const violations = [];

  const key = (li) => li.catalogReference?.catalogItemId
    ? `${li.catalogReference.appId}:${li.catalogReference.catalogItemId}` : li._id;
  const cantidades = new Map();
  for (const li of lineItems) cantidades.set(key(li), (cantidades.get(key(li)) || 0) + (Number(li.quantity) || 0));
  for (const li of lineItems) {
    if (cantidades.get(key(li)) > MAX_UNIDADES_POR_PIEZA) {
      violations.push({
        severity: esCarrito ? 'WARNING' : 'ERROR',
        target: { lineItem: { name: 'LINE_ITEM_DEFAULT', _id: li._id } },
        description: `Máximo ${MAX_UNIDADES_POR_PIEZA} unidades por pieza. Para pedidos mayores escríbenos por WhatsApp.`,
      });
    }
  }
  return { violations };
};
