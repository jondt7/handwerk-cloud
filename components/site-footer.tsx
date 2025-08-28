import Link from 'next/link';
import {getTranslations, getLocale} from 'next-intl/server';

export async function SiteFooter() {
  const t = await getTranslations('common');
  const locale = (await getLocale()) as 'de' | 'en';

  return (
    <footer className="border-t">
      <div className="container py-12 flex items-center justify-between text-sm text-neutral-600">
        <p>© {new Date().getFullYear()} Handwerk.Cloud</p>
        <nav className="flex items-center gap-6">
          <Link href={`/${locale}/legal/imprint`} className="hover:text-neutral-900 hover:underline underline-offset-4">
            {t('footer.imprint')}
          </Link>
          <Link href={`/${locale}/legal/privacy`} className="hover:text-neutral-900 hover:underline underline-offset-4">
            {t('footer.privacy')}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
