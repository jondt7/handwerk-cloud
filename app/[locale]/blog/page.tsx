// app/[locale]/blog/page.tsx
import {getLocale} from 'next-intl/server';
import Link from 'next/link';
import {getAllPosts} from '@/lib/posts';
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

export default async function BlogIndex() {
  const locale = (await getLocale()) as Locale;
  const posts = await getAllPosts(locale);

  const noPostsText = locale === 'de' ? 'Noch keine Beiträge vorhanden.' : 'No posts yet.';
  const pageTitle = locale === 'de' ? 'Blog' : 'Blog';

  return (
    <section className="container py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-6 text-balance">{pageTitle}</h1>

      {posts.length === 0 ? (
        <p className="text-neutral-600">{noPostsText}</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 list-none">
          {posts.map(({meta}) => (
            <li key={meta.slug} className="ring-1 ring-neutral-200 rounded-xl p-6 hover:bg-neutral-50 hover:shadow-sm transition">
              <article>
                <h2 className="text-xl font-medium tracking-tight text-balance">
                  <Link href={`/${locale}/blog/${meta.slug}`} className="hover:underline">
                    {meta.title}
                  </Link>
                </h2>
                {meta.description ? (
                  <p className="text-neutral-600 mt-1 clamp-2">{meta.description}</p>
                ) : null}
                <div className="mt-3 flex items-center gap-3 text-sm text-neutral-500">
                  <time dateTime={meta.date}>{formatDate(meta.date, locale)}</time>
                  {meta.tags && meta.tags.length > 0 ? <span aria-hidden>•</span> : null}
                  {meta.tags && meta.tags.length > 0 ? (
                    <ul className="flex gap-2 list-none">
                      {meta.tags.slice(0, 3).map((tag) => (
                        <li key={tag} className="rounded-full bg-neutral-50 ring-1 ring-neutral-200 px-2 py-0.5 text-xs text-neutral-700">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
