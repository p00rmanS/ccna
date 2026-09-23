import { useState } from 'react';
import { parseMac } from '../../utils/mac';

// ---------------------------------------------------------------------------
// Guess the device
// ---------------------------------------------------------------------------

const OPTIONS = ['Router', 'Layer 2 switch', 'Layer 3 switch', 'Firewall', 'Access point', 'WLC'] as const;

const SCENARIOS: Array<{ prompt: string; answer: (typeof OPTIONS)[number]; why: string }> = [
  { prompt: 'You need to connect two different IP networks.', answer: 'Router', why: 'Routers forward packets between IP networks using a routing table.' },
  { prompt: 'Twenty-four PCs in one VLAN must be connected using MAC addresses.', answer: 'Layer 2 switch', why: 'A Layer 2 switch forwards frames inside one network using destination MACs.' },
  { prompt: 'Give thirty laptops wireless access on one floor.', answer: 'Access point', why: 'An access point bridges wireless clients onto the wired LAN.' },
  { prompt: 'Block unwanted inbound traffic from the internet according to policy.', answer: 'Firewall', why: 'A firewall permits or denies traffic by policy, often with state and application awareness.' },
  { prompt: 'Centrally configure and monitor 200 lightweight access points.', answer: 'WLC', why: 'A wireless LAN controller manages many lightweight APs from one place.' },
  { prompt: 'Route between VLANs at high speed on the campus core without an external router.', answer: 'Layer 3 switch', why: 'A Layer 3 switch does both switching and inter-VLAN routing in hardware.' },
];

