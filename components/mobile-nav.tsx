'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LangSwitcher } from '@/components/lang-switcher';

export function MobileNav({
  locale,
  labels
}: {
  locale: 'de' | 'en';
  labels: { home: string; news: string; pricing: string; blog: string };
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 right-0 w-80 max-w-[90%] bg-white shadow-xl ring-1 ring-neutral-200 p-5 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="mt-4 grid gap-1">
              <Link href={`/${locale}`} className="rounded-md px-3 py-2 hover:bg-neutral-50">{labels.home}</Link>
              <Link href={`/${locale}/news`} className="rounded-md px-3 py-2 hover:bg-neutral-50">{labels.news}</Link>
              <Link href={`/${locale}/pricing`} className="rounded-md px-3 py-2 hover:bg-neutral-50">{labels.pricing}</Link>
              <Link href={`/${locale}/blog`} className="rounded-md px-3 py-2 hover:bg-neutral-50">{labels.blog}</Link>
            </nav>

            <div className="mt-auto pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Lang</span>
                <LangSwitcher />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

