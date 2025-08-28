// app/sitemap.ts
import type {MetadataRoute} from 'next';
import {locales, type Locale} from '@/i18n/config';
import {getPostSlugs} from '@/lib/posts';
import {getNewsSlugs} from '@/lib/news';

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();
  const urls: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Home
    urls.push({
      url: `${base}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: locale === 'de' ? 1 : 0.8,
      alternates: {
        languages: {
          'de-DE': `${base}/de`,
          'en-US': `${base}/en`
        }
      }
    });

    // Blog index
    urls.push({
      url: `${base}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
      alternates: {
        languages: {
          'de-DE': `${base}/de/blog`,
          'en-US': `${base}/en/blog`
        }
      }
    });

    // News index
    urls.push({
      url: `${base}/${locale}/news`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.85,
      alternates: {
        languages: {
          'de-DE': `${base}/de/news`,
          'en-US': `${base}/en/news`
        }
      }
    });

    // Blog posts
    const slugs = await getPostSlugs(locale as Locale);
    for (const slug of slugs) {
      urls.push({
        url: `${base}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
        alternates: {
          languages: {
            'de-DE': `${base}/de/blog/${slug}`,
            'en-US': `${base}/en/blog/${slug}`
          }
        }
      });
    }

    // News items
    const nslugs = await getNewsSlugs(locale as Locale);
    for (const slug of nslugs) {
      urls.push({
        url: `${base}/${locale}/news/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.8,
        alternates: {
          languages: {
            'de-DE': `${base}/de/news/${slug}`,
            'en-US': `${base}/en/news/${slug}`
          }
        }
      });
    }
  }

  return urls;
}
