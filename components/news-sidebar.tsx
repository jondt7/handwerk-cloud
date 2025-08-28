import Link from 'next/link';

export function NewsSidebar({
  locale,
  topTopics,
  topSources
}: {
  locale: 'de' | 'en';
  topTopics: Array<{ name: string; count: number }>;
  topSources: Array<{ name: string; count: number }>;
}) {
  const labels = locale === 'de'
    ? { topics: 'Beliebte Themen', sources: 'Top Quellen', subscribe: 'Newsletter abonnieren', email: 'E-Mail' }
    : { topics: 'Popular topics', sources: 'Top sources', subscribe: 'Subscribe to newsletter', email: 'Email' };

  return (
    <aside className="sticky top-24 space-y-6">
      <section className="ring-1 ring-neutral-200 rounded-xl p-5">
        <h2 className="text-sm font-medium tracking-tight text-neutral-700">{labels.topics}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {topTopics.slice(0, 12).map((t) => (
            <Link
              key={t.name}
              href={`/${locale}/news?topic=${encodeURIComponent(t.name)}`}
              className="rounded-full bg-neutral-50 ring-1 ring-neutral-200 px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-100"
            >
              {t.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="ring-1 ring-neutral-200 rounded-xl p-5">
        <h2 className="text-sm font-medium tracking-tight text-neutral-700">{labels.sources}</h2>
        <ul className="mt-3 list-none m-0 p-0 space-y-1 text-sm">
          {topSources.slice(0, 10).map((s) => (
            <li key={s.name} className="flex items-center justify-between">
              <a href="#" className="hover:underline text-neutral-800" aria-disabled>
                {s.name}
              </a>
              <span className="text-neutral-500 text-xs">{s.count}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="ring-1 ring-neutral-200 rounded-xl p-5">
        <h2 className="text-sm font-medium tracking-tight text-neutral-700">{labels.subscribe}</h2>
        <div className="mt-3 flex gap-2">
          <input type="email" placeholder={labels.email} className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <button className="btn btn-primary" type="button">OK</button>
        </div>
      </section>
    </aside>
  );
}
