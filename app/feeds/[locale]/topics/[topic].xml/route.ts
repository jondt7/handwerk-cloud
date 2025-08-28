import { NextResponse } from 'next/server';
import { isLocale, type Locale } from '@/i18n/config';
import { getAllNews } from '@/lib/news';

function xmlEscape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const revalidate = 300;

export async function GET(req: Request, ctx: { params: Promise<{ locale: string; topic: string }> }) {
  const { locale: raw, topic } = await ctx.params;
  const locale = isLocale(raw) ? (raw as Locale) : 'de';
  const items = (await getAllNews(locale)).filter((p) => (p.meta.topics || []).includes(topic)).slice(0, 100);

  const url = new URL(req.url);
  const base = `${url.protocol}//${url.host}`;
  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n<title>Handwerk.Cloud – ${topic} (${locale.toUpperCase()})</title>\n<link>${xmlEscape(base)}/${locale}/topics/${encodeURIComponent(topic)}</link>\n<description>Latest ${topic} news</description>` +
  items.map((p) => {
    const link = `${base}/${locale}/news/${p.meta.slug}`;
    const pub = new Date(p.meta.date).toUTCString();
    const desc = xmlEscape(p.meta.summary || '');
    return `\n<item>\n<title>${xmlEscape(p.meta.title)}</title>\n<link>${xmlEscape(link)}</link>\n<guid>${xmlEscape(link)}</guid>\n<pubDate>${xmlEscape(pub)}</pubDate>\n<description>${desc}</description>\n</item>`;
  }).join('') + `\n</channel>\n</rss>`;

  return new NextResponse(rss, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}

