'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';

export function MainNav({
  locale,
  labels
}: {
  locale: 'de' | 'en';
  labels: { home: string; pricing: string; news: string; blog: string; allPosts: string };
}) {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const itemClass = (active?: boolean) =>
    clsx(
      'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors',
      active
        ? 'bg-neutral-100 text-neutral-900'
        : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
    );

  return (
    <div className="hidden md:flex items-center gap-2" ref={menuRef}>
      <Link href={`/${locale}`} className={itemClass(isActive(`/${locale}`))}>
        {labels.home}
      </Link>
      <Link href={`/${locale}/pricing`} className={itemClass(isActive(`/${locale}/pricing`))}>
        {labels.pricing}
      </Link>

      {/* News link */}
      <Link href={`/${locale}/news`} className={itemClass(isActive(`/${locale}/news`))}>
        {labels.news}
      </Link>

      {/* Blog dropdown */}
      <div className="relative">
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((v) => !v)}
          className={itemClass(isActive(`/${locale}/blog`))}
        >
          {labels.blog}
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
            className={clsx('transition-transform', open ? 'rotate-180' : 'rotate-0')}
          >
            <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open ? (
          <div
            role="menu"
            className="absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-xl bg-white ring-1 ring-neutral-200 shadow-md p-2 z-50"
          >
            <Link
              href={`/${locale}/blog`}
              className="block rounded-md px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {labels.allPosts}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
