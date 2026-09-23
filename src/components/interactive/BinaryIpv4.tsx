import { useMemo, useState } from 'react';
import { BIT_VALUES, additionBreakdown, bitsToNumber, fromBinary, numberToBits, toBinary8 } from '../../utils/binary';
import { classifyIp, describeSubnet, parseIp, toBinaryOctets } from '../../utils/subnet';

// ---------------------------------------------------------------------------
// Binary lab: explore + drill
// ---------------------------------------------------------------------------

type DrillKind = 'to-binary' | 'to-decimal';
const DRILL_LENGTH = 10;

function randomOctet(): number {
  // Bias towards values seen in masks and addresses so practice is useful.
  const common = [0, 1, 10, 64, 128, 168, 172, 192, 224, 240, 248, 252, 254, 255];
  return Math.random() < 0.3 ? common[Math.floor(Math.random() * common.length)]! : Math.floor(Math.random() * 256);
}

export function BinaryLab() {
  const [mode, setMode] = useState<'explore' | 'drill'>('explore');
  return (
    <div className="widget">
      <div className="widget-title">Binary lab</div>
      <div className="tabs" role="tablist" aria-label="Binary lab mode">
        {(['explore', 'drill'] as const).map((m) => (
          <button key={m} type="button" role="tab" className="tab" aria-selected={mode === m} onClick={() => setMode(m)}>{m === 'explore' ? 'Explore' : 'Drill'}</button>
        ))}
      </div>
      {mode === 'explore' ? <Explore /> : <Drill />}
    </div>
  );
}

function Explore() {
  const [bits, setBits] = useState<boolean[]>(numberToBits(172));
  const value = bitsToNumber(bits);
  const [decimalText, setDecimalText] = useState('172');
  const setFromDecimal = (t: string) => {
    setDecimalText(t);
    const n = Number(t);
    if (t.trim() !== '' && Number.isInteger(n) && n >= 0 && n <= 255) setBits(numberToBits(n));
  };
  return (
    <div>
      <p className="muted small">Click the bits to turn them on and off, or type a decimal number from 0 to 255.</p>
      <div className="bits" role="group" aria-label="Eight bits of one octet">
        {bits.map((on, i) => (
          <div className="bit" key={i}>
            <button type="button" aria-pressed={on} aria-label={`Bit worth ${BIT_VALUES[i]}, currently ${on ? 1 : 0}`} onClick={() => { const next = bits.map((b, j) => (j === i ? !b : b)); setBits(next); setDecimalText(String(bitsToNumber(next))); }}>{on ? 1 : 0}</button>
            <span>{BIT_VALUES[i]}</span>
          </div>
        ))}
      </div>
      <p aria-live="polite" style={{ marginTop: 12 }}>
        <code>{additionBreakdown(value)}</code> = <strong>{value}</strong> &nbsp;·&nbsp; binary <code>{toBinary8(value)}</code>
      </p>
      <div className="field" style={{ maxWidth: 240 }}>
        <label htmlFor="dec-in">Decimal (0–255)</label>
        <input id="dec-in" type="number" min={0} max={255} value={decimalText} onChange={(e) => setFromDecimal(e.target.value)} />
      </div>
    </div>
  );
}

