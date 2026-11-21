/* Sandara — diseño «intuitivo» sobre la web publicada en Wix.
   Instalación: Wix > Ajustes > Código personalizado > Agregar código > Todas las páginas > Fin del <body> > pegar dentro de <script>.
   Idempotente y solo de presentación: no toca productos, carrito ni pagos. Referencia visual: sim-intuitivo/index.html.
   Los ids comp-… son componentes de Wix; si se borran o duplican en el editor hay que actualizarlos aquí. */
(function () {
  if (window.__sandaraIntuitivo) return;
  window.__sandaraIntuitivo = true;

  var NEGRO = '#0a0a0a', CREMA2 = '#f2efe3', LINEA = '#e2ddd0', GRIS = '#5a5a5a';
  var SANS = '"Nunito Sans",system-ui,sans-serif';

  var f = document.createElement('link');
  f.rel = 'stylesheet';
  f.href = 'https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,600&display=swap';
  document.head.appendChild(f);

  var css = [
    /* Aviso superior (comp-mwpi68gn): barra negra a todo el ancho, texto blanco */
    /* Solo escritorio: en móvil el aviso queda como estaba (la cabecera es más baja y la barra se tapaba) */
    '@media(min-width:601px){#comp-mwpi68gn{position:relative}#comp-mwpi68gn::before{content:"";position:absolute;top:0;bottom:0;left:50%;width:100vw;transform:translateX(-50%);background:' + NEGRO + ';z-index:0}#comp-mwpi68gn *{position:relative;z-index:1;color:#fff!important;letter-spacing:.06em}}',

    /* Portada: «Comprar ahora» (comp-mwogvs3u) como botón negro lleno */
    '#comp-mwogvs3u,#comp-mwogvs3u *{overflow:visible!important}',
    '#comp-mwogvs3u a{display:inline-block;background:' + NEGRO + ';padding:0 26px;min-height:44px;line-height:44px;margin-top:-4px;width:auto!important;white-space:nowrap!important;border:1px solid ' + NEGRO + ';transition:background .15s,color .15s}',
    '#comp-mwogvs3u a,#comp-mwogvs3u a *{color:#fff!important;text-decoration:none!important;font-size:12px!important;letter-spacing:.2em!important;text-transform:uppercase;font-family:' + SANS + '!important;font-weight:400!important;white-space:nowrap!important}',
    '#comp-mwogvs3u a:hover{background:#2a2a2a}',

    /* Botón «Agregar» de las fichas: contorno negro, relleno al pasar el cursor */
    '.sdr-agregar{background:transparent!important;color:' + NEGRO + '!important;border:1px solid ' + NEGRO + '!important;text-transform:uppercase;letter-spacing:.2em;transition:background .15s,color .15s}',
    '.sdr-agregar *{color:inherit!important;font-size:12px!important;letter-spacing:.2em!important;font-family:' + SANS + '!important;font-weight:400!important}',
    '.sdr-agregar:hover:not(:disabled){background:' + NEGRO + '!important;color:#fff!important}',

    /* Cuerpo de texto con Nunito Sans (en lugar de Avenir) */
    '.sdr-sans,.sdr-sans *{font-family:' + SANS + '!important;font-weight:300}',

    /* Franja de confianza */
    '#masterPage.mesh-layout{grid-template-rows:max-content max-content min-content max-content max-content!important}',
    '#masterPage.mesh-layout > #sdr-confianza{grid-row:4/5!important;grid-column:1/2!important}',
    '#masterPage.mesh-layout > #SITE_FOOTER{grid-row:5/6!important}',
    '#sdr-confianza{background:' + CREMA2 + ';border-top:1px solid ' + LINEA + ';border-bottom:1px solid ' + LINEA + ';font-family:' + SANS + '}',
    '#sdr-confianza .in{max-width:1180px;margin:0 auto;padding:28px clamp(16px,4vw,48px);display:grid;grid-template-columns:repeat(4,1fr);gap:24px}',
    '#sdr-confianza b{display:block;font-weight:600;font-size:14px;color:' + NEGRO + '}',
    '#sdr-confianza span{font-size:13px;font-weight:300;color:' + GRIS + '}',
    '@media(max-width:860px){#sdr-confianza .in{grid-template-columns:1fr 1fr}}',
    /* Móvil: botón que cabe en pantalla */
    '@media(max-width:600px){#comp-mwogvs3u a{padding:0 12px!important;min-height:36px;line-height:36px!important;margin-top:0}#comp-mwogvs3u a,#comp-mwogvs3u a *{font-size:10px!important;letter-spacing:.08em!important}}',
    '@media(prefers-reduced-motion:reduce){*{transition:none!important}}'
  ].join('\n');
  var st = document.createElement('style');
  st.id = 'sdr-intuitivo-css';
  st.textContent = css;
  document.head.appendChild(st);

  function confianza() {
    if (document.getElementById('sdr-confianza')) return;
    var foot = document.getElementById('SITE_FOOTER');
    if (!foot || !foot.parentNode) return;
    var s = document.createElement('section');
    s.id = 'sdr-confianza';
    s.setAttribute('aria-label', 'Compra con confianza');
    s.innerHTML = '<div class="in">' +
      '<div><b>Envíos a todo el Perú</b><span>Lima S/ 8 · Provincias S/ 20</span></div>' +
      '<div><b>Gratis desde S/ 300</b><span>Se aplica solo en el carrito</span></div>' +
      '<div><b>Yape y Plin</b><span>Te confirmamos por WhatsApp</span></div>' +
      '<div><b>¿Dudas?</b><span>Escríbenos: 949 209 933</span></div>' +
      '</div>';
    foot.parentNode.insertBefore(s, foot);
  }

  function flecha() {
    var sp = document.querySelector('#comp-mwogvs3u a span');
    if (sp && sp.children.length === 0 && sp.textContent.indexOf('→') < 0) sp.textContent += ' →';
  }

  function botones() {
    document.querySelectorAll('button').forEach(function (b) {
      if (b.classList.contains('sdr-agregar')) return;
      var t = (b.textContent || '').trim().toLowerCase();
      if (t !== 'agregar al carrito') return;
      b.classList.add('sdr-agregar');
      var hojas = [b].concat([].slice.call(b.querySelectorAll('*')));
      hojas.forEach(function (n) {
        if (n.children.length === 0 && /agregar al carrito/i.test(n.textContent)) n.textContent = 'Agregar';
      });
    });
  }

  /* Recorrido costoso: solo hojas de texto, en lotes y pocas veces (nunca por cada mutación). */
  var fuentesOcupado = false;
  function fuentes() {
    if (fuentesOcupado) return;
    fuentesOcupado = true;
    var lista = [].slice.call(document.querySelectorAll('span:not(.sdr-sans),p:not(.sdr-sans),a:not(.sdr-sans),li:not(.sdr-sans),button:not(.sdr-sans)'));
    var i = 0;
    (function lote() {
      var fin = Math.min(i + 150, lista.length);
      for (; i < fin; i++) {
        var e = lista[i];
        if (e.children.length > 0 || !e.textContent.trim()) continue;
        if (/avenir/i.test(getComputedStyle(e).fontFamily)) e.classList.add('sdr-sans');
      }
      if (i < lista.length) setTimeout(lote, 16); else fuentesOcupado = false;
    })();
  }

  function rapido() { confianza(); flecha(); botones(); }
  rapido();
  var tr, tf;
  new MutationObserver(function () {
    clearTimeout(tr); tr = setTimeout(rapido, 250);
  }).observe(document.body, { childList: true, subtree: true });
  [800, 2500, 6000].forEach(function (ms) { setTimeout(fuentes, ms); });
  window.addEventListener('scroll', function () { clearTimeout(tf); tf = setTimeout(fuentes, 600); }, { passive: true });
})();
