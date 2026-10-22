import { useId, type ReactNode } from 'react';
import type { DiagramId } from '../../types';

/** All diagrams are inline SVG driven by CSS variables, so they follow the light/dark theme. */

function Svg({ title, desc, viewBox, children }: { title: string; desc: string; viewBox: string; children: ReactNode }) {
  const id = useId();
  return (
    <svg viewBox={viewBox} role="img" aria-labelledby={`${id}-t ${id}-d`}>
      <title id={`${id}-t`}>{title}</title>
      <desc id={`${id}-d`}>{desc}</desc>
      {children}
    </svg>
  );
}

type Kind = 'default' | 'end' | 'mid' | 'warn' | 'danger' | 'ok';
const KIND_CLASS: Record<Kind, string> = { default: 'd-box', end: 'd-box-end', mid: 'd-box-mid', warn: 'd-box-warn', danger: 'd-box-danger', ok: 'd-box-ok' };

function Node({ x, y, w = 112, h = 50, label, sub, kind = 'default' }: { x: number; y: number; w?: number; h?: number; label: string; sub?: string; kind?: Kind }) {
  return (
    <g>
      <rect className={KIND_CLASS[kind]} x={x} y={y} width={w} height={h} rx={10} />
      <text className="d-text" x={x + w / 2} y={sub ? y + h / 2 - 2 : y + h / 2 + 5} textAnchor="middle">{label}</text>
      {sub && <text className="d-sub" x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle">{sub}</text>}
    </g>
  );
}

const Link = ({ x1, y1, x2, y2, dashed }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean }) => (
  <line className={dashed ? 'd-line-dash' : 'd-line'} x1={x1} y1={y1} x2={x2} y2={y2} />
);

function Cloud({ cx, cy, label, sub }: { cx: number; cy: number; label: string; sub?: string }) {
  return (
    <g>
      <ellipse className="d-box" cx={cx} cy={cy} rx={64} ry={38} />
      <text className="d-text" x={cx} y={sub ? cy - 2 : cy + 5} textAnchor="middle">{label}</text>
      {sub && <text className="d-sub" x={cx} y={cy + 14} textAnchor="middle">{sub}</text>}
    </g>
  );
}

// ---------------------------------------------------------------------------

function NetworkOverview() {
  return (
    <Svg viewBox="0 0 720 330" title="A small network" desc="A PC, a printer and a file server connect by cable to a switch. A laptop and a phone connect wirelessly to an access point that is also cabled to the switch. The switch connects to a router, which connects to the internet, where a web server sits.">
      <Link x1={136} y1={45} x2={300} y2={130} />
      <Link x1={136} y1={125} x2={300} y2={140} />
      <Link x1={136} y1={205} x2={300} y2={150} />
      <Link x1={356} y1={160} x2={356} y2={230} />
      <Link x1={124} y1={275} x2={310} y2={262} dashed />
      <Link x1={260} y1={285} x2={318} y2={268} dashed />
      <Link x1={412} y1={135} x2={480} y2={135} />
      <Link x1={592} y1={135} x2={604} y2={135} />
      <Link x1={668} y1={173} x2={668} y2={225} />
      <Node x={24} y={20} w={112} label="PC" sub="end device" kind="end" />
      <Node x={24} y={100} w={112} label="Printer" sub="end device" kind="end" />
      <Node x={24} y={180} w={112} label="File server" sub="end device" kind="end" />
      <Node x={24} y={250} w={100} label="Laptop" sub="Wi-Fi" kind="end" />
      <Node x={150} y={262} w={100} label="Phone" sub="Wi-Fi" kind="end" />
      <Node x={300} y={110} label="Switch" sub="intermediate" kind="mid" />
      <Node x={300} y={230} label="Access point" sub="intermediate" kind="mid" />
      <Node x={480} y={110} label="Router" sub="intermediate" kind="mid" />
      <Cloud cx={668} cy={135} label="Internet" />
      <Node x={612} y={225} w={112} label="Web server" sub="end device" kind="end" />
      <rect className="d-box-end" x={24} y={310} width={12} height={12} rx={3} />
      <text className="d-sub" x={42} y={321}>End device</text>
      <rect className="d-box-mid" x={130} y={310} width={12} height={12} rx={3} />
      <text className="d-sub" x={148} y={321}>Intermediate device</text>
      <line className="d-line-dash" x1={290} y1={316} x2={318} y2={316} />
      <text className="d-sub" x={324} y={321}>Wireless link</text>
      <line className="d-line" x1={420} y1={316} x2={448} y2={316} />
      <text className="d-sub" x={454} y={321}>Cable</text>
    </Svg>
  );
}

// ---------------------------------------------------------------------------

function Glyph({ kind, cx, cy }: { kind: string; cx: number; cy: number }) {
  const arrow = (deg: number) => (
    <g transform={`rotate(${deg} ${cx} ${cy})`}>
      <path className="d-icon" d={`M${cx} ${cy - 10} L${cx} ${cy - 27} M${cx - 5} ${cy - 22} L${cx} ${cy - 27} L${cx + 5} ${cy - 22}`} />
    </g>
  );
  switch (kind) {
    case 'router':
      return <g><circle className="d-icon" cx={cx} cy={cy} r={11} />{arrow(0)}{arrow(90)}{arrow(180)}{arrow(270)}</g>;
    case 'switch':
    case 'l3':
      return (
        <g>
          <rect className="d-icon" x={cx - 30} y={cy - 15} width={60} height={30} rx={5} />
          <path className="d-icon" d={`M${cx - 20} ${cy - 5} H${cx + 18} M${cx + 12} ${cy - 10} L${cx + 18} ${cy - 5} L${cx + 12} ${cy}`} />
          <path className="d-icon" d={`M${cx + 20} ${cy + 8} H${cx - 18} M${cx - 12} ${cy + 3} L${cx - 18} ${cy + 8} L${cx - 12} ${cy + 13}`} />
          {kind === 'l3' && <text className="d-text" x={cx + 34} y={cy - 12}>L3</text>}
        </g>
      );
    case 'firewall':
      return (
        <g>
          <rect className="d-icon" x={cx - 30} y={cy - 18} width={60} height={36} rx={3} />
          <path className="d-icon" d={`M${cx - 30} ${cy - 6} H${cx + 30} M${cx - 30} ${cy + 6} H${cx + 30} M${cx} ${cy - 18} V${cy - 6} M${cx - 15} ${cy - 6} V${cy + 6} M${cx + 15} ${cy - 6} V${cy + 6} M${cx} ${cy + 6} V${cy + 18}`} />
        </g>
      );
    case 'ap': {
      const arc = (r: number) => {
        const dx = 0.643 * r;
        const dy = 0.766 * r;
        return <path key={r} className="d-icon" d={`M${cx - dx} ${cy + 12 - dy} A${r} ${r} 0 0 1 ${cx + dx} ${cy + 12 - dy}`} />;
      };
      return <g><circle className="d-icon" cx={cx} cy={cy + 12} r={4} />{arc(12)}{arc(20)}{arc(28)}</g>;
    }
    case 'wlc':
      return (
        <g>
          <rect className="d-icon" x={cx - 30} y={cy - 16} width={60} height={26} rx={4} />
          <circle className="d-icon" cx={cx - 14} cy={cy - 3} r={3} /><circle className="d-icon" cx={cx} cy={cy - 3} r={3} /><circle className="d-icon" cx={cx + 14} cy={cy - 3} r={3} />
          <path className="d-icon" d={`M${cx - 14} ${cy + 10} V${cy + 20} M${cx} ${cy + 10} V${cy + 20} M${cx + 14} ${cy + 10} V${cy + 20}`} />
        </g>
      );
    case 'server':
      return (
        <g>
          {[-18, -4, 10].map((dy) => <g key={dy}><rect className="d-icon" x={cx - 24} y={cy + dy} width={48} height={11} rx={3} /><circle className="d-icon" cx={cx + 16} cy={cy + dy + 5.5} r={1.5} /></g>)}
        </g>
      );
    default:
      return (
        <g>
          <rect className="d-icon" x={cx - 24} y={cy - 18} width={48} height={30} rx={3} />
          <path className="d-icon" d={`M${cx - 10} ${cy + 20} H${cx + 10} M${cx} ${cy + 12} V${cy + 20}`} />
        </g>
      );
  }
}

const GALLERY: Array<{ kind: string; label: string; layer: string; cls: Kind }> = [
  { kind: 'router', label: 'Router', layer: 'Layer 3 · joins networks', cls: 'mid' },
  { kind: 'switch', label: 'Layer 2 switch', layer: 'Layer 2 · MAC addresses', cls: 'mid' },
  { kind: 'l3', label: 'Layer 3 switch', layer: 'Layers 2 + 3 · switch + route', cls: 'mid' },
  { kind: 'firewall', label: 'Firewall / NGFW', layer: 'Layers 3–7 · policy', cls: 'warn' },
  { kind: 'ap', label: 'Access point', layer: 'Wireless ↔ wired (L1–2)', cls: 'mid' },
  { kind: 'wlc', label: 'WLC / controller', layer: 'Manages many APs', cls: 'mid' },
  { kind: 'server', label: 'Server', layer: 'Provides services', cls: 'end' },
  { kind: 'endpoint', label: 'Endpoint', layer: 'Uses services', cls: 'end' },
];

function DeviceGallery() {
  return (
    <Svg viewBox="0 0 720 320" title="Common network devices" desc="Eight device cards: router, Layer 2 switch, Layer 3 switch, firewall, access point, wireless LAN controller, server and endpoint, each with the layer it mainly works at.">
      {GALLERY.map((d, i) => {
        const x = 16 + (i % 4) * 176;
        const y = 16 + Math.floor(i / 4) * 152;
        return (
          <g key={d.kind}>
            <rect className={KIND_CLASS[d.cls]} x={x} y={y} width={164} height={140} rx={12} />
            <Glyph kind={d.kind} cx={x + 82} cy={y + 52} />
            <text className="d-text" x={x + 82} y={y + 104} textAnchor="middle">{d.label}</text>
            <text className="d-sub" x={x + 82} y={y + 122} textAnchor="middle">{d.layer}</text>
          </g>
        );
      })}
    </Svg>
  );
}

// ---------------------------------------------------------------------------

function LanWan() {
  return (
    <Svg viewBox="0 0 720 310" title="Two LANs joined by a WAN" desc="A head office LAN with a PC, a server, a switch and a router on the left. A branch LAN with a PC, a printer, a switch and a router on the right. The two routers connect through a service provider WAN cloud in the middle.">
      <rect className="d-zone" x={10} y={30} width={262} height={250} rx={14} />
      <text className="d-title" x={26} y={54}>HQ LAN</text>
      <rect className="d-zone" x={448} y={30} width={262} height={250} rx={14} />
      <text className="d-title" x={464} y={54}>Branch LAN</text>
      <Link x1={116} y1={92} x2={150} y2={130} />
      <Link x1={116} y1={172} x2={150} y2={150} />
      <Link x1={195} y1={160} x2={195} y2={205} />
      <Link x1={596} y1={92} x2={560} y2={130} />
      <Link x1={596} y1={172} x2={560} y2={150} />
      <Link x1={515} y1={160} x2={515} y2={205} />
      <Link x1={240} y1={230} x2={296} y2={230} />
      <Link x1={424} y1={230} x2={470} y2={230} />
      <Node x={26} y={68} w={92} label="PC" kind="end" />
      <Node x={26} y={148} w={92} label="Server" kind="end" />
      <Node x={150} y={110} w={90} label="Switch" kind="mid" />
      <Node x={150} y={205} w={90} label="Router" kind="mid" />
      <Node x={594} y={68} w={92} label="PC" kind="end" />
      <Node x={594} y={148} w={92} label="Printer" kind="end" />
      <Node x={470} y={110} w={90} label="Switch" kind="mid" />
      <Node x={470} y={205} w={90} label="Router" kind="mid" />
      <Cloud cx={360} cy={230} label="WAN" sub="service provider" />
      <text className="d-sub" x={360} y={290} textAnchor="middle">LAN/WAN boundary = the router at each site</text>
    </Svg>
  );
}

