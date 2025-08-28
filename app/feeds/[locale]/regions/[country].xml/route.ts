import { NextResponse } from 'next/server';
import { isLocale, type Locale } from '@/i18n/config';
import { getAllNews } from '@/lib/news';

function xmlEscape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const revalidate = 300;

export async function GET(req: Request, ctx: { params: Promise<{ locale: string; country: string }> }) {
  const { locale: raw, country } = await ctx.params;
  const locale = isLocale(raw) ? (raw as Locale) : 'de';
  const items = (await getAllNews(locale)).filter((p) => p.meta.country === country).slice(0, 100);

  const url = new URL(req.url);
  const base = `${url.protocol}//${url.host}`;
  const rss = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<rss version=\"2.0\"><channel><title>Handwerk.Cloud – ${xmlEscape(country)} (${locale.toUpperCase()})</title><link>${xmlEscape(base)}/${locale}/regions/${encodeURIComponent(country)}</link><description>Latest news for ${xmlEscape(country)}</description>` +
  items.map((p) => { const link = `${base}/${locale}/news/${p.meta.slug}`; const pub = new Date(p.meta.date).toUTCString(); const desc = xmlEscape(p.meta.summary || ''); return `\n<item><title>${xmlEscape(p.meta.title)}</title><link>${xmlEscape(link)}</link><guid>${xmlEscape(link)}</guid><pubDate>${xmlEscape(pub)}</pubDate><description>${desc}</description></item>`; }).join('') + `</channel></rss>`;
  return new NextResponse(rss, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}