function Drill() {
  const [kind, setKind] = useState<DrillKind>('to-binary');
  const [n, setN] = useState(randomOctet);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<null | { ok: boolean }>(null);
  const [asked, setAsked] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const finished = asked >= DRILL_LENGTH && result === null;

  const check = () => {
    const ok = kind === 'to-binary' ? fromBinary(answer) === n && answer.replace(/\s/g, '').length === 8 : Number(answer.trim()) === n && answer.trim() !== '';
    setResult({ ok });
    setAsked((a) => a + 1);
    setScore((s) => s + (ok ? 1 : 0));
    setStreak((s) => (ok ? s + 1 : 0));
  };
  const next = () => { setN(randomOctet()); setAnswer(''); setResult(null); };
  const restart = () => { setAsked(0); setScore(0); setStreak(0); next(); };
  const changeKind = (k: DrillKind) => { setKind(k); restart(); };

  if (finished) {
    return (
      <div>
        <h3>Drill finished: {score} / {DRILL_LENGTH}</h3>
        <p>{score >= 8 ? 'Nice work — that is the level to aim for.' : 'Keep practising; check each answer by adding the place values of the 1s.'}</p>
        <button type="button" className="btn btn-primary" onClick={restart}>Start another round</button>
      </div>
    );
  }
  const prompt = kind === 'to-binary' ? `Convert ${n} to an 8-bit binary number.` : `Convert ${toBinary8(n)} to decimal.`;
  return (
    <div>
      <div className="row">
        <div className="chips" role="group" aria-label="Drill type">
          <button type="button" className="chip" aria-pressed={kind === 'to-binary'} onClick={() => changeKind('to-binary')}>Decimal → binary</button>
          <button type="button" className="chip" aria-pressed={kind === 'to-decimal'} onClick={() => changeKind('to-decimal')}>Binary → decimal</button>
        </div>
        <span className="badge">Question {Math.min(asked + (result ? 0 : 1), DRILL_LENGTH)} / {DRILL_LENGTH}</span>
        <span className="badge badge-success">Score {score}</span>
        <span className="badge">Streak {streak}</span>
      </div>
      <p style={{ marginTop: 14 }}><strong>{prompt}</strong></p>
      <form onSubmit={(e) => { e.preventDefault(); if (result) next(); else if (answer.trim()) check(); }}>
        <div className="row">
          <label htmlFor="drill-in" className="sr-only">Your answer</label>
          <input id="drill-in" type="text" inputMode={kind === 'to-decimal' ? 'numeric' : 'text'} className="answer-input" value={answer} onChange={(e) => setAnswer(e.target.value)} disabled={result !== null} autoComplete="off" placeholder={kind === 'to-binary' ? '8 digits, e.g. 10101100' : 'e.g. 172'} autoFocus />
          {result === null ? <button type="submit" className="btn btn-primary" disabled={!answer.trim()}>Check</button> : <button type="submit" className="btn btn-primary">{asked >= DRILL_LENGTH ? 'Finish' : 'Next'}</button>}
        </div>
      </form>
      <div aria-live="polite">
        {result && (
          <div className={`feedback ${result.ok ? 'feedback-ok' : 'feedback-bad'}`}>
            <strong>{result.ok ? 'Correct!' : 'Not quite.'}</strong>
            {n} = {additionBreakdown(n)} = <code>{toBinary8(n)}</code>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// IPv4 network / host splitter
// ---------------------------------------------------------------------------

export function Ipv4Split() {
  const [addr, setAddr] = useState('192.168.50.130');
  const [prefix, setPrefix] = useState(25);
  const ip = parseIp(addr);
  const facts = useMemo(() => (ip === null ? null : describeSubnet(ip, prefix)), [ip, prefix]);
  const octets = ip === null ? [] : toBinaryOctets(ip);
  return (
    <div className="widget">
      <div className="widget-title">IPv4 network / host splitter</div>
      <div className="row">
        <div className="field">
          <label htmlFor="ip-in">IPv4 address</label>
          <input id="ip-in" type="text" className="answer-input" value={addr} onChange={(e) => setAddr(e.target.value)} inputMode="decimal" spellCheck={false} aria-invalid={ip === null} autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor="pfx-in">Prefix length: /{prefix}</label>
          <input id="pfx-in" type="range" min={8} max={30} value={prefix} onChange={(e) => setPrefix(Number(e.target.value))} />
        </div>
      </div>
      {ip === null || facts === null ? (
        <div className="feedback feedback-bad" role="alert" style={{ marginTop: 12 }}><strong>Not a valid IPv4 address.</strong>Use four numbers from 0 to 255 separated by dots, e.g. 192.168.50.130.</div>
      ) : (
        <>
          <div className="octet-row" style={{ margin: '14px 0 6px' }} aria-label="Binary form of the address, network bits highlighted">
            {octets.map((o, oi) => (
              <span className="octet" key={oi}>
                {o.split('').map((b, bi) => <span key={bi} className={`b ${oi * 8 + bi < prefix ? 'b-net' : 'b-host'}`}>{b}</span>)}
              </span>
            ))}
          </div>
          <div className="legend"><span><span className="swatch" style={{ background: 'var(--primary)' }} />Network bits ({prefix})</span><span><span className="swatch" style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)' }} />Host bits ({facts.hostBits})</span></div>
          <div className="table-wrap" style={{ marginTop: 12 }} aria-live="polite">
            <table className="table">
              <tbody>
                <tr><th scope="row">Type</th><td>{classifyIp(ip)}</td></tr>
                <tr><th scope="row">Subnet mask</th><td><code>{facts.mask}</code> (/{prefix})</td></tr>
                <tr><th scope="row">Network address</th><td><code>{facts.network}</code></td></tr>
                <tr><th scope="row">Broadcast address</th><td><code>{facts.broadcast}</code></td></tr>
                <tr><th scope="row">Usable hosts</th><td><code>{facts.firstHost}</code> – <code>{facts.lastHost}</code> ({facts.usableHosts.toLocaleString()} hosts = 2<sup>{facts.hostBits}</sup> − 2)</td></tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
