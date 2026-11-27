// pagina-inicio.js (Código de la página Inicio)
// Cantidad de piezas y precio "desde" de cada colección, calculados desde la tienda.
// Si la consulta falla, se queda el texto escrito en el editor (no se borra nada).
//
// IDs que hay que poner en el editor (panel Propiedades), solo escritorio:
//   #resumenPlata   → texto "16 PIEZAS · DESDE S/ 40"   (comp-mwpig2va)
//   #resumenAcero   → texto "154 PIEZAS · S/ 25"         (comp-mwpi9die)
//   #resumenAtelier → texto "6 PIEZAS · DESDE S/ 80"     (comp-mwpia3og)
//   #verPlata / #verAcero / #verAtelier → "VER LAS N PIEZAS →"
//      (comp-mwpi8amf / comp-mwpijlec / comp-mwpiifhg)
// Si un ID no existe (p. ej. en celular), se ignora.
import wixData from 'wix-data';

const COLECCIONES = [
  { slug: 'plata-de-ley-950-925', resumen: '#resumenPlata',   ver: '#verPlata' },
  { slug: 'selección-sandara',    resumen: '#resumenAcero',   ver: '#verAcero' },
  { slug: 'atelier',              resumen: '#resumenAtelier', ver: '#verAtelier' },
];

$w.onReady(() => Promise.all(COLECCIONES.map(pintar)));

async function pintar({ slug, resumen, ver }) {
  try {
    const col = await wixData.query('Stores/Collections').eq('slug', slug).limit(1).find();
    if (!col.items.length) return;
    const res = await wixData.query('Stores/Products')
      .hasSome('collections', [col.items[0]._id])
      .limit(1000)
      .find();
    const piezas = res.items.filter((p) => p.visible !== false);
    if (!piezas.length) return;
    const minimo = Math.min(...piezas.map((p) => p.discountedPrice || p.price).filter((n) => n > 0));
    poner(resumen, `${piezas.length} PIEZAS · DESDE S/ ${soles(minimo)}`);
    poner(ver, `VER LAS ${piezas.length} PIEZAS →`);
  } catch (e) {
    console.error('pagina-inicio', slug, e);
  }
}

function soles(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

function poner(sel, texto) {
  const el = $w(sel);
  if (!el || !el.id) return;
  if ('label' in el) el.label = texto;
  else el.text = texto;
}
