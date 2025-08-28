// i18n/request.ts
import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale, isLocale} from '@/i18n/config';

export default getRequestConfig(async ({requestLocale}) => {
  // Locale aus dem Request (falls Middleware sie setzt), sonst Fallback
  const requested = (await requestLocale) as string | undefined;
  const locale = requested && isLocale(requested) ? requested : defaultLocale;

  return {
    locale, // <- WICHTIG: muss gesetzt sein
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
