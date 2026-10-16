import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DOMAINS } from '../data/domains';
import { FLASHCARDS, LABS, LESSONS, QUESTIONS, lessonById, totalMinutes } from '../data';
import { ProgressBar, Stat } from '../components/common/Common';
import { HeroArt } from '../components/common/HeroArt';
import { CLI_TASKS } from '../data/cliTasks';
import { computeStreaks, dayKey, topicAccuracy, weakTopics, type Onboarding } from '../store/state';
import { cardsDue, domainProgress, newCards, quizAccuracy, recommendPlan, recommendedLesson, subnettingAccuracy } from '../store/derived';
import { dispatch, useAppState } from '../store/store';

const EXPERIENCE: Array<[Onboarding['experience'], string]> = [['new', 'Brand new to networking'], ['some-it', 'Some IT knowledge'], ['student', 'Networking student'], ['professional', 'Working IT professional']];
const GOALS: Array<[Onboarding['goal'], string]> = [['learn', 'Learn networking'], ['pass', 'Pass the CCNA'], ['school', 'Prepare for school'], ['job', 'Improve job skills']];
const MINUTES: Array<[Onboarding['minutesPerDay'], string]> = [[30, '30 min / day'], [60, '1 hour / day'], [90, '90 min / day'], [120, '2 hours / day']];

function OnboardingCard() {
  const state = useAppState();
  const saved = state.settings.onboarding;
  const [editing, setEditing] = useState(saved === null);
  const [form, setForm] = useState<Onboarding>(saved ?? { experience: 'new', goal: 'pass', minutesPerDay: 60 });
  const plan = saved ? recommendPlan(saved, LESSONS) : null;

  if (!editing && plan) {
    return (
      <section className="card" aria-labelledby="plan-h">
        <div className="row row-between">
          <h2 id="plan-h" style={{ margin: 0 }}>Your starting plan</h2>
          <button type="button" className="btn btn-sm" onClick={() => setEditing(true)}>Change answers</button>
        </div>
        <p><strong>{plan.headline}</strong></p>
        <p className="muted">Start at: {plan.startAt}</p>
        <p className="muted" style={{ marginBottom: 0 }}>{plan.detail}</p>
      </section>
    );
  }
  return (
    <section className="card" aria-labelledby="ob-h">
      <h2 id="ob-h">Tell us about you</h2>
      <p className="muted">Three quick questions to suggest where to start. Nothing leaves your device.</p>
      <form
        onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'setSettings', settings: { onboarding: form } }); setEditing(false); }}
        className="grid grid-3"
      >
        <div className="field">
          <label htmlFor="ob-exp">Experience</label>
          <select id="ob-exp" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value as Onboarding['experience'] })}>{EXPERIENCE.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        </div>
        <div className="field">
          <label htmlFor="ob-goal">Goal</label>
          <select id="ob-goal" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value as Onboarding['goal'] })}>{GOALS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        </div>
        <div className="field">
          <label htmlFor="ob-min">Study time</label>
          <select id="ob-min" value={form.minutesPerDay} onChange={(e) => setForm({ ...form, minutesPerDay: Number(e.target.value) as Onboarding['minutesPerDay'] })}>{MINUTES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        </div>
        <div><button type="submit" className="btn btn-primary">Show my plan</button></div>
      </form>
    </section>
  );
}

