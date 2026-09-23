import { useMemo, useState } from 'react';
import { broadcastAddress, firstHost, intToIp, lastHost, networkAddress, parseIp, usableHostCount } from '../../utils/subnet';
import { classifyIpv6, compressIpv6, expandIpv6, macToEui64, parseIpv6 } from '../../utils/ipv6';
import { planVlsm, type VlsmRequest } from '../../utils/vlsm';

// ---------------------------------------------------------------------------
// Cable picker: straight-through or crossover?
// ---------------------------------------------------------------------------

type Device = 'PC' | 'Server' | 'Router' | 'Access point' | 'Switch' | 'Hub';
/** PCs, servers, routers and APs transmit on pins 1,2 (MDI). Switches and hubs transmit on 3,6 (MDI-X). */
const GROUP: Record<Device, 'MDI' | 'MDI-X'> = { PC: 'MDI', Server: 'MDI', Router: 'MDI', 'Access point': 'MDI', Switch: 'MDI-X', Hub: 'MDI-X' };
const PAIRS: Array<[Device, Device]> = [['PC', 'Switch'], ['Switch', 'Switch'], ['PC', 'Router'], ['Router', 'Switch'], ['PC', 'PC'], ['Access point', 'Switch'], ['Router', 'Router'], ['Switch', 'Hub'], ['Server', 'Router']];

