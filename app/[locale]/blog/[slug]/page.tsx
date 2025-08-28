// app/[locale]/blog/[slug]/page.tsx
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {
  getPostBySlug,
  getPostSlugs,
  estimateReadingMinutes,
  type Locale
} from '@/lib/posts';
import {PostMetaBar} from '@/components/post-meta';
import {AISummaryCard} from '@/components/ai-summary';
import {getTranslations} from 'next-intl/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export const revalidate = 600; // ISR 10 Min.
export const dynamicParams = false;

export async function generateStaticParams() {
  const locales: Locale[] = ['de', 'en'];
  const params: Array<{locale: Locale; slug: string}> = [];
  for (const locale of locales) {
    const slugs = await getPostSlugs(locale);
    params.push(...slugs.map((slug) => ({locale, slug})));
  }
  return params;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: Locale; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  const post = await getPostBySlug(locale, slug);
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      type: 'article',
      title: post.meta.title,
      description: post.meta.description,
      locale,
      tags: post.meta.tags,
      authors: ['Handwerk.Cloud'],
      publishedTime: post.meta.date,
      modifiedTime: post.meta.updated
    },
    alternates: {
      languages: {
        'de-DE': `/de/blog/${slug}`,
        'en-US': `/en/blog/${slug}`
      }
    }
  };
}

export default async function BlogPost({
  params
}: {
  params: Promise<{locale: Locale; slug: string}>;
}) {
  const {locale, slug} = await params;
  const t = await getTranslations('post');
  const post = await getPostBySlug(locale, slug);
  if (!post) notFound();

  const readMinutes = estimateReadingMinutes(post.content, locale);

  return (
    <article className="container py-10">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {post.meta.title}
          </h1>

          <div className="mt-2">
            <PostMetaBar
              meta={post.meta}
              locale={locale}
              readMinutes={readMinutes}
              labels={{
                published: t('published'),
                updated: t('updated'),
                readTime: (m) => t('read_time', {minutes: m})
              }}
            />
          </div>

          {post.meta.description ? (
            <p className="mt-4 text-neutral-700">{post.meta.description}</p>
          ) : null}

          {/* dezenter Divider unter dem Header-Bereich */}
          <hr className="mt-6 border-neutral-200" />
        </header>

        {post.meta.aiSummary ? (
          <div className="mb-8">
            <AISummaryCard
              summary={post.meta.aiSummary}
              sources={post.meta.sources}
              labels={{
                title: t('ai_summary'),
                sources: t('sources')
              }}
            />
          </div>
        ) : null}

        <div className="prose prose-neutral max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, {behavior: 'wrap'}]]}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {post.meta.tags && post.meta.tags.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.meta.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-neutral-50 ring-1 ring-neutral-200 px-3 py-1 text-xs text-neutral-700"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
