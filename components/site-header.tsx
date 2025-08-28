import Link from 'next/link';
import {getTranslations, getLocale} from 'next-intl/server';
import { LangSwitcher } from '@/components/lang-switcher';
import { MainNav } from '@/components/main-nav';
import { MobileNav } from '@/components/mobile-nav';

export async function SiteHeader() {
  const t = await getTranslations('common');
  const locale = (await getLocale()) as 'de' | 'en';

  return (
    <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-semibold tracking-tight hover:opacity-80">
          {t('brand')}
        </Link>
        <nav className="flex items-center gap-4">
          <MobileNav
            locale={locale}
            labels={{
              home: t('nav.home'),
              news: t('nav.news'),
              pricing: t('nav.pricing'),
              blog: t('nav.blog')
            }}
          />
          <MainNav
            locale={locale}
            labels={{
              home: t('nav.home'),
              pricing: t('nav.pricing'),
              news: t('nav.news'),
              blog: t('nav.blog'),
              allPosts: locale === 'de' ? 'Alle Beiträge' : 'All posts'
            }}
          />
          <div className="h-5 w-px bg-neutral-200 hidden md:block" aria-hidden></div>
          <div className="hidden md:block">
            <LangSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}
