import { useState } from 'react';
import { Calculator } from '../components/subnetting/Calculator';
import { Trainer } from '../components/subnetting/Trainer';
import { PageHead } from '../components/common/Common';
import { subnettingAccuracy, subnettingAverageSeconds } from '../store/derived';
import { useAppState } from '../store/store';
import { describeSubnet, parseIp } from '../utils/subnet';

const KIND_LABEL: Record<string, string> = {
  network: 'Network address', broadcast: 'Broadcast address', 'first-host': 'First host', 'last-host': 'Last host',
  'host-count': 'Host count', mask: 'Prefix → mask', prefix: 'Mask → prefix', 'same-subnet': 'Same subnet?',
};

function Stats() {
  const state = useAppState();
  const s = state.subnetting;
  const acc = subnettingAccuracy(state);
  const avg = subnettingAverageSeconds(state);
  const buckets = Object.entries(s.byBucket);
  return (
    <div className="card">
      <h2>Your subnetting stats</h2>
      {s.attempted === 0 ? (
        <p className="muted">No attempts yet. Your accuracy, average time and weakest prefix ranges will appear here after you practise.</p>
      ) : (
        <>
          <div className="grid grid-4">
            <div className="stat"><span className="stat-value">{acc}%</span><span className="stat-label">Accuracy</span></div>
            <div className="stat"><span className="stat-value">{s.attempted}</span><span className="stat-label">Answered</span></div>
            <div className="stat"><span className="stat-value">{avg}s</span><span className="stat-label">Average time</span></div>
            <div className="stat"><span className="stat-value">{s.bestStreak}</span><span className="stat-label">Best streak</span></div>
          </div>
          <h3 style={{ marginTop: 18 }}>By prefix range</h3>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Range</th><th>Answered</th><th>Accuracy</th></tr></thead>
              <tbody>
                {buckets.map(([name, t]) => {
                  const pct = Math.round((t.correct / t.attempted) * 100);
                  return <tr key={name}><td>{name}</td><td>{t.attempted}</td><td>{pct}% {t.attempted >= 5 && pct < 70 && <span className="badge badge-danger">weak</span>}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
          <h3>By question type</h3>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Type</th><th>Answered</th><th>Accuracy</th></tr></thead>
              <tbody>
                {Object.entries(s.byKind).map(([k, t]) => t && <tr key={k}><td>{KIND_LABEL[k] ?? k}</td><td>{t.attempted}</td><td>{Math.round((t.correct / t.attempted) * 100)}%</td></tr>)}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function CheatSheet() {
  const rows = [24, 25, 26, 27, 28, 29, 30].map((p) => describeSubnet(parseIp('10.0.0.0')!, p));
  return (
    <div className="card">
      <h2>Prefix cheat sheet</h2>
      <p className="muted small">Computed by the same code that checks your answers. Block size = 256 − the interesting mask octet.</p>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Prefix</th><th>Mask</th><th>Block size</th><th>Addresses</th><th>Usable</th></tr></thead>
          <tbody>
            {rows.map((r) => <tr key={r.prefix}><td>/{r.prefix}</td><td><code>{r.mask}</code></td><td>{256 - Number(r.mask.split('.')[3])}</td><td>{r.totalAddresses}</td><td>{r.usableHosts}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Subnetting() {
  const [tab, setTab] = useState<'practice' | 'calculator' | 'reference'>('practice');
  return (
    <div>
      <PageHead title="Subnetting trainer" eyebrow="Practice">
        Unlimited practice with mathematically checked answers. Every question is generated fresh and comes with a worked solution.
      </PageHead>
      <div className="tabs" role="tablist" aria-label="Subnetting tools">
        {([['practice', 'Practice'], ['calculator', 'Calculator'], ['reference', 'Cheat sheet']] as const).map(([k, l]) => (
          <button key={k} type="button" role="tab" className="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      <div className="stack">
        {tab === 'practice' && <><Trainer /><Stats /></>}
        {tab === 'calculator' && <Calculator />}
        {tab === 'reference' && <CheatSheet />}
      </div>
    </div>
  );
}
