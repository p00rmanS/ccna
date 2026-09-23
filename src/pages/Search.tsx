import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { COMMANDS } from '../data/commands';
import { CURRICULUM } from '../data/curriculum';
import { FLASHCARDS, LABS, LESSONS, QUESTIONS } from '../data';
import { EmptyState, PageHead } from '../components/common/Common';
import { buildIndex, search, snippet, type SearchKind } from '../utils/search';

const ORDER: SearchKind[] = ['Lesson', 'Term', 'Command', 'Lab', 'Flashcard', 'Question', 'Planned module'];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const kind = params.get('kind') as SearchKind | null;
  const index = useMemo(() => buildIndex({ lessons: LESSONS, commands: COMMANDS, labs: LABS, flashcards: FLASHCARDS, questions: QUESTIONS, curriculum: CURRICULUM }), []);
  const hits = useMemo(() => search(index, q, 200), [index, q]);
  const counts = ORDER.map((k) => [k, hits.filter((h) => h.doc.kind === k).length] as const).filter(([, n]) => n > 0);
  const shown = kind ? hits.filter((h) => h.doc.kind === kind) : hits;
  const grouped = ORDER.map((k) => [k, shown.filter((h) => h.doc.kind === k)] as const).filter(([, list]) => list.length > 0);

  const setQuery = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set('q', value); else next.delete('q');
    setParams(next, { replace: true });
  };

  return (
    <div>
      <PageHead title="Search" eyebrow="Find anything">
        Lessons, glossary terms, commands, labs, flashcards, quiz questions and the planned roadmap — all in one place.
      </PageHead>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="card">
        <div className="field">
          <label htmlFor="search-page-input">Search the course</label>
          <input id="search-page-input" type="search" value={q} onChange={(e) => setQuery(e.target.value)} placeholder="Try: subnet, OSPF, switch, EUI-64, show ip interface brief" autoFocus autoComplete="off" />
        </div>
        {counts.length > 0 && (
          <div className="chips" style={{ marginTop: 12 }} role="group" aria-label="Filter results by type">
            <button type="button" className="chip" aria-pressed={!kind} onClick={() => { const n = new URLSearchParams(params); n.delete('kind'); setParams(n, { replace: true }); }}>All ({hits.length})</button>
            {counts.map(([k, n]) => (
              <button key={k} type="button" className="chip" aria-pressed={kind === k} onClick={() => { const nx = new URLSearchParams(params); nx.set('kind', k); setParams(nx, { replace: true }); }}>{k} ({n})</button>
            ))}
          </div>
        )}
      </form>

      <div role="status" className="small muted" style={{ margin: '12px 0' }}>
        {q.trim() === '' ? 'Type to search.' : `${hits.length} result${hits.length === 1 ? '' : 's'} for “${q}”`}
      </div>

      {q.trim() !== '' && hits.length === 0 && (
        <EmptyState title="Nothing found" action={<Link className="btn" to="/learn">Browse the course</Link>}>Try a shorter or different word. The topic may not be published yet — check the course roadmap.</EmptyState>
      )}

      <div className="stack">
        {grouped.map(([k, list]) => (
          <section key={k} aria-label={k}>
            <h2 style={{ fontSize: '1.05rem' }}>{k}{k === 'Term' ? 's' : k === 'Lesson' || k === 'Command' || k === 'Lab' ? 's' : k === 'Flashcard' ? 's' : k === 'Question' ? 's' : 's'} <span className="muted small">({list.length})</span></h2>
            <ul className="result-list">
              {list.slice(0, kind ? 200 : 8).map(({ doc }) => (
                <li key={doc.id}>
                  <Link to={doc.to}>{doc.title}</Link>
                  {doc.context && <span className="badge" style={{ marginLeft: 8 }}>{doc.context}</span>}
                  <div className="small muted">{snippet(doc.text, q)}</div>
                </li>
              ))}
            </ul>
            {!kind && list.length > 8 && <button type="button" className="btn btn-sm btn-ghost" onClick={() => { const n = new URLSearchParams(params); n.set('kind', k); setParams(n, { replace: true }); }}>Show all {list.length} {k.toLowerCase()} results</button>}
          </section>
        ))}
      </div>
    </div>
  );
}
