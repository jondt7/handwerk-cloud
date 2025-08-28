'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import clsx from 'clsx';

export function NavLink({href, children}: {href: string; children: React.ReactNode}) {
  const pathname = usePathname() || '/';
  const active = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'text-sm transition-colors underline-offset-4',
        active ? 'text-neutral-900 underline' : 'text-neutral-700 hover:text-neutral-900 hover:underline'
      )}
    >
      {children}
    </Link>
  );
}