// ---------------------------------------------------------------------------

const OSI_ROWS: Array<{ n: number; name: string; pdu: string; addr: string; ex: string; cls: Kind }> = [
  { n: 7, name: 'Application', pdu: 'Data', addr: '—', ex: 'HTTP, DNS, DHCP, SSH', cls: 'end' },
  { n: 6, name: 'Presentation', pdu: 'Data', addr: '—', ex: 'encoding, encryption, JSON', cls: 'end' },
  { n: 5, name: 'Session', pdu: 'Data', addr: '—', ex: 'start / keep / end a session', cls: 'end' },
  { n: 4, name: 'Transport', pdu: 'Segment', addr: 'Port numbers', ex: 'TCP, UDP', cls: 'warn' },
  { n: 3, name: 'Network', pdu: 'Packet', addr: 'IP address', ex: 'IPv4, IPv6, ICMP · router', cls: 'mid' },
  { n: 2, name: 'Data Link', pdu: 'Frame', addr: 'MAC address', ex: 'Ethernet, 802.11 · switch', cls: 'ok' },
  { n: 1, name: 'Physical', pdu: 'Bits', addr: '—', ex: 'copper, fibre, radio · hub', cls: 'default' },
];

function OsiEncapsulation() {
  return (
    <Svg viewBox="0 0 720 440" title="The seven OSI layers" desc="A table of the seven OSI layers from Application at the top to Physical at the bottom, showing the PDU, the addressing used and example protocols or devices for each layer. An arrow shows that encapsulation happens from the top layer down.">
      <text className="d-title" x={26} y={26}>Layer</text>
      <text className="d-title" x={92} y={26}>Name</text>
      <text className="d-title" x={236} y={26}>PDU</text>
      <text className="d-title" x={332} y={26}>Addressing</text>
      <text className="d-title" x={464} y={26}>Examples</text>
      {OSI_ROWS.map((r, i) => {
        const y = 36 + i * 56;
        return (
          <g key={r.n}>
            <rect className={KIND_CLASS[r.cls]} x={12} y={y} width={664} height={48} rx={10} />
            <circle className="d-fill-net" cx={40} cy={y + 24} r={15} />
            <text className="d-bit-text" x={40} y={y + 29} textAnchor="middle">{r.n}</text>
            <text className="d-text" x={92} y={y + 29}>{r.name}</text>
            <text className="d-text" x={236} y={y + 29}>{r.pdu}</text>
            <text className="d-sub" x={332} y={y + 29} style={{ fontSize: 13 }}>{r.addr}</text>
            <text className="d-sub" x={464} y={y + 29} style={{ fontSize: 12 }}>{r.ex}</text>
          </g>
        );
      })}
      <line className="d-line" x1={700} y1={44} x2={700} y2={412} />
      <path className="d-arrow" d="M694 406 L700 420 L706 406 Z" />
      <text className="d-sub" transform="rotate(-90 690 240)" x={690} y={240} textAnchor="middle">encapsulation ↓</text>
    </Svg>
  );
}

function TcpIpMap() {
  const rowY = (i: number) => 44 + i * 48;
  return (
    <Svg viewBox="0 0 640 400" title="TCP/IP model compared with OSI" desc="The seven OSI layers on the left. On the right the four TCP/IP layers: Application covers OSI layers 7, 6 and 5; Transport covers layer 4; Internet covers layer 3; Network Access covers layers 2 and 1.">
      <text className="d-title" x={30} y={28}>OSI model</text>
      <text className="d-title" x={380} y={28}>TCP/IP model</text>
      {OSI_ROWS.map((r, i) => (
        <g key={r.n}>
          <rect className={KIND_CLASS[r.cls]} x={30} y={rowY(i)} width={250} height={44} rx={9} />
          <text className="d-text" x={46} y={rowY(i) + 27}>{r.n} · {r.name}</text>
        </g>
      ))}
      <rect className="d-box-end" x={370} y={rowY(0)} width={250} height={140} rx={9} />
      <text className="d-text" x={495} y={rowY(0) + 62} textAnchor="middle">Application</text>
      <text className="d-sub" x={495} y={rowY(0) + 82} textAnchor="middle">HTTP, DNS, DHCP, SSH</text>
      <rect className="d-box-warn" x={370} y={rowY(3)} width={250} height={44} rx={9} />
      <text className="d-text" x={495} y={rowY(3) + 20} textAnchor="middle">Transport</text>
      <text className="d-sub" x={495} y={rowY(3) + 36} textAnchor="middle">TCP, UDP</text>
      <rect className="d-box-mid" x={370} y={rowY(4)} width={250} height={44} rx={9} />
      <text className="d-text" x={495} y={rowY(4) + 20} textAnchor="middle">Internet</text>
      <text className="d-sub" x={495} y={rowY(4) + 36} textAnchor="middle">IP, ICMP</text>
      <rect className="d-box-ok" x={370} y={rowY(5)} width={250} height={92} rx={9} />
      <text className="d-text" x={495} y={rowY(5) + 40} textAnchor="middle">Network Access</text>
      <text className="d-sub" x={495} y={rowY(5) + 60} textAnchor="middle">Ethernet, Wi-Fi</text>
    </Svg>
  );
}

// ---------------------------------------------------------------------------

function EthernetFrame() {
  const fields: Array<{ x: number; w: number; label: string; sub: string; cls: Kind }> = [
    { x: 16, w: 104, label: 'Preamble', sub: '7 bytes', cls: 'default' },
    { x: 124, w: 44, label: 'SFD', sub: '1 B', cls: 'default' },
    { x: 172, w: 112, label: 'Destination MAC', sub: '6 bytes', cls: 'end' },
    { x: 288, w: 112, label: 'Source MAC', sub: '6 bytes', cls: 'end' },
    { x: 404, w: 66, label: 'Type', sub: '2 bytes', cls: 'mid' },
    { x: 474, w: 150, label: 'Data / payload', sub: '46–1500 bytes', cls: 'ok' },
    { x: 628, w: 76, label: 'FCS', sub: '4 bytes', cls: 'danger' },
  ];
  const bracket = (x1: number, x2: number, y: number, text: string) => (
    <g>
      <path className="d-line" d={`M${x1} ${y} v8 H${x2} v-8`} />
      <text className="d-sub" x={(x1 + x2) / 2} y={y + 24} textAnchor="middle">{text}</text>
    </g>
  );
  return (
    <Svg viewBox="0 0 720 230" title="Ethernet II frame" desc="Fields of an Ethernet II frame in order: preamble 7 bytes and start frame delimiter 1 byte, destination MAC 6 bytes, source MAC 6 bytes, type 2 bytes, data 46 to 1500 bytes, and frame check sequence 4 bytes. The header is 14 bytes, the trailer is the FCS, and the frame is 64 to 1518 bytes.">
      <text className="d-title" x={16} y={30}>Ethernet II frame (fields left to right, as sent)</text>
      {fields.map((f) => (
        <g key={f.label}>
          <rect className={KIND_CLASS[f.cls]} x={f.x} y={46} width={f.w} height={56} rx={8} />
          <text className="d-text" x={f.x + f.w / 2} y={72} textAnchor="middle" style={{ fontSize: f.w < 80 ? 11 : 13 }}>{f.label}</text>
          <text className="d-sub" x={f.x + f.w / 2} y={90} textAnchor="middle">{f.sub}</text>
        </g>
      ))}
      {bracket(172, 470, 112, 'Header: 14 bytes')}
      {bracket(628, 704, 112, 'Trailer')}
      {bracket(172, 704, 150, 'Frame size: 64–1518 bytes (destination MAC through FCS)')}
      <text className="d-sub" x={68} y={126} textAnchor="middle">not counted in</text>
      <text className="d-sub" x={68} y={140} textAnchor="middle">frame size</text>
      <text className="d-sub" x={16} y={214}>MTU (maximum payload) = 1500 bytes · 802.1Q VLAN tag adds 4 bytes → 1522</text>
    </Svg>
  );
}

function MacAnatomy() {
  const bytes = ['00', '1A', '2B', '3C', '4D', '5E'];
  return (
    <Svg viewBox="0 0 720 270" title="Anatomy of a MAC address" desc="The MAC address 00:1A:2B:3C:4D:5E has six bytes. The first three bytes are the OUI assigned to the manufacturer and the last three are assigned by the manufacturer. In the first byte the lowest bit is the individual or group bit and the next bit is the universal or local bit.">
      <path className="d-line" d="M30 62 v-8 H326 v8" />
      <text className="d-sub" x={178} y={44} textAnchor="middle">OUI — first 24 bits (assigned to the manufacturer by the IEEE)</text>
      <path className="d-line" d="M364 62 v-8 H660 v8" />
      <text className="d-sub" x={512} y={44} textAnchor="middle">NIC-specific — last 24 bits (assigned by the manufacturer)</text>
      {bytes.map((b, i) => (
        <g key={i}>
          <rect className={i < 3 ? 'd-box-end' : 'd-box-mid'} x={30 + i * 106} y={70} width={100} height={46} rx={8} />
          <text className="d-mono" x={80 + i * 106} y={99} textAnchor="middle" style={{ fontSize: 20 }}>{b}</text>
        </g>
      ))}
      <text className="d-sub" x={30} y={148}>The first byte (0x00) in binary — two bits have special meaning:</text>
      {[0, 0, 0, 0, 0, 0, 0, 0].map((bit, i) => (
        <g key={i}>
          <rect className={i >= 6 ? 'd-box-warn' : 'd-box'} x={30 + i * 38} y={158} width={34} height={34} rx={6} />
          <text className="d-mono" x={47 + i * 38} y={181} textAnchor="middle">{bit}</text>
        </g>
      ))}
      <text className="d-sub" x={47 + 6 * 38} y={210} textAnchor="middle">U/L</text>
      <text className="d-sub" x={47 + 7 * 38} y={210} textAnchor="middle">I/G</text>
      <text className="d-text" x={350} y={172} style={{ fontSize: 12 }}>I/G (lowest bit): 0 = unicast, 1 = group (multicast / broadcast)</text>
      <text className="d-text" x={350} y={194} style={{ fontSize: 12 }}>U/L (next bit): 0 = universally assigned, 1 = locally administered</text>
      <text className="d-sub" x={30} y={250}>Cisco IOS writes the same address as 001a.2b3c.4d5e · Windows as 00-1A-2B-3C-4D-5E</text>
    </Svg>
  );
}

function BinaryPlaces() {
  const values = [128, 64, 32, 16, 8, 4, 2, 1];
  const bits = [1, 0, 1, 0, 1, 1, 0, 0];
  return (
    <Svg viewBox="0 0 720 250" title="Binary place values in one octet" desc="The eight place values of an octet from 128 down to 1. For the number 172 the bits are 1 0 1 0 1 1 0 0, which adds 128, 32, 8 and 4.">
      {values.map((v, i) => {
        const x = 28 + i * 84;
        const on = bits[i] === 1;
        return (
          <g key={v}>
            <text className="d-sub" x={x + 38} y={26} textAnchor="middle">2^{7 - i}</text>
            <rect className="d-box" x={x} y={34} width={76} height={44} rx={8} />
            <text className="d-text" x={x + 38} y={62} textAnchor="middle" style={{ fontSize: 17 }}>{v}</text>
            <rect className={on ? 'd-box-end' : 'd-box'} x={x} y={94} width={76} height={56} rx={8} />
            <text className="d-mono" x={x + 38} y={130} textAnchor="middle" style={{ fontSize: 24, opacity: on ? 1 : 0.5 }}>{bits[i]}</text>
          </g>
        );
      })}
      <text className="d-text" x={360} y={186} textAnchor="middle" style={{ fontSize: 18 }}>128 + 32 + 8 + 4 = 172</text>
      <text className="d-sub" x={360} y={212} textAnchor="middle">Bits that are 1 add their place value. Bits that are 0 add nothing.</text>
      <text className="d-sub" x={360} y={232} textAnchor="middle">172 in binary = 10101100</text>
    </Svg>
  );
}

