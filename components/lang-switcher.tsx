'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { useMemo } from 'react';

function switchLocaleInPath(pathname: string, target: Locale) {
  const parts = pathname.split('/').filter(Boolean); // ['', 'de', '...'] -> ['de', ...]
  if (parts.length === 0) return `/${target}`;
  const currentMaybeLocale = parts[0];
  if (locales.includes(currentMaybeLocale as Locale)) {
    parts[0] = target;
  } else {
    parts.unshift(target);
  }
  return '/' + parts.join('/');
}

export function LangSwitcher() {
  const pathname = usePathname() || '/';
  const router = useRouter();

  const current = useMemo<Locale>(() => {
    const p = pathname.split('/').filter(Boolean);
    return locales.includes((p[0] as Locale)) ? (p[0] as Locale) : 'de';
  }, [pathname]);

  const other: Locale = current === 'de' ? 'en' : 'de';

  return (
    <button
      onClick={() => router.push(switchLocaleInPath(pathname, other))}
      className="text-sm text-neutral-600 hover:text-neutral-900"
      aria-label={`Switch language to ${other.toUpperCase()}`}
    >
      {other.toUpperCase()}
    </button>
  );
}
