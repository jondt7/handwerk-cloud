import Link from 'next/link';
import Image from 'next/image';
import { timeAgo } from '@/lib/time';
import type { NewsMeta } from '@/lib/news';

export function NewsCard({ meta, locale }: { meta: NewsMeta; locale: 'de' | 'en' }) {
  const ago = timeAgo(meta.date, locale);

  return (
    <article className="ring-1 ring-neutral-200 rounded-xl p-5 hover:bg-neutral-50 hover:shadow-sm transition">
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-medium tracking-tight text-balance">
            <Link href={`/${locale}/news/${meta.slug}`} className="hover:underline">
              {meta.title}
            </Link>
          </h3>
          {meta.summary ? (
            <p className="text-neutral-600 mt-1 clamp-2 text-sm md:text-[0.95rem]">{meta.summary}</p>
          ) : null}
          <div className="mt-3 text-xs md:text-sm text-neutral-500 flex items-center gap-3">
            <span>{ago}</span>
            {meta.sourceName ? (
              <>
                <span aria-hidden>•</span>
                <span>{meta.sourceName}</span>
              </>
            ) : null}
            {meta.country ? (
              <>
                <span aria-hidden>•</span>
                <span>{meta.country}</span>
              </>
            ) : null}
          </div>
        </div>
        {meta.image ? (
          <div className="relative w-28 h-20 md:w-36 md:h-24 flex-shrink-0 overflow-hidden rounded-lg ring-1 ring-neutral-200 bg-neutral-100">
            <Image src={meta.image} alt="" fill sizes="(max-width: 768px) 112px, 144px" className="object-cover" />
          </div>
        ) : null}
      </div>
    </article>
  );
}