function Ipv4Structure() {
  const octets = ['11000000', '10101000', '00000001', '00110010'];
  const dec = ['192', '168', '1', '50'];
  const x0 = 34;
  const cell = 19;
  const gap = 14;
  const ox = (o: number) => x0 + o * (8 * cell + gap);
  return (
    <Svg viewBox="0 0 720 300" title="Structure of an IPv4 address" desc="The address 192.168.1.50 with a /24 prefix drawn as 32 bits in four octets. The first 24 bits are the network portion and the last 8 bits are the host portion. The mask is 255.255.255.0.">
      <text className="d-title" x={34} y={28}>192.168.1.50 /24</text>
      {octets.map((bitsStr, o) => (
        <g key={o}>
          <text className="d-mono" x={ox(o) + 4 * cell} y={92} textAnchor="middle" style={{ fontSize: 17 }}>{dec[o]}</text>
          {bitsStr.split('').map((b, i) => {
            const idx = o * 8 + i;
            const net = idx < 24;
            return (
              <g key={i}>
                <rect className={net ? 'd-fill-net' : 'd-fill-host'} x={ox(o) + i * cell} y={106} width={cell - 1} height={32} rx={3} />
                <text className="d-bit-text" x={ox(o) + i * cell + (cell - 1) / 2} y={127} textAnchor="middle">{b}</text>
              </g>
            );
          })}
          <text className="d-sub" x={ox(o) + 4 * cell} y={158} textAnchor="middle">octet {o + 1} · 8 bits</text>
        </g>
      ))}
      <path className="d-line" d={`M${ox(0)} 176 v8 H${ox(2) + 8 * cell - 1} v-8`} />
      <text className="d-text" x={(ox(0) + ox(2) + 8 * cell) / 2} y={208} textAnchor="middle">Network portion · 24 bits (mask bits = 1)</text>
      <path className="d-line" d={`M${ox(3)} 176 v8 H${ox(3) + 8 * cell - 1} v-8`} />
      <text className="d-text" x={ox(3) + 4 * cell} y={208} textAnchor="middle">Host portion · 8 bits</text>
      <text className="d-sub" x={ox(3) + 4 * cell} y={226} textAnchor="middle">(mask bits = 0)</text>
      <text className="d-sub" x={34} y={266}>Mask 255.255.255.0 = 24 ones followed by 8 zeros = /24 → 2^8 = 256 addresses, 254 usable.</text>
    </Svg>
  );
}

// ---------------------------------------------------------------------------

