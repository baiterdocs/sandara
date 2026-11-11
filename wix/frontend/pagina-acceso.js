// Página "Acceso" (SSO propio). Elementos: #socialLogin (Custom Element "social-login"), #txtErrLogin
// Alternativa sin código: activar Google, Facebook y Apple en Ajustes > Miembros > Registro e inicio de sesión.
import { authentication } from 'wix-members-frontend';
import wixLocationFrontend from 'wix-location-frontend';
import { loginGoogle, loginMeta } from 'backend/sso.web';

const GOOGLE_CLIENT_ID = 'XXXXXXXX.apps.googleusercontent.com'; // público (el backend valida el aud)
const META_APP_ID = 'XXXXXXXXXXXXXXX';                            // público

$w.onReady(() => {
  $w('#txtErrLogin').collapse();
  $w('#socialLogin').setAttribute('google-client-id', GOOGLE_CLIENT_ID);
  $w('#socialLogin').setAttribute('meta-app-id', META_APP_ID);

  $w('#socialLogin').on('credencial', async ({ detail }) => {
    const r = detail.proveedor === 'google' ? await loginGoogle(detail.token)
            : detail.proveedor === 'meta' ? await loginMeta(detail.token) : { ok: false };
    if (!r?.ok) { $w('#txtErrLogin').text = r?.error || 'No pudimos iniciar sesión.'; $w('#txtErrLogin').expand(); return; }
    await authentication.applySessionToken(r.sessionToken);
    const destino = wixLocationFrontend.query.volver;
    wixLocationFrontend.to(destino && destino.startsWith('/') && !destino.startsWith('//') ? destino : '/');
  });
});
