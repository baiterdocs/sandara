// Service plugin: eCommerce Validations (Wix lo crea en backend/service-plugins/ecom-validations/<nombre>/).
// Pegar este contenido en el .js generado. En el -config.js poner validateInCart: true.
import { MAX_UNIDADES_POR_PIEZA } from 'backend/config';

export const getValidationViolations = async (options, context) => {
  const lineItems = options.validationInfo.lineItems || [];
  const esCarrito = options.sourceInfo.source === 'CART';
  const violations = [];

  for (const li of lineItems) {
    if (li.quantity > MAX_UNIDADES_POR_PIEZA) {
      violations.push({
        severity: esCarrito ? 'WARNING' : 'ERROR',
        target: { lineItem: { name: 'LINE_ITEM_DEFAULT', _id: li._id } },
        description: `Máximo ${MAX_UNIDADES_POR_PIEZA} unidades por pieza. Para pedidos mayores escríbenos por WhatsApp.`,
      });
    }
  }
  return { violations };
};