function IosModes() {
  const rows = [
    { prompt: 'Router>', mode: 'User EXEC', tag: 'Bisita', what: 'Look only — basic checks', how: 'Where you land after login', cls: 'default' as Kind },
    { prompt: 'Router#', mode: 'Privileged EXEC', tag: 'May-ari', what: 'All show/debug commands, copy, reload', how: 'enable', cls: 'end' as Kind },
    { prompt: 'Router(config)#', mode: 'Global configuration', tag: 'Renovation', what: 'Change the whole device', how: 'configure terminal', cls: 'warn' as Kind },
    { prompt: 'Router(config-if)#', mode: 'Interface configuration', tag: 'Kwarto', what: 'Change one interface (also -line, -router, -vlan…)', how: 'interface g0/0', cls: 'ok' as Kind },
  ];
  return (
    <Svg viewBox="0 0 720 360" title="Cisco IOS command modes" desc="Four rows going down: user EXEC with the prompt ending in greater-than; privileged EXEC ending in a hash, entered with enable; global configuration entered with configure terminal; and interface configuration entered with the interface command. The exit command goes back one level and end returns to privileged EXEC.">
      <text className="d-title" x={24} y={22}>Prompt</text>
      <text className="d-title" x={252} y={22}>Mode (Taglish nickname)</text>
      <text className="d-title" x={520} y={22}>How to get in</text>
      {rows.map((r, i) => {
        const y = 32 + i * 82;
        return (
          <g key={r.prompt}>
            <rect className={KIND_CLASS[r.cls]} x={12} y={y} width={696} height={58} rx={10} />
            <text className="d-mono" x={28} y={y + 35} style={{ fontSize: 15 }}>{r.prompt}</text>
            <text className="d-text" x={252} y={y + 24}>{r.mode} — “{r.tag}”</text>
            <text className="d-sub" x={252} y={y + 43} style={{ fontSize: 12 }}>{r.what}</text>
            <text className="d-mono" x={520} y={y + 35} style={{ fontSize: 13 }}>{r.how}</text>
            {i < 3 && <text className="d-sub" x={360} y={y + 74} textAnchor="middle" style={{ fontSize: 11 }}>↓ deeper · ↑ exit = one step back · end = straight to #</text>}
          </g>
        );
      })}
    </Svg>
  );
}

function MediaCompare() {
  const cols = [
    { title: 'UTP copper', cls: 'end' as Kind, rows: ['Signal: electrical', 'Reach: 100 m max', 'Connector: RJ-45', 'Cost: lowest', 'Use: desk to switch', 'Watch out: interference, distance'] },
    { title: 'Multimode fibre', cls: 'mid' as Kind, rows: ['Signal: light (LED / VCSEL)', 'Reach: hundreds of metres', 'Core: 50 / 62.5 µm (wide)', 'Connector: LC / SC', 'Use: inside a building or campus', 'Cost: medium'] },
    { title: 'Single-mode fibre', cls: 'ok' as Kind, rows: ['Signal: light (laser)', 'Reach: kilometres (10 km+)', 'Core: about 9 µm (thin)', 'Connector: LC / SC', 'Use: between buildings and cities', 'Cost: highest'] },
  ];
  return (
    <Svg viewBox="0 0 720 300" title="Copper, multimode fibre and single-mode fibre compared" desc="Three columns compare UTP copper, multimode fibre and single-mode fibre by signal type, reach, connector, cost and typical use.">
      {cols.map((c, i) => {
        const x = 12 + i * 236;
        return (
          <g key={c.title}>
            <rect className={KIND_CLASS[c.cls]} x={x} y={12} width={224} height={276} rx={12} />
            <text className="d-text" x={x + 112} y={40} textAnchor="middle" style={{ fontSize: 16 }}>{c.title}</text>
            {c.rows.map((r, k) => <text key={r} className="d-sub" x={x + 14} y={78 + k * 34} style={{ fontSize: 12.5 }}>{r}</text>)}
          </g>
        );
      })}
    </Svg>
  );
}

function SubnetBlocks() {
  const x0 = 40;
  const w = 640;
  const ipX = x0 + (130 / 256) * w;
  const blocks = [0, 64, 128, 192];
  return (
    <Svg viewBox="0 0 720 260" title="Block size of a /26 in the last octet" desc="The last octet from 0 to 255 is split into four blocks of 64 addresses: 0 to 63, 64 to 127, 128 to 191 and 192 to 255. An address ending in 130 lands in the block starting at 128, so its network address ends in 128 and its broadcast address ends in 191.">
      <text className="d-title" x={40} y={26}>/26 → mask 255.255.255.192 → block size = 256 − 192 = 64</text>
      {blocks.map((b, i) => (
        <g key={b}>
          <rect className={b === 128 ? 'd-box-ok' : 'd-box'} x={x0 + (b / 256) * w} y={90} width={w / 4} height={54} rx={4} />
          <text className="d-text" x={x0 + (b / 256) * w + w / 8} y={122} textAnchor="middle">{b} – {b + 63}</text>
          <text className="d-mono" x={x0 + (b / 256) * w + 4} y={80} style={{ fontSize: 12 }}>.{b}</text>
          <text className="d-mono" x={x0 + (b / 256) * w + w / 4 - 4} y={166} textAnchor="end" style={{ fontSize: 12 }}>.{b + 63}</text>
          {i === 0 && <text className="d-sub" x={x0 - 2} y={62}>network (unang address)</text>}
          {i === 0 && <text className="d-sub" x={x0 + w / 4 - 4} y={184} textAnchor="end">broadcast (huling address)</text>}
        </g>
      ))}
      <path className="d-arrow" d={`M${ipX - 6} 208 L${ipX} 196 L${ipX + 6} 208 Z`} />
      <line className="d-line" x1={ipX} y1={144} x2={ipX} y2={198} />
      <text className="d-text" x={ipX} y={228} textAnchor="middle">.130 → nakatayo sa block na .128–.191</text>
      <text className="d-sub" x={ipX} y={246} textAnchor="middle">network = .128 · broadcast = .191 · hosts = .129 – .190</text>
    </Svg>
  );
}

function Ipv6Structure() {
  const groups = ['2001', '0db8', '0a00', '0001', '0000', '0000', '0000', '0001'];
  const gx = (i: number) => 22 + i * 86;
  return (
    <Svg viewBox="0 0 720 270" title="Structure of an IPv6 address" desc="An IPv6 address is eight groups of four hexadecimal digits. In the example 2001:0db8:0a00:0001:0000:0000:0000:0001 with a /64 prefix, the first four groups are the network prefix (a 48-bit global routing prefix plus a 16-bit subnet ID) and the last four groups are the 64-bit interface ID.">
      {groups.map((g, i) => (
        <g key={i}>
          <rect className={i < 3 ? 'd-box-end' : i === 3 ? 'd-box-warn' : 'd-box-mid'} x={gx(i)} y={70} width={78} height={50} rx={8} />
          <text className="d-mono" x={gx(i) + 39} y={101} textAnchor="middle" style={{ fontSize: 17 }}>{g}</text>
          {i < 7 && <text className="d-text" x={gx(i) + 82} y={101} textAnchor="middle">:</text>}
          <text className="d-sub" x={gx(i) + 39} y={138} textAnchor="middle">16 bits</text>
        </g>
      ))}
      <text className="d-title" x={22} y={30}>2001:0db8:0a00:0001:0000:0000:0000:0001 /64 = 2001:db8:a00:1::1/64</text>
      <path className="d-line" d={`M${gx(0)} 58 v-8 H${gx(3) + 78} v8`} />
      <text className="d-text" x={(gx(0) + gx(3) + 78) / 2} y={44} textAnchor="middle" style={{ fontSize: 12 }}>Network prefix — 64 bits (/64)</text>
      <path className="d-line" d={`M${gx(4)} 58 v-8 H${gx(7) + 78} v8`} />
      <text className="d-text" x={(gx(4) + gx(7) + 78) / 2} y={44} textAnchor="middle" style={{ fontSize: 12 }}>Interface ID — 64 bits</text>
      <path className="d-line" d={`M${gx(0)} 158 v8 H${gx(2) + 78} v-8`} />
      <text className="d-sub" x={(gx(0) + gx(2) + 78) / 2} y={186} textAnchor="middle">Global routing prefix (48)</text>
      <path className="d-line" d={`M${gx(3)} 158 v8 H${gx(3) + 78} v-8`} />
      <text className="d-sub" x={gx(3) + 39} y={186} textAnchor="middle">Subnet ID (16)</text>
      <text className="d-sub" x={22} y={232}>8 groups × 16 bits = 128 bits. Each group = 4 hex digits. Almost every LAN uses a /64, so the last 64 bits are for hosts.</text>
    </Svg>
  );
}

function Ipv6Types() {
  const rows = [
    { start: '2xxx or 3xxx', name: 'Global unicast', prefix: '2000::/3', taglish: 'Sa MUNDO — public, pwede sa internet', cls: 'ok' as Kind },
    { start: 'FE80 … FEBF', name: 'Link-local', prefix: 'FE80::/10', taglish: 'Sa KAPITBAHAY — sa iisang link lang', cls: 'mid' as Kind },
    { start: 'FC.. or FD..', name: 'Unique local', prefix: 'FC00::/7', taglish: 'Sa PAMILYA — private sa loob ng org', cls: 'warn' as Kind },
    { start: 'FFxx', name: 'Multicast', prefix: 'FF00::/8', taglish: 'Sa GRUPO — walang broadcast sa IPv6', cls: 'end' as Kind },
    { start: '::1', name: 'Loopback', prefix: '::1/128', taglish: 'Sarili mo (parang 127.0.0.1)', cls: 'default' as Kind },
    { start: '::', name: 'Unspecified', prefix: '::/128', taglish: 'Wala pang address', cls: 'default' as Kind },
  ];
  return (
    <Svg viewBox="0 0 720 380" title="IPv6 address types by first digits" desc="Six rows: global unicast starts with 2 or 3; link-local starts with FE80; unique local starts with FC or FD; multicast starts with FF; loopback is ::1; unspecified is ::.">
      <text className="d-title" x={24} y={24}>Unang digits</text>
      <text className="d-title" x={188} y={24}>Uri</text>
      <text className="d-title" x={340} y={24}>Prefix</text>
      <text className="d-title" x={450} y={24}>Madaling tandaan</text>
      {rows.map((r, i) => {
        const y = 34 + i * 56;
        return (
          <g key={r.name}>
            <rect className={KIND_CLASS[r.cls]} x={12} y={y} width={696} height={48} rx={10} />
            <text className="d-mono" x={26} y={y + 30} style={{ fontSize: 15 }}>{r.start}</text>
            <text className="d-text" x={188} y={y + 30}>{r.name}</text>
            <text className="d-mono" x={340} y={y + 30} style={{ fontSize: 12.5 }}>{r.prefix}</text>
            <text className="d-sub" x={450} y={y + 30} style={{ fontSize: 12 }}>{r.taglish}</text>
          </g>
        );
      })}
    </Svg>
  );
}

function Badge({ cx, cy, label, kind }: { cx: number; cy: number; label: string; kind: Kind }) {
  return (
    <g>
      <rect className={KIND_CLASS[kind]} x={cx - 19} y={cy - 11} width={38} height={22} rx={6} />
      <text className="d-sub" x={cx} y={cy + 4} textAnchor="middle" style={{ fontWeight: 700 }}>{label}</text>
    </g>
  );
}

function VlanSegments() {
  return (
    <Svg viewBox="0 0 720 320" title="One switch, two VLANs" desc="Two Sales PCs in VLAN 10 and two Engineering PCs in VLAN 20 all plug into the same switch. PCs in the same VLAN can talk directly. PCs in different VLANs have no direct path and need a router.">
      <rect className="d-zone" x={12} y={14} width={168} height={140} rx={12} />
      <rect className="d-zone" x={12} y={166} width={168} height={140} rx={12} />
      <text className="d-title" x={24} y={32}>VLAN 10 · SALES</text>
      <text className="d-title" x={24} y={184}>VLAN 20 · ENG</text>
      <Link x1={132} y1={64} x2={300} y2={140} />
      <Link x1={132} y1={120} x2={300} y2={150} />
      <Link x1={132} y1={216} x2={300} y2={170} />
      <Link x1={132} y1={272} x2={300} y2={180} />
      <Node x={24} y={42} w={108} h={44} label="PC1" sub="Fa0/1" kind="end" />
      <Node x={24} y={98} w={108} h={44} label="PC2" sub="Fa0/2" kind="end" />
      <Node x={24} y={194} w={108} h={44} label="PC3" sub="Fa0/3" kind="ok" />
      <Node x={24} y={250} w={108} h={44} label="PC4" sub="Fa0/4" kind="ok" />
      <Node x={300} y={125} w={120} h={70} label="SW1" sub="isang switch lang" kind="mid" />
      <Node x={490} y={40} w={218} h={84} label="Same VLAN" sub="direktang nag-uusap" kind="ok" />
      <Node x={490} y={196} w={218} h={84} label="Different VLAN" sub="kailangan ng router (Layer 3)" kind="danger" />
      <Link x1={420} y1={148} x2={490} y2={100} dashed />
      <Link x1={420} y1={172} x2={490} y2={228} dashed />
    </Svg>
  );
}

function Dot1qTrunk() {
  const parts: Array<{ x: number; w: number; label: string; kind: Kind }> = [
    { x: 24, w: 100, label: 'Dest MAC', kind: 'default' },
    { x: 128, w: 100, label: 'Source MAC', kind: 'default' },
    { x: 232, w: 140, label: '802.1Q TAG · 4 bytes', kind: 'mid' },
    { x: 376, w: 80, label: 'Type', kind: 'default' },
    { x: 460, w: 132, label: 'Data', kind: 'default' },
    { x: 596, w: 100, label: 'FCS', kind: 'default' },
  ];
  return (
    <Svg viewBox="0 0 720 290" title="A trunk carries many VLANs" desc="Two switches joined by one trunk link. Frames from VLAN 10 and VLAN 20 carry an 802.1Q tag that names their VLAN. Frames from the native VLAN travel untagged. Below, an Ethernet frame with the four-byte 802.1Q tag inserted after the source MAC address.">
      <line className="d-line" x1={134} y1={112} x2={586} y2={112} />
      <line className="d-line" x1={134} y1={118} x2={586} y2={118} />
      <Node x={24} y={85} w={110} h={60} label="SW1" sub="Gi0/1 = trunk" kind="mid" />
      <Node x={586} y={85} w={110} h={60} label="SW2" sub="Gi0/1 = trunk" kind="mid" />
      <Node x={170} y={30} w={120} h={44} label="VLAN 10" sub="may tag: 10" kind="end" />
      <Node x={300} y={30} w={120} h={44} label="VLAN 20" sub="may tag: 20" kind="ok" />
      <Node x={430} y={30} w={140} h={44} label="Native VLAN" sub="walang tag" kind="warn" />
      <text className="d-sub" x={360} y={166} textAnchor="middle">Isang cable, maraming VLAN. Ang tag ang nagsasabi kung kaninong VLAN ang frame.</text>
      {parts.map((p) => (
        <g key={p.label}>
          <rect className={KIND_CLASS[p.kind]} x={p.x} y={204} width={p.w} height={44} rx={8} />
          <text className="d-text" x={p.x + p.w / 2} y={231} textAnchor="middle" style={{ fontSize: 12 }}>{p.label}</text>
        </g>
      ))}
      <text className="d-sub" x={302} y={275} textAnchor="middle">TPID 0x8100 · priority 3 bits · VLAN ID 12 bits (1–4094)</text>
    </Svg>
  );
}

function RouterOnAStick() {
  return (
    <Svg viewBox="0 0 720 300" title="Router-on-a-stick" desc="PC-A in VLAN 10 and PC-B in VLAN 20 connect to a switch. A single trunk cable joins the switch to a router. The router's one physical interface is split into two subinterfaces, one per VLAN, each acting as the default gateway for its VLAN.">
      <Link x1={144} y1={64} x2={240} y2={140} />
      <Link x1={144} y1={236} x2={240} y2={160} />
      <line className="d-line" x1={360} y1={146} x2={520} y2={146} />
      <line className="d-line" x1={360} y1={152} x2={520} y2={152} />
      <Node x={24} y={40} w={120} h={48} label="PC-A" sub="VLAN 10 · .11" kind="end" />
      <Node x={24} y={212} w={120} h={48} label="PC-B" sub="VLAN 20 · .11" kind="ok" />
      <Node x={240} y={120} w={120} h={60} label="SW1" sub="access + trunk" kind="mid" />
      <text className="d-sub" x={440} y={132} textAnchor="middle">ISANG trunk cable</text>
      <text className="d-sub" x={440} y={172} textAnchor="middle">VLAN 10 + VLAN 20</text>
      <rect className="d-box-warn" x={520} y={70} width={188} height={160} rx={10} />
      <text className="d-text" x={614} y={94} textAnchor="middle">R1</text>
      <text className="d-mono" x={614} y={118} textAnchor="middle" style={{ fontSize: 11.5 }}>Gi0/0 (walang IP)</text>
      <rect className="d-box-end" x={534} y={132} width={160} height={38} rx={8} />
      <text className="d-mono" x={614} y={148} textAnchor="middle" style={{ fontSize: 11.5 }}>Gi0/0.10 · dot1Q 10</text>
      <text className="d-sub" x={614} y={163} textAnchor="middle">192.168.10.1</text>
      <rect className="d-box-ok" x={534} y={180} width={160} height={38} rx={8} />
      <text className="d-mono" x={614} y={196} textAnchor="middle" style={{ fontSize: 11.5 }}>Gi0/0.20 · dot1Q 20</text>
      <text className="d-sub" x={614} y={211} textAnchor="middle">192.168.20.1</text>
      <text className="d-sub" x={360} y={284} textAnchor="middle">PC-A → PC-B: pataas sa router sa trunk, papalitan ang VLAN, pabalik sa parehong cable.</text>
    </Svg>
  );
}

function LoopStorm() {
  return (
    <Svg viewBox="0 0 720 340" title="A switching loop" desc="Three switches connected in a triangle with no spanning tree. A broadcast frame is forwarded out every port, around the ring, again and again. Consequences: a broadcast storm, an unstable MAC table and duplicate frames.">
      <Link x1={330} y1={70} x2={120} y2={168} />
      <Link x1={390} y1={70} x2={600} y2={168} />
      <Link x1={180} y1={196} x2={540} y2={196} />
      <Node x={300} y={20} w={120} h={50} label="SW1" sub="Layer 2" kind="mid" />
      <Node x={60} y={168} w={120} h={50} label="SW2" sub="Layer 2" kind="mid" />
      <Node x={540} y={168} w={120} h={50} label="SW3" sub="Layer 2" kind="mid" />
      <Node x={200} y={96} w={104} h={26} label="BROADCAST" kind="danger" />
      <Node x={416} y={96} w={104} h={26} label="BROADCAST" kind="danger" />
      <Node x={308} y={183} w={104} h={26} label="BROADCAST" kind="danger" />
      <text className="d-sub" x={360} y={150} textAnchor="middle">Walang TTL sa Layer 2: umiikot nang walang hanggan</text>
      <Node x={24} y={262} w={216} h={56} label="Broadcast storm" sub="CPU at bandwidth ubos" kind="danger" />
      <Node x={252} y={262} w={216} h={56} label="MAC table instability" sub="paiba-iba ang port ng MAC" kind="danger" />
      <Node x={480} y={262} w={216} h={56} label="Duplicate frames" sub="maraming kopya ng frame" kind="danger" />
    </Svg>
  );
}

function StpRoles() {
  return (
    <Svg viewBox="0 0 720 320" title="STP port roles in a triangle" desc="SW1 is the root bridge and both its ports are designated ports. SW2 and SW3 each have a root port facing SW1. On the link between SW2 and SW3, SW2 has the designated port and SW3 has the alternate port, which blocks traffic, so the loop is broken.">
      <Link x1={330} y1={66} x2={120} y2={200} />
      <Link x1={390} y1={66} x2={600} y2={200} />
      <Link x1={180} y1={225} x2={540} y2={225} dashed />
      <Node x={300} y={16} w={120} h={50} label="SW1" sub="ROOT BRIDGE" kind="warn" />
      <Node x={60} y={200} w={120} h={50} label="SW2" sub="priority 32768" kind="mid" />
      <Node x={540} y={200} w={120} h={50} label="SW3" sub="priority 32768" kind="mid" />
      <Badge cx={292} cy={90} label="DP" kind="ok" />
      <Badge cx={428} cy={90} label="DP" kind="ok" />
      <Badge cx={152} cy={180} label="RP" kind="end" />
      <Badge cx={568} cy={180} label="RP" kind="end" />
      <Badge cx={214} cy={225} label="DP" kind="ok" />
      <Badge cx={506} cy={225} label="ALT" kind="danger" />
      <text className="d-sub" x={215} y={128} textAnchor="middle">cost 4</text>
      <text className="d-sub" x={505} y={128} textAnchor="middle">cost 4</text>
      <text className="d-sub" x={360} y={216} textAnchor="middle">cost 4 · dito na-block ang loop</text>
      <Badge cx={44} cy={288} label="RP" kind="end" />
      <text className="d-sub" x={70} y={292}>Root port: pinakamalapit sa root</text>
      <Badge cx={286} cy={288} label="DP" kind="ok" />
      <text className="d-sub" x={312} y={292}>Designated: nagpapasa ng frames</text>
      <Badge cx={528} cy={288} label="ALT" kind="danger" />
      <text className="d-sub" x={554} y={292}>Alternate: naka-block</text>
    </Svg>
  );
}

function RstpConvergence() {
  return (
    <Svg viewBox="0 0 720 260" title="Classic 802.1D versus Rapid PVST+ convergence" desc="802.1D moves through blocking, listening and learning before forwarding, up to about 50 seconds. Rapid PVST+ uses a proposal and agreement handshake on point-to-point links and reaches forwarding in about 1 to 2 seconds for an edge or newly active link.">
      <text className="d-sub" x={16} y={34}>802.1D (classic)</text>
      <Node x={16} y={44} w={176} h={40} label="Blocking" sub="20s (max age)" kind="danger" />
      <Node x={192} y={44} w={132} h={40} label="Listening" sub="15s" kind="warn" />
      <Node x={324} y={44} w={132} h={40} label="Learning" sub="15s" kind="warn" />
      <Node x={456} y={44} w={132} h={40} label="Forwarding" kind="ok" />
      <text className="d-sub" x={16} y={106}>Hanggang ~50 segundo bago makarating sa Forwarding</text>
      <text className="d-sub" x={16} y={162}>Rapid PVST+ (RSTP)</text>
      <Node x={16} y={172} w={90} h={40} label="Discarding" kind="danger" />
      <Node x={106} y={172} w={90} h={40} label="Learning" kind="warn" />
      <Node x={196} y={172} w={392} h={40} label="Forwarding" sub="proposal/agreement sa point-to-point link" kind="ok" />
      <text className="d-sub" x={16} y={234}>Kadalasan 1–2 segundo lang sa isang edge o bagong link — walang paghihintay sa timers</text>
    </Svg>
  );
}

function StpGuards() {
  return (
    <Svg viewBox="0 0 720 300" title="PortFast, BPDU Guard and Root Guard on an access switch" desc="A PC on Gi0/1 with PortFast and BPDU Guard forwards immediately, but if a switch or hub is plugged in instead and sends a BPDU, the port is error-disabled. The uplink on Gi0/1 to the distribution switch has Root Guard, so if a rogue switch offers a better bridge ID the port goes into a root-inconsistent state instead of becoming the new root.">
      <Node x={280} y={20} w={160} h={50} label="Distribution" sub="ROOT BRIDGE" kind="warn" />
      <Node x={40} y={150} w={160} h={50} label="Access switch" kind="mid" />
      <Link x1={200} y1={175} x2={280} y2={60} />
      <Badge cx={230} cy={130} label="RG" kind="end" />
      <text className="d-sub" x={244} y={108}>Root Guard sa uplink</text>
      <Node x={20} y={250} w={120} h={40} label="PC" kind="ok" />
      <Link x1={80} y1={250} x2={100} y2={200} />
      <Badge cx={100} cy={222} label="PF" kind="ok" />
      <text className="d-sub" x={124} y={226}>PortFast + BPDU Guard</text>
      <Node x={220} y={250} w={220} h={44} label="Rogue switch/hub sa PC port" sub="magpapadala ng BPDU" kind="danger" />
      <Link x1={220} y1={272} x2={140} y2={200} dashed />
      <Node x={480} y={190} w={220} h={70} label="Kung may BPDU sa PortFast port" sub="err-disabled agad (BPDU Guard)" kind="danger" />
      <Node x={480} y={40} w={220} h={70} label="Kung mas mataas ang rogue root" sub="root-inconsistent, hindi papalitan ang root" kind="danger" />
    </Svg>
  );
}

function EtherChannelBundle() {
  return (
    <Svg viewBox="0 0 720 260" title="Four links bundled into one Port-channel" desc="Two switches are joined by four physical links, Gi0/1 to Gi0/4. Spanning tree would block three of them. With EtherChannel they form Port-channel 1, which spanning tree sees as a single link, and traffic is shared across all four.">
      <text className="d-sub" x={16} y={22}>Walang EtherChannel: STP blocks ang 3 sa 4 na link</text>
      <Node x={40} y={40} w={110} h={44} label="SW1" kind="mid" />
      <Node x={250} y={40} w={110} h={44} label="SW2" kind="mid" />
      <Link x1={150} y1={50} x2={250} y2={50} />
      <Link x1={150} y1={58} x2={250} y2={58} dashed />
      <Link x1={150} y1={66} x2={250} y2={66} dashed />
      <Link x1={150} y1={74} x2={250} y2={74} dashed />
      <text className="d-sub" x={380} y={66}>1 ang gumagana, 3 ang naka-block</text>
      <text className="d-sub" x={16} y={134}>May EtherChannel (LACP): isang Port-channel1</text>
      <Node x={40} y={152} w={110} h={44} label="SW1" kind="mid" />
      <Node x={250} y={152} w={110} h={44} label="SW2" kind="mid" />
      <Link x1={150} y1={162} x2={250} y2={162} />
      <Link x1={150} y1={170} x2={250} y2={170} />
      <Link x1={150} y1={178} x2={250} y2={178} />
      <Link x1={150} y1={186} x2={250} y2={186} />
      <Badge cx={200} cy={216} label="Po1" kind="ok" />
      <text className="d-sub" x={380} y={166}>Isang link ang nakikita ng STP</text>
      <text className="d-sub" x={380} y={186}>Lahat ng 4 ay gumagana (load balancing)</text>
      <text className="d-sub" x={226} y={246}>LACP: active/passive · PAgP: desirable/auto</text>
    </Svg>
  );
}

function DiscoveryNeighbors() {
  return (
    <Svg viewBox="0 0 720 250" title="CDP and LLDP only see directly connected neighbours" desc="SW1 is connected to SW2 and to router R1. A PC sits behind SW2. SW1 learns about SW2 and R1 through CDP or LLDP but cannot see the PC because it is two hops away.">
      <Node x={280} y={20} w={150} h={50} label="SW1" sub="tinitingnan natin" kind="warn" />
      <Node x={60} y={130} w={150} h={50} label="SW2" kind="mid" />
      <Node x={500} y={130} w={150} h={50} label="R1" kind="mid" />
      <Link x1={320} y1={70} x2={160} y2={130} />
      <Link x1={400} y1={70} x2={560} y2={130} />
      <Badge cx={240} cy={100} label="1 hop" kind="ok" />
      <Badge cx={480} cy={100} label="1 hop" kind="ok" />
      <Node x={80} y={200} w={110} h={40} label="PC" sub="2 hops: hindi nakikita" kind="danger" />
      <Link x1={135} y1={180} x2={135} y2={200} dashed />
    </Svg>
  );
}

function DhcpDora() {
  return (
    <Svg viewBox="0 0 720 300" title="The DHCP DORA exchange" desc="The client broadcasts a Discover. The server replies with an Offer. The client broadcasts a Request for that offer. The server confirms with an Acknowledge and the client keeps the address for the lease time.">
      <Node x={40} y={16} w={140} h={44} label="Client" sub="walang IP pa" kind="end" />
      <Node x={540} y={16} w={140} h={44} label="DHCP server" kind="mid" />
      <line className="d-line-dash" x1={110} y1={60} x2={110} y2={290} />
      <line className="d-line-dash" x1={610} y1={60} x2={610} y2={290} />
      <Link x1={110} y1={95} x2={610} y2={95} />
      <text className="d-text" x={360} y={86} textAnchor="middle">1  Discover (broadcast)</text>
      <Link x1={610} y1={140} x2={110} y2={140} />
      <text className="d-text" x={360} y={131} textAnchor="middle">2  Offer (address, mask, gateway, DNS)</text>
      <Link x1={110} y1={185} x2={610} y2={185} />
      <text className="d-text" x={360} y={176} textAnchor="middle">3  Request (broadcast)</text>
      <Link x1={610} y1={230} x2={110} y2={230} />
      <text className="d-text" x={360} y={221} textAnchor="middle">4  Acknowledge (lease confirmed)</text>
      <text className="d-sub" x={360} y={272} textAnchor="middle">UDP: server 67, client 68</text>
    </Svg>
  );
}

function DhcpRelay() {
  return (
    <Svg viewBox="0 0 720 240" title="DHCP relay with ip helper-address" desc="A PC broadcasts a DHCP Discover on its subnet. The router interface facing the PC is configured with ip helper-address and forwards it as a unicast to a DHCP server on a different subnet.">
      <Node x={20} y={90} w={120} h={50} label="PC" sub="Discover broadcast" kind="end" />
      <Node x={270} y={90} w={150} h={50} label="Router" sub="ip helper-address" kind="warn" />
      <Node x={560} y={90} w={140} h={50} label="DHCP server" sub="10.0.0.5" kind="mid" />
      <Link x1={140} y1={115} x2={270} y2={115} />
      <Link x1={420} y1={115} x2={560} y2={115} />
      <text className="d-sub" x={205} y={104} textAnchor="middle">broadcast</text>
      <text className="d-sub" x={490} y={104} textAnchor="middle">unicast</text>
      <Badge cx={205} cy={160} label="Gi0/0" kind="ok" />
      <text className="d-sub" x={205} y={190} textAnchor="middle">helper dito (client side)</text>
      <text className="d-sub" x={360} y={224} textAnchor="middle">Hindi pinapasa ng router ang broadcast kung walang relay</text>
    </Svg>
  );
}

function DnsResolution() {
  return (
    <Svg viewBox="0 0 720 280" title="Recursive DNS resolution" desc="A client asks its resolver for www.example.com. The resolver asks a root server, which points to the .com TLD server, which points to the authoritative server for example.com. The authoritative server returns the address and the resolver replies to the client and caches the answer.">
      <Node x={20} y={110} w={110} h={50} label="Client" sub="www.example.com?" kind="end" />
      <Node x={230} y={110} w={130} h={50} label="Resolver" sub="recursive + cache" kind="warn" />
      <Node x={470} y={10} w={200} h={44} label="Root server" sub="'tanungin ang .com'" kind="mid" />
      <Node x={470} y={118} w={200} h={44} label="TLD (.com) server" sub="'tanungin ang example.com'" kind="mid" />
      <Node x={470} y={226} w={200} h={44} label="Authoritative server" sub="A: 93.184.216.34" kind="ok" />
      <Link x1={130} y1={135} x2={230} y2={135} />
      <Link x1={360} y1={122} x2={470} y2={32} />
      <Link x1={360} y1={135} x2={470} y2={140} />
      <Link x1={360} y1={148} x2={470} y2={248} />
      <text className="d-sub" x={180} y={124} textAnchor="middle">1</text>
      <text className="d-sub" x={420} y={66} textAnchor="middle">2</text>
      <text className="d-sub" x={420} y={132} textAnchor="middle">3</text>
      <text className="d-sub" x={420} y={218} textAnchor="middle">4</text>
      <text className="d-sub" x={180} y={176} textAnchor="middle">5: sagot + cache</text>
    </Svg>
  );
}

function NatTerms() {
  return (
    <Svg viewBox="0 0 720 270" title="The four NAT address terms" desc="An inside PC has the inside local address 192.168.1.10. The NAT router translates it to the inside global address 203.0.113.5. The outside server has the outside global address 198.51.100.7, which the inside sees as the outside local address, normally the same value.">
      <rect className="d-box-mid" x={20} y={30} width={260} height={210} rx={14} opacity={0.35} />
      <text className="d-sub" x={32} y={52}>INSIDE (loob)</text>
      <rect className="d-box-end" x={440} y={30} width={260} height={210} rx={14} opacity={0.35} />
      <text className="d-sub" x={452} y={52}>OUTSIDE (labas)</text>
      <Node x={40} y={90} w={130} h={50} label="PC1" sub="inside local" kind="end" />
      <Node x={40} y={170} w={230} h={44} label="192.168.1.10" sub="private, paningin ng loob" kind="default" />
      <Node x={300} y={90} w={110} h={50} label="NAT" sub="router" kind="warn" />
      <Link x1={170} y1={115} x2={300} y2={115} />
      <Link x1={410} y1={115} x2={470} y2={115} />
      <Node x={470} y={90} w={210} h={50} label="203.0.113.5" sub="inside global" kind="ok" />
      <Node x={470} y={170} w={210} h={50} label="198.51.100.7" sub="outside global / local" kind="mid" />
    </Svg>
  );
}

function NatStaticDynamic() {
  return (
    <Svg viewBox="0 0 720 280" title="Static versus dynamic NAT" desc="Static NAT maps server 192.168.1.50 permanently to 203.0.113.9. Dynamic NAT hands out addresses from a three-address pool to PC1, PC2 and PC3, while PC4 has no address left and cannot be translated.">
      <text className="d-sub" x={16} y={22}>Static: permanente</text>
      <Node x={30} y={34} w={150} h={44} label="192.168.1.50" sub="server" kind="end" />
      <Link x1={180} y1={56} x2={480} y2={56} />
      <Node x={480} y={34} w={170} h={44} label="203.0.113.9" sub="laging pareho" kind="ok" />
      <text className="d-sub" x={16} y={118}>Dynamic: pool na 3 address</text>
      <Node x={30} y={130} w={110} h={34} label="PC1" kind="end" />
      <Node x={30} y={172} w={110} h={34} label="PC2" kind="end" />
      <Node x={30} y={214} w={110} h={34} label="PC3" kind="end" />
      <Node x={30} y={256} w={110} h={22} label="PC4" kind="danger" />
      <Link x1={140} y1={147} x2={480} y2={147} />
      <Link x1={140} y1={189} x2={480} y2={189} />
      <Link x1={140} y1={231} x2={480} y2={231} />
      <Node x={480} y={130} w={170} h={34} label="203.0.113.10" kind="ok" />
      <Node x={480} y={172} w={170} h={34} label="203.0.113.11" kind="ok" />
      <Node x={480} y={214} w={170} h={34} label="203.0.113.12" kind="ok" />
      <text className="d-sub" x={160} y={271}>PC4: ubos na ang pool, hindi makalabas</text>
    </Svg>
  );
}

function PatPorts() {
  return (
    <Svg viewBox="0 0 720 240" title="PAT shares one address using ports" desc="PC1 at 192.168.1.10 and PC2 at 192.168.1.11 both leave through the router as 203.0.113.5, but with different source ports, 51000 and 51001, so replies return to the right host.">
      <Node x={20} y={40} w={170} h={50} label="PC1 192.168.1.10" sub="port 51000" kind="end" />
      <Node x={20} y={140} w={170} h={50} label="PC2 192.168.1.11" sub="port 51000" kind="end" />
      <Node x={300} y={90} w={120} h={60} label="Router" sub="PAT overload" kind="warn" />
      <Link x1={190} y1={65} x2={300} y2={110} />
      <Link x1={190} y1={165} x2={300} y2={130} />
      <Node x={520} y={40} w={180} h={50} label="203.0.113.5:51000" sub="para sa PC1" kind="ok" />
      <Node x={520} y={140} w={180} h={50} label="203.0.113.5:51001" sub="para sa PC2" kind="ok" />
      <Link x1={420} y1={110} x2={520} y2={65} />
      <Link x1={420} y1={130} x2={520} y2={165} />
      <text className="d-sub" x={360} y={225} textAnchor="middle">Iisang address, magkaibang port</text>
    </Svg>
  );
}

function NtpStrata() {
  return (
    <Svg viewBox="0 0 720 280" title="NTP stratum hierarchy" desc="A reference clock is stratum 0. A server attached to it is stratum 1. Servers that sync from it are stratum 2, and their clients are stratum 3. Each layer adds one to the stratum number.">
      <Node x={250} y={10} w={220} h={44} label="Reference clock" sub="stratum 0 (GPS / atomic)" kind="warn" />
      <Node x={250} y={84} w={220} h={44} label="NTP server" sub="stratum 1" kind="ok" />
      <Node x={110} y={160} w={200} h={44} label="Router R1" sub="stratum 2" kind="mid" />
      <Node x={410} y={160} w={200} h={44} label="Router R2" sub="stratum 2" kind="mid" />
      <Node x={60} y={230} w={150} h={40} label="Switch" sub="stratum 3" kind="end" />
      <Node x={260} y={230} w={150} h={40} label="Switch" sub="stratum 3" kind="end" />
      <Node x={470} y={230} w={150} h={40} label="PC / server" sub="stratum 3" kind="end" />
      <Link x1={360} y1={54} x2={360} y2={84} />
      <Link x1={330} y1={128} x2={210} y2={160} />
      <Link x1={390} y1={128} x2={510} y2={160} />
      <Link x1={170} y1={204} x2={135} y2={230} />
      <Link x1={250} y1={204} x2={335} y2={230} />
      <Link x1={510} y1={204} x2={545} y2={230} />
      <text className="d-sub" x={500} y={32}>mas mababa = mas malapit sa totoong oras</text>
    </Svg>
  );
}

function SnmpFlow() {
  return (
    <Svg viewBox="0 0 720 260" title="SNMP polling and traps" desc="The network management station sends GET requests to the agent on a managed switch on UDP port 161 and the agent replies. When something fails the agent sends a trap to the management station on UDP port 162.">
      <Node x={30} y={90} w={190} h={70} label="NMS (manager)" sub="nagtatanong at nakikinig" kind="warn" />
      <Node x={500} y={90} w={190} h={70} label="Switch + agent" sub="MIB: CPU, interfaces..." kind="mid" />
      <Link x1={220} y1={110} x2={500} y2={110} />
      <Link x1={500} y1={140} x2={220} y2={140} dashed />
      <text className="d-text" x={360} y={100} textAnchor="middle">GET / SET  (UDP 161)</text>
      <text className="d-sub" x={360} y={158} textAnchor="middle">TRAP / INFORM  (UDP 162)</text>
      <Badge cx={360} cy={50} label="polling: tanong" kind="end" />
      <Badge cx={360} cy={210} label="trap: sigaw" kind="danger" />
      <text className="d-sub" x={360} y={245} textAnchor="middle">v1/v2c: community string  ·  v3: authentication + encryption</text>
    </Svg>
  );
}

function SyslogLevels() {
  const L = [
    ['0', 'Emergencies', 'danger'], ['1', 'Alerts', 'danger'], ['2', 'Critical', 'danger'], ['3', 'Errors', 'warn'],
    ['4', 'Warnings', 'warn'], ['5', 'Notifications', 'ok'], ['6', 'Informational', 'ok'], ['7', 'Debugging', 'end'],
  ] as const;
  return (
    <Svg viewBox="0 0 720 220" title="Syslog severity levels" desc="Eight severity levels from 0 emergencies, the most serious, to 7 debugging, the least serious. A threshold of N shows levels 0 through N.">
      {L.map(([n, name, kind], i) => (
        <Node key={n} x={10 + i * 88} y={60} w={82} h={70} label={n} sub={name} kind={kind} />
      ))}
      <text className="d-sub" x={10} y={44}>mas seryoso</text>
      <text className="d-sub" x={710} y={44} textAnchor="end">mas madaldal</text>
      <line className="d-line" x1={10} y1={160} x2={450} y2={160} />
      <text className="d-text" x={10} y={186}>logging trap 4 {'→'} ipinapadala ang 0, 1, 2, 3, 4</text>
      <text className="d-sub" x={10} y={206}>Every Awesome Cisco Engineer Will Need Ice cream Daily</text>
    </Svg>
  );
}

function SshVsTelnet() {
  return (
    <Svg viewBox="0 0 720 260" title="Telnet versus SSH" desc="Telnet on TCP 23 sends the username and password in clear text that anyone on the path can read. SSH on TCP 22 encrypts the whole session so a sniffer only sees unreadable data.">
      <text className="d-sub" x={16} y={20}>Telnet (TCP 23): plain text</text>
      <Node x={20} y={32} w={120} h={44} label="Admin PC" kind="end" />
      <Node x={560} y={32} w={140} h={44} label="Router" kind="mid" />
      <Link x1={140} y1={54} x2={560} y2={54} />
      <Node x={250} y={96} w={220} h={34} label="user: admin pass: cisco" kind="danger" />
      <text className="d-sub" x={360} y={46} textAnchor="middle">nababasa ng sniffer</text>
      <text className="d-sub" x={16} y={158}>SSH (TCP 22): encrypted</text>
      <Node x={20} y={170} w={120} h={44} label="Admin PC" kind="end" />
      <Node x={560} y={170} w={140} h={44} label="Router" kind="mid" />
      <Link x1={140} y1={192} x2={560} y2={192} />
      <Node x={250} y={226} w={220} h={30} label="x9#Qk2!pL0aR...  " kind="ok" />
      <text className="d-sub" x={360} y={184} textAnchor="middle">hindi mabasa ng sniffer</text>
    </Svg>
  );
}

function TftpVsFtp() {
  return (
    <Svg viewBox="0 0 720 280" title="TFTP versus FTP" desc="TFTP sends a file over UDP port 69 with no login. FTP opens a control connection on TCP port 21 with a login, and a separate data connection on TCP port 20 to move the file.">
      <text className="d-sub" x={16} y={20}>TFTP: isang transfer, walang login</text>
      <Node x={20} y={32} w={120} h={44} label="Router" kind="end" />
      <Node x={560} y={32} w={140} h={44} label="TFTP server" kind="mid" />
      <Link x1={140} y1={54} x2={560} y2={54} />
      <Badge cx={350} cy={54} label="UDP 69" kind="warn" />
      <text className="d-sub" x={350} y={86} textAnchor="middle">walang username o password</text>
      <text className="d-sub" x={16} y={130}>FTP: control + data, may login</text>
      <Node x={20} y={142} w={120} h={44} label="Router / PC" kind="end" />
      <Node x={560} y={142} w={140} h={44} label="FTP server" kind="mid" />
      <Link x1={140} y1={156} x2={560} y2={156} />
      <Link x1={140} y1={176} x2={560} y2={176} dashed />
      <Badge cx={350} cy={150} label="TCP 21 control" kind="ok" />
      <Badge cx={350} cy={186} label="TCP 20 data" kind="end" />
      <text className="d-sub" x={360} y={230} textAnchor="middle">Parehong plain text. Ligtas na alternatibo: SFTP / SCP (SSH, TCP 22)</text>
      <Node x={200} y={240} w={320} h={30} label="Backup: copy running-config tftp:" kind="default" />
    </Svg>
  );
}

function SecurityChain() {
  return (
    <Svg viewBox="0 0 720 220" title="Threat, exploit, vulnerability and asset" desc="A threat uses an exploit against a vulnerability to harm an asset. Mitigation sits in the path and reduces the risk.">
      <Node x={10} y={70} w={120} h={60} label="Threat" sub="sino ang aatake" kind="danger" />
      <Node x={170} y={70} w={120} h={60} label="Exploit" sub="paano" kind="warn" />
      <Node x={330} y={70} w={130} h={60} label="Vulnerability" sub="anong butas" kind="warn" />
      <Node x={500} y={70} w={120} h={60} label="Asset" sub="ano ang apektado" kind="end" />
      <Link x1={130} y1={100} x2={170} y2={100} />
      <Link x1={290} y1={100} x2={330} y2={100} />
      <Link x1={460} y1={100} x2={500} y2={100} />
      <Node x={250} y={160} w={240} h={44} label="Mitigation" sub="patch, ACL, training, backup" kind="ok" />
      <Link x1={370} y1={160} x2={395} y2={130} dashed />
      <text className="d-sub" x={10} y={30}>CIA: Confidentiality · Integrity · Availability</text>
      <text className="d-sub" x={10} y={50}>Panganib = posibilidad × epekto</text>
    </Svg>
  );
}

function ThreatMap() {
  const rows = [
    ['Malware', 'update + antivirus + backup'],
    ['Phishing', 'training + MFA + email filter'],
    ['Spoofing', 'DHCP snooping, DAI, port security'],
    ['Man-in-the-middle', 'encryption (TLS, VPN) + authentication'],
    ['DoS / DDoS', 'rate limiting + scrubbing + redundancy'],
  ] as const;
  return (
    <Svg viewBox="0 0 720 300" title="Common threats and their usual defences" desc="Malware is countered by updates and antivirus; phishing by training and MFA; spoofing by DHCP snooping, DAI and port security; man-in-the-middle by encryption and authentication; DoS by rate limiting and scrubbing.">
      <text className="d-title" x={20} y={24}>Banta</text>
      <text className="d-title" x={300} y={24}>Karaniwang depensa</text>
      {rows.map(([a, b], i) => (
        <g key={a}>
          <Node x={20} y={36 + i * 52} w={220} h={40} label={a} kind="danger" />
          <Link x1={240} y1={56 + i * 52} x2={290} y2={56 + i * 52} />
          <Node x={290} y={36 + i * 52} w={410} h={40} label={b} kind="ok" />
        </g>
      ))}
    </Svg>
  );
}

function HardeningLayers() {
  return (
    <Svg viewBox="0 0 720 260" title="Ways into a Cisco device and how to protect each" desc="Console, VTY remote lines and privileged EXEC are the three doors into a device. Each is protected: console with login local and a timeout, VTY with SSH only and local users, and privileged EXEC with enable secret. Unused ports are shut down.">
      <Node x={280} y={10} w={160} h={50} label="Router / Switch" kind="warn" />
      <Node x={20} y={100} w={200} h={64} label="Console" sub="login local + exec-timeout" kind="mid" />
      <Node x={260} y={100} w={200} h={64} label="VTY (remote)" sub="SSH only + login local" kind="mid" />
      <Node x={500} y={100} w={200} h={64} label="Privileged EXEC" sub="enable secret (hash)" kind="mid" />
      <Link x1={320} y1={60} x2={120} y2={100} />
      <Link x1={360} y1={60} x2={360} y2={100} />
      <Link x1={400} y1={60} x2={600} y2={100} />
      <Node x={20} y={196} w={320} h={44} label="Unused ports: shutdown + unused VLAN" kind="ok" />
      <Node x={380} y={196} w={320} h={44} label="Banner: legal warning, no welcome" kind="end" />
    </Svg>
  );
}

function AclFlow() {
  return (
    <Svg viewBox="0 0 720 280" title="How a router evaluates an ACL" desc="A packet is compared with rule 10, then 20, then 30. The first matching rule permits or denies it and stops the search. If nothing matches, the implicit deny drops the packet.">
      <Node x={20} y={110} w={110} h={50} label="Packet" kind="end" />
      <Node x={180} y={20} w={200} h={44} label="10 deny host .10" kind="danger" />
      <Node x={180} y={84} w={200} h={44} label="20 permit 192.168.1.0/24" kind="ok" />
      <Node x={180} y={148} w={200} h={44} label="30 permit tcp ... eq 80" kind="ok" />
      <Node x={180} y={212} w={200} h={44} label="implicit deny any" sub="nakatago" kind="danger" />
      <Link x1={130} y1={135} x2={180} y2={42} />
      <Link x1={130} y1={135} x2={180} y2={106} />
      <Link x1={130} y1={135} x2={180} y2={170} />
      <Link x1={130} y1={135} x2={180} y2={234} dashed />
      <text className="d-text" x={420} y={50}>tugma? bawal, humihinto</text>
      <text className="d-text" x={420} y={114}>tugma? pasok, humihinto</text>
      <text className="d-text" x={420} y={178}>tugma? pasok, humihinto</text>
      <text className="d-sub" x={420} y={240}>walang tugma: ibabagsak</text>
    </Svg>
  );
}

function AclPlacement() {
  return (
    <Svg viewBox="0 0 720 240" title="ACL placement" desc="An extended ACL is placed close to the source, so unwanted traffic is dropped early. A standard ACL is placed close to the destination because it only knows the source address.">
      <Node x={20} y={90} w={110} h={50} label="Source" kind="end" />
      <Node x={190} y={90} w={110} h={50} label="R1" kind="mid" />
      <Node x={360} y={90} w={110} h={50} label="R2" kind="mid" />
      <Node x={530} y={90} w={110} h={50} label="R3" kind="mid" />
      <Node x={640} y={160} w={70} h={44} label="Dest" kind="end" />
      <Link x1={130} y1={115} x2={190} y2={115} />
      <Link x1={300} y1={115} x2={360} y2={115} />
      <Link x1={470} y1={115} x2={530} y2={115} />
      <Link x1={620} y1={140} x2={670} y2={160} />
      <Badge cx={190} cy={70} label="EXT" kind="ok" />
      <text className="d-sub" x={150} y={50}>extended: malapit sa source</text>
      <Badge cx={600} cy={190} label="STD" kind="warn" />
      <text className="d-sub" x={420} y={222}>standard: malapit sa destination</text>
    </Svg>
  );
}

function AclExtendedRead() {
  return (
    <Svg viewBox="0 0 720 200" title="Reading an extended ACL entry" desc="An entry reads action, protocol, source with wildcard, destination with wildcard and a port operator, for example permit tcp 192.168.10.0 0.0.0.255 host 10.0.0.50 eq 443.">
      <Node x={10} y={50} w={90} h={50} label="permit" sub="o deny" kind="ok" />
      <Node x={110} y={50} w={80} h={50} label="tcp" sub="protocol" kind="end" />
      <Node x={200} y={50} w={190} h={50} label="192.168.10.0 0.0.0.255" sub="source + wildcard" kind="mid" />
      <Node x={400} y={50} w={160} h={50} label="host 10.0.0.50" sub="destination" kind="mid" />
      <Node x={570} y={50} w={130} h={50} label="eq 443" sub="port" kind="warn" />
      <text className="d-sub" x={10} y={140}>P → S → D → P: Protocol, Source, Destination, Port</text>
      <text className="d-sub" x={10} y={164}>eq = katumbas · neq = hindi · gt/lt = mas malaki/maliit · range = saklaw</text>
    </Svg>
  );
}

function PortSecurityModes() {
  return (
    <Svg viewBox="0 0 720 260" title="Port security violation modes" desc="A second MAC address appears on a port with a maximum of one. Protect drops the frame silently. Restrict drops it, logs it and counts it. Shutdown puts the port into err-disabled.">
      <Node x={20} y={100} w={130} h={56} label="Intruder" sub="2nd MAC" kind="danger" />
      <Node x={230} y={100} w={160} h={56} label="Switch port" sub="max 1 secure MAC" kind="mid" />
      <Link x1={150} y1={128} x2={230} y2={128} />
      <Node x={470} y={14} w={230} h={60} label="Protect" sub="drop lang, walang log" kind="warn" />
      <Node x={470} y={98} w={230} h={60} label="Restrict" sub="drop + log + counter" kind="warn" />
      <Node x={470} y={182} w={230} h={60} label="Shutdown (default)" sub="err-disabled ang port" kind="danger" />
      <Link x1={390} y1={118} x2={470} y2={44} />
      <Link x1={390} y1={128} x2={470} y2={128} />
      <Link x1={390} y1={138} x2={470} y2={212} />
      <text className="d-sub" x={20} y={240}>Bawi: shutdown → no shutdown</text>
    </Svg>
  );
}

function DhcpSnoopingPorts() {
  return (
    <Svg viewBox="0 0 720 280" title="DHCP snooping trusted and untrusted ports" desc="A switch has one trusted uplink toward the real DHCP server and untrusted ports for a client PC and an attacker running a rogue DHCP server. Offers from the rogue server are dropped; offers from the real server pass.">
      <Node x={270} y={100} w={180} h={70} label="Switch" sub="DHCP snooping on" kind="warn" />
      <Node x={270} y={10} w={180} h={50} label="Real DHCP server" kind="ok" />
      <Node x={20} y={100} w={150} h={50} label="Client PC" sub="untrusted" kind="end" />
      <Node x={20} y={200} w={190} h={50} label="Rogue DHCP server" sub="untrusted" kind="danger" />
      <Link x1={360} y1={60} x2={360} y2={100} />
      <Link x1={170} y1={125} x2={270} y2={135} />
      <Link x1={210} y1={225} x2={290} y2={170} dashed />
      <Badge cx={360} cy={80} label="trusted" kind="ok" />
      <text className="d-text" x={500} y={60}>Offer ng totoong server: pasok</text>
      <text className="d-text" x={500} y={230}>Offer ng rogue: ibinabagsak</text>
      <text className="d-sub" x={500} y={134}>Binding table: MAC, IP, VLAN, port</text>
    </Svg>
  );
}

function DaiCheck() {
  return (
    <Svg viewBox="0 0 720 260" title="Dynamic ARP Inspection check" desc="An attacker sends an ARP reply claiming the gateway IP at the attacker's MAC. The switch compares it with the DHCP snooping binding table, finds no match and drops the packet.">
      <Node x={20} y={20} w={170} h={50} label="Attacker" sub="ARP: 10.1.1.1 is at MAC X" kind="danger" />
      <Node x={250} y={90} w={170} h={60} label="Switch + DAI" sub="untrusted port" kind="warn" />
      <Node x={500} y={20} w={200} h={90} label="Binding table" sub="10.1.1.1 = MAC G (gateway)" kind="mid" />
      <Link x1={190} y1={55} x2={250} y2={110} />
      <Link x1={420} y1={110} x2={500} y2={80} />
      <Node x={250} y={190} w={170} h={50} label="X ≠ G → DROP" kind="danger" />
      <Link x1={335} y1={150} x2={335} y2={190} />
      <text className="d-sub" x={440} y={160}>Hindi tugma sa table = ibagsak</text>
      <text className="d-sub" x={440} y={180}>Static host = ARP ACL</text>
    </Svg>
  );
}

function AaaRadiusTacacs() {
  return (
    <Svg viewBox="0 0 720 270" title="AAA with RADIUS or TACACS+" desc="An admin logs in to a router. The router asks a central AAA server using TACACS+ over TCP 49 or RADIUS over UDP 1812, and falls back to local accounts if the server does not answer.">
      <Node x={10} y={100} w={110} h={50} label="Admin" kind="end" />
      <Node x={190} y={100} w={130} h={50} label="Router" sub="aaa new-model" kind="mid" />
      <Node x={470} y={30} w={230} h={64} label="AAA server" sub="users · policy · logs" kind="ok" />
      <Node x={470} y={170} w={230} h={64} label="Local fallback" sub="username ... secret" kind="warn" />
      <Link x1={120} y1={125} x2={190} y2={125} />
      <Link x1={320} y1={110} x2={470} y2={62} />
      <Link x1={320} y1={140} x2={470} y2={202} dashed />
      <text className="d-sub" x={340} y={74}>TACACS+ TCP 49 (lahat naka-encrypt)</text>
      <text className="d-sub" x={340} y={92}>RADIUS UDP 1812 (password lang)</text>
      <text className="d-sub" x={330} y={190}>kapag walang sagot</text>
      <text className="d-sub" x={10} y={258}>Authentication: sino · Authorization: ano · Accounting: ano ang ginawa</text>
    </Svg>
  );
}

function VpnSiteRemote() {
  return (
    <Svg viewBox="0 0 720 300" title="Site-to-site and remote-access VPN" desc="Head Office and Branch are joined by a site-to-site IPsec tunnel across the internet. A remote worker connects to Head Office with a remote-access VPN. At Head Office a firewall separates inside, outside and a DMZ with the public web server, and an IPS inspects traffic.">
      <Node x={20} y={20} w={150} h={50} label="Head Office" sub="firewall + IPS" kind="mid" />
      <Node x={550} y={20} w={150} h={50} label="Branch" kind="mid" />
      <Cloud cx={360} cy={50} label="Internet" />
      <Link x1={170} y1={45} x2={296} y2={45} />
      <Link x1={424} y1={45} x2={550} y2={45} />
      <Badge cx={240} cy={30} label="IPsec ESP" kind="ok" />
      <Badge cx={490} cy={30} label="tunnel" kind="ok" />
      <text className="d-sub" x={360} y={110} textAnchor="middle">site-to-site: gateway sa gateway</text>
      <Node x={270} y={200} w={160} h={50} label="Remote worker" sub="VPN client" kind="end" />
      <Link x1={350} y1={200} x2={360} y2={88} dashed />
      <text className="d-sub" x={380} y={150}>remote-access</text>
      <Node x={20} y={150} w={150} h={50} label="DMZ" sub="public web server" kind="warn" />
      <Link x1={95} y1={70} x2={95} y2={150} />
      <Node x={20} y={230} w={150} h={50} label="Inside LAN" kind="end" />
      <Link x1={95} y1={200} x2={95} y2={230} />
      <text className="d-sub" x={500} y={250}>IDS = nakikinig lang</text>
      <text className="d-sub" x={500} y={270}>IPS = inline, humaharang</text>
    </Svg>
  );
}

function RouterHops() {
  return (
    <Svg viewBox="0 0 720 280" title="Addresses across two routers" desc="A PC sends a packet to a server through two routers. The source and destination IP addresses stay the same on every link, but the source and destination MAC addresses change on each link.">
      <Node x={10} y={90} w={90} h={50} label="PC1" kind="end" />
      <Node x={190} y={90} w={90} h={50} label="R1" kind="mid" />
      <Node x={370} y={90} w={90} h={50} label="R2" kind="mid" />
      <Node x={560} y={90} w={110} h={50} label="Server" kind="end" />
      <Link x1={100} y1={115} x2={190} y2={115} />
      <Link x1={280} y1={115} x2={370} y2={115} />
      <Link x1={460} y1={115} x2={560} y2={115} />
      <text className="d-text" x={145} y={80} textAnchor="middle">L2: PC1 → R1</text>
      <text className="d-text" x={325} y={80} textAnchor="middle">L2: R1 → R2</text>
      <text className="d-text" x={510} y={80} textAnchor="middle">L2: R2 → Server</text>
      <rect className="d-box-ok" x={10} y={170} width={660} height={44} rx={8} />
      <text className="d-text" x={340} y={196} textAnchor="middle">IP: 192.168.1.10 → 10.0.0.5  (pareho sa lahat ng link)</text>
      <text className="d-sub" x={340} y={244} textAnchor="middle">IP = end to end · MAC = hop by hop · TTL bumababa ng 1 bawat router</text>
    </Svg>
  );
}

function RouteEntry() {
  return (
    <Svg viewBox="0 0 720 200" title="Parts of a route entry" desc="The route O 10.2.0.0/16 [110/2] via 10.1.1.2, 00:01:10, GigabitEthernet0/0 has a code O for OSPF, the prefix 10.2.0.0/16, an administrative distance of 110, a metric of 2, a next hop of 10.1.1.2, an age and an exit interface.">
      <Node x={10} y={60} w={60} h={50} label="O" sub="code" kind="warn" />
      <Node x={80} y={60} w={130} h={50} label="10.2.0.0/16" sub="prefix" kind="end" />
      <Node x={220} y={60} w={110} h={50} label="[110/2]" sub="AD / metric" kind="ok" />
      <Node x={340} y={60} w={130} h={50} label="via 10.1.1.2" sub="next hop" kind="mid" />
      <Node x={480} y={60} w={90} h={50} label="00:01:10" sub="age" kind="default" />
      <Node x={580} y={60} w={130} h={50} label="Gi0/0" sub="exit interface" kind="mid" />
      <text className="d-sub" x={10} y={150}>Pagpili: 1) longest prefix · 2) AD mababa · 3) metric mababa</text>
      <text className="d-sub" x={10} y={174}>AD: C 0 · S 1 · EIGRP 90 · OSPF 110 · RIP 120</text>
    </Svg>
  );
}

