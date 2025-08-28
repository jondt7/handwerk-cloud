export function timeAgo(iso: string, locale: 'de' | 'en'): string {
  const rtf = new Intl.RelativeTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', { numeric: 'auto' });
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = then - now; // negative if past

  const abs = Math.abs(diff);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (abs < minute) return rtf.format(Math.round(diff / 1000), 'second');
  if (abs < hour) return rtf.format(Math.round(diff / minute), 'minute');
  if (abs < day) return rtf.format(Math.round(diff / hour), 'hour');
  if (abs < week) return rtf.format(Math.round(diff / day), 'day');
  return rtf.format(Math.round(diff / week), 'week');
}

