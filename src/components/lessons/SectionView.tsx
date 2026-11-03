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
      <div className="hook-eyebrow" id="hook-h">Pro tip — madaling tandaan</div>
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

function RememberView({ section }: { section: Extract<Section, { type: 'remember' }> }) {
  return (
    <aside className="remember" aria-label="Exam alert">
      <div className="remember-tag"><span aria-hidden="true">!</span> Tandaan sa exam</div>
      {section.title && <h3>{section.title}</h3>}
      <ul>{section.items.map((it, i) => <li key={i}><Rich text={it} /></li>)}</ul>
    </aside>
  );
}

function DeepDiveView({ section }: { section: Extract<Section, { type: 'deepdive' }> }) {
  return (
    <section className="lesson-block deepdive">
      <div className="story-eyebrow">Mas malalim</div>
      <h2>{section.title}</h2>
      {section.paragraphs.map((p, i) => <p key={i}><Rich text={p} /></p>)}
      {section.steps && <ol className="steps">{section.steps.map((s, i) => <li key={i}><Rich text={s} /></li>)}</ol>}
      {section.tricks && (
        <div className="tricks">
          <div className="tricks-title">Tips at tricks</div>
          <ul>{section.tricks.map((t, i) => <li key={i}><Rich text={t} /></li>)}</ul>
        </div>
      )}
    </section>
  );
}

function StoryView({ section }: { section: Extract<Section, { type: 'story' }> }) {
  return (
    <section className="lesson-block story" aria-labelledby="story-h">
      <div className="story-eyebrow">Kuwento</div>
      <h2 id="story-h">{section.title}</h2>
      {section.paragraphs.map((p, i) => <p key={i}><Rich text={p} /></p>)}
      <p className="story-moral"><strong>Aral:</strong> <Rich text={section.moral} /></p>
    </section>
  );
}

function AnalogyView({ section }: { section: Extract<Section, { type: 'analogy' }> }) {
  const { settings } = useAppState();
  const body = settings.style === 'taglish' && section.taglish ? section.taglish : section.body;
  return (
    <section className="lesson-block">
      <h2>Analogy: {section.title}</h2>
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

function useTaglish(): boolean {
  return useAppState().settings.style === 'taglish';
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
  const tl = useTaglish();
  switch (section.type) {
    case 'explain':
      return <Explain section={section} />;
    case 'remember':
      return <RememberView section={section} />;
    case 'deepdive':
      return <DeepDiveView section={section} />;
    case 'story':
      return <StoryView section={section} />;
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
                <dd><Rich text={tl && t.taglish ? t.taglish : t.definition} /></dd>
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
              <tbody>{section.explain.map((e) => <tr key={e.line}><td>{e.line}</td><td>{tl && e.taglish ? e.taglish : e.why}</td></tr>)}</tbody>
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
              <tbody>{section.items.map((e) => <tr key={e.command}><td>{e.command}</td><td>{tl && e.taglish ? e.taglish : e.shows}</td></tr>)}</tbody>
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
          <h2>{section.title}</h2>
          <ul>{section.items.map((it, i) => <li key={i}><Rich text={it} /></li>)}</ul>
        </section>
      );
    case 'troubleshoot':
      return (
        <section className="lesson-block card">
          <h2>{section.title}</h2>
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
          <h2>{section.title}</h2>
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
