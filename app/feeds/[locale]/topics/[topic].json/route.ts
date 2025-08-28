import { NextResponse } from 'next/server';
import { isLocale, type Locale } from '@/i18n/config';
import { getAllNews } from '@/lib/news';

export const revalidate = 300;

export async function GET(req: Request, ctx: { params: Promise<{ locale: string; topic: string }> }) {
  const { locale: raw, topic } = await ctx.params;
  const locale = isLocale(raw) ? (raw as Locale) : 'de';
  const items = (await getAllNews(locale)).filter((p) => (p.meta.topics || []).includes(topic)).slice(0, 100);

  const url = new URL(req.url);
  const base = `${url.protocol}//${url.host}`;
  return NextResponse.json({
    version: 'https://jsonfeed.org/version/1',
    title: `Handwerk.Cloud – ${topic} (${locale.toUpperCase()})`,
    home_page_url: `${base}/${locale}/topics/${encodeURIComponent(topic)}`,
    items: items.map((p) => ({
      id: `${base}/${locale}/news/${p.meta.slug}`,
      url: `${base}/${locale}/news/${p.meta.slug}`,
      title: p.meta.title,
      summary: p.meta.summary || '',
      date_published: new Date(p.meta.date).toISOString()
    }))
  });
}

