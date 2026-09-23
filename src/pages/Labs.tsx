import { Link } from 'react-router-dom';
import { LABS, lessonById } from '../data';
import { PageHead } from '../components/common/Common';
import { useAppState } from '../store/store';

export default function Labs() {
  const state = useAppState();
  const done = LABS.filter((l) => state.completedLabs[l.id]).length;
  return (
    <div>
      <PageHead title="Hands-on labs" eyebrow="Practice">
        Every lesson has a lab. Follow the philosophy: learn, configure, verify, break it, troubleshoot, rebuild from memory — without copying and pasting.
      </PageHead>
      <p><span className="badge badge-primary">{done} of {LABS.length} completed</span></p>
      <div className="grid grid-auto">
        {LABS.map((lab) => {
          const complete = Boolean(state.completedLabs[lab.id]);
          const checks = (state.labChecks[lab.id] ?? []).length;
          return (
            <article className="card" key={lab.id}>
              <div className="row row-between">
                <span className="badge">{lab.tool}</span>
                {complete ? <span className="badge badge-success">✓ Completed</span> : checks > 0 ? <span className="badge badge-warning">In progress</span> : <span className="badge">Not started</span>}
              </div>
              <h3 style={{ marginTop: 10 }}>{lab.title}</h3>
              <p className="muted small">{lab.objective}</p>
              <p className="small muted">From: {lessonById(lab.lessonId)?.title} · ⏱ {lab.minutes} min · {checks}/{lab.checklist.length} checks</p>
              <Link className="btn btn-primary" to={`/labs/${lab.id}`}>{complete ? 'Review lab' : checks > 0 ? 'Continue lab' : 'Start lab'}</Link>
            </article>
          );
        })}
      </div>
      <p className="muted small" style={{ marginTop: 20 }}>
        Packet Tracer is a free simulator from Cisco Networking Academy. Its behaviour can differ from real IOS devices; where that matters, the lab says so.
      </p>
    </div>
  );
}
