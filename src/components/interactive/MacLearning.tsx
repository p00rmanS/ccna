import { useMemo, useState } from 'react';
import { processFrame, type MacEntry, type SwitchResult } from '../../utils/switching';

interface Host {
  name: string;
  mac: string;
  port: number;
}

// Demo addresses: first byte 00 keeps them valid unicast MACs; they are not real vendor addresses.
const HOSTS: Host[] = [
  { name: 'PC-A', mac: '00aa.aaaa.aaaa', port: 1 },
  { name: 'PC-B', mac: '00bb.bbbb.bbbb', port: 2 },
  { name: 'PC-C', mac: '00cc.cccc.cccc', port: 3 },
  { name: 'PC-D', mac: '00dd.dddd.dddd', port: 4 },
];
const BROADCAST = 'ffff.ffff.ffff';
const PORTS = HOSTS.map((h) => h.port);

interface Sim {
  src: Host;
  dstLabel: string;
  dstMac: string;
  result: SwitchResult;
  stage: 1 | 2 | 3;
}

interface LogEntry {
  text: string;
}

const learnedText = { new: 'learned a NEW entry', moved: 'updated the port (host moved)', refreshed: 'refreshed the existing entry', none: 'did not learn a source address' } as const;

export function MacLearning() {
  const [table, setTable] = useState<MacEntry[]>([]);
  const [src, setSrc] = useState('PC-A');
  const [dst, setDst] = useState('PC-B');
  const [sim, setSim] = useState<Sim | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);

  const srcHost = HOSTS.find((h) => h.name === src)!;
  const dstIsBroadcast = dst === 'Broadcast';
  const invalid = !dstIsBroadcast && dst === src;

  const send = () => {
    const dstHost = HOSTS.find((h) => h.name === dst);
    const dstMac = dstIsBroadcast ? BROADCAST : dstHost!.mac;
    const result = processFrame(table, { srcMac: srcHost.mac, dstMac, ingress: srcHost.port }, PORTS);
    setTable(result.table);
    setSim({ src: srcHost, dstLabel: dstIsBroadcast ? 'Broadcast' : dst, dstMac, result, stage: 1 });
    setLog((l) => [{ text: `${src} → ${dstIsBroadcast ? 'Broadcast' : dst}: ${result.decision.toUpperCase()}${result.outPorts.length ? ` (out Fa0/${result.outPorts.join(', Fa0/')})` : ''}` }, ...l].slice(0, 8));
  };

  const reset = () => { setTable([]); setSim(null); setLog([]); };
  const advance = () => setSim((s) => (s && s.stage < 3 ? { ...s, stage: (s.stage + 1) as 2 | 3 } : s));
  const finish = () => setSim((s) => (s ? { ...s, stage: 3 } : s));

  const receivers = useMemo(() => new Set(sim && sim.stage >= 3 ? sim.result.outPorts : []), [sim]);
  const decided = sim && sim.stage >= 2;

  const message = !sim
    ? 'The MAC address table is empty. Choose a sender and a destination, then send a frame.'
    : sim.stage === 1
      ? `1 · The frame from ${sim.src.name} (${sim.src.mac}) arrives on Fa0/${sim.src.port}. The switch reads the SOURCE MAC and ${learnedText[sim.result.learned]}.`
      : sim.stage === 2
        ? `2 · The switch reads the DESTINATION MAC ${sim.dstMac}. ${sim.result.reason}`
        : sim.result.decision === 'filter'
          ? '3 · Nothing is sent: the frame is filtered.'
          : `3 · The frame leaves ${sim.result.outPorts.map((p) => `Fa0/${p}`).join(', ')}. ${sim.result.decision === 'flood' ? 'On flooded ports, only the host whose MAC matches keeps the frame; the others’ network cards discard it (broadcasts are accepted by everyone).' : 'Only the destination receives it.'}`;

  // Geometry for the little topology drawing.
  const pos: Record<number, { x: number; y: number }> = { 1: { x: 70, y: 50 }, 2: { x: 70, y: 150 }, 3: { x: 350, y: 50 }, 4: { x: 350, y: 150 } };

  return (
    <div className="widget">
      <div className="widget-title">MAC learning simulator</div>
      <p className="muted small">One switch, one VLAN, four PCs. Addresses are demonstration values (real MACs start with a vendor OUI).</p>
      <div className="sw-layout">
        <div>
          <svg viewBox="0 0 420 210" role="img" aria-label="Switch SW1 with four PCs on ports Fa0/1 to Fa0/4" style={{ width: '100%', height: 'auto', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <rect className="d-box-mid" x={165} y={80} width={90} height={50} rx={10} />
            <text className="d-text" x={210} y={110} textAnchor="middle">SW1</text>
            {HOSTS.map((h) => {
              const p = pos[h.port]!;
              const isSrc = sim?.src.port === h.port;
              const out = sim ? (sim.stage >= 2 && sim.result.outPorts.includes(h.port)) : false;
              const got = receivers.has(h.port);
              const hx = p.x < 200 ? p.x + 70 : p.x;
              const sx = p.x < 200 ? 165 : 255;
              return (
                <g key={h.name}>
                  <line x1={hx} y1={p.y + 20} x2={sx} y2={105} className={isSrc || out ? 'd-line' : 'd-line-dash'} style={{ stroke: isSrc ? 'var(--primary)' : out ? 'var(--success)' : undefined, strokeWidth: isSrc || out ? 4 : 2 }} />
                  <rect className={isSrc ? 'd-box-end' : got ? 'd-box-ok' : 'd-box'} x={p.x} y={p.y} width={70} height={40} rx={8} />
                  <text className="d-text" x={p.x + 35} y={p.y + 18} textAnchor="middle">{h.name}</text>
                  <text className="d-sub" x={p.x + 35} y={p.y + 32} textAnchor="middle">Fa0/{h.port}</text>
                </g>
              );
            })}
          </svg>
          <div className="row" style={{ marginTop: 12 }}>
            <div className="field">
              <label htmlFor="sim-src">From</label>
              <select id="sim-src" value={src} onChange={(e) => setSrc(e.target.value)}>{HOSTS.map((h) => <option key={h.name}>{h.name}</option>)}</select>
            </div>
            <div className="field">
              <label htmlFor="sim-dst">To</label>
              <select id="sim-dst" value={dst} onChange={(e) => setDst(e.target.value)}>
                {HOSTS.map((h) => <option key={h.name}>{h.name}</option>)}
                <option>Broadcast</option>
              </select>
            </div>
            <button type="button" className="btn btn-primary" onClick={send} disabled={invalid} style={{ alignSelf: 'flex-end' }}>Send frame</button>
          </div>
          {invalid && <p className="small" style={{ color: 'var(--danger)' }}>Choose a different destination than the sender.</p>}
          <div className="row" style={{ marginTop: 8 }}>
            <button type="button" className="btn btn-sm" onClick={advance} disabled={!sim || sim.stage >= 3}>Next step</button>
            <button type="button" className="btn btn-sm" onClick={finish} disabled={!sim || sim.stage >= 3}>Show result</button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => { setTable([]); setSim(null); }}>Clear table</button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={reset}>Reset all</button>
          </div>
          <div className="feedback feedback-ok" style={{ background: 'var(--primary-soft)', borderColor: 'var(--primary)' }} aria-live="polite">
            {decided && sim && <strong>Decision: {sim.result.decision.toUpperCase()}</strong>}
            {message}
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: '1rem' }}>SW1# show mac address-table</h3>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Vlan</th><th>Mac Address</th><th>Type</th><th>Ports</th></tr></thead>
              <tbody>
                {table.length === 0 && <tr><td colSpan={4} className="muted">(empty)</td></tr>}
                {table.map((e) => {
                  const isNew = sim && sim.result.learned === 'new' && sim.result.table.some((t) => t.mac === e.mac) && e.mac === sim.src.mac && sim.stage >= 1;
                  return <tr key={e.mac} className={isNew ? 'row-new' : undefined}><td>1</td><td><code>{e.mac}</code></td><td>DYNAMIC</td><td>Fa0/{e.port}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
          <h3 style={{ fontSize: '1rem', marginTop: 14 }}>Frame log</h3>
          {log.length === 0 ? <p className="muted small">No frames sent yet.</p> : <ol className="log">{log.map((l, i) => <li key={i}>{l.text}</li>)}</ol>}
          <p className="small muted">Try it: send A → B (flooded — B is unknown), then B → A (forwarded — A was learned), then A → B again (forwarded).</p>
        </div>
      </div>
    </div>
  );
}
