// Sandara · prototipo de compra en 3 toques. Mismas reglas que wix/public/datos-cliente.js
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const body = document.body, panel = $('#panel'), cta = $('#cta');
  const ICON = (id) => `<svg class="ico" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  let paso = 'datos', ultimoFoco = null, precioTxt = 'S/ 155.00', disponible = false;
  const escapeHTML = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  $$('.js-buy').forEach((b) => { b.disabled = true; });

  // Producto desde el catálogo (?p=id). Sin parámetro: Aretes Antonella.
  const qs = new URLSearchParams(location.search);
  const CATS = { aretes: 'Aretes', dije: 'Dijes', anillo: 'Anillos', cadena: 'Cadenas y pulseras', pulsera: 'Cadenas y pulseras' };
  fetch('sim/catalogo.json').then((r) => r.json()).then((cat) => {
    const id = qs.get('p') || 'aretes-antonella';
    const p = cat.find((x) => x.id === id);
    if (!p) throw new Error('Producto no encontrado');
    disponible = !p.agotado;
    $$('.js-buy').forEach((b) => { b.disabled = !disponible; });
    if (p) {
      precioTxt = 'S/ ' + p.precio.toFixed(2);
      document.title = `${p.nombre} · Sandara`;
      $('#p-nombre').textContent = p.nombre; $('#it-nombre').textContent = p.nombre;
      $$('.js-precio').forEach((e) => { e.textContent = precioTxt; });
      $('#p-precio').textContent = precioTxt;
      $('#p-lede').textContent = 'Consulta los materiales y detalles de esta pieza en su ficha de Sandara.';
      $('#crumb-cat').textContent = CATS[p.cat];
      $('#crumb-cat').href = `coleccion.html?c=${p.cat === 'pulsera' ? 'cadena' : p.cat}`;
      $('#stage').src = p.img_local; $('#stage').alt = p.nombre; $('#it-img').src = p.img_local;
      const t = $$('.thumbs button');
      t[0].dataset.src = p.img_local; $('img', t[0]).src = p.img_local;
      if (p.img2_local && p.id !== 'anillo-pureza') { t[1].dataset.src = p.img2_local; $('img', t[1]).src = p.img2_local; }
      else t[1].hidden = true;
      if (p.agotado) $$('.js-buy').forEach((b) => { b.disabled = true; b.textContent = 'Agotado'; });
    }
    if (qs.get('comprar') === '1' && !(p && p.agotado)) abrir();
  }).catch(() => {
    disponible = false;
    $('#p-nombre').textContent = 'No pudimos cargar esta pieza';
    $('#p-lede').textContent = 'Vuelve a la colección para elegir una pieza disponible.';
    $$('.js-buy').forEach((b) => { b.disabled = true; });
  });

  // Galería
  $$('.thumbs button').forEach((b) => b.addEventListener('click', () => {
    $$('.thumbs button').forEach((x) => x.setAttribute('aria-current', 'false'));
    b.setAttribute('aria-current', 'true'); $('#stage').src = b.dataset.src;
  }));

  // Panel
  const abrir = () => { if (!disponible) return; ultimoFoco = document.activeElement; panel.inert = false; panel.setAttribute('aria-hidden', 'false'); body.classList.add('open'); setTimeout(() => { if (body.classList.contains('open')) $('#f-email').focus(); }, 350); };
  const cerrar = () => { body.classList.remove('open'); ultimoFoco?.focus(); panel.inert = true; panel.setAttribute('aria-hidden', 'true'); };
  $$('.js-buy').forEach((b) => b.addEventListener('click', abrir));
  $$('[data-close]').forEach((b) => b.addEventListener('click', cerrar));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && body.classList.contains('open')) cerrar(); });

  // Mantener la navegación de teclado dentro del panel abierto.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !body.classList.contains('open')) return;
    const root = panel;
    const controles = [...root.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]')]
      .filter(el => el.getClientRects().length && !el.closest('[inert]'));
    if (!controles.length) { e.preventDefault(); return; }
    const primero = controles[0], ultimo = controles[controles.length - 1];
    if (!root.contains(document.activeElement) || (e.shiftKey && document.activeElement === primero)) { e.preventDefault(); (e.shiftKey ? ultimo : primero).focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });

  // Validación: ayuda al enfocar, error solo al salir del campo, éxito en vivo
  const RX_EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;
  const TYPO = { 'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmail.co': 'gmail.com', 'hotmal.com': 'hotmail.com', 'hotmial.com': 'hotmail.com', 'outlok.com': 'outlook.com' };
  const sugerir = (v) => { const [u, d] = v.trim().toLowerCase().split('@'); return u && TYPO[d] ? `${u}@${TYPO[d]}` : ''; };
  const cel9 = (v) => v.replace(/\D/g, '').replace(/^51(?=9\d{8}$)/, '');
  const AYUDA = { email: 'Aquí te llega la confirmación.', nombre: 'Como figura en tu DNI, para la entrega.', cel: 'Te escribimos por WhatsApp.', dir: 'Escribe la calle y elige de la lista.' };
  const tocado = {}; let dirElegida = null;

  const reglas = {
    email: (v) => { const s = sugerir(v); if (s) return { ok: false, t: `¿Quisiste decir <button type="button" data-fix="${escapeHTML(s)}">${escapeHTML(s)}</button>?` };
      return RX_EMAIL.test(v.trim()) ? { ok: true } : { ok: false, t: 'Revisa tu correo: debe verse como nombre@gmail.com' }; },
    nombre: (v) => v.trim().split(/\s+/).length >= 2 && v.trim().length >= 5 ? { ok: true } : { ok: false, t: 'Escribe tu nombre y un apellido.' },
    cel: (v) => /^9\d{8}$/.test(cel9(v)) ? { ok: true } : { ok: false, t: 'Son 9 dígitos y empieza con 9, por ejemplo 987 654 321.' },
    dir: () => dirElegida ? { ok: true } : { ok: false, t: 'Elige una dirección de la lista para que tu pedido llegue sin problemas.' },
  };

  function pintar(k, mostrarError) {
    const f = $(`.field[data-k="${k}"]`), input = $('input', f), p = $('.msg p', f);
    const r = reglas[k](input.value);
    f.classList.toggle('ok', r.ok);
    const err = !r.ok && mostrarError;
    f.classList.toggle('bad', err);
    input.setAttribute('aria-invalid', err ? 'true' : 'false');
    if (err) { p.innerHTML = ICON('alert') + `<span>${r.t}</span>`; f.classList.remove('help'); }
    return r.ok;
  }

  $$('.field[data-k]').forEach((f) => {
    const k = f.dataset.k, input = $('input', f), p = $('.msg p', f);
    input.addEventListener('focus', () => { if (!f.classList.contains('bad') && !f.classList.contains('ok')) { p.textContent = AYUDA[k]; f.classList.add('help'); } });
    input.addEventListener('input', () => {
      if (k === 'cel') { const d = cel9(input.value).slice(0, 9); input.value = d.replace(/^(\d{3})(\d{0,3})(\d{0,3}).*/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' ')); }
      if (k === 'dir') { dirElegida = null; buscar(input.value); }
      pintar(k, tocado[k]);
    });
    input.addEventListener('blur', () => { f.classList.remove('help'); if (input.value) { tocado[k] = true; setTimeout(() => pintar(k, true), k === 'dir' ? 180 : 0); } });
  });
  document.addEventListener('click', (e) => {
    const fix = e.target.closest('[data-fix]');
    if (fix) { $('#f-email').value = fix.dataset.fix; pintar('email', true); $('#f-email').focus(); }
  });

  // Autocompletado (en Wix: Address Input con Google Places, filtro Perú)
  const DIRS = [
    ['Av. José Larco 700', 'Miraflores, Lima'], ['Av. José Larco 1150', 'Miraflores, Lima'],
    ['Av. Benavides 2840', 'Santiago de Surco, Lima'], ['Calle Las Begonias 415', 'San Isidro, Lima'],
    ['Av. Javier Prado Este 4200', 'Santiago de Surco, Lima'], ['Jr. de la Unión 600', 'Cercado de Lima, Lima'],
  ];
  const sug = $('#sug'), dir = $('#f-dir');
  function buscar(q) {
    q = q.trim().toLowerCase();
    const hits = q.length < 3 ? [] : DIRS.filter(([c]) => c.toLowerCase().includes(q.replace(/^av\.?\s*/, ''))).slice(0, 4);
    sug.innerHTML = hits.map(([c, d], i) => `<li role="option" id="op${i}" aria-selected="${i === 0}">${ICON('pin')}<span>${c}<br><small>${d}</small></span></li>`).join('');
    sug.hidden = !hits.length; dir.setAttribute('aria-expanded', String(!!hits.length));
    $$('li', sug).forEach((li, i) => li.addEventListener('mousedown', (e) => { e.preventDefault(); elegir(hits[i]); }));
  }
  function elegir([c, d]) {
    dirElegida = { calle: c, distrito: d }; dir.value = `${c}, ${d}`;
    sug.hidden = true; dir.setAttribute('aria-expanded', 'false'); tocado.dir = true; pintar('dir', true);
  }
  dir.addEventListener('keydown', (e) => {
    const ops = $$('li', sug); if (sug.hidden || !ops.length) return;
    let i = ops.findIndex((o) => o.getAttribute('aria-selected') === 'true');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); i = (i + (e.key === 'ArrowDown' ? 1 : ops.length - 1)) % ops.length;
      ops.forEach((o, j) => o.setAttribute('aria-selected', String(j === i))); dir.setAttribute('aria-activedescendant', ops[i].id); }
    if (e.key === 'Enter') { e.preventDefault(); ops[i].dispatchEvent(new MouseEvent('mousedown')); }
  });

  // Pasos
  const barras = $$('.progress i');
  function ir(nuevo) {
    paso = nuevo;
    $$('.step').forEach((s) => s.classList.toggle('on', s.id === `s-${nuevo}`));
    const n = { datos: 1, pago: 2, gracias: 3 }[nuevo];
    barras.forEach((b, i) => b.classList.toggle('on', i < n));
    cta.parentElement.hidden = nuevo === 'gracias';
    cta.innerHTML = nuevo === 'datos' ? `Continuar al pago${ICON('arrow')}` : `${ICON('lock')}Pagar ${precioTxt}`;
    $('.panel-body').scrollTop = 0;
  }
  $('[data-back]').addEventListener('click', () => ir('datos'));
  $$('.methods [role=radio]').forEach((b) => b.addEventListener('click', () => {
    $$('.methods [role=radio]').forEach((x) => x.setAttribute('aria-checked', 'false')); b.setAttribute('aria-checked', 'true');
  }));

  const ocupado = (fn) => { if (cta.disabled) return; cta.disabled = true; cta.setAttribute('aria-busy', 'true'); setTimeout(() => { cta.removeAttribute('aria-busy'); cta.disabled = false; fn(); }, 900); };
  $('#s-datos').addEventListener('submit', (e) => { e.preventDefault(); if (paso === 'datos') cta.click(); });
  cta.addEventListener('click', () => {
    if (paso === 'datos') {
      const ks = ['email', 'nombre', 'cel', 'dir'];
      ks.forEach((k) => { tocado[k] = true; });
      const malos = ks.filter((k) => !pintar(k, true));
      if (malos.length) { $(`.field[data-k="${malos[0]}"] input`).focus(); return; }
      $('#sum-dir').textContent = dirElegida.calle + ', ' + dirElegida.distrito.split(',')[0];
      $('#sum-cel').textContent = $('#f-cel').value;
      $('#gr-n').textContent = $('#f-nombre').value.trim().split(/\s+/)[0];
      ocupado(() => ir('pago'));
    } else if (paso === 'pago') ocupado(() => ir('gracias'));
  });

  $('#g-save').addEventListener('click', () => { $('#save').innerHTML = `<p class="saved">${ICON('check')}Demostración: no se conectó Google ni se guardaron datos.</p>`; });
  $('#later').addEventListener('click', () => { $('#save').hidden = true; });
})();
