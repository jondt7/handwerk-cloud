import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['de', 'en'] as const;
const defaultLocale = 'de';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Statische Dateien & Next intern ausnehmen
  if (pathname.startsWith('/_next') || pathname.includes('.')) return;

  // Hat die URL bereits eine Locale?
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return;

  // Sonst auf Default-Locale umleiten (z. B. "/" -> "/de")
  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
