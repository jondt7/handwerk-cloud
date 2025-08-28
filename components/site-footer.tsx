import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function SiteFooter() {
  const t = useTranslations('common');

  return (
    <footer className="border-t">
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 py-10 flex items-center justify-between text-sm text-neutral-600">
        <p>© {new Date().getFullYear()} Handwerk.Cloud</p>
        <nav className="flex items-center gap-6">
          <Link href="/de/legal/imprint" className="hover:text-neutral-900">{t('footer.imprint')}</Link>
          <Link href="/de/legal/privacy" className="hover:text-neutral-900">{t('footer.privacy')}</Link>
        </nav>
      </div>
    </footer>
  );
}