export default function Dashboard() {
  const state = useAppState();
  const now = Date.now();
  const streaks = useMemo(() => computeStreaks(state.studyDays, dayKey(now)), [state.studyDays, now]);
  const next = recommendedLesson(state, LESSONS);
  const rows = useMemo(() => domainProgress(state, DOMAINS, LESSONS), [state]);
  const acc = useMemo(() => topicAccuracy(state, QUESTIONS), [state]);
  const weak = weakTopics(acc);
  const started = state.studyDays.length > 0;
  const due = cardsDue(state, FLASHCARDS, now);
  const fresh = newCards(state, FLASHCARDS);
  const qa = quizAccuracy(state);
  const sa = subnettingAccuracy(state);
  const completed = LESSONS.filter((l) => state.completedLessons[l.id]).length;
  const labsDone = Object.keys(state.completedLabs).length;
  const nextCli = CLI_TASKS.find((t) => !state.cliTasks[t.id]);
  const today: Array<{ key: string; to: string; icon: string; title: string; detail: string }> = [];
  if (due > 0) today.push({ key: 'cards', to: '/flashcards', icon: 'SRS', title: `Review ${due} flashcard${due === 1 ? '' : 's'}`, detail: 'spaced repetition works best when you show up on time' });
  if (next) today.push({ key: 'lesson', to: `/learn/${next.id}`, icon: 'LRN', title: `${started ? 'Continue' : 'Start'}: ${next.title}`, detail: `about ${next.estimatedMinutes} minutes` });
  if (weak[0]) today.push({ key: 'weak', to: `/learn/${weak[0].lessonId}`, icon: 'FIX', title: `Revisit ${lessonById(weak[0].lessonId)?.title}`, detail: `you are at ${Math.round(weak[0].accuracy * 100)}% on it` });
  if (nextCli) today.push({ key: 'cli', to: '/cli', icon: 'CLI', title: `CLI practice: ${nextCli.title}`, detail: 'type real IOS commands' });
  today.push({ key: 'subnet', to: '/subnetting', icon: 'SUB', title: '10-minute subnetting drill', detail: 'speed comes from repetition' });
  if (state.quizAttempts.length >= 3 && state.examHistory.length === 0) today.push({ key: 'exam', to: '/exams', icon: 'EXM', title: 'Try a 20-question practice exam', detail: 'find your gaps under time pressure' });

  return (
    <div className="stack">
      <section className="hero" aria-labelledby="hero-h">
      <div className="hero-grid">
       <div>
        <div className="eyebrow">Cisco 200-301 CCNA · independent study platform</div>
        <h1 id="hero-h">Master the CCNA</h1>
        <p className="hero-lead">From zero networking knowledge to exam-ready. Learn visually, build real Cisco configurations, master subnetting and troubleshoot real scenarios.</p>
        <div className="row" style={{ marginTop: 16 }}>
          {next ? <Link className="btn btn-primary" to={`/learn/${next.id}`}>{started ? 'Continue course' : 'Start learning'}</Link> : <Link className="btn btn-primary" to="/learn">Review the course</Link>}
          <Link className="btn" to="/subnetting">Practice subnetting</Link>
          <Link className="btn" to="/learn">See the full course</Link>
        </div>
       </div>
       <HeroArt />
      </div>
      </section>

      <section className="card" aria-labelledby="today-h">
        <h2 id="today-h">Today’s plan</h2>
        <p className="muted small">A short, sensible list based on what you have actually done. Do as much as you can — even 20 minutes keeps the streak alive.</p>
        <ul className="today">
          {today.map((t) => (
            <li key={t.key}><Link to={t.to}><span aria-hidden="true">{t.icon}</span><span><strong>{t.title}</strong><span className="muted small"> — {t.detail}</span></span></Link></li>
          ))}
        </ul>
      </section>

      <OnboardingCard />

      <section aria-labelledby="stats-h">
        <h2 id="stats-h" className="sr-only">Your statistics</h2>
        <div className="grid grid-4">
          <Stat label="Study streak" value={`${streaks.current} day${streaks.current === 1 ? '' : 's'}`} hint={streaks.longest ? `Longest: ${streaks.longest}` : 'Study today to start one'} />
          <Stat label="Lessons completed" value={`${completed} / ${LESSONS.length}`} hint={`Published so far · about ${Math.round(totalMinutes() / 60)} h`} />
          <Stat label="Quiz accuracy" value={qa === null ? '—' : `${qa}%`} hint={qa === null ? 'Take a lesson quiz' : `${state.quizAttempts.length} attempt${state.quizAttempts.length === 1 ? '' : 's'}`} />
          <Stat label="Subnetting accuracy" value={sa === null ? '—' : `${sa}%`} hint={sa === null ? 'Try the trainer' : `${state.subnetting.attempted} answered`} />
          <Stat label="Labs completed" value={`${labsDone} / ${LABS.length}`} hint="Packet Tracer and paper labs" />
          <Stat label="Flashcards due" value={due} hint={`${fresh} new card${fresh === 1 ? '' : 's'} waiting`} />
        </div>
      </section>

      <div className="grid grid-2">
        <section className="card" aria-labelledby="next-h">
          <h2 id="next-h">Recommended next</h2>
          {next ? (
            <>
              <h3 style={{ marginBottom: 2 }}>{next.title}</h3>
              <p className="muted">{next.description}</p>
              <div className="row"><span className="badge">⏱ {next.estimatedMinutes} min</span><Link className="btn btn-primary" to={`/learn/${next.id}`}>Open lesson</Link></div>
            </>
          ) : (
            <p className="muted">You have completed every published lesson. Review your weak topics, keep your flashcards current and drill subnetting while more modules are added.</p>
          )}
        </section>
        <section className="card" aria-labelledby="review-h">
          <h2 id="review-h">Review queue</h2>
          {weak.length === 0 ? (
            <p className="muted">{state.quizAttempts.length === 0 ? 'Take a lesson quiz and your weakest topics will appear here.' : 'No weak topics yet. A topic appears here after at least three answers with under 70% accuracy.'}</p>
          ) : (
            <ol>
              {weak.slice(0, 5).map((w) => (
                <li key={w.lessonId}>
                  <Link to={`/learn/${w.lessonId}`}>{lessonById(w.lessonId)?.title}</Link> <span className="muted small">— {Math.round(w.accuracy * 100)}% over {w.seen} answers</span>
                </li>
              ))}
            </ol>
          )}
          {due > 0 && <p><Link to="/flashcards">{due} flashcard{due === 1 ? '' : 's'} due for review →</Link></p>}
        </section>
      </div>

      <section className="card" aria-labelledby="domains-h">
        <h2 id="domains-h">Domain progress</h2>
        <p className="muted small">Weights come from the CCNA 200-301 blueprint. Progress counts only lessons published so far — the other domains are on the course roadmap.</p>
        <div className="stack">
          {rows.map((r) => (
            <div key={r.domain.id}>
              <div className="row row-between">
                <span><strong>{r.domain.number} {r.domain.name}</strong> <span className="muted small">· {r.domain.weight}% of exam</span></span>
                <span className="small muted">{r.percent === null ? 'No lessons published yet' : `${r.completed} of ${r.published} lessons`}</span>
              </div>
              <ProgressBar value={r.percent ?? 0} label={`${r.domain.name} progress`} tone={r.percent === 100 ? 'success' : undefined} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
