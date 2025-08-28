import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export type Locale = 'de' | 'en';

export type SourceRef = { name?: string; url: string };

export type PostMeta = {
  title: string;
  date: string;          // ISO-8601 (published)
  updated?: string;      // ISO-8601 (last modified)
  description?: string;
  tags?: string[];
  locale: Locale;
  slug: string;
  aiSummary?: string;    // kurze KI-Zusammenfassung (oben im Artikel)
  sources?: SourceRef[]; // Quellenliste
};

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'blog');

async function readDirSafe(dir: string): Promise<string[]> {
  try { return await fs.readdir(dir); } catch { return []; }
}

export async function getPostSlugs(locale: Locale): Promise<string[]> {
  const dir = path.join(CONTENT_ROOT, locale);
  const files = await readDirSafe(dir);
  return files
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.mdx?$/, ''));
}

export async function getPostBySlug(
  locale: Locale,
  slug: string
): Promise<{ meta: PostMeta; content: string } | null> {
  const filePath = path.join(CONTENT_ROOT, locale, `${slug}.md`);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(raw);

    const src = (data as unknown as { sources?: unknown }).sources;
    const sources: SourceRef[] = Array.isArray(src)
      ? src
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
          .filter((s): s is SourceRef => Boolean(s && s.url && s.url.length > 0))
      : [];

    const meta: PostMeta = {
      title: data.title ?? slug,
      date: data.date ?? new Date().toISOString(),
      updated: data.updated,
      description: data.description ?? '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      aiSummary: typeof data.aiSummary === 'string' ? data.aiSummary : undefined,
      sources,
      locale,
      slug
    };
    return { meta, content };
  } catch {
    return null;
  }
}

export async function getAllPosts(
  locale: Locale
): Promise<Array<{ meta: PostMeta; content: string }>> {
  const slugs = await getPostSlugs(locale);
  const posts = await Promise.all(slugs.map((s) => getPostBySlug(locale, s)));
  const present = posts.filter(Boolean) as Array<{ meta: PostMeta; content: string }>;
  present.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
  return present;
}

export function estimateReadingMinutes(content: string, locale: Locale): number {
  // Grobe Schätzung: DE ~210 WPM, EN ~230 WPM
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const wpm = locale === 'de' ? 210 : 230;
  return Math.max(1, Math.round(words / wpm));
}
