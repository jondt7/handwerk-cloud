import '../globals.css';
import { inter } from '@/app/fonts';
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {locales, defaultLocale, isLocale, type Locale} from '@/i18n/config';
import {SiteHeader} from '@/components/site-header';
import {SiteFooter} from '@/components/site-footer';
import {Analytics} from '@vercel/analytics/react';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale: _raw} = await params;

  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://handwerk.cloud';
  const urlBase = base.replace(/\/$/, '');

  return {
    metadataBase: new URL(urlBase),
    alternates: {
      languages: {
        'de-DE': '/de',
        'en-US': '/en'
      }
    }
  };
}

async function getMessages(locale: Locale) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale: rawLocale} = await params; // Next 15: params ist ein Promise
  const locale = isLocale(rawLocale) ? (rawLocale as Locale) : defaultLocale;
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className={`${inter.variable} antialiased font-sans text-neutral-900 bg-white`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="min-h-dvh flex flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
