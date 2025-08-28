// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['de', 'en'],
  defaultLocale: 'de',
  // optional: 'always' erzwingt /de /en Präfix
  localePrefix: 'always'
});

export const config = {
  // alle Seiten, aber keine statischen Dateien/Next-Interna
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