export function CablePicker() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<'Straight-through' | 'Crossover' | null>(null);
  const [score, setScore] = useState(0);
  if (i >= PAIRS.length) {
    return (
      <div className="widget">
        <div className="widget-title">Which cable? — finished</div>
        <p>Score: <strong>{score}</strong> / {PAIRS.length}. Ang sikreto: <strong>Switch/Hub ang kakaibang team.</strong></p>
        <button type="button" className="btn" onClick={() => { setI(0); setPicked(null); setScore(0); }}>Play again</button>
      </div>
    );
  }
  const [a, b] = PAIRS[i]!;
  const answer = GROUP[a] === GROUP[b] ? 'Crossover' : 'Straight-through';
  const ok = picked === answer;
  return (
    <div className="widget">
      <div className="widget-title">Which cable? <span className="badge">{i + 1} / {PAIRS.length}</span></div>
      <p style={{ fontSize: '1.15rem' }}><strong>{a}</strong> ↔ <strong>{b}</strong></p>
      <div className="row" role="group" aria-label="Cable choices">
        {(['Straight-through', 'Crossover'] as const).map((c) => (
          <button key={c} type="button" className="btn" disabled={picked !== null} onClick={() => { setPicked(c); if (c === answer) setScore((s) => s + 1); }}>{c}</button>
        ))}
      </div>
      <div aria-live="polite">
        {picked && (
          <div className={`feedback ${ok ? 'feedback-ok' : 'feedback-bad'}`}>
            <strong>{ok ? 'Tama!' : `Mali — ${answer}.`}</strong>
            {a} ay {GROUP[a]} at {b} ay {GROUP[b]}. {GROUP[a] === GROUP[b] ? 'Magkapareho sila ng pin layout, kaya kailangang i-cross.' : 'Magkaiba sila ng pin layout, kaya straight-through ang tama.'} (Sa modern devices, Auto-MDIX ang nag-aayos nito — pero ito pa rin ang tanong sa exam.)
          </div>
        )}
      </div>
      {picked && <button type="button" className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => { setI(i + 1); setPicked(null); }}>{i === PAIRS.length - 1 ? 'See result' : 'Next'}</button>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subnet lister
// ---------------------------------------------------------------------------

const MAX_ROWS = 64;

export function SubnetLister() {
  const [baseText, setBaseText] = useState('192.168.10.0');
  const [basePrefix, setBasePrefix] = useState(24);
  const [newPrefix, setNewPrefix] = useState(26);
  const ip = parseIp(baseText);
  const effectiveNew = Math.max(newPrefix, basePrefix + 1);
  const data = useMemo(() => {
    if (ip === null) return null;
    const net = networkAddress(ip, basePrefix);
    const borrowed = effectiveNew - basePrefix;
    const count = 2 ** borrowed;
    const size = 2 ** (32 - effectiveNew);
    const rows = Array.from({ length: Math.min(count, MAX_ROWS) }, (_, k) => {
      const n = net + k * size;
      return { n: k + 1, network: intToIp(n), first: intToIp(firstHost(n, effectiveNew)), last: intToIp(lastHost(n, effectiveNew)), broadcast: intToIp(broadcastAddress(n, effectiveNew)) };
    });
    return { net: intToIp(net), borrowed, count, size, rows };
  }, [ip, basePrefix, effectiveNew]);

  return (
    <div className="widget">
      <div className="widget-title">Subnet lister — hatiin ang network</div>
      <div className="row">
        <div className="field">
          <label htmlFor="sl-base">Base network</label>
          <input id="sl-base" type="text" className="answer-input" value={baseText} onChange={(e) => setBaseText(e.target.value)} spellCheck={false} autoComplete="off" aria-invalid={ip === null} />
        </div>
        <div className="field">
          <label htmlFor="sl-bp">Base prefix</label>
          <select id="sl-bp" value={basePrefix} onChange={(e) => setBasePrefix(Number(e.target.value))}>{[16, 20, 22, 23, 24, 25].map((p) => <option key={p} value={p}>/{p}</option>)}</select>
        </div>
        <div className="field">
          <label htmlFor="sl-np">Split into</label>
          <select id="sl-np" value={effectiveNew} onChange={(e) => setNewPrefix(Number(e.target.value))}>{Array.from({ length: 30 - basePrefix }, (_, k) => basePrefix + 1 + k).map((p) => <option key={p} value={p}>/{p}</option>)}</select>
        </div>
      </div>
      <div aria-live="polite">
        {!data ? (
          <div className="feedback feedback-bad" style={{ marginTop: 12 }}><strong>Invalid address.</strong>Use four numbers separated by dots.</div>
        ) : (
          <>
            <p style={{ marginTop: 12 }}>
              Humiram ka ng <strong>{data.borrowed}</strong> bit → <strong>2<sup>{data.borrowed}</sup> = {data.count.toLocaleString()}</strong> subnets, bawat isa ay <strong>block size {data.size.toLocaleString()}</strong> at <strong>{usableHostCount(effectiveNew).toLocaleString()}</strong> usable hosts.
            </p>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>#</th><th>Network</th><th>Usable range</th><th>Broadcast</th></tr></thead>
                <tbody>{data.rows.map((r) => <tr key={r.n}><td>{r.n}</td><td><code>{r.network}/{effectiveNew}</code></td><td><code>{r.first}</code> – <code>{r.last}</code></td><td><code>{r.broadcast}</code></td></tr>)}</tbody>
              </table>
            </div>
            {data.count > MAX_ROWS && <p className="small muted">Showing the first {MAX_ROWS} of {data.count.toLocaleString()} subnets.</p>}
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// VLSM planner
// ---------------------------------------------------------------------------

const COLORS = ['var(--primary)', 'var(--accent)', 'var(--warning)', 'var(--success)', 'var(--danger)', '#8b5cf6', '#ec4899', '#14b8a6'];

export function VlsmPlanner() {
  const [base, setBase] = useState('192.168.100.0/24');
  const [rows, setRows] = useState<VlsmRequest[]>([
    { name: 'HQ LAN', hosts: 100 }, { name: 'Sales LAN', hosts: 50 }, { name: 'IT LAN', hosts: 20 }, { name: 'WAN Link 1', hosts: 2 }, { name: 'WAN Link 2', hosts: 2 },
  ]);
  const result = useMemo(() => planVlsm(base, rows), [base, rows]);
  const update = (idx: number, patch: Partial<VlsmRequest>) => setRows(rows.map((r, k) => (k === idx ? { ...r, ...patch } : r)));

  return (
    <div className="widget">
      <div className="widget-title">VLSM planner — Malaki muna, maliit mamaya</div>
      <div className="field" style={{ maxWidth: 260 }}>
        <label htmlFor="vl-base">Base network</label>
        <input id="vl-base" type="text" className="answer-input" value={base} onChange={(e) => setBase(e.target.value)} spellCheck={false} autoComplete="off" />
      </div>
      <fieldset style={{ border: 0, padding: 0, margin: '12px 0 0' }}>
        <legend style={{ fontWeight: 600, marginBottom: 6 }}>Networks kailangan mo (hosts na kailangan)</legend>
        {rows.map((r, idx) => (
          <div className="row" key={idx} style={{ marginBottom: 6 }}>
            <label className="sr-only" htmlFor={`vl-n-${idx}`}>Name of network {idx + 1}</label>
            <input id={`vl-n-${idx}`} type="text" value={r.name} onChange={(e) => update(idx, { name: e.target.value })} style={{ width: 170 }} />
            <label className="sr-only" htmlFor={`vl-h-${idx}`}>Hosts needed for network {idx + 1}</label>
            <input id={`vl-h-${idx}`} type="number" min={1} value={Number.isFinite(r.hosts) ? r.hosts : ''} onChange={(e) => update(idx, { hosts: e.target.value === '' ? NaN : Number(e.target.value) })} style={{ width: 100 }} />
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setRows(rows.filter((_, k) => k !== idx))} aria-label={`Remove ${r.name || 'network'}`} disabled={rows.length === 1}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn btn-sm" onClick={() => setRows([...rows, { name: `Network ${rows.length + 1}`, hosts: 10 }])} disabled={rows.length >= 12}>+ Add network</button>
      </fieldset>
      <div aria-live="polite">
        {!result.ok ? (
          <div className="feedback feedback-bad" style={{ marginTop: 12 }}><strong>Hindi pa pwede.</strong>{result.error}</div>
        ) : (
          <>
            <div role="img" aria-label="Address space bar showing where each network was placed" style={{ display: 'flex', height: 34, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', marginTop: 14 }}>
              {result.allocations.map((a, k) => <div key={a.network} title={`${a.name} ${a.network}/${a.prefix}`} style={{ width: `${(a.size / result.baseSize) * 100}%`, background: COLORS[k % COLORS.length] }} />)}
              {result.freeAddresses > 0 && <div style={{ flex: 1, background: 'var(--surface-2)' }} title="Free" />}
            </div>
            <p className="small muted">Bawat kulay = isang network sa loob ng {result.base}. Kulay abo = libre pa ({result.freeAddresses} addresses).</p>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th></th><th>Network</th><th>Needs</th><th>Prefix</th><th>Usable range</th><th>Broadcast</th></tr></thead>
                <tbody>
                  {result.allocations.map((a, k) => (
                    <tr key={a.network}>
                      <td><span className="swatch" style={{ background: COLORS[k % COLORS.length] }} aria-hidden="true" /></td>
                      <td>{a.name}</td><td>{a.hosts}</td><td><code>{a.network}/{a.prefix}</code> ({a.usable} usable)</td>
                      <td><code>{a.firstHost}</code> – <code>{a.lastHost}</code></td><td><code>{a.broadcast}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// IPv6 compress / expand
// ---------------------------------------------------------------------------

export function Ipv6Compress() {
  const [text, setText] = useState('2001:0db8:0000:0000:0000:ff00:0042:8329');
  const g = parseIpv6(text);
  const zeros = g ? g.filter((x) => x === 0).length : 0;
  return (
    <div className="widget">
      <div className="widget-title">IPv6 compress / expand</div>
      <div className="field">
        <label htmlFor="v6-in">IPv6 address (kahit anong form)</label>
        <input id="v6-in" type="text" className="answer-input" style={{ width: '100%', maxWidth: 480 }} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} autoComplete="off" aria-invalid={g === null} />
      </div>
      <div aria-live="polite">
        {!g ? (
          <div className="feedback feedback-bad" style={{ marginTop: 12 }}><strong>Hindi valid na IPv6.</strong>Hanggang 8 kahon (groups) ng 1–4 hex digits, hiwalay ng “:”, at <strong>isang</strong> “::” lang.</div>
        ) : (
          <div className="table-wrap" style={{ marginTop: 12 }}>
            <table className="table">
              <tbody>
                <tr><th scope="row">Buo (expanded)</th><td><code>{expandIpv6(g)}</code></td></tr>
                <tr><th scope="row">Pinaikli (compressed)</th><td><code>{compressIpv6(g)}</code></td></tr>
                <tr><th scope="row">Mga kahong zero</th><td>{zeros} sa 8 {zeros >= 2 ? '— ang pinakamahabang tuloy-tuloy na zero ay pinalitan ng “::”.' : '— walang 2+ tuloy-tuloy, kaya walang “::”.'}</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// IPv6 classifier + EUI-64
// ---------------------------------------------------------------------------

export function Ipv6Classify() {
  const [text, setText] = useState('fe80::1');
  const [mac, setMac] = useState('00:1A:2B:3C:4D:5E');
  const g = parseIpv6(text);
  const cls = g ? classifyIpv6(g) : null;
  const eui = macToEui64(mac);
  return (
    <div className="widget">
      <div className="widget-title">IPv6 type finder at EUI-64</div>
      <div className="field">
        <label htmlFor="v6c-in">Ilagay ang IPv6 address</label>
        <input id="v6c-in" type="text" className="answer-input" style={{ width: '100%', maxWidth: 420 }} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} autoComplete="off" aria-invalid={g === null} />
        <span className="small muted">Subukan: 2001:db8::1 · fe80::1 · fd12:3456::1 · ff02::5 · ::1</span>
      </div>
      <div aria-live="polite">
        {!g ? <div className="feedback feedback-bad" style={{ marginTop: 12 }}><strong>Hindi valid na IPv6.</strong></div> : cls && (
          <div className="feedback feedback-ok" style={{ marginTop: 12 }}><strong>{cls.label} · {cls.prefix}</strong>{cls.detail}</div>
        )}
      </div>
      <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '18px 0' }} />
      <div className="field">
        <label htmlFor="v6c-mac">MAC address → modified EUI-64</label>
        <input id="v6c-mac" type="text" className="answer-input" value={mac} onChange={(e) => setMac(e.target.value)} spellCheck={false} autoComplete="off" aria-invalid={eui === null} />
      </div>
      <div aria-live="polite">
        {!eui ? <div className="feedback feedback-bad" style={{ marginTop: 12 }}><strong>Hindi valid na MAC.</strong></div> : (
          <div className="table-wrap" style={{ marginTop: 12 }}>
            <table className="table">
              <tbody>
                <tr><th scope="row">Hakbang 1</th><td>Hatiin ang MAC sa gitna at ilagay ang <code>FFFE</code>.</td></tr>
                <tr><th scope="row">Hakbang 2</th><td>I-flip ang ika-7 bit ng unang byte (U/L bit): <code>{mac.replace(/[^0-9a-fA-F]/g, '').slice(0, 2).toUpperCase()}</code> → <code>{eui.groups[0]!.toString(16).padStart(4, '0').slice(0, 2).toUpperCase()}</code>.</td></tr>
                <tr><th scope="row">Interface ID</th><td><code>{eui.short}</code></td></tr>
                <tr><th scope="row">Link-local address</th><td><code>{eui.linkLocal}</code></td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
