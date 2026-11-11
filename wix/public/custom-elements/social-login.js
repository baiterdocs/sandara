// public/custom-elements/social-login.js — Custom Element "social-login".
// Atributos: google-client-id, meta-app-id. Emite "credencial" { proveedor, token }.
// Los tokens se VERIFICAN en backend/sso.web.js; este elemento solo los obtiene.
const cargar = (src) => new Promise((ok, ko) => {
  if (document.querySelector(`script[src="${src}"]`)) return ok();
  const s = Object.assign(document.createElement('script'), { src, async: true, defer: true, onload: ok, onerror: ko });
  document.head.appendChild(s);
});

class SocialLogin extends HTMLElement {
  static get observedAttributes() { return ['google-client-id', 'meta-app-id']; }
  attributeChangedCallback() { this.render(); }
  connectedCallback() { this.render(); }

  emitir(proveedor, token) {
    this.dispatchEvent(new CustomEvent('credencial', { detail: { proveedor, token } }));
  }

  async render() {
    const g = this.getAttribute('google-client-id');
    const m = this.getAttribute('meta-app-id');
    if (!g && !m) return;
    this.innerHTML = `
      <style>
        .sl{display:flex;flex-direction:column;gap:12px;font-family:'Josefin Sans',Arial,sans-serif}
        .sl button{height:44px;border:1px solid #2F2E2E;background:#fff;color:#2F2E2E;font:inherit;
          letter-spacing:.08em;text-transform:uppercase;cursor:pointer;border-radius:0}
        .sl button:hover{background:#2F2E2E;color:#fff}
      </style>
      <div class="sl"><div id="g"></div>${m ? '<button id="fb" type="button">Continuar con Facebook</button>' : ''}</div>`;

    if (g) {
      await cargar('https://accounts.google.com/gsi/client');
      google.accounts.id.initialize({ client_id: g, callback: (r) => this.emitir('google', r.credential) });
      google.accounts.id.renderButton(this.querySelector('#g'),
        { theme: 'outline', size: 'large', shape: 'rectangular', text: 'continue_with', width: 320, locale: 'es' });
    }
    if (m) {
      await cargar('https://connect.facebook.net/es_LA/sdk.js');
      FB.init({ appId: m, version: 'v21.0', cookie: false, xfbml: false });
      this.querySelector('#fb').onclick = () => FB.login((r) => {
        if (r.authResponse?.accessToken) this.emitir('meta', r.authResponse.accessToken);
      }, { scope: 'email' });
    }
  }
}
customElements.define('social-login', SocialLogin);
