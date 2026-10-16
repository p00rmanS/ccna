import { useState, type ReactNode } from 'react';
import type { CalloutKind } from '../../types';

const CALLOUT_TITLES: Record<CalloutKind, { icon: string; title: string }> = {
  trap: { icon: '!', title: 'CCNA exam trap' },
  tip: { icon: '+', title: 'Pro tip' },
  memorize: { icon: '#', title: 'Memorize this' },
  relax: { icon: '~', title: 'Don’t memorize this yet' },
};

export function Callout({ kind, children }: { kind: CalloutKind; children: ReactNode }) {
  const t = CALLOUT_TITLES[kind];
  return (
    <aside className={`callout callout-${kind}`}>
      <div className="callout-title">
        <span className="callout-tag" aria-hidden="true"><span>{t.icon}</span></span>{t.title}
      </div>
      <p>{children}</p>
    </aside>
  );
}

export function CodeBlock({ title, code, copyText }: { title?: string; code: string; copyText?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(copyText ?? code);
      setState('copied');
    } catch {
      setState('failed');
    }
    window.setTimeout(() => setState('idle'), 1800);
  };
  return (
    <figure className="code" style={{ marginInline: 0 }}>
      <div className="code-head">
        <span>{title ?? 'Terminal'}</span>
        <button type="button" className="btn btn-sm" onClick={copy} aria-label={`Copy ${title ?? 'code'} to the clipboard`}>
          {state === 'copied' ? 'Copied ✓' : state === 'failed' ? 'Copy failed' : 'Copy'}
        </button>
      </div>
      <pre tabIndex={0}>
        <code>{code}</code>
      </pre>
    </figure>
  );
}

export function ProgressBar({ value, label, tone }: { value: number; label: string; tone?: 'success' }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={`progress ${tone === 'success' ? 'progress-success' : ''}`} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v}>
      <span style={{ width: `${v}%` }} />
    </div>
  );
}

export function PageHead({ title, children, eyebrow }: { title: string; children?: ReactNode; eyebrow?: string }) {
  return (
    <header className="page-head">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </header>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="card card-flat" style={{ textAlign: 'center', padding: '32px 20px' }}>
      <h3>{title}</h3>
      {children && <p className="muted">{children}</p>}
      {action}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="card stat">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {hint && <span className="stat-hint">{hint}</span>}
    </div>
  );
}

/** Inline formatting for lesson text: `code` and **bold**. Never uses innerHTML. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) return <code key={i}>{part.slice(1, -1)}</code>;
        // Bold may contain inline code, so render its content through the same formatter.
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={i}><Rich text={part.slice(2, -2)} /></strong>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/** Small safe Markdown renderer: headings, lists, fenced code, bold, italic and inline code. */
export function Markdown({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  let i = 0;
  let key = 0;
  const inline = (s: string): ReactNode[] =>
    s.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).filter(Boolean).map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) return <code key={idx}>{part.slice(1, -1)}</code>;
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={idx}>{part.slice(2, -2)}</strong>;
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={idx}>{part.slice(1, -1)}</em>;
      return part;
    });
  while (i < lines.length) {
    const line = lines[i]!;
    if (line.startsWith('```')) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i]!.startsWith('```')) code.push(lines[i++]!);
      i++;
      nodes.push(<pre key={key++}><code>{code.join('\n')}</code></pre>);
    } else if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^#+/)![0].length;
      const content = inline(line.replace(/^#+\s*/, ''));
      nodes.push(level === 1 ? <h2 key={key++}>{content}</h2> : level === 2 ? <h3 key={key++}>{content}</h3> : <h4 key={key++}>{content}</h4>);
      i++;
    } else if (/^\s*[-*]\s+/.test(line)) {
      const items: ReactNode[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i]!)) items.push(<li key={items.length}>{inline(lines[i++]!.replace(/^\s*[-*]\s+/, ''))}</li>);
      nodes.push(<ul key={key++}>{items}</ul>);
    } else if (/^\s*\d+\.\s+/.test(line)) {
      const items: ReactNode[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i]!)) items.push(<li key={items.length}>{inline(lines[i++]!.replace(/^\s*\d+\.\s+/, ''))}</li>);
      nodes.push(<ol key={key++}>{items}</ol>);
    } else if (line.trim() === '') {
      i++;
    } else {
      const para: string[] = [];
      while (i < lines.length && lines[i]!.trim() !== '' && !/^(#{1,3}\s|```|\s*[-*]\s+|\s*\d+\.\s+)/.test(lines[i]!)) para.push(lines[i++]!);
      nodes.push(<p key={key++}>{inline(para.join(' '))}</p>);
    }
  }
  return <div className="md">{nodes}</div>;
}