export function GuessDevice() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const done = index >= SCENARIOS.length;
  const s = SCENARIOS[index];

  if (done) {
    return (
      <div className="widget">
        <div className="widget-title">Guess the device — finished</div>
        <p>You got <strong>{score}</strong> of {SCENARIOS.length} right.</p>
        <button type="button" className="btn" onClick={() => { setIndex(0); setPicked(null); setScore(0); }}>Play again</button>
      </div>
    );
  }
  const correct = picked === s!.answer;
  return (
    <div className="widget">
      <div className="widget-title">Guess the device <span className="badge">{index + 1} / {SCENARIOS.length}</span></div>
      <p><strong>{s!.prompt}</strong> Which device fits best?</p>
      <div className="choice-grid" role="group" aria-label="Device choices">
        {OPTIONS.map((o) => (
          <button key={o} type="button" className="btn" disabled={picked !== null} onClick={() => { setPicked(o); if (o === s!.answer) setScore((n) => n + 1); }}>
            {o}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {picked && (
          <div className={`feedback ${correct ? 'feedback-ok' : 'feedback-bad'}`}>
            <strong>{correct ? 'Correct!' : `Not quite — the best answer is ${s!.answer}.`}</strong>
            {s!.why}
          </div>
        )}
      </div>
      {picked && <button type="button" className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => { setIndex((i) => i + 1); setPicked(null); }}>{index === SCENARIOS.length - 1 ? 'See result' : 'Next'}</button>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Encapsulation stepper
// ---------------------------------------------------------------------------

const ENC_STEPS = [
  { title: 'Layers 7–5: the application creates data', text: 'A browser builds an HTTP request. At this point there are no addresses at all — just data.', pieces: ['Data'] },
  { title: 'Layer 4: transport adds a header → segment', text: 'TCP adds a header with the source and destination port numbers (for example destination 443).', pieces: ['TCP', 'Data'] },
  { title: 'Layer 3: network adds a header → packet', text: 'IP adds a header with the source and destination IP addresses. Routers read this.', pieces: ['IP', 'TCP', 'Data'] },
  { title: 'Layer 2: data link adds a header and trailer → frame', text: 'Ethernet adds the source and destination MAC addresses in front and the FCS at the end. Switches read this.', pieces: ['Ethernet', 'IP', 'TCP', 'Data', 'FCS'] },
  { title: 'Layer 1: physical sends bits', text: 'The frame is converted into signals — electrical, light or radio — and sent onto the medium as bits.', pieces: ['Ethernet', 'IP', 'TCP', 'Data', 'FCS'], bits: true },
] as const;

const PIECE_CLASS: Record<string, string> = { Data: 'd-box-ok', TCP: 'd-box-warn', IP: 'd-box-mid', Ethernet: 'd-box-end', FCS: 'd-box-danger' };

export function Encapsulation() {
  const [step, setStep] = useState(0);
  const s = ENC_STEPS[step]!;
  const bits = 'bits' in s && s.bits;
  return (
    <div className="widget">
      <div className="widget-title">Encapsulation stepper <span className="badge">step {step + 1} of {ENC_STEPS.length}</span></div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '12px 0', alignItems: 'stretch' }} aria-hidden="true">
        {s.pieces.map((p) => (
          <svg key={p} width={p === 'Data' ? 120 : 84} height={54} style={{ flex: '0 0 auto' }}>
            <rect className={PIECE_CLASS[p]} x={1} y={1} width={p === 'Data' ? 118 : 82} height={52} rx={8} />
            <text className="d-text" x={p === 'Data' ? 60 : 42} y={32} textAnchor="middle">{p}</text>
          </svg>
        ))}
      </div>
      {bits && <p className="octet-row" aria-hidden="true">0110 1000 0101 1100 1001 0011 1010 0110 …</p>}
      <div aria-live="polite">
        <h3>{s.title}</h3>
        <p>{s.text}</p>
      </div>
      <div className="row">
        <button type="button" className="btn" disabled={step === 0} onClick={() => setStep(step - 1)}>← Back</button>
        <button type="button" className="btn btn-primary" disabled={step === ENC_STEPS.length - 1} onClick={() => setStep(step + 1)}>Next step →</button>
        <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>Restart</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAC decoder
// ---------------------------------------------------------------------------

export function MacDecoder() {
  const [text, setText] = useState('00:1A:2B:3C:4D:5E');
  const info = parseMac(text);
  const firstByteBits = info ? info.bytes[0]!.toString(2).padStart(8, '0') : '';
  return (
    <div className="widget">
      <div className="widget-title">MAC address decoder</div>
      <div className="field">
        <label htmlFor="mac-input">Enter a MAC address (any format)</label>
        <input id="mac-input" type="text" className="answer-input" value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} autoComplete="off" aria-describedby="mac-help" />
        <span id="mac-help" className="small muted">Try 001a.2b3c.4d5e, 00-1A-2B-3C-4D-5E, FF:FF:FF:FF:FF:FF or 01:00:5E:00:00:05.</span>
      </div>
      <div aria-live="polite">
        {!info ? (
          <div className="feedback feedback-bad" style={{ marginTop: 12 }}><strong>Not a valid MAC address.</strong>A MAC has 12 hexadecimal digits (0–9 and A–F) in groups of two (colon or hyphen) or four (dots).</div>
        ) : (
          <div className="table-wrap" style={{ marginTop: 12 }}>
            <table className="table">
              <tbody>
                <tr><th scope="row">Colon</th><td><code>{info.colon}</code></td></tr>
                <tr><th scope="row">Windows</th><td><code>{info.dash}</code></td></tr>
                <tr><th scope="row">Cisco IOS</th><td><code>{info.cisco}</code></td></tr>
                <tr><th scope="row">OUI (manufacturer)</th><td><code>{info.oui}</code></td></tr>
                <tr><th scope="row">NIC-specific</th><td><code>{info.nic}</code></td></tr>
                <tr><th scope="row">First byte (binary)</th><td><code>{firstByteBits}</code></td></tr>
                <tr><th scope="row">Type</th><td>{info.kind === 'broadcast' ? 'Broadcast — every device in the broadcast domain' : info.kind === 'multicast' ? 'Multicast (group bit = 1)' : 'Unicast (group bit = 0)'}</td></tr>
                <tr><th scope="row">Administration</th><td>{info.administration === 'universal' ? 'Universally administered (assigned by the manufacturer)' : 'Locally administered (set by software or an administrator)'}</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
