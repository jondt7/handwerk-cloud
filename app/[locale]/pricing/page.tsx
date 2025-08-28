// app/[locale]/pricing/page.tsx
import {getTranslations, getLocale} from 'next-intl/server';
import Link from 'next/link';

export default async function PricingPage() {
  const [t, tCommon, raw] = await Promise.all([
    getTranslations('pricing'),
    getTranslations('common'),
    getLocale()
  ]);
  const locale = (raw as 'de' | 'en');

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 py-16">
      <header className="mb-10">
        <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-neutral-700">
          {t('free_badge')}
        </span>
        <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="mt-3 text-neutral-600">{t('subtitle')}</p>
        <div className="mt-6 flex gap-3">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center rounded-xl px-5 py-3 bg-neutral-900 text-white"
          >
            {tCommon('cta.primary')}
          </Link>
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center rounded-xl px-5 py-3 border border-neutral-900"
          >
            {tCommon('cta.secondary')}
          </Link>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-2xl p-6">
          <h2 className="text-lg font-medium">{t('free_title')}</h2>
          <ul className="mt-3 space-y-2 text-neutral-700 list-disc pl-5">
            <li>{t('free_bullets.0')}</li>
            <li>{t('free_bullets.1')}</li>
            <li>{t('free_bullets.2')}</li>
          </ul>
        </div>

        <div className="border rounded-2xl p-6">
          <h2 className="text-lg font-medium">{t('roadmap_title')}</h2>
          <ul className="mt-3 space-y-2 text-neutral-700 list-disc pl-5">
            <li>{t('roadmap_bullets.0')}</li>
            <li>{t('roadmap_bullets.1')}</li>
            <li>{t('roadmap_bullets.2')}</li>
          </ul>
          <p className="mt-4 text-sm text-neutral-500">{t('disclaimer')}</p>
        </div>
      </div>
    </section>
  );
}
