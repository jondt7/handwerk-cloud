import type {Locale, PostMeta} from '@/lib/posts';

function fmt(date: string, locale: Locale) {
  try {
    return new Date(date).toLocaleDateString(
      locale === 'de' ? 'de-DE' : 'en-US',
      { year: 'numeric', month: 'long', day: '2-digit' }
    );
  } catch { return date; }
}

export function PostMetaBar({
  meta, locale, readMinutes, labels
}: {
  meta: PostMeta;
  locale: Locale;
  readMinutes: number;
  labels: { published: string; updated: string; readTime: (m: number) => string }
}) {
  return (
    <div className="text-sm text-neutral-600 flex flex-wrap items-center gap-x-4 gap-y-2">
      <span>{labels.readTime(readMinutes)}</span>
      <span aria-hidden>•</span>
      <span>{labels.published}: {fmt(meta.date, locale)}</span>
      {meta.updated ? (
        <>
          <span aria-hidden>•</span>
          <span>{labels.updated}: {fmt(meta.updated, locale)}</span>
        </>
      ) : null}
    </div>
  );
}
