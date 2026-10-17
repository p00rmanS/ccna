import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { labById, lessonById } from '../data';
import { CodeBlock, EmptyState, ProgressBar, useTaglish } from '../components/common/Common';
import { dispatch, useAppState } from '../store/store';

export default function LabPage() {
  const { labId = '' } = useParams();
  const lab = labById(labId);
  const state = useAppState();
  const tl = useTaglish();
  const [hints, setHints] = useState(0);
  const [solution, setSolution] = useState<'hidden' | 'confirm' | 'shown'>('hidden');

  if (!lab) return <EmptyState title="Lab not found" action={<Link className="btn btn-primary" to="/labs">All labs</Link>} />;
  const L = tl && lab.tl ? lab.tl : lab;
  const checks = state.labChecks[lab.id] ?? [];
  const complete = Boolean(state.completedLabs[lab.id]);
  const lesson = lessonById(lab.lessonId);
  const bookmarkKey = `lab:${lab.id}`;
  const bookmarked = state.bookmarks.includes(bookmarkKey);

  return (
    <article className="stack">
      <nav className="small muted" aria-label="Breadcrumb"><Link to="/labs">Labs</Link> › {lab.title}</nav>
      <header>
        <h1>{lab.title}</h1>
        <div className="row">
          <span className="badge">{lab.tool}</span>
          <span className="badge">⏱ {lab.minutes} min</span>
          {complete && <span className="badge badge-success">✓ Completed</span>}
          {lesson && <Link className="small" to={`/learn/${lesson.id}`}>From lesson: {lesson.title}</Link>}
        </div>
        <p style={{ marginTop: 10 }}><strong>Objective.</strong> {L.objective}</p>
      </header>

      <div className="grid grid-2">
        <section className="card" aria-labelledby="topo-h">
          <h2 id="topo-h">Topology and addressing</h2>
          {lab.topology ? <CodeBlock title="Topology" code={lab.topology} /> : <p className="muted">No devices to wire — this lab uses your own computer or a sheet of paper.</p>}
          {lab.addressing && (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Device</th><th>Interface</th><th>Address</th><th>Notes</th></tr></thead>
                <tbody>{lab.addressing.map((a, i) => <tr key={i}><td>{a.device}</td><td>{a.interface}</td><td><code>{a.address}</code></td><td>{a.note ?? ''}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </section>
        <section className="card" aria-labelledby="check-h">
          <h2 id="check-h">Validation checklist</h2>
          <ProgressBar value={(checks.length / lab.checklist.length) * 100} label="Checklist progress" tone={checks.length === lab.checklist.length ? 'success' : undefined} />
          <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
            {L.checklist.map((c, i) => (
              <li key={c}>
                <label className="row" style={{ fontWeight: 500, alignItems: 'flex-start', flexWrap: 'nowrap' }}>
                  <input type="checkbox" checked={checks.includes(i)} onChange={() => dispatch({ type: 'toggleLabCheck', labId: lab.id, index: i })} />
                  <span>{c}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card" aria-labelledby="steps-h">
        <h2 id="steps-h">Step-by-step instructions</h2>
        <ol className="steps">{L.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
      </section>

      <section className="card" aria-labelledby="hints-h">
        <h2 id="hints-h">Stuck? Ask for help in stages</h2>
        <p className="muted small">Try for a few minutes first. Hints come before the solution on purpose.</p>
        {L.hints.slice(0, hints).map((h, i) => <div className="callout callout-tip" key={i}><div className="callout-title">Hint {i + 1}</div><p>{h}</p></div>)}
        {hints < lab.hints.length && <button type="button" className="btn btn-sm" onClick={() => setHints(hints + 1)}>Show hint {hints + 1} of {lab.hints.length}</button>}
        <div style={{ marginTop: 14 }}>
          {solution === 'hidden' && <button type="button" className="btn btn-sm" onClick={() => setSolution('confirm')}>Show solution…</button>}
          {solution === 'confirm' && (
            <div className="feedback feedback-bad">
              <strong>Have you tried the hints?</strong>
              Looking now means copying instead of understanding. You can still show it.
              <div className="row" style={{ marginTop: 8 }}>
                <button type="button" className="btn btn-sm" onClick={() => setSolution('shown')}>Show solution</button>
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setSolution('hidden')}>Keep trying</button>
              </div>
            </div>
          )}
          {solution === 'shown' && (
            <div className="feedback feedback-ok">
              <strong>Solution</strong>
              <ul style={{ marginBottom: 0 }}>{L.solution.map((s, i) => <li key={i}>{s}</li>)}</ul>
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => setSolution('hidden')}>Hide</button>
            </div>
          )}
        </div>
      </section>

      {lab.breakIt && (
        <section className="callout callout-trap">
          <div className="callout-title">Now break it, then fix it</div>
          <p>{L.breakIt}</p>
        </section>
      )}

      <section className="card" aria-labelledby="track-h">
        <h2 id="track-h">Track your work</h2>
        <div className="field" style={{ maxWidth: 420 }}>
          <label htmlFor="pkt-file">Your Packet Tracer file name (optional)</label>
          <input id="pkt-file" type="text" placeholder="e.g. lab-ipv4-attempt1.pkt" value={state.labFiles[lab.id] ?? ''} onChange={(e) => dispatch({ type: 'setLabFile', id: lab.id, file: e.target.value })} />
          <span className="small muted">This app cannot open .pkt files; the name is stored only so you can find your own file later.</span>
        </div>
        <div className="row" style={{ marginTop: 14 }}>
          <button type="button" className={`btn ${complete ? '' : 'btn-primary'}`} onClick={() => dispatch({ type: complete ? 'uncompleteLab' : 'completeLab', id: lab.id })}>{complete ? '✓ Completed — undo' : 'I completed this lab'}</button>
          <button type="button" className="btn" aria-pressed={bookmarked} onClick={() => dispatch({ type: 'toggleBookmark', key: bookmarkKey })}>{bookmarked ? '★ Bookmarked' : '☆ Bookmark'}</button>
          <button type="button" className="btn btn-danger" onClick={() => { if (window.confirm('Reset this lab’s checklist and completion?')) { dispatch({ type: 'resetLab', id: lab.id }); setHints(0); setSolution('hidden'); } }}>Reset lab progress</button>
        </div>
      </section>
    </article>
  );
}
