import {getTranslations} from 'next-intl/server';

export default async function ImprintPage() {
  const t = await getTranslations('legal.imprint');

  return (
    <section className="container py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="mt-2 text-neutral-600">{t('subtitle')}</p>

      <div className="prose prose-neutral max-w-none mt-8">
        {/* Platzhalter-Inhalte – bitte rechtlich korrekt befüllen */}
        <h2>{t('companyTitle')}</h2>
        <p>Handwerk.Cloud<br/>Musterstraße 1<br/>12345 Musterstadt</p>

        <h2>{t('contactTitle')}</h2>
        <p>E-Mail: info@example.com</p>

        <h2>{t('liabilityTitle')}</h2>
        <p>{t('liabilityText')}</p>
      </div>
    </section>
  );
}
