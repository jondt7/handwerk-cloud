import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {getNewsBySlug, getNewsSlugs, getAllNews, estimateReadingMinutes, type Locale as NewsLocale} from '@/lib/news';
import {AISummaryCard} from '@/components/ai-summary';
import {getTranslations} from 'next-intl/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { headers } from 'next/headers';

export const revalidate = 600;
export const dynamicParams = false;

export async function generateStaticParams() {
  const locales: NewsLocale[] = ['de', 'en'];
  const params: Array<{locale: NewsLocale; slug: string}> = [];
  for (const locale of locales) {
    const slugs = await getNewsSlugs(locale);
    params.push(...slugs.map((slug) => ({locale, slug})));
  }
  return params;
}

export async function generateMetadata({
  params
}: { params: Promise<{locale: NewsLocale; slug: string}> }): Promise<Metadata> {
  const {locale, slug} = await params;
  const item = await getNewsBySlug(locale, slug);
  if (!item) return {};
  return {
    title: item.meta.title,
    description: item.meta.summary,
    openGraph: {
      type: 'article',
      title: item.meta.title,
      description: item.meta.summary,
      locale,
      tags: item.meta.tags,
      authors: ['Handwerk.Cloud'],
      publishedTime: item.meta.date,
      modifiedTime: item.meta.updated
    },
    alternates: {
      languages: {
        'de-DE': `/de/news/${slug}`,
        'en-US': `/en/news/${slug}`
      }
    }
  };
}

export default async function NewsItem({
  params
}: { params: Promise<{locale: NewsLocale; slug: string}> }) {
  const {locale, slug} = await params;
  const t = await getTranslations('post');
  const item = await getNewsBySlug(locale, slug);
  if (!item) notFound();

  const readMinutes = estimateReadingMinutes(item.content, locale);
  const all = await getAllNews(locale);
  const related = all
    .filter((x) => x.meta.slug !== item.meta.slug)
    .map((x) => {
      const tset = new Set(x.meta.topics || []);
      const overlap = (item.meta.topics || []).reduce((n, v) => n + (tset.has(v) ? 1 : 0), 0);
      const tagset = new Set(x.meta.tags || []);
      const tover = (item.meta.tags || []).reduce((n, v) => n + (tagset.has(v) ? 1 : 0), 0);
      const score = overlap * 2 + tover + (x.meta.sourceDomain && x.meta.sourceDomain === item.meta.sourceDomain ? 1 : 0);
      return { x, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((r) => r.x.meta);

  const h = headers();
  const proto = h.get('x-forwarded-proto') || 'https';
  const host = h.get('host') || 'localhost:3000';
  const base = `${proto}://${host}`.replace(/\/$/, '');
  const url = `${base}/${locale}/news/${item.meta.slug}`;
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.meta.title,
    description: item.meta.summary || undefined,
    datePublished: item.meta.date,
    dateModified: item.meta.updated || item.meta.date,
    inLanguage: locale,
    mainEntityOfPage: url,
    author: { '@type': 'Organization', name: 'Handwerk.Cloud' },
    publisher: { '@type': 'Organization', name: 'Handwerk.Cloud' },
    url,
    keywords: [...(item.meta.topics || []), ...(item.meta.tags || [])].join(', ') || undefined
  };

  return (
    <article className="container py-10">
      <div className="max-w-3xl mx-auto">
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(ld)}} />
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-balance">{item.meta.title}</h1>
          <div className="mt-2 text-sm text-neutral-600 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>{t('read_time', { minutes: readMinutes })}</span>
            <span aria-hidden>•</span>
            <time dateTime={item.meta.date}>
              {new Date(item.meta.date).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', { year: 'numeric', month: 'long', day: '2-digit' })}
            </time>
            {item.meta.sourceName ? (
              <>
                <span aria-hidden>•</span>
                <a href={item.meta.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  {item.meta.sourceName}
                </a>
              </>
            ) : null}
          </div>
          {item.meta.summary ? (
            <p className="mt-4 text-neutral-700">{item.meta.summary}</p>
          ) : null}
          <hr className="mt-6 border-neutral-200" />
        </header>

        {item.meta.aiSummary ? (
          <div className="mb-8">
            <AISummaryCard
              summary={item.meta.aiSummary}
              sources={item.meta.sources}
              labels={{
                title: t('ai_summary'),
                sources: t('sources')
              }}
            />
          </div>
        ) : null}

        <div className="prose prose-neutral max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, {behavior: 'wrap'}]]}>
            {item.content}
          </ReactMarkdown>
        </div>

        {(item.meta.tags && item.meta.tags.length > 0) || (item.meta.topics && item.meta.topics.length > 0) || item.meta.country ? (
          <div className="mt-10 flex flex-wrap gap-2">
            {item.meta.country ? (
              <span className="rounded-full bg-neutral-50 ring-1 ring-neutral-200 px-3 py-1 text-xs text-neutral-700">{item.meta.country}</span>
            ) : null}
            {(item.meta.topics || []).map((tag) => (
              <span key={tag} className="rounded-full bg-neutral-50 ring-1 ring-neutral-200 px-3 py-1 text-xs text-neutral-700">{tag}</span>
            ))}
            {(item.meta.tags || []).map((tag) => (
              <span key={tag} className="rounded-full bg-neutral-50 ring-1 ring-neutral-200 px-3 py-1 text-xs text-neutral-700">{tag}</span>
            ))}
          </div>
        ) : null}
      </div>

      {related.length > 0 ? (
        <div className="max-w-3xl mx-auto mt-12">
          <h2 className="text-xl font-semibold tracking-tight mb-3">{locale === 'de' ? 'Verwandte Artikel' : 'Related articles'}</h2>
          <ul className="grid gap-3 md:grid-cols-2 list-none">
            {related.map((m) => (
              <li key={m.slug} className="ring-1 ring-neutral-200 rounded-xl p-4 hover:bg-neutral-50 transition">
                <a href={`/${locale}/news/${m.slug}`} className="font-medium hover:underline">
                  {m.title}
                </a>
                {m.summary ? <p className="text-sm text-neutral-600 mt-1 clamp-2">{m.summary}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
