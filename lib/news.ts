import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type { SourceRef } from '@/lib/posts';

export type Locale = 'de' | 'en';

export type NewsMeta = {
  title: string;
  summary?: string;
  date: string;               // ISO published
  updated?: string;           // ISO updated
  topics?: string[];          // thematische Schwerpunkte
  tags?: string[];            // freie Schlagworte
  country?: string;           // ISO country code or name
  city?: string;
  sourceUrl?: string;
  sourceName?: string;
  sourceDomain?: string;
  image?: string;
  imageCredit?: string;
  locale: Locale;
  slug: string;            // routing slug (e.g., title-ddMM)
  aiSummary?: string;      // kurze KI-Zusammenfassung
  sources?: SourceRef[];   // Quellenliste
};

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'news');

async function readDirSafe(dir: string): Promise<string[]> {
  try { return await fs.readdir(dir); } catch { return []; }
}

function parseSources(input: unknown): SourceRef[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((s: unknown) => {
      if (typeof s === 'string') return { url: s } as SourceRef;
      if (s && typeof s === 'object') {
        const rec = s as { name?: unknown; url?: unknown };
        const url = typeof rec.url === 'string' ? rec.url : undefined;
        const name = typeof rec.name === 'string' ? rec.name : undefined;
        return url ? ({ name, url } satisfies SourceRef) : undefined;
      }
      return undefined;
    })
    .filter((s): s is SourceRef => Boolean(s && s.url && s.url.length > 0));
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}+/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function suffixFromDate(dateIso?: string): string | null {
  if (!dateIso) return null;
  const d = new Date(dateIso);
  if (isNaN(d.getTime())) return null;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}${mm}`; // e.g., 2508
}

function computeRouteSlug(title?: string, date?: string, fallback?: string): string {
  const base = title ? slugify(title) : (fallback ? slugify(fallback) : 'item');
  const suf = suffixFromDate(date);
  return suf ? `${base}-${suf}` : base;
}

export async function getNewsSlugs(locale: Locale): Promise<string[]> {
  const dir = path.join(CONTENT_ROOT, locale);
  const files = (await readDirSafe(dir)).filter((f) => f.endsWith('.md'));
  const slugs: string[] = [];
  for (const f of files) {
    try {
      const raw = await fs.readFile(path.join(dir, f), 'utf8');
      const { data } = matter(raw);
      const explicit = typeof data.slug === 'string' ? data.slug : undefined;
      const route = explicit || computeRouteSlug(data.title, data.date, f.replace(/\.mdx?$/, ''));
      slugs.push(route);
    } catch {
      slugs.push(f.replace(/\.mdx?$/, ''));
    }
  }
  return slugs;
}

export async function getNewsBySlug(
  locale: Locale,
  slug: string
): Promise<{ meta: NewsMeta; content: string } | null> {
  const dir = path.join(CONTENT_ROOT, locale);
  const files = (await readDirSafe(dir)).filter((f) => f.endsWith('.md'));
  for (const f of files) {
    try {
      const raw = await fs.readFile(path.join(dir, f), 'utf8');
      const { data, content } = matter(raw);
      const explicit = typeof data.slug === 'string' ? data.slug : undefined;
      const route = explicit || computeRouteSlug(data.title, data.date, f.replace(/\.mdx?$/, ''));
      if (route !== slug) continue;

      const sources: SourceRef[] = parseSources((data as unknown as { sources?: unknown }).sources);

      const meta: NewsMeta = {
        title: data.title ?? route,
        summary: data.summary ?? data.description ?? '',
        date: data.date ?? new Date().toISOString(),
        updated: data.updated,
        topics: Array.isArray(data.topics) ? data.topics : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        country: typeof data.country === 'string' ? data.country : undefined,
        city: typeof data.city === 'string' ? data.city : undefined,
        sourceUrl: typeof data.sourceUrl === 'string' ? data.sourceUrl : undefined,
        sourceName: typeof data.sourceName === 'string' ? data.sourceName : undefined,
        sourceDomain: typeof data.sourceDomain === 'string' ? data.sourceDomain : undefined,
        image: typeof data.image === 'string' ? data.image : undefined,
        imageCredit: typeof data.imageCredit === 'string' ? data.imageCredit : undefined,
        locale,
        slug: route,
        aiSummary: typeof data.aiSummary === 'string' ? data.aiSummary : undefined,
        sources
      };
      return { meta, content };
    } catch {
      continue;
    }
  }
  return null;
}

export async function getAllNews(locale: Locale): Promise<Array<{ meta: NewsMeta; content: string }>> {
  const dir = path.join(CONTENT_ROOT, locale);
  const files = (await readDirSafe(dir)).filter((f) => f.endsWith('.md'));
  const present: Array<{ meta: NewsMeta; content: string }> = [];
  for (const f of files) {
    try {
      const raw = await fs.readFile(path.join(dir, f), 'utf8');
      const { data, content } = matter(raw);
      const route = (typeof data.slug === 'string' && data.slug) || computeRouteSlug(data.title, data.date, f.replace(/\.mdx?$/, ''));
      const sources: SourceRef[] = parseSources((data as unknown as { sources?: unknown }).sources);

      const meta: NewsMeta = {
        title: data.title ?? route,
        summary: data.summary ?? data.description ?? '',
        date: data.date ?? new Date().toISOString(),
        updated: data.updated,
        topics: Array.isArray(data.topics) ? data.topics : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        country: typeof data.country === 'string' ? data.country : undefined,
        city: typeof data.city === 'string' ? data.city : undefined,
        sourceUrl: typeof data.sourceUrl === 'string' ? data.sourceUrl : undefined,
        sourceName: typeof data.sourceName === 'string' ? data.sourceName : undefined,
        sourceDomain: typeof data.sourceDomain === 'string' ? data.sourceDomain : undefined,
        image: typeof data.image === 'string' ? data.image : undefined,
        imageCredit: typeof data.imageCredit === 'string' ? data.imageCredit : undefined,
        locale,
        slug: route,
        aiSummary: typeof data.aiSummary === 'string' ? data.aiSummary : undefined,
        sources
      };
      present.push({ meta, content });
    } catch {
      continue;
    }
  }
  present.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
  return present;
}

export function estimateReadingMinutes(content: string, locale: Locale): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const wpm = locale === 'de' ? 210 : 230;
  return Math.max(1, Math.round(words / wpm));
}
