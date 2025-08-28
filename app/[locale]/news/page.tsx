import {getLocale} from 'next-intl/server';
import {getAllNews, type Locale as NewsLocale} from '@/lib/news';
import { NewsCard } from '@/components/news-card';
import { NewsSidebar } from '@/components/news-sidebar';

type SP = { q?: string; topic?: string; country?: string; days?: string; page?: string };

function withinDays(iso: string, days?: number) {
  if (!days) return true;
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  return new Date(iso).getTime() >= since;
}

export const revalidate = 300;

export default async function NewsIndex({
  searchParams
}: {
  searchParams: Promise<SP>;
}) {
  const locale = (await getLocale()) as NewsLocale;
  const sp = await searchParams;
  const q = (sp.q || '').toLowerCase().trim();
  const topic = (sp.topic || '').trim();
  const country = (sp.country || '').trim();
  const days = sp.days ? Math.max(0, parseInt(sp.days)) : undefined;
  const page = sp.page ? Math.max(1, parseInt(sp.page)) : 1;
  const pageSize = 24;

  const all = await getAllNews(locale);

  const filtered = all.filter(({meta}) => {
    if (days && !withinDays(meta.date, days)) return false;
    if (topic && !(meta.topics || []).includes(topic)) return false;
    if (country && meta.country !== country) return false;
    if (q) {
      const hay = `${meta.title}\n${meta.summary || ''}\n${(meta.tags || []).join(' ')}\n${(meta.topics || []).join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Build facets from all items for simple select options
  const topics = Array.from(new Set(all.flatMap((p) => p.meta.topics || []))).sort();
  const countries = Array.from(new Set(all.map((p) => p.meta.country).filter(Boolean) as string[])).sort();

  const labels = locale === 'de'
    ? { title: 'News', tagline: 'Aktuelle Meldungen aus Bau & Handwerk – kuratiert und neutral zusammengefasst.', none: 'Keine Meldungen gefunden.', allPosts: 'Alle News', source: 'Quelle', filters: 'Filter', clear: 'Zurücksetzen', latest: 'Neueste Meldungen' }
    : { title: 'News', tagline: 'Latest construction & trades headlines — curated and concise.', none: 'No news found.', allPosts: 'All news', source: 'Source', filters: 'Filters', clear: 'Reset', latest: 'Latest news' };

  const makeUrl = (patch: Partial<SP>) => {
    const params = new URLSearchParams();
    const current = sp as SP;
    (['q','topic','country','days','page'] as const).forEach((key) => {
      const val = (key in patch ? patch[key] : current[key]) || '';
      if (val) params.set(key, String(val));
    });
    return `/${locale}/news?${params.toString()}`;
  };

  return (
    <section className="container py-12">
      {/* Hero */}
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{labels.title}</h1>
        <p className="mt-2 text-neutral-600">{labels.tagline}</p>
      </header>

      {/* Filters */}
      <div className="md:sticky md:top-20 md:z-10">
      <form className="ring-1 ring-neutral-200 rounded-xl p-4 mb-8 grid gap-3 md:grid-cols-5 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60" method="get">
        <input
          type="search"
          name="q"
          placeholder={locale === 'de' ? 'Suche…' : 'Search…'}
          defaultValue={q}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <select name="topic" defaultValue={topic} className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
          <option value="">{locale === 'de' ? 'Alle Themen' : 'All topics'}</option>
          {topics.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select name="country" defaultValue={country} className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
          <option value="">{locale === 'de' ? 'Alle Länder' : 'All countries'}</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select name="days" defaultValue={days?.toString() || ''} className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
          <option value="">{locale === 'de' ? 'Alle Zeiten' : 'Any time'}</option>
          <option value="1">{locale === 'de' ? 'Letzte 24 Std.' : 'Last 24h'}</option>
          <option value="7">{locale === 'de' ? 'Letzte 7 Tage' : 'Last 7 days'}</option>
          <option value="30">{locale === 'de' ? 'Letzte 30 Tage' : 'Last 30 days'}</option>
        </select>
        <div className="flex items-center gap-2">
          <button type="submit" className="btn btn-primary w-full">{locale === 'de' ? 'Filtern' : 'Filter'}</button>
          <a href={`/${locale}/news`} className="btn btn-secondary w-full">{labels.clear}</a>
        </div>
      </form>
      </div>

      {slice.length === 0 ? (
        <p className="text-neutral-600">{labels.none}</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <h2 className="sr-only">{labels.latest}</h2>
            {slice.map(({meta}) => (
              <NewsCard key={meta.slug} meta={meta} locale={locale} />
            ))}
          </div>
          <div>
            <NewsSidebar
              locale={locale}
              topTopics={
                topics
                  .map((t) => ({ name: t, count: all.filter((x) => (x.meta.topics || []).includes(t)).length }))
                  .sort((a, b) => b.count - a.count)
              }
              topSources={
                Array.from(new Map(all.map((x) => [x.meta.sourceName || x.meta.sourceDomain || '—', 0])).keys())
                  .map((name) => ({ name, count: all.filter((x) => (x.meta.sourceName || x.meta.sourceDomain || '—') === name).length }))
                  .filter((s) => s.name && s.name !== '—')
                  .sort((a, b) => b.count - a.count)
              }
            />
          </div>
        </div>
      )}

      {pages > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-2">
          <a
            href={makeUrl({ page: String(Math.max(1, page - 1)) })}
            aria-disabled={page === 1}
            className="btn btn-secondary"
          >
            {locale === 'de' ? 'Zurück' : 'Prev'}
          </a>
          <span className="text-sm text-neutral-600">{page} / {pages}</span>
          <a
            href={makeUrl({ page: String(Math.min(pages, page + 1)) })}
            aria-disabled={page === pages}
            className="btn btn-secondary"
          >
            {locale === 'de' ? 'Weiter' : 'Next'}
          </a>
        </div>
      ) : null}
    </section>
  );
}
