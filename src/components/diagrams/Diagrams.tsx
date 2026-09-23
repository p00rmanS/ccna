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
