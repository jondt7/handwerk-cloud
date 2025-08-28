import { NextResponse } from 'next/server';
import { params } from 'next/headers';
import { isLocale, type Locale } from '@/i18n/config';
import { getAllNews } from '@/lib/news';

export const revalidate = 300;

export async function GET(req: Request, ctx: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await ctx.params;
  const locale = isLocale(raw) ? (raw as Locale) : 'de';
  const items = (await getAllNews(locale)).slice(0, 100);

  const url = new URL(req.url);
  const base = `${url.protocol}//${url.host}`;
  const feedUrl = `${base}/feeds/${locale}/news.json`;

  const feed = {
    version: 'https://jsonfeed.org/version/1',
    title: `Handwerk.Cloud News (${locale.toUpperCase()})`,
    home_page_url: `${base}/${locale}`,
    feed_url: feedUrl,
    items: items.map((p) => ({
      id: `${base}/${locale}/news/${p.meta.slug}`,
      url: `${base}/${locale}/news/${p.meta.slug}`,
      title: p.meta.title,
      summary: p.meta.summary || '',
      date_published: new Date(p.meta.date).toISOString()
    }))
  } as const;

  return NextResponse.json(feed);
}

