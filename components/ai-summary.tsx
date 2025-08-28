import type {SourceRef} from '@/lib/posts';

export function AISummaryCard({
  summary, sources, labels
}: {
  summary: string;
  sources?: SourceRef[];
  labels: { title: string; sources: string };
}) {
  return (
    <aside className="border rounded-2xl p-5 bg-neutral-50">
      <h2 className="text-sm font-medium tracking-tight text-neutral-700">{labels.title}</h2>
      <p className="mt-2 text-neutral-800 whitespace-pre-line">{summary}</p>

      {sources && sources.length > 0 ? (
        <div className="mt-4">
          <div className="text-xs font-medium text-neutral-600 mb-1">{labels.sources}</div>
          <ul className="list-none m-0 p-0 text-sm">
            {sources.map((s, i) => (
              <li key={s.url + i}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">
                  {s.name ?? s.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
