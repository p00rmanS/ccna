import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CLI_TASKS, cliTaskById, type CliTask } from '../data/cliTasks';
import { lessonById } from '../data';
import { PageHead } from '../components/common/Common';
import { dispatch, useAppState } from '../store/store';
import { complete, help, promptOf, run, type Device } from '../utils/ios';

interface Line {
  kind: 'cmd' | 'out';
  text: string;
}

const WELCOME: Line[] = [{ kind: 'out', text: 'Simulated Cisco IOS practice device. Type ? for help, Tab to complete, ↑/↓ for history.' }];

export default function CliLab() {
  const state = useAppState();
  const firstOpen = CLI_TASKS.find((t) => !state.cliTasks[t.id]) ?? CLI_TASKS[0]!;
  const [taskId, setTaskId] = useState(firstOpen.id);
  const task = cliTaskById(taskId) as CliTask;
  const [device, setDevice] = useState<Device>(() => task.build());
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState('');
  const [recall, setRecall] = useState<{ list: string[]; idx: number }>({ list: [], idx: -1 });
  const [hints, setHints] = useState(0);
  const [solution, setSolution] = useState<'hidden' | 'confirm' | 'shown'>('hidden');
  const termRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => task.objectives.map((o) => o.check(device)), [task, device]);
  const done = results.every(Boolean);
  const alreadySaved = Boolean(state.cliTasks[task.id]);

  useEffect(() => { if (done && !alreadySaved) dispatch({ type: 'completeCliTask', id: task.id }); }, [done, alreadySaved, task.id]);
  useEffect(() => { const el = termRef.current; if (el) el.scrollTop = el.scrollHeight; }, [lines]);

  const reset = (id = taskId) => {
    const t = cliTaskById(id) as CliTask;
    setTaskId(id);
    setDevice(t.build());
    setLines(WELCOME);
    setInput('');
    setRecall({ list: [], idx: -1 });
    setHints(0);
    setSolution('hidden');
    inputRef.current?.focus();
  };

  const submit = () => {
    const raw = input;
    const prompt = promptOf(device);
    const echo: Line = { kind: 'cmd', text: `${prompt} ${raw}` };
    setInput('');
    if (raw.trim() !== '') setRecall((r) => ({ list: [...r.list, raw], idx: -1 }));
    if (raw.trim().endsWith('?')) {
      const before = raw.trim().slice(0, -1);
      // A space before “?” lists the next options; no space completes the word.
      const text = /\s\?$/.test(raw.trimEnd()) || before === '' ? `${before} ` : before;
      setLines((l) => [...l, echo, ...help(device, text.trimStart()).map((t): Line => ({ kind: 'out', text: t }))]);
      return;
    }
    const result = run(device, raw);
    setDevice(result.device);
    setLines((l) => [...l, echo, ...result.output.map((t): Line => ({ kind: 'out', text: t }))]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const completed = complete(device, input);
      if (completed) setInput(completed);
    } else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key.toLowerCase() === 'p')) {
      e.preventDefault();
      if (recall.list.length === 0) return;
      const idx = recall.idx === -1 ? recall.list.length - 1 : Math.max(0, recall.idx - 1);
      setRecall({ ...recall, idx });
      setInput(recall.list[idx]!);
    } else if (e.key === 'ArrowDown' || (e.ctrlKey && e.key.toLowerCase() === 'n')) {
      e.preventDefault();
      if (recall.idx === -1) return;
      const idx = recall.idx + 1;
      if (idx >= recall.list.length) { setRecall({ ...recall, idx: -1 }); setInput(''); }
      else { setRecall({ ...recall, idx }); setInput(recall.list[idx]!); }
    } else if (e.ctrlKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (device.mode === 'config' || device.mode === 'config-if') {
        const result = run(device, 'end');
        setDevice(result.device);
        setLines((l) => [...l, { kind: 'cmd', text: `${promptOf(device)} ^Z` }]);
      }
    }
  };

  const lesson = lessonById(task.lessonId);
  const completedCount = CLI_TASKS.filter((t) => state.cliTasks[t.id]).length;

  return (
    <div>
      <PageHead title="CLI practice" eyebrow="Practice">
        Type real Cisco IOS commands against a simulated router. Abbreviations, ? help, Tab completion and the real error messages all work. Every task checks your configuration — no copy-and-paste needed.
      </PageHead>
      <p><span className="badge badge-primary">{completedCount} of {CLI_TASKS.length} tasks completed</span></p>

      <div className="chips" role="group" aria-label="Choose a task" style={{ margin: '12px 0 18px' }}>
        {CLI_TASKS.map((t, i) => (
          <button key={t.id} type="button" className="chip" aria-pressed={t.id === taskId} onClick={() => reset(t.id)}>
            {state.cliTasks[t.id] ? '✓ ' : ''}{i + 1}. {t.title}
          </button>
        ))}
      </div>

      <div className="cli-layout">
        <section className="card" aria-labelledby="task-h">
          <div className="row row-between">
            <h2 id="task-h" style={{ margin: 0 }}>{task.title}</h2>
            <span className="badge">{task.level}</span>
          </div>
          {task.briefing.map((p, i) => <p key={i} style={{ marginTop: 10 }}>{p}</p>)}
          {lesson && <p className="small muted">Related lesson: <Link to={`/learn/${lesson.id}`}>{lesson.title}</Link></p>}
          <h3>Objectives</h3>
          <ul className="checklist" aria-live="polite">
            {task.objectives.map((o, i) => (
              <li key={o.text} data-done={results[i]}>
                <span className="check" data-done={results[i]} aria-hidden="true">✓</span>
                <span>{o.text}<span className="sr-only">{results[i] ? ' (done)' : ' (not done yet)'}</span></span>
              </li>
            ))}
          </ul>
          {done && (
            <div className="feedback feedback-ok" role="status">
              <strong>Task complete! 🎉</strong>
              Tama lahat ng objectives. {completedCount < CLI_TASKS.length ? 'Sige, susunod na task.' : 'Natapos mo na ang lahat ng CLI tasks.'}
            </div>
          )}
          <div className="stack" style={{ marginTop: 14 }}>
            {task.hints.slice(0, hints).map((h, i) => <div className="callout callout-tip" key={i}><div className="callout-title">Hint {i + 1}</div><p>{h}</p></div>)}
            <div className="row">
              {hints < task.hints.length && <button type="button" className="btn btn-sm" onClick={() => setHints(hints + 1)}>Hint ({hints}/{task.hints.length})</button>}
              {solution === 'hidden' && <button type="button" className="btn btn-sm" onClick={() => setSolution('confirm')}>Show solution…</button>}
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => reset()}>Reset task</button>
            </div>
            {solution === 'confirm' && (
              <div className="feedback feedback-bad">
                <strong>Subukan mo muna ang hints.</strong>
                Kapag kinopya mo lang, hindi mo ito matututunan.
                <div className="row" style={{ marginTop: 8 }}>
                  <button type="button" className="btn btn-sm" onClick={() => setSolution('shown')}>Show solution</button>
                  <button type="button" className="btn btn-sm btn-ghost" onClick={() => setSolution('hidden')}>Keep trying</button>
                </div>
              </div>
            )}
            {solution === 'shown' && (
              <div className="feedback feedback-ok">
                <strong>One way to solve it</strong>
                <pre style={{ margin: '6px 0 0', whiteSpace: 'pre-wrap', fontFamily: 'var(--mono)' }}>{task.solution.join('\n')}</pre>
              </div>
            )}
          </div>
        </section>

        <section aria-label="Device terminal">
          <div className="term" onClick={() => inputRef.current?.focus()}>
            <div className="term-head"><span>{device.hostname} — simulated console</span><span>{device.mode === 'user' ? 'User EXEC' : device.mode === 'priv' ? 'Privileged EXEC' : device.mode === 'config' ? 'Global config' : 'Interface config'}</span></div>
            <div className="term-body" ref={termRef} role="log" aria-live="polite" aria-label="Terminal output">
              {lines.map((l, i) => <div key={i} className={l.kind === 'cmd' ? 'term-cmd' : 'term-out'}>{l.text || ' '}</div>)}
            </div>
            <form className="term-input" onSubmit={(e) => { e.preventDefault(); submit(); }}>
              <label htmlFor="cli-input" className="term-prompt">{promptOf(device)}</label>
              <input
                id="cli-input" ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown}
                autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} aria-label={`Command at prompt ${promptOf(device)}`} autoFocus
              />
            </form>
          </div>
          <p className="small muted" style={{ marginTop: 8 }}>
            Tip: type <code>?</code> at any point. This is a teaching simulator with a limited command set — commands it does not know return the normal “Invalid input” error.
          </p>
        </section>
      </div>
    </div>
  );
}