function StaticRoutePair() {
  return (
    <Svg viewBox="0 0 720 240" title="Forward and return static routes" desc="R1 has a static route to LAN2 through R2, and R2 has a return static route to LAN1 through R1. Both are needed for a ping reply to come back.">
      <Node x={10} y={90} w={110} h={50} label="LAN1" sub="192.168.1.0/24" kind="end" />
      <Node x={190} y={90} w={90} h={50} label="R1" kind="mid" />
      <Node x={400} y={90} w={90} h={50} label="R2" kind="mid" />
      <Node x={580} y={90} w={120} h={50} label="LAN2" sub="192.168.2.0/24" kind="end" />
      <Link x1={120} y1={115} x2={190} y2={115} />
      <Link x1={280} y1={115} x2={400} y2={115} />
      <Link x1={490} y1={115} x2={580} y2={115} />
      <text className="d-text" x={340} y={90} textAnchor="middle">172.16.0.0/30</text>
      <rect className="d-box-ok" x={140} y={160} width={190} height={34} rx={6} />
      <text className="d-sub" x={235} y={182} textAnchor="middle">R1: ip route LAN2 via R2</text>
      <rect className="d-box-warn" x={360} y={160} width={190} height={34} rx={6} />
      <text className="d-sub" x={455} y={182} textAnchor="middle">R2: ip route LAN1 via R1 (PABALIK)</text>
      <text className="d-sub" x={360} y={225} textAnchor="middle">Walang return route = dumarating ang request, walang reply</text>
    </Svg>
  );
}

