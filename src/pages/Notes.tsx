import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { COMMANDS } from '../data/commands';
import { LESSONS, labById, lessonById } from '../data';
import { EmptyState, Markdown, PageHead } from '../components/common/Common';
import { dispatch, useAppState } from '../store/store';
import { downloadText } from '../utils/download';

function describeBookmark(key: string): { label: string; to: string; kind: string } | null {
  const [kind, id = ''] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
  if (kind === 'lesson') { const l = lessonById(id); return l ? { label: l.title, to: `/learn/${id}`, kind: 'Lesson' } : null; }
  if (kind === 'lab') { const l = labById(id); return l ? { label: l.title, to: `/labs/${id}`, kind: 'Lab' } : null; }
  if (kind === 'command') { const c = COMMANDS.find((x) => x.id === id); return c ? { label: c.command, to: '/commands', kind: 'Command' } : null; }
  return null;
}

export default function Notes() {
  const state = useAppState();
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');

  const notes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LESSONS.filter((l) => state.notes[l.id]).filter((l) => !q || state.notes[l.id]!.toLowerCase().includes(q) || l.title.toLowerCase().includes(q));
  }, [state.notes, query]);

  const exportAll = () => {
    const body = LESSONS.filter((l) => state.notes[l.id]).map((l) => `# ${l.title}\n\n${state.notes[l.id]}\n`).join('\n---\n\n');
    setMessage(downloadText('ccna-mastery-notes.md', body || '# No notes yet\n', 'text/markdown') ? 'Notes exported.' : 'Your browser blocked the download.');
  };

  const bookmarks = state.bookmarks.map((k) => ({ key: k, info: describeBookmark(k) }));

  return (
    <div className="stack">
      <PageHead title="Notes and bookmarks" eyebrow="Your workspace">
        Notes are written on each lesson page in Markdown and saved automatically on this device.
      </PageHead>

      <section className="card" aria-labelledby="notes-h">
        <div className="row row-between">
          <h2 id="notes-h" style={{ margin: 0 }}>Notes</h2>
          <button type="button" className="btn btn-sm" onClick={exportAll} disabled={Object.keys(state.notes).length === 0}>Export all as Markdown</button>
        </div>
        <div className="field" style={{ margin: '12px 0', maxWidth: 420 }}>
          <label htmlFor="notes-search">Search notes</label>
          <input id="notes-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your notes" />
        </div>
        <p role="status" className="small muted">{message}</p>
        {Object.keys(state.notes).length === 0 ? (
          <EmptyState title="No notes yet">Open any lesson and use the “My notes” box beside it. Mark commands with backticks and headings with #.</EmptyState>
        ) : notes.length === 0 ? (
          <p className="muted">No notes match your search.</p>
        ) : (
          <div className="stack">
            {notes.map((l) => (
              <article key={l.id} className="card card-flat">
                <div className="row row-between"><h3 style={{ margin: 0 }}>{l.title}</h3><Link className="btn btn-sm" to={`/learn/${l.id}`}>Edit in lesson</Link></div>
                <Markdown text={state.notes[l.id]!} />
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="card" aria-labelledby="bm-h">
        <h2 id="bm-h">Bookmarks</h2>
        {bookmarks.length === 0 ? (
          <p className="muted">Bookmark lessons, labs and commands with the ☆ button and they will be listed here.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {bookmarks.map(({ key, info }) => (
              <li key={key} className="row row-between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                {info ? <span><span className="badge">{info.kind}</span> <Link to={info.to}>{info.label}</Link></span> : <span className="muted">Unknown item ({key})</span>}
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => dispatch({ type: 'toggleBookmark', key })} aria-label={`Remove bookmark ${info?.label ?? key}`}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
