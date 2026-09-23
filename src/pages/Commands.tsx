import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { COMMANDS, COMMAND_CATEGORIES } from '../data/commands';
import { lessonById } from '../data';
import { CodeBlock, EmptyState, PageHead } from '../components/common/Common';
import { dispatch, useAppState } from '../store/store';

export default function Commands() {
  const state = useAppState();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMMANDS.filter((c) => {
      if (category !== 'All' && c.category !== category) return false;
      if (onlyBookmarks && !state.bookmarks.includes(`command:${c.id}`)) return false;
      if (!q) return true;
      return [c.command, c.purpose, c.syntax, c.example, c.category, c.mistake].some((f) => f.toLowerCase().includes(q));
    });
  }, [query, category, onlyBookmarks, state.bookmarks]);

  return (
    <div>
      <PageHead title="Command library" eyebrow="Reference">
        Searchable Cisco IOS commands and the host tools you use beside them. Every card shows the mode, an example, how to verify it, and the mistake to avoid.
      </PageHead>
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="field">
          <label htmlFor="cmd-search">Search commands</label>
          <input id="cmd-search" type="search" placeholder="e.g. vlan, ospf, no shutdown" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="chips" style={{ marginTop: 12 }} role="group" aria-label="Filter by category">
          {['All', ...COMMAND_CATEGORIES].map((c) => <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}
        </div>
        <label className="row" style={{ fontWeight: 500, marginTop: 12 }}>
          <input type="checkbox" checked={onlyBookmarks} onChange={(e) => setOnlyBookmarks(e.target.checked)} /> Bookmarked only
        </label>
      </div>
      <p className="muted small" role="status">{results.length} command{results.length === 1 ? '' : 's'} shown</p>
      {results.length === 0 ? (
        <EmptyState title="No commands match">Try a shorter search term or choose “All” categories.</EmptyState>
      ) : (
        <div className="grid grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))' }}>
          {results.map((c) => {
            const key = `command:${c.id}`;
            const bookmarked = state.bookmarks.includes(key);
            const lesson = c.lessonId ? lessonById(c.lessonId) : undefined;
            return (
              <article key={c.id} className="card cmd-card">
                <div className="row row-between">
                  <span className="badge badge-primary">{c.category}</span>
                  <button type="button" className="btn btn-sm btn-ghost" aria-pressed={bookmarked} onClick={() => dispatch({ type: 'toggleBookmark', key })} aria-label={`${bookmarked ? 'Remove bookmark for' : 'Bookmark'} ${c.command}`}>{bookmarked ? '★' : '☆'}</button>
                </div>
                <h2 style={{ fontSize: '1.15rem', marginTop: 6 }}><code>{c.command}</code></h2>
                <p>{c.purpose}</p>
                <CodeBlock title={`Mode: ${c.mode}`} code={c.example} />
                <dl>
                  <dt>Syntax</dt><dd><code style={{ whiteSpace: 'pre-wrap' }}>{c.syntax}</code></dd>
                  {c.verification && <><dt>Verify</dt><dd>{c.verification}</dd></>}
                  <dt>Common mistake</dt><dd>{c.mistake}</dd>
                  {lesson && <><dt>Lesson</dt><dd><Link to={`/learn/${lesson.id}`}>{lesson.title}</Link></dd></>}
                </dl>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