function DefaultRouteStub() {
  return (
    <Svg viewBox="0 0 720 250" title="Default route on a stub network" desc="A customer router R1 has a default route 0.0.0.0/0 toward the ISP. The ISP has a static return route to the customer LAN. Anything R1 has no specific route for is sent to the ISP and on to the internet.">
      <Node x={10} y={80} w={120} h={50} label="LAN" sub="192.168.1.0/24" kind="end" />
      <Node x={190} y={80} w={100} h={50} label="R1" sub="stub" kind="mid" />
      <Node x={400} y={80} w={100} h={50} label="ISP" kind="warn" />
      <Cloud cx={620} cy={105} label="Internet" />
      <Link x1={130} y1={105} x2={190} y2={105} />
      <Link x1={290} y1={105} x2={400} y2={105} />
      <Link x1={500} y1={105} x2={556} y2={105} />
      <rect className="d-box-ok" x={130} y={150} width={230} height={34} rx={6} />
      <text className="d-sub" x={245} y={172} textAnchor="middle">R1: ip route 0.0.0.0 0.0.0.0 ISP  (S*)</text>
      <rect className="d-box-warn" x={380} y={150} width={240} height={34} rx={6} />
      <text className="d-sub" x={500} y={172} textAnchor="middle">ISP: ip route 192.168.1.0/24 via R1</text>
      <text className="d-sub" x={360} y={220} textAnchor="middle">/0 = pinakamaikling prefix: huling gagamitin, "gateway of last resort"</text>
    </Svg>
  );
}

