// Site-wide password (HTTP Basic Auth) while Del Valle Lending Co. is internal / under Barrett review.
// Password lives in the Vercel env var SITE_PASSWORD. Any username works.
// To open the site to the public later: delete this file (or remove SITE_PASSWORD).
export const config = { matcher: '/:path*' };

export default function middleware(request) {
  const expected = process.env.SITE_PASSWORD;
  if (!expected) return; // no password set -> site is open

  const auth = request.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');
  if (scheme === 'Basic' && encoded) {
    try {
      const decoded = atob(encoded);
      const password = decoded.slice(decoded.indexOf(':') + 1);
      if (password === expected) return; // continue to the page
    } catch (e) {}
  }

  return new Response('Del Valle Lending Co. — acceso privado / private access', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Del Valle Lending Co.", charset="UTF-8"',
      'X-Robots-Tag': 'noindex, nofollow',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
