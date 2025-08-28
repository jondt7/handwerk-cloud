import { NextResponse } from 'next/server';
import { locales, type Locale } from '@/i18n/config';
import { headers } from 'next/headers';
import { getAllNews } from '@/lib/news';

function xmlEscape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const revalidate = 300; // 5 minutes

export async function GET() {
  const h = await headers();
  const proto = h.get('x-forwarded-proto') || 'https';
  const host = h.get('host') || 'localhost:3000';
  const base = `${proto}://${host}`.replace(/\/$/, '');
  const cutoff = Date.now() - 3 * 24 * 60 * 60 * 1000; // last 72h
  const items: Array<{ url: string; title: string; lang: string; date: string }> = [];

  for (const loc of locales) {
    const all = await getAllNews(loc as Locale);
    for (const { meta } of all) {
      const t = new Date(meta.date).getTime();
      if (isNaN(t) || t < cutoff) continue;
      items.push({
        url: `${base}/${loc}/news/${meta.slug}`,
        title: meta.title,
        lang: loc,
        date: new Date(meta.date).toISOString()
      });
    }
  }

  const head = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;
  const body = items.map((it) => `
    <url>
      <loc>${xmlEscape(it.url)}</loc>
      <news:news>
        <news:publication>
          <news:name>Handwerk.Cloud</news:name>
          <news:language>${xmlEscape(it.lang)}</news:language>
        </news:publication>
        <news:publication_date>${xmlEscape(it.date)}</news:publication_date>
        <news:title>${xmlEscape(it.title)}</news:title>
      </news:news>
      <lastmod>${xmlEscape(it.date)}</lastmod>
    </url>`).join('\n');
  const tail = `</urlset>`;
  const xml = head + '\n' + body + '\n' + tail;
  return new NextResponse(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
