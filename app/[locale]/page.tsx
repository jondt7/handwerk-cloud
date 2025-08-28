import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <section className="px-6 py-16 md:px-10 lg:px-16 max-w-6xl mx-auto">
      <div className="grid gap-8 md:grid-cols-2 items-center">
        <header>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">{t('headline')}</h1>
          <p className="mt-4 text-lg text-neutral-600">{t('tagline')}</p>
          <div className="mt-8 flex gap-4">
            <Link href="#" className="inline-flex items-center rounded-xl px-5 py-3 border border-neutral-900">
              {/* secondary CTA */}
              {t('value2_title')}
            </Link>
            <Link href="#" className="inline-flex items-center rounded-xl px-5 py-3 bg-neutral-900 text-white">
              {/* primary CTA */}
              {t('value3_title')}
            </Link>
          </div>
        </header>

        <ul className="grid gap-4">
          <li className="rounded-2xl border p-6">
            <h3 className="font-medium">{t('value1_title')}</h3>
            <p className="text-neutral-600 mt-1">{t('value1_text')}</p>
          </li>
          <li className="rounded-2xl border p-6">
            <h3 className="font-medium">{t('value2_title')}</h3>
            <p className="text-neutral-600 mt-1">{t('value2_text')}</p>
          </li>
          <li className="rounded-2xl border p-6">
            <h3 className="font-medium">{t('value3_title')}</h3>
            <p className="text-neutral-600 mt-1">{t('value3_text')}</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
