// Sandara · header, menú y footer compartidos + helpers de catálogo
(() => {
  const pagina = document.body.dataset.page || '';
  if (!document.getElementById('i-menu')) document.body.insertAdjacentHTML('afterbegin', `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <symbol id="i-bag" viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
    <symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="1"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/><path d="M12 14.5v2.5"/></symbol>
    <symbol id="i-gem" viewBox="0 0 24 24"><path d="M7 4h10l4 5-9 11L3 9l4-5Z"/><path d="M3 9h18M9.5 4 8 9l4 11 4-11-1.5-5"/></symbol>
    <symbol id="i-gift" viewBox="0 0 24 24"><rect x="4" y="9" width="16" height="11"/><path d="M3 9h18M12 9v11M12 9c-1.5-3-5-4-5-1.5S10 9 12 9Zm0 0c1.5-3 5-4 5-1.5S14 9 12 9Z"/></symbol>
    <symbol id="i-chat" viewBox="0 0 24 24"><path d="M5 18.5 4 21l3.2-1.3A8 8 0 1 0 5 18.5Z"/><path d="M9 11h6M9 14h4"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
    <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
    <symbol id="i-leaf" viewBox="0 0 24 24"><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z"/><path d="M5 19 13 11"/></symbol>
    <symbol id="i-hand" viewBox="0 0 24 24"><path d="M8 12V6.5a1.5 1.5 0 0 1 3 0V11m0-5.5a1.5 1.5 0 0 1 3 0V11m0-4a1.5 1.5 0 0 1 3 0v6.5a6.5 6.5 0 0 1-6.5 6.5h-.6a5 5 0 0 1-4-2l-2.6-3.6a1.5 1.5 0 0 1 2.3-1.9L8 14"/></symbol>
    <symbol id="i-truck" viewBox="0 0 24 24"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></symbol>
    <symbol id="i-swap" viewBox="0 0 24 24"><path d="M4 8h14l-3-3M20 16H6l3 3"/></symbol>
    <symbol id="i-spark" viewBox="0 0 24 24"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></symbol>
  </svg>`);
  const ICON = (id, cls = 'ico') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const NAV = [['coleccion.html', 'Colección', 'coleccion'], ['atelier.html', 'Atelier', 'atelier'], ['ayuda.html', 'Ayuda', 'ayuda']];
  const navHtml = NAV.map(([h, t, k]) => `<a href="${h}"${k === pagina ? ' aria-current="page"' : ''}>${t}</a>`).join('');

  const hd = document.querySelector('[data-site="header"]');
  if (hd) hd.outerHTML = `
    <header class="hd on-dark">
      <button class="menu" aria-label="Abrir menú" aria-expanded="false" style="color:#fff;width:44px;height:44px;place-items:center">${ICON('menu')}</button>
      <nav aria-label="Principal">${navHtml}</nav>
      <a class="logo" href="inicio.html" aria-label="Sandara, inicio"><img src="sim/assets/logo-blanco.png" alt="Sandara" width="100" height="30"></a>
      <div class="tools">
        <a href="coleccion.html" aria-label="Buscar" style="color:#fff;width:44px;height:44px;display:grid;place-items:center">${ICON('search')}</a>
        <button aria-label="Bolsa de muestra, sin carrito conectado" disabled title="Carrito de muestra">${ICON('bag')}<span class="count" aria-hidden="true">0</span></button>
      </div>
    </header>
    <div class="drawer" aria-hidden="true" inert>
      <div class="scrim2" data-menu-close></div>
      <nav aria-label="Menú">
        <button class="x" data-menu-close aria-label="Cerrar menú">${ICON('x')}</button>
        <a href="inicio.html">Inicio</a>${navHtml}
        <a href="https://www.instagram.com/sandara.pe/" rel="noopener">Instagram</a>
      </nav>
    </div>`;

  const ft = document.querySelector('[data-site="footer"]');
  if (ft) ft.outerHTML = `
    <footer class="ft2 on-dark">
      <div class="cols">
        <div><img src="sim/assets/logo-blanco.png" alt="Sandara" width="93" height="28"><p>Joyería minimalista, hecha para acompañar el día a día.</p></div>
        <div><h3>Comprar</h3><ul><li><a href="coleccion.html?c=aretes">Aretes</a></li><li><a href="coleccion.html?c=dije">Dijes</a></li><li><a href="coleccion.html?c=anillo">Anillos</a></li><li><a href="coleccion.html?c=cadena">Cadenas y pulseras</a></li></ul></div>
        <div><h3>Ayuda</h3><ul><li><a href="ayuda.html#envios">Envíos</a></li><li><a href="ayuda.html#cambios">Cambios</a></li><li><a href="ayuda.html#cuidado">Cuidado de tus joyas</a></li><li><a href="ayuda.html#faq">Preguntas frecuentes</a></li></ul></div>
        <div><h3>Contacto</h3><ul><li><a href="https://wa.link/yhg8b4" rel="noopener">WhatsApp</a></li><li><a href="https://www.instagram.com/sandara.pe/" rel="noopener">Instagram</a></li><li>Lima, Perú</li></ul></div>
      </div>
      <div class="legal"><span>© 2026 Sandara</span><span><a href="ayuda.html#terminos">Términos</a> · <a href="ayuda.html#privacidad">Privacidad</a> · <a href="ayuda.html#reclamaciones">Libro de reclamaciones</a></span></div>
    </footer>
    <p class="demo-note">Simulación del sitio. Políticas, plazos y medios de pago marcados como pendientes deben completarse con la información real.</p>`;

  // Menú móvil
  const body = document.body;
  const btn = document.querySelector('.hd .menu');
  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    btn?.setAttribute('aria-expanded', String(open));
    const drawer = document.querySelector('.drawer');
    drawer?.setAttribute('aria-hidden', String(!open));
    if (drawer) drawer.inert = !open;
    if (open) document.querySelector('.drawer nav a')?.focus(); else btn?.focus();
  };
  btn?.addEventListener('click', () => setMenu(true));
  document.querySelectorAll('[data-menu-close]').forEach((b) => b.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && body.classList.contains('menu-open')) setMenu(false); });

  // Catálogo
  const soles = (n) => 'S/ ' + n.toFixed(2);
  window.Sandara = {
    ICON, soles,
    catalogo: () => fetch('sim/catalogo.json').then((r) => r.json()),
    card: (p) => `
      <li class="card${p.agotado ? ' agotado' : ''}" data-id="${p.id}">
        <a href="index_simulacion.html?p=${p.id}">
          <div class="ph">
            ${p.agotado ? '<span class="tag out">Agotado</span>' : p.badge ? `<span class="tag">${p.badge}</span>` : ''}
            <img src="${p.img_local}" alt="${p.nombre}" loading="lazy" width="800" height="800">
            ${p.img2_local && p.id !== 'anillo-pureza' ? `<img class="alt" src="${p.img2_local}" alt="" loading="lazy" width="800" height="800">` : ''}
          </div>
          <h3>${p.nombre}</h3>
          <p class="pr">${soles(p.precio)}</p>
        </a>
        ${p.agotado
          ? `<button class="quick js-notify" type="button" aria-expanded="false">Avísame cuando vuelva</button>
             <form class="notify" novalidate><label class="sr" for="n-${p.id}">Tu correo</label><input id="n-${p.id}" type="email" autocomplete="email" placeholder="Tu correo" required><button type="submit">Avisar</button></form>`
          : `<a class="quick" href="index_simulacion.html?p=${p.id}&comprar=1">${ICON('lock')}Comprar ahora</a>`}
      </li>`,
    bindNotify: (root) => {
      root.addEventListener('click', (e) => {
        const b = e.target.closest('.js-notify'); if (!b) return;
        const f = b.nextElementSibling; const on = !f.classList.contains('on');
        f.classList.toggle('on', on); b.setAttribute('aria-expanded', String(on)); if (on) f.querySelector('input').focus();
      });
      root.addEventListener('submit', (e) => {
        const f = e.target.closest('.notify'); if (!f) return; e.preventDefault();
        const v = f.querySelector('input').value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)) { f.querySelector('input').setAttribute('aria-invalid', 'true'); f.querySelector('input').focus(); return; }
        f.outerHTML = `<p class="notify-ok" role="status">${ICON('check')}Demostración: no se guardó el correo ni se enviarán avisos.</p>`;
      });
    },
  };
})();