const DIAGRAMS: Record<DiagramId, () => ReactNode> = {
  'ios-modes': IosModes,
  'media-compare': MediaCompare,
  'subnet-blocks': SubnetBlocks,
  'ipv6-structure': Ipv6Structure,
  'ipv6-types': Ipv6Types,
  'network-overview': NetworkOverview,
  'device-gallery': DeviceGallery,
  'lan-wan': LanWan,
  'osi-encapsulation': OsiEncapsulation,
  'tcpip-osi-map': TcpIpMap,
  'ethernet-frame': EthernetFrame,
  'mac-anatomy': MacAnatomy,
  'binary-places': BinaryPlaces,
  'ipv4-structure': Ipv4Structure,
  'vlan-segments': VlanSegments,
  'dot1q-trunk': Dot1qTrunk,
  'router-on-a-stick': RouterOnAStick,
  'loop-storm': LoopStorm,
  'stp-roles': StpRoles,
  'rstp-convergence': RstpConvergence,
  'stp-guards': StpGuards,
  'etherchannel-bundle': EtherChannelBundle,
  'discovery-neighbors': DiscoveryNeighbors,
  'dhcp-dora': DhcpDora,
  'dhcp-relay': DhcpRelay,
  'dns-resolution': DnsResolution,
  'nat-terms': NatTerms,
  'nat-static-dynamic': NatStaticDynamic,
  'pat-ports': PatPorts,
  'ntp-strata': NtpStrata,
  'snmp-flow': SnmpFlow,
  'syslog-levels': SyslogLevels,
  'ssh-vs-telnet': SshVsTelnet,
  'tftp-vs-ftp': TftpVsFtp,
  'security-chain': SecurityChain,
  'threat-map': ThreatMap,
  'hardening-layers': HardeningLayers,
  'acl-flow': AclFlow,
  'acl-placement': AclPlacement,
  'acl-extended-read': AclExtendedRead,
  'port-security-modes': PortSecurityModes,
  'dhcp-snooping-ports': DhcpSnoopingPorts,
  'dai-check': DaiCheck,
  'aaa-radius-tacacs': AaaRadiusTacacs,
  'vpn-site-remote': VpnSiteRemote,
  'router-hops': RouterHops,
  'route-entry': RouteEntry,
  'static-route-pair': StaticRoutePair,
  'default-route-stub': DefaultRouteStub,
};

export function DiagramView({ id, caption }: { id: DiagramId; caption: string }) {
  const Diagram = DIAGRAMS[id];
  return (
    <figure className="diagram" style={{ marginInline: 0 }}>
      <Diagram />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
