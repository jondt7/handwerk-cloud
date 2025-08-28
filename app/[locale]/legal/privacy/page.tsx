import {getTranslations} from 'next-intl/server';

export default async function PrivacyPage() {
  const t = await getTranslations('legal.privacy');

  return (
    <section className="container py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="mt-2 text-neutral-600">{t('subtitle')}</p>

      <div className="prose prose-neutral max-w-none mt-8">
        {/* Platzhalter-Inhalte – später durch echte DSGVO-Infos ersetzen */}
        <h2>{t('controllerTitle')}</h2>
        <p>{t('controllerText')}</p>

        <h2>{t('dataTitle')}</h2>
        <p>{t('dataText')}</p>

        <h2>{t('rightsTitle')}</h2>
        <p>{t('rightsText')}</p>
      </div>
    </section>
  );
}
