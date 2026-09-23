import { useMemo, useState } from 'react';
import { STP_COSTS, ROLE_LABEL, computeStp, effectivePriority, electRoot, type Bridge, type Link, type PortRole } from '../../utils/stp';

const NAMES = ['SW1', 'SW2', 'SW3'] as const;
/** SW3 has the lowest MAC on purpose: the root is decided by ID, not by the name or by who is on top. */
const MACS = ['00aa.aaaa.0003', '00aa.aaaa.0002', '00aa.aaaa.0001'];
const POS = [{ x: 360, y: 52 }, { x: 110, y: 218 }, { x: 610, y: 218 }];
const LINK_ENDS: Array<[number, number]> = [[0, 1], [0, 2], [1, 2]];
const PRIORITIES = [4096, 8192, 16384, 24576, 32768, 40960, 61440];
const VLAN = 1;

const ROLE_CLASS: Record<PortRole, string> = { root: 'd-box-end', designated: 'd-box-ok', alternate: 'd-box-danger' };
const ROLE_SHORT: Record<PortRole, string> = { root: 'RP', designated: 'DP', alternate: 'ALT' };

const costOf = (mbps: number) => STP_COSTS.find((c) => c.mbps === mbps)?.cost ?? 4;

export function StpElection() {
  const [prio, setPrio] = useState<number[]>([32768, 32768, 32768]);
  const [speed, setSpeed] = useState<number[]>([1000, 1000, 1000]);

  const { bridges, result } = useMemo(() => {
    const bridges: Bridge[] = NAMES.map((id, i) => ({ id, priority: prio[i] ?? 32768, vlan: VLAN, mac: MACS[i]! }));
    const links: Link[] = LINK_ENDS.map(([a, b], i) => ({ a: NAMES[a]!, b: NAMES[b]!, cost: costOf(speed[i] ?? 1000) }));
    return { bridges, result: computeStp(bridges, links)! };
  }, [prio, speed]);

  const root = electRoot(bridges)!;
  const lowest = Math.min(...bridges.map(effectivePriority));
  const tied = bridges.filter((b) => effectivePriority(b) === lowest);
  const why = tied.length === 1
    ? `${root.id} ang root bridge: pinakamababa ang priority niya (${lowest}).`
    : `Tabla ang priority (${lowest}) ng ${tied.map((t) => t.id).join(' at ')}, kaya ang pinakamababang MAC ang nanalo: ${root.id}.`;
  const portOf = (link: number, bridge: string) => result.ports.find((p) => p.link === link && p.bridge === bridge)!;
  const blocked = result.ports.filter((p) => !p.forwarding);

  const summary = `Root bridge ${root.id}. ${blocked.length ? `Blocked: ${blocked.map((p) => `${p.bridge} port toward ${p.peer}`).join(', ')}.` : 'No blocked ports.'}`;

  return (
    <div className="widget">
      <div className="widget-title">STP election — sino ang root, sino ang naka-block?</div>
      <p className="muted small" style={{ marginTop: 0 }}>Baguhin ang priority at bilis ng link. Tingnan kung paano nagbabago ang root at ang mga port role. (Hindi ito real na switch — modelo ito ng mga patakaran ng STP.)</p>
      <div className="grid grid-3" style={{ marginBottom: 12 }}>
        {NAMES.map((n, i) => (
          <div className="field" key={n}>
            <label htmlFor={`stp-p-${n}`}>{n} priority</label>
            <select id={`stp-p-${n}`} value={prio[i]} onChange={(e) => setPrio(prio.map((p, k) => (k === i ? Number(e.target.value) : p)))}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}{p === 32768 ? ' (default)' : ''}</option>)}
            </select>
          </div>
        ))}
        {LINK_ENDS.map(([a, b], i) => (
          <div className="field" key={i}>
            <label htmlFor={`stp-s-${i}`}>{NAMES[a]}–{NAMES[b]} link</label>
            <select id={`stp-s-${i}`} value={speed[i]} onChange={(e) => setSpeed(speed.map((s, k) => (k === i ? Number(e.target.value) : s)))}>
              {STP_COSTS.map((c) => <option key={c.mbps} value={c.mbps}>{c.speed} · cost {c.cost}</option>)}
            </select>
          </div>
        ))}
      </div>

      <svg viewBox="0 0 720 290" role="img" aria-label={summary} style={{ width: '100%', height: 'auto', maxWidth: 720 }}>
        {LINK_ENDS.map(([a, b], i) => {
          const pa = POS[a]!;
          const pb = POS[b]!;
          const dead = !portOf(i, NAMES[a]!).forwarding || !portOf(i, NAMES[b]!).forwarding;
          return (
            <g key={i}>
              <line className={dead ? 'd-line-dash' : 'd-line'} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} />
              <text className="d-sub" x={(pa.x + pb.x) / 2} y={(pa.y + pb.y) / 2 - (i === 2 ? 26 : 8)} textAnchor="middle">
                cost {costOf(speed[i] ?? 1000)}
              </text>
            </g>
          );
        })}
        {NAMES.map((n, i) => {
          const p = POS[i]!;
          const isRoot = n === root.id;
          return (
            <g key={n}>
              <rect className={isRoot ? 'd-box-warn' : 'd-box-mid'} x={p.x - 66} y={p.y - 28} width={132} height={56} rx={10} />
              <text className="d-text" x={p.x} y={p.y - 4} textAnchor="middle">{n}{isRoot ? ' · ROOT' : ''}</text>
              <text className="d-sub" x={p.x} y={p.y + 14} textAnchor="middle">{effectivePriority(bridges[i]!)} · {MACS[i]}</text>
            </g>
          );
        })}
        {LINK_ENDS.flatMap(([a, b], i) => [[a, b], [b, a]].map(([from, to]) => {
          const pf = POS[from!]!;
          const pt = POS[to!]!;
          const port = portOf(i, NAMES[from!]!);
          // Nudge the badge along the line, out of the way of the switch boxes.
          const dx = pt.x - pf.x;
          const dy = pt.y - pf.y;
          const len = Math.hypot(dx, dy);
          const dist = Math.abs(dx) > Math.abs(dy) * 2 ? 92 : 78;
          const cx = pf.x + (dx / len) * dist;
          const cy = pf.y + (dy / len) * dist;
          return (
            <g key={`${i}-${from}`}>
              <rect className={ROLE_CLASS[port.role]} x={cx - 19} y={cy - 11} width={38} height={22} rx={6} />
              <text className="d-sub" x={cx} y={cy + 4} textAnchor="middle" style={{ fontWeight: 700 }}>{ROLE_SHORT[port.role]}</text>
            </g>
          );
        }))}
      </svg>

      <div aria-live="polite">
        <div className="feedback feedback-ok" style={{ marginTop: 8 }}><strong>Root bridge: {root.id}.</strong>{why}</div>
        <div className="table-wrap" style={{ marginTop: 12 }}>
          <table className="table">
            <thead><tr><th>Switch</th><th>Bridge ID (priority + VLAN {VLAN} · MAC)</th><th>Root path cost</th><th>Ports</th></tr></thead>
            <tbody>
              {NAMES.map((n, i) => (
                <tr key={n}>
                  <td><strong>{n}</strong></td>
                  <td><code>{effectivePriority(bridges[i]!)} · {MACS[i]}</code></td>
                  <td>{result.rootPathCost[n]}</td>
                  <td>
                    {result.ports.filter((p) => p.bridge === n).map((p) => (
                      <div key={p.link}>→ {p.peer}: <strong>{ROLE_LABEL[p.role]}</strong>{p.forwarding ? '' : ' — hindi nagpapasa ng frames'}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small muted">Paalala: ang priority na ipinapadala ay <em>priority + VLAN ID</em> (extended system ID), kaya 32768 sa VLAN 1 ay nagiging 32769. RP = root port, DP = designated port, ALT = alternate (blocked).</p>
      </div>
      <button type="button" className="btn btn-ghost" onClick={() => { setPrio([32768, 32768, 32768]); setSpeed([1000, 1000, 1000]); }}>Reset</button>
    </div>
  );
}
