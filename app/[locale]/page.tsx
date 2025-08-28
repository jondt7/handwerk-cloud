// app/[locale]/page.tsx
import {getTranslations, getLocale} from 'next-intl/server';
import Link from 'next/link';
import {getAllPosts, type PostMeta} from '@/lib/posts';
import {getAllNews, type Locale as NewsLocale} from '@/lib/news';
import type {Locale} from '@/lib/posts';

function formatDate(iso: string, locale: Locale) {
  try {
    return new Date(iso).toLocaleDateString(
      locale === 'de' ? 'de-DE' : 'en-US',
      {year: 'numeric', month: 'short', day: '2-digit'}
    );
  } catch {
    return iso;
  }
}

export default async function HomePage() {
  const [tHome, tCommon, localeRaw] = await Promise.all([
    getTranslations('home'),
    getTranslations('common'),
    getLocale()
  ]);
  const locale = localeRaw as Locale;

  const latestPosts: Array<{meta: PostMeta}> = (await getAllPosts(locale)).slice(0, 3);
  const latestNews = (await getAllNews(locale as unknown as NewsLocale)).slice(0, 6);

  const latestLabel = locale === 'de' ? 'Neueste Beiträge' : 'Latest posts';
  const viewAllLabel = locale === 'de' ? 'Alle Beiträge' : 'View all';

  return (
    <>
      {/* Hero */}
      <section className="relative py-20">
        {/* subtle radial background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.04),transparent_60%)]" aria-hidden />
        <div className="container grid gap-12 md:grid-cols-2 items-center">
          <header>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
              {tHome('headline')}
            </h1>
            <p className="mt-5 text-lg text-neutral-600">
              {tHome('tagline')}
            </p>
            <div className="mt-8 flex gap-4">
              <Link href={`/${locale}/blog`} className="btn btn-primary">
                {tCommon('cta.primary')}
              </Link>
              <Link href={`/${locale}/pricing`} className="btn btn-secondary">
                {tCommon('cta.secondary')}
              </Link>
            </div>
          </header>

          {/* Value Props */}
          <ul className="grid gap-4 list-none">
            <li className="ring-1 ring-neutral-200 rounded-xl p-6 hover:bg-neutral-50 hover:shadow-sm transition">
              <h3 className="font-medium">{tHome('value1_title')}</h3>
              <p className="text-neutral-600 mt-1">{tHome('value1_text')}</p>
            </li>
            <li className="ring-1 ring-neutral-200 rounded-xl p-6 hover:bg-neutral-50 hover:shadow-sm transition">
              <h3 className="font-medium">{tHome('value2_title')}</h3>
              <p className="text-neutral-600 mt-1">{tHome('value2_text')}</p>
            </li>
            <li className="ring-1 ring-neutral-200 rounded-xl p-6 hover:bg-neutral-50 hover:shadow-sm transition">
              <h3 className="font-medium">{tHome('value3_title')}</h3>
              <p className="text-neutral-600 mt-1">{tHome('value3_text')}</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Partner/Empfehlung – prominenter, kontextueller Backlink */}
      <section className="container -mt-6 pb-8">
        <div className="ring-1 ring-neutral-200 rounded-xl p-5 bg-white">
          <p className="text-sm md:text-base text-neutral-700">
            {locale === 'de' ? (
              <>
                Empfohlene Lösung für Betriebe: {' '}
                <a href="https://www.clean-invoice.de" className="underline hover:no-underline">
                  Clean Invoice
                </a>{' '}
                – Rechnungen sauber prüfen, digitalisieren und Workflows automatisieren.
              </>
            ) : (
              <>
                Recommended for trades: {' '}
                <a href="https://www.clean-invoice.de" className="underline hover:no-underline">
                  Clean Invoice
                </a>{' '}
                – streamline invoice validation, digitization and approval workflows.
              </>
            )}
          </p>
        </div>
      </section>

      {/* Top News */}
      <section className="container pb-12">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            {locale === 'de' ? 'Aktuelle News' : 'Latest News'}
          </h2>
          <Link href={`/${locale}/news`} className="text-sm text-neutral-600 hover:text-neutral-900">
            {locale === 'de' ? 'Alle News' : 'View all'}
          </Link>
        </div>
        {latestNews.length === 0 ? (
          <p className="text-neutral-600">{locale === 'de' ? 'Noch keine News.' : 'No news yet.'}</p>
        ) : (
          <ul className="grid md:grid-cols-3 gap-6 list-none">
            {latestNews.map(({meta}) => (
              <li key={meta.slug} className="ring-1 ring-neutral-200 rounded-xl p-5 hover:bg-neutral-50 hover:shadow-sm transition">
                <article>
                  <h3 className="text-lg font-medium tracking-tight text-balance">
                    <Link href={`/${locale}/news/${meta.slug}`} className="hover:underline">
                      {meta.title}
                    </Link>
                  </h3>
                  {meta.summary ? (
                    <p className="text-neutral-600 mt-1 clamp-2">{meta.summary}</p>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Latest posts */}
      <section className="container pb-20">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">{latestLabel}</h2>
          <Link href={`/${locale}/blog`} className="text-sm text-neutral-600 hover:text-neutral-900">
            {viewAllLabel}
          </Link>
        </div>

        {latestPosts.length === 0 ? (
          <p className="text-neutral-600">
            {locale === 'de' ? 'Noch keine Beiträge vorhanden.' : 'No posts yet.'}
          </p>
        ) : (
          <ul className="grid md:grid-cols-3 gap-6 list-none">
            {latestPosts.map(({meta}) => (
              <li key={meta.slug} className="ring-1 ring-neutral-200 rounded-xl p-6 hover:shadow-sm hover:bg-neutral-50 transition group">
                <article>
                  <h3 className="text-lg font-medium tracking-tight">
                    <Link href={`/${locale}/blog/${meta.slug}`} className="hover:underline">
                      {meta.title}
                    </Link>
                  </h3>
                  {meta.description ? (
                    <p className="text-neutral-600 mt-1 clamp-2">{meta.description}</p>
                  ) : null}
                  <div className="mt-3 text-sm text-neutral-500">
                    <time dateTime={meta.date}>{formatDate(meta.date, locale)}</time>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
