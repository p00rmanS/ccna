import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CURRICULUM } from '../data/curriculum';
import { DOMAINS } from '../data/domains';
import { LESSONS, lessonById, moduleOfLesson } from '../data';
import { PageHead, ProgressBar } from '../components/common/Common';
import { useAppState } from '../store/store';
import { recommendedLesson } from '../store/derived';

export default function Learn() {
  const state = useAppState();
  const [showPlanned, setShowPlanned] = useState(true);
  const [domain, setDomain] = useState<string>('all');
  const next = recommendedLesson(state, LESSONS);
  const completedCount = LESSONS.filter((l) => state.completedLessons[l.id]).length;
  const modules = CURRICULUM.flatMap((p) => p.modules);
  const publishedModules = modules.filter((m) => m.lessonIds.length > 0).length;

  return (
    <div>
      <PageHead title="Course" eyebrow="Learn">
        The full CCNA path, in order. Published modules are ready to study; planned modules are on the roadmap and show what they will cover — nothing is padded with filler.
      </PageHead>
      <section className="card continue-card" aria-label="Continue learning">
        {next ? (
          <>
            <div>
              <span className="eyebrow">{completedCount === 0 ? 'Start here' : 'Up next'}{moduleOfLesson(next.id) ? ` · Module ${moduleOfLesson(next.id)!.id}` : ''}</span>
              <h3 style={{ margin: '2px 0 4px' }}>{next.title}</h3>
              <p className="muted small" style={{ margin: 0 }}>{next.estimatedMinutes} min · {next.difficulty} · {completedCount} of {LESSONS.length} lessons completed</p>
            </div>
            <Link className="btn btn-primary" to={`/learn/${next.id}`}>{completedCount === 0 ? 'Start lesson' : 'Continue'} →</Link>
          </>
        ) : (
          <p style={{ margin: 0 }}><strong>All {LESSONS.length} published lessons are complete.</strong> Review with flashcards and practice exams while new modules are added.</p>
        )}
      </section>
      <div className="chip-row" role="group" aria-label="Filter by exam domain">
        <button type="button" className="chip" aria-pressed={domain === 'all'} onClick={() => setDomain('all')}>All domains</button>
        {DOMAINS.map((d) => (
          <button key={d.id} type="button" className="chip" aria-pressed={domain === d.id} onClick={() => setDomain(d.id)}>{d.number} {d.name}</button>
        ))}
      </div>
      <div className="row row-between" style={{ marginBottom: 18 }}>
        <span className="badge badge-primary">{LESSONS.length} lessons published · {publishedModules} of {modules.length} modules</span>
        <label className="row" style={{ fontWeight: 500 }}>
          <input type="checkbox" checked={showPlanned} onChange={(e) => setShowPlanned(e.target.checked)} /> Show planned modules
        </label>
      </div>
      <div className="stack">
        {CURRICULUM.map((phase) => {
          const visible = phase.modules.filter((m) => (showPlanned || m.lessonIds.length > 0) && (domain === 'all' || m.domain === domain));
          if (visible.length === 0) return null;
          return (
            <section key={phase.id} aria-labelledby={`${phase.id}-h`}>
              <h2 id={`${phase.id}-h`}>{phase.title}</h2>
              <p className="muted">{phase.blurb}</p>
              <div className="grid grid-auto">
                {visible.map((m) => {
                  const lessons = m.lessonIds.map((id) => lessonById(id)!).filter(Boolean);
                  const done = lessons.filter((l) => state.completedLessons[l.id]).length;
                  const minutes = lessons.reduce((n, l) => n + l.estimatedMinutes, 0);
                  const published = lessons.length > 0;
                  return (
                    <article key={m.id} className="module" data-domain={m.domain} data-status={published ? 'published' : 'planned'}>
                      <div className="row row-between">
                        <span className="eyebrow">Module {m.id}</span>
                        <span className={`badge ${published ? 'badge-success' : ''}`}>{published ? 'Published' : 'Planned'}</span>
                      </div>
                      <h3 style={{ margin: '4px 0' }}>{m.title}</h3>
                      {published ? (
                        <>
                          <p className="muted small" style={{ margin: '0 0 8px' }}>{lessons.length} lesson{lessons.length === 1 ? '' : 's'} · {minutes} min · {done} completed</p>
                          <ProgressBar value={(done / lessons.length) * 100} label={`Module ${m.id} progress`} tone={done === lessons.length ? 'success' : undefined} />
                          <ul className="module-lessons">
                            {lessons.map((l) => (
                              <li key={l.id}>
                                <Link to={`/learn/${l.id}`}>
                                  <span className="check" data-done={Boolean(state.completedLessons[l.id])} aria-hidden="true">✓</span>
                                  <span>{l.title}<span className="sr-only">{state.completedLessons[l.id] ? ' (completed)' : ''}</span></span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <>
                          <ul className="topic-list" style={{ margin: '6px 0 0', paddingLeft: '1.1em' }}>{m.topics.map((t) => <li key={t}>{t}</li>)}</ul>
                          {m.note && <p className="small muted" style={{ marginTop: 8, marginBottom: 0 }}>{m.note}</p>}
                        </>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
