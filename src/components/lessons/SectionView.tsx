import { useState } from 'react';
import type { Section } from '../../types';
import { Callout, CodeBlock, Rich } from '../common/Common';
import { DiagramView } from '../diagrams/Diagrams';
import { InteractiveView } from '../interactive';
import { dispatch, useAppState } from '../../store/store';
import type { ExplainStyle } from '../../store/state';

const TABS: Array<{ key: 'simple' | 'taglish' | 'technical'; label: string; style: ExplainStyle }> = [
  { key: 'taglish', label: 'Taglish', style: 'taglish' },
  { key: 'simple', label: 'Simple English (like I’m 10)', style: 'simple' },
  { key: 'technical', label: 'Technical', style: 'english' },
];

function Hook({ section }: { section: Extract<Section, { type: 'hook' }> }) {
  return (
    <section className="hook" aria-labelledby="hook-h">
      <div className="hook-eyebrow" id="hook-h"><span aria-hidden="true">💡</span> Pro tip — madaling tandaan</div>
      <h2>{section.title}</h2>
      <p className="hook-trick"><Rich text={section.trick} /></p>
      {section.taglish.map((p, i) => <p key={i}><Rich text={p} /></p>)}
      <div className="hook-test">
        <strong>Subukan mo:</strong> <Rich text={section.test.question} />
        <Reveal label="Tingnan ang sagot"><Rich text={section.test.answer} /></Reveal>
      </div>
    </section>
  );
}

function AnalogyView({ section }: { section: Extract<Section, { type: 'analogy' }> }) {
  const { settings } = useAppState();
  const body = settings.style === 'taglish' && section.taglish ? section.taglish : section.body;
  return (
    <section className="lesson-block">
      <h2><span aria-hidden="true">🏘️</span> Analogy: {section.title}</h2>
      {body.map((p, i) => <p key={i}><Rich text={p} /></p>)}
      {settings.style === 'taglish' && section.taglish && <p className="small muted">Ipinapakita sa Taglish. Palitan ang explanation style sa itaas ng lesson para sa English version.</p>}
    </section>
  );
}

function Explain({ section }: { section: Extract<Section, { type: 'explain' }> }) {
  const { settings } = useAppState();
  const active = TABS.find((t) => t.style === settings.style) ?? TABS[0]!;
  return (
    <section className="lesson-block" aria-labelledby="explain-h">
      <h2 id="explain-h">Understand it</h2>
      <div className="tabs" role="tablist" aria-label="Explanation style">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`tab-${t.key}`}
            aria-selected={active.key === t.key}
            aria-controls="explain-panel"
            className="tab"
            onClick={() => dispatch({ type: 'setSettings', settings: { style: t.style } })}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div id="explain-panel" role="tabpanel" aria-labelledby={`tab-${active.key}`} tabIndex={0}>
        {section[active.key].map((p, i) => <p key={i}><Rich text={p} /></p>)}
      </div>
      {active.key === 'taglish' && <p className="small muted">Commands and technical terms stay in English on purpose — they are what you will type and see on the exam.</p>}
    </section>
  );
}

function Reveal({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" className="btn btn-sm" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Hide answer' : label}</button>
      {open && <div className="feedback feedback-ok" style={{ marginTop: 10 }}>{children}</div>}
    </div>
  );
}

export function SectionView({ section }: { section: Section }) {
  switch (section.type) {
    case 'explain':
      return <Explain section={section} />;
    case 'analogy':
      return <AnalogyView section={section} />;
    case 'hook':
      return <Hook section={section} />;
    case 'diagram':
      return <DiagramView id={section.id} caption={section.caption} />;
    case 'interactive':
      return <InteractiveView id={section.id} caption={section.caption} />;
    case 'terms':
      return (
        <section className="lesson-block">
          <h2>Key terminology</h2>
          <dl className="term-list">
            {section.items.map((t) => (
              <div className="term" key={t.term}>
                <dt>{t.term}</dt>
                <dd><Rich text={t.definition} /></dd>
              </div>
            ))}
          </dl>
        </section>
      );
    case 'flow':
      return (
        <section className="lesson-block">
          <h2>{section.title}</h2>
          <ol className="steps">{section.steps.map((s, i) => <li key={i}><Rich text={s} /></li>)}</ol>
        </section>
      );
    case 'cli':
      return (
        <section className="lesson-block">
          <h2>{section.title}</h2>
          <CodeBlock title="Terminal / Cisco CLI" code={section.transcript} copyText={section.copyable ?? section.transcript} />
          <div className="table-wrap">
            <table className="table explain-table">
              <caption className="sr-only">Line-by-line explanation</caption>
              <thead><tr><th>Line</th><th>What it does</th></tr></thead>
              <tbody>{section.explain.map((e) => <tr key={e.line}><td>{e.line}</td><td>{e.why}</td></tr>)}</tbody>
            </table>
          </div>
          {section.note && <p className="small muted" style={{ marginTop: 8 }}>{section.note}</p>}
        </section>
      );
    case 'verify':
      return (
        <section className="lesson-block">
          <h2>{section.title}</h2>
          <div className="table-wrap">
            <table className="table explain-table">
              <thead><tr><th>Command</th><th>What it shows</th></tr></thead>
              <tbody>{section.items.map((e) => <tr key={e.command}><td>{e.command}</td><td>{e.shows}</td></tr>)}</tbody>
            </table>
          </div>
          {section.good && <p><span className="badge badge-success">Healthy</span> {section.good}</p>}
          {section.bad && <p><span className="badge badge-danger">Broken</span> {section.bad}</p>}
        </section>
      );
    case 'callout':
      return <Callout kind={section.kind}><Rich text={section.text} /></Callout>;
    case 'list':
      return (
        <section className="lesson-block">
          <h2>{section.variant === 'mistakes' ? <span aria-hidden="true">❌ </span> : section.variant === 'tips' ? <span aria-hidden="true">🎯 </span> : null}{section.title}</h2>
          <ul>{section.items.map((it, i) => <li key={i}><Rich text={it} /></li>)}</ul>
        </section>
      );
    case 'troubleshoot':
      return (
        <section className="lesson-block card">
          <h2><span aria-hidden="true">🔧</span> {section.title}</h2>
          <p><Rich text={section.scenario} /></p>
          {section.evidence && <CodeBlock title="Evidence" code={section.evidence} />}
          <p><strong><Rich text={section.question} /></strong></p>
          <Reveal label="Show the answer">
            <p><strong>Diagnosis:</strong> <Rich text={section.answer} /></p>
            {section.fix && <p style={{ marginBottom: 0 }}><strong>Fix and verify:</strong> <Rich text={section.fix} /></p>}
          </Reveal>
        </section>
      );
    case 'challenge':
      return (
        <section className="lesson-block card">
          <h2><span aria-hidden="true">🧩</span> {section.title}</h2>
          <p><Rich text={section.prompt} /></p>
          <Reveal label="Check my answer"><Rich text={section.answer} /></Reveal>
        </section>
      );
    case 'summary':
      return (
        <section className="lesson-block">
          <h2>Summary — what to remember</h2>
          <ul>{section.points.map((p, i) => <li key={i}><Rich text={p} /></li>)}</ul>
        </section>
      );
  }
}
