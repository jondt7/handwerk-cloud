import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LangSwitcher } from './lang-switcher';

export function SiteHeader() {
  const t = useTranslations('common');

  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          {t('brand')}
        </Link>
        <nav className="flex items-center gap-6 text-sm text-neutral-700">
          <Link href="/de" className="hover:text-neutral-900">{t('nav.home')}</Link>
          <Link href="/de/pricing" className="hover:text-neutral-900">{t('nav.pricing')}</Link>
          <Link href="/de/blog" className="hover:text-neutral-900">{t('nav.blog')}</Link>
          <LangSwitcher />
        </nav>
      </div>
    </header>
  );
}
