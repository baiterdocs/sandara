// Página de agradecimiento (Thank You Page).
// Elementos: #thankYouPage1 (widget), #boxGuardar, #txtGuardar, #socialLogin (Custom Element "social-login"),
//            #txtOkGuardar, #btnNoGracias
// Ofrece crear cuenta con UN clic (Google/Meta) después de pagar. Nunca antes.
import { authentication, currentMember } from 'wix-members-frontend';
import { loginGoogle, loginMeta } from 'backend/sso.web';

const GOOGLE_CLIENT_ID = 'XXXXXXXX.apps.googleusercontent.com';
const META_APP_ID = 'XXXXXXXXXXXXXXX';

$w.onReady(async () => {
  $w('#txtOkGuardar').collapse();
  const [order, miembro] = await Promise.all([
    $w('#thankYouPage1').getOrder().catch(() => null),
    currentMember.getMember().catch(() => null),
  ]);
  if (miembro || !order) { $w('#boxGuardar').collapse(); return; }

  $w('#txtGuardar').text = `¡Gracias${order.billingInfo?.firstName ? ', ' + order.billingInfo.firstName : ''}! ¿Guardamos tus datos para que tu próxima compra sea en 1 clic?`;
  $w('#socialLogin').setAttribute('google-client-id', GOOGLE_CLIENT_ID);
  $w('#socialLogin').setAttribute('meta-app-id', META_APP_ID);

  $w('#socialLogin').on('credencial', async ({ detail }) => {
    const r = detail.proveedor === 'google' ? await loginGoogle(detail.token) : await loginMeta(detail.token);
    if (!r?.ok) { $w('#txtOkGuardar').text = r?.error || 'No se pudo guardar. Tu compra está confirmada igual.'; $w('#txtOkGuardar').expand(); return; }
    await authentication.applySessionToken(r.sessionToken);
    $w('#socialLogin').collapse();
    $w('#txtOkGuardar').text = '✓ Listo. La próxima vez solo tocas "Comprar ahora".';
    $w('#txtOkGuardar').expand();
  });

  $w('#btnNoGracias').onClick(() => $w('#boxGuardar').collapse());
});
