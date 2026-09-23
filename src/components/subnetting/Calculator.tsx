import { useState } from 'react';
import { classifyIp, describeSubnet, parseAddressAndMask, toBinaryOctets } from '../../utils/subnet';

export function Calculator() {
  const [text, setText] = useState('192.168.50.130/25');
  const parsed = parseAddressAndMask(text);
  const facts = parsed ? describeSubnet(parsed.ip, parsed.prefix) : null;
  const octets = parsed ? toBinaryOctets(parsed.ip) : [];
  return (
    <div className="card">
      <h2>Subnet calculator</h2>
      <p className="muted">Use it to check your own working — not to replace it. Accepts <code>192.168.50.130/25</code> or <code>192.168.50.130 255.255.255.128</code>.</p>
      <div className="field" style={{ maxWidth: 420 }}>
        <label htmlFor="calc-in">Address and mask</label>
        <input id="calc-in" type="text" className="answer-input" value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} autoComplete="off" aria-invalid={!parsed} />
      </div>
      <div aria-live="polite">
        {!parsed || !facts ? (
          <div className="feedback feedback-bad" style={{ marginTop: 12 }}><strong>Could not read that.</strong>Use CIDR (address/prefix) or an address followed by a contiguous dotted mask.</div>
        ) : (
          <div className="table-wrap" style={{ marginTop: 12 }}>
            <table className="table">
              <tbody>
                <tr><th scope="row">Address type</th><td>{classifyIp(parsed.ip)}</td></tr>
                <tr><th scope="row">Address (binary)</th><td><code>{octets.join('.')}</code></td></tr>
                <tr><th scope="row">Mask</th><td><code>{facts.mask}</code> = /{facts.prefix} · wildcard <code>{facts.wildcard}</code></td></tr>
                <tr><th scope="row">Network address</th><td><code>{facts.network}</code></td></tr>
                <tr><th scope="row">Broadcast address</th><td><code>{facts.broadcast}</code></td></tr>
                <tr><th scope="row">Usable host range</th><td><code>{facts.firstHost}</code> – <code>{facts.lastHost}</code></td></tr>
                <tr><th scope="row">Addresses</th><td>{facts.totalAddresses.toLocaleString()} total · {facts.usableHosts.toLocaleString()} usable{facts.prefix >= 31 ? ' (a /31 is for point-to-point links; a /32 is a single host)' : ''}</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
