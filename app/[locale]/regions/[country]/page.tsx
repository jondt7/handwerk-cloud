import {getLocale} from 'next-intl/server';
import { headers } from 'next/headers';
import { locales, type Locale as L } from '@/i18n/config';
import { getAllNews, type Locale as NewsLocale } from '@/lib/news';
import { NewsCard } from '@/components/news-card';
import { NewsSidebar } from '@/components/news-sidebar';

type SP = { page?: string };

export const revalidate = 300;
export const dynamicParams = false;

export async function generateStaticParams() {
  const params: Array<{ locale: L; country: string }> = [];
  for (const loc of locales) {
    const all = await getAllNews(loc as NewsLocale);
    const countries = Array.from(new Set(all.map((p) => p.meta.country).filter(Boolean) as string[]));
    params.push(...countries.map((c) => ({ locale: loc, country: c })));
  }
  return params;
}

export default async function CountryPage({
  params,
  searchParams
}: { params: Promise<{ locale: L; country: string }>; searchParams: Promise<SP> }) {
  const { locale, country } = await params;
  const sp = await searchParams;
  const page = sp.page ? Math.max(1, parseInt(sp.page)) : 1;
  const pageSize = 24;

  const all = await getAllNews(locale as NewsLocale);
  const filtered = all.filter((p) => p.meta.country === country);
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  const topics = Array.from(new Set(all.flatMap((p) => p.meta.topics || []))).sort();
  const topSources = Array.from(new Map(all.map((x) => [x.meta.sourceName || x.meta.sourceDomain || '—', 0])).keys())
    .map((name) => ({ name, count: all.filter((x) => (x.meta.sourceName || x.meta.sourceDomain || '—') === name).length }))
    .filter((s) => s.name && s.name !== '—')
    .sort((a, b) => b.count - a.count);

  const h = await headers();
  const proto = h.get('x-forwarded-proto') || 'https';
  const host = h.get('host') || 'localhost:3000';
  const base = `${proto}://${host}`.replace(/\/$/, '');
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: slice.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${base}/${locale}/news/${p.meta.slug}`, name: p.meta.title }))
  } as const;

  const labels = locale === 'de'
    ? { heading: `Region: ${country}`, none: 'Keine Meldungen gefunden.' }
    : { heading: `Region: ${country}`, none: 'No news found.' };

  const makeUrl = (n: number) => `/${locale}/regions/${encodeURIComponent(country)}?page=${n}`;

  return (
    <section className="container py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{labels.heading}</h1>
        <p className="mt-2 text-neutral-600">
          {locale === 'de' ? 'Kuratiert, neutral, regelmäßig aktualisiert.' : 'Curated, neutral, regularly updated.'}
        </p>
      </header>
      {slice.length === 0 ? (
        <p className="text-neutral-600">{labels.none}</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {slice.map(({ meta }) => (
              <NewsCard key={meta.slug} meta={meta} locale={locale} />
            ))}
          </div>
          <div>
            <NewsSidebar
              locale={locale as NewsLocale}
              topTopics={topics.map((t) => ({ name: t, count: all.filter((x) => (x.meta.topics || []).includes(t)).length }))}
              topSources={topSources}
            />
          </div>
        </div>
      )}

      {pages > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-2">
          <a href={makeUrl(Math.max(1, page - 1))} className="btn btn-secondary" aria-disabled={page === 1}>
            {locale === 'de' ? 'Zurück' : 'Prev'}
          </a>
          <span className="text-sm text-neutral-600">{page} / {pages}</span>
          <a href={makeUrl(Math.min(pages, page + 1))} className="btn btn-secondary" aria-disabled={page === pages}>
            {locale === 'de' ? 'Weiter' : 'Next'}
          </a>
        </div>
      ) : null}
    </section>
  );
}

