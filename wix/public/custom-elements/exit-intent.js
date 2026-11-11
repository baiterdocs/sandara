// public/custom-elements/exit-intent.js — Custom Element "exit-intent" (tag: exit-intent).
// Detecta intención de salida y emite evento "salida" con datos de atribución para Meta CAPI.
// Desktop: cursor sale por arriba. Móvil: scroll rápido hacia arriba tras leer >40% o 45 s sin interacción.
const ck = (n) => (document.cookie.match(new RegExp('(?:^|; )' + n + '=([^;]*)')) || [])[1] || '';

class ExitIntent extends HTMLElement {
  connectedCallback() {
    this.style.display = 'none';
    if (sessionStorage.getItem('sd_exit')) return;
    const armarDesde = Date.now() + 8000; // no molestar los primeros 8 s
    let lastY = scrollY, lastT = Date.now(), idle;

    const disparar = (motivo) => {
      if (Date.now() < armarDesde || sessionStorage.getItem('sd_exit')) return;
      sessionStorage.setItem('sd_exit', '1');
      this.dispatchEvent(new CustomEvent('salida', {
        detail: { motivo, fbp: ck('_fbp'), fbc: ck('_fbc'), ua: navigator.userAgent, url: location.href },
      }));
      limpiar();
    };
    const onOut = (e) => { if (!e.relatedTarget && e.clientY <= 0) disparar('desktop'); };
    const onScroll = () => {
      const y = scrollY, t = Date.now();
      const leido = (y + innerHeight) / document.documentElement.scrollHeight;
      if (lastY - y > 400 && t - lastT < 350 && leido > 0.4) disparar('scroll-up');
      lastY = y; lastT = t; reiniciarIdle();
    };
    const reiniciarIdle = () => { clearTimeout(idle); idle = setTimeout(() => disparar('inactivo'), 45000); };
    const limpiar = () => {
      document.removeEventListener('mouseout', onOut);
      removeEventListener('scroll', onScroll);
      clearTimeout(idle);
    };

    if (matchMedia('(pointer:fine)').matches) document.addEventListener('mouseout', onOut);
    else { addEventListener('scroll', onScroll, { passive: true }); reiniciarIdle(); }
    this._limpiar = limpiar;
  }
  disconnectedCallback() { this._limpiar?.(); }
}
customElements.define('exit-intent', ExitIntent);
