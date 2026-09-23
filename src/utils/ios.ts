/**
 * A small, honest simulation of the Cisco IOS command line for practice.
 * It models modes, abbreviations, help, common errors and a limited command set for a router
 * and a Layer 2 switch (VLANs, trunks, subinterfaces). It is NOT a real device: unsupported
 * commands are rejected with the normal IOS error text.
 */
import { broadcastAddress, intToIp, maskToPrefix, networkAddress, parseIp } from './subnet';

export type Mode = 'user' | 'priv' | 'config' | 'config-if' | 'config-subif' | 'config-vlan';
export type Kind = 'router' | 'switch';

export interface Switchport {
  /** "dynamic" is the factory default (dynamic auto): it behaves as an access port unless the neighbour trunks. */
  mode: 'dynamic' | 'access' | 'trunk';
  accessVlan: number;
  nativeVlan: number;
  allowed: 'all' | number[];
}

export interface Iface {
  name: string;
  ip: string | null;
  mask: string | null;
  description: string;
  shutdown: boolean;
  /** Is a working cable plugged into a live device? */
  connected: boolean;
  switchport: Switchport | null;
  /** 802.1Q VLAN of a router subinterface. */
  dot1q: number | null;
}

export interface Snapshot {
  kind: Kind;
  hostname: string;
  interfaces: Record<string, Iface>;
  vlans: Record<number, string>;
  domainLookup: boolean;
  banner: string | null;
  enableSecret: boolean;
}

export interface Device extends Snapshot {
  mode: Mode;
  currentIf: string | null;
  /** Interfaces selected by "interface range" (empty when a single interface is selected). */
  currentRange: string[];
  currentVlan: number | null;
  /** Saved configuration (NVRAM). null = none. */
  startup: Snapshot | null;
  /** Addresses that answer a ping when they sit in the subnet of an up/up interface. */
  reachable: string[];
  history: string[];
  visited: Mode[];
}

export interface DeviceOptions {
  kind?: Kind;
  hostname?: string;
  mode?: Mode;
  interfaces?: Array<Partial<Iface> & { name: string }>;
  vlans?: Record<number, string>;
  reachable?: string[];
  /** Treat the initial configuration as already saved to NVRAM. */
  saved?: boolean;
  enableSecret?: boolean;
}

const ROUTER_IFACES = [
  { name: 'GigabitEthernet0/0', connected: true },
  { name: 'GigabitEthernet0/1', connected: true },
  { name: 'GigabitEthernet0/2', connected: false },
];

const SWITCH_IFACES = [
  ...Array.from({ length: 8 }, (_, i) => ({ name: `FastEthernet0/${i + 1}`, connected: i < 4 })),
  { name: 'GigabitEthernet0/1', connected: true },
  { name: 'GigabitEthernet0/2', connected: false },
];

const newSwitchport = (): Switchport => ({ mode: 'dynamic', accessVlan: 1, nativeVlan: 1, allowed: 'all' });
const DEFAULT_VLANS: Record<number, string> = { 1: 'default' };

export function newDevice(opts: DeviceOptions = {}): Device {
  const kind = opts.kind ?? 'router';
  const interfaces: Record<string, Iface> = {};
  for (const i of opts.interfaces ?? (kind === 'switch' ? SWITCH_IFACES : ROUTER_IFACES)) {
    interfaces[i.name] = {
      ip: null, mask: null, description: '', shutdown: kind === 'router', connected: false,
      switchport: kind === 'switch' ? newSwitchport() : null, dot1q: null, ...i,
    };
  }
  const base: Snapshot = {
    kind, hostname: opts.hostname ?? (kind === 'switch' ? 'Switch' : 'Router'), interfaces,
    vlans: { ...DEFAULT_VLANS, ...(opts.vlans ?? {}) }, domainLookup: true, banner: null, enableSecret: opts.enableSecret ?? false,
  };
  const mode = opts.mode ?? 'user';
  return {
    ...cloneSnapshot(base), mode, currentIf: null, currentRange: [], currentVlan: null,
    startup: opts.saved ? cloneSnapshot(base) : null, reachable: opts.reachable ?? [], history: [], visited: [mode],
  };
}

function cloneIface(i: Iface): Iface {
  return { ...i, switchport: i.switchport ? { ...i.switchport, allowed: i.switchport.allowed === 'all' ? 'all' : [...i.switchport.allowed] } : null };
}

function cloneSnapshot(s: Snapshot): Snapshot {
  const interfaces: Record<string, Iface> = {};
  for (const [k, v] of Object.entries(s.interfaces)) interfaces[k] = cloneIface(v);
  return { kind: s.kind, hostname: s.hostname, interfaces, vlans: { ...s.vlans }, domainLookup: s.domainLookup, banner: s.banner, enableSecret: s.enableSecret };
}

const snapshotOf = (d: Device): Snapshot => cloneSnapshot(d);

export function promptOf(d: Device): string {
  switch (d.mode) {
    case 'user': return `${d.hostname}>`;
    case 'priv': return `${d.hostname}#`;
    case 'config': return `${d.hostname}(config)#`;
    case 'config-if': return `${d.hostname}(config-if${d.currentRange.length > 1 ? '-range' : ''})#`;
    case 'config-subif': return `${d.hostname}(config-subif)#`;
    case 'config-vlan': return `${d.hostname}(config-vlan)#`;
  }
}

// ---------------------------------------------------------------------------
// VLAN lists ("10,20,30-32")
// ---------------------------------------------------------------------------

export function parseVlanList(text: string): number[] | null {
  const out = new Set<number>();
  for (const part of text.split(',')) {
    const m = /^(\d+)(?:-(\d+))?$/.exec(part.trim());
    if (!m) return null;
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    if (a < 1 || b > 4094 || a > b) return null;
    for (let v = a; v <= b; v++) out.add(v);
  }
  return [...out].sort((x, y) => x - y);
}

export function formatVlanList(nums: readonly number[]): string {
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  const parts: string[] = [];
  for (let i = 0; i < sorted.length; ) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j]! + 1) j++;
    parts.push(j > i ? `${sorted[i]}-${sorted[j]}` : String(sorted[i]));
    i = j + 1;
  }
  return parts.join(',');
}

const allowedSet = (allowed: 'all' | number[]): number[] => (allowed === 'all' ? Array.from({ length: 4094 }, (_, i) => i + 1) : allowed);
const allowedText = (allowed: 'all' | number[]): string => (allowed === 'all' ? '1-4094' : allowed.length ? formatVlanList(allowed) : 'none');

// ---------------------------------------------------------------------------
// Status and rendering
// ---------------------------------------------------------------------------

const isSub = (name: string) => name.includes('.');

/** Status/protocol for an interface. A subinterface is up only when its parent is. */
export function statusOf(s: Snapshot, i: Iface): { status: string; protocol: string } {
  if (isSub(i.name)) {
    const parent = s.interfaces[i.name.split('.')[0]!];
    if (i.shutdown) return { status: 'administratively down', protocol: 'down' };
    return parent && !parent.shutdown && parent.connected ? { status: 'up', protocol: 'up' } : { status: 'down', protocol: 'down' };
  }
  if (i.shutdown) return { status: 'administratively down', protocol: 'down' };
  return i.connected ? { status: 'up', protocol: 'up' } : { status: 'down', protocol: 'down' };
}

const shortName = (n: string) => n.replace('FastEthernet', 'Fa').replace('GigabitEthernet', 'Gi');

function renderBrief(s: Snapshot): string[] {
  const line = (name: string, ip: string | null, status: string, protocol: string) =>
    `${name.padEnd(23)}${(ip ?? 'unassigned').padEnd(16)}YES ${(ip ? 'manual' : 'unset').padEnd(7)}${status.padEnd(22)}${protocol}`;
  const lines = [`${'Interface'.padEnd(23)}${'IP-Address'.padEnd(16)}OK? Method Status                Protocol`];
  if (s.kind === 'switch') lines.push(line('Vlan1', null, 'administratively down', 'down'));
  for (const i of Object.values(s.interfaces)) {
    const st = statusOf(s, i);
    lines.push(line(i.name, i.ip, st.status, st.protocol));
  }
  return lines;
}

function wrapPorts(ports: string[], width = 31): string[] {
  const lines: string[] = [];
  let cur = '';
  for (const p of ports) {
    const next = cur ? `${cur}, ${p}` : p;
    if (next.length > width && cur) { lines.push(`${cur},`); cur = p; } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

function renderVlanBrief(s: Snapshot): string[] {
  const out = [
    `VLAN ${'Name'.padEnd(33)}${'Status'.padEnd(10)}Ports`,
    `---- ${'-'.repeat(32)} ${'-'.repeat(9)} ${'-'.repeat(31)}`,
  ];
  for (const id of Object.keys(s.vlans).map(Number).sort((a, b) => a - b)) {
    const ports = Object.values(s.interfaces).filter((i) => i.switchport && i.switchport.mode !== 'trunk' && i.switchport.accessVlan === id).map((i) => shortName(i.name));
    const wrapped = wrapPorts(ports);
    out.push(`${String(id).padEnd(5)}${s.vlans[id]!.padEnd(33)}${'active'.padEnd(10)}${wrapped[0] ?? ''}`);
    for (const extra of wrapped.slice(1)) out.push(' '.repeat(48) + extra);
  }
  out.push(`1002 ${'fddi-default'.padEnd(33)}act/unsup`, `1003 ${'token-ring-default'.padEnd(33)}act/unsup`, `1004 ${'fddinet-default'.padEnd(33)}act/unsup`, `1005 ${'trnet-default'.padEnd(33)}act/unsup`);
  return out;
}

function renderTrunks(s: Snapshot): string[] {
  const trunks = Object.values(s.interfaces).filter((i) => i.switchport?.mode === 'trunk' && statusOf(s, i).status === 'up');
  if (trunks.length === 0) return [];
  const active = Object.keys(s.vlans).map(Number);
  const section = (title: string, cell: (i: Iface) => string) => [
    '', `${'Port'.padEnd(12)}${title}`, ...trunks.map((i) => `${shortName(i.name).padEnd(12)}${cell(i)}`),
  ];
  const activeList = (i: Iface) => formatVlanList(allowedSet(i.switchport!.allowed).filter((v) => active.includes(v))) || 'none';
  return [
    `${'Port'.padEnd(12)}${'Mode'.padEnd(13)}${'Encapsulation'.padEnd(15)}${'Status'.padEnd(14)}Native vlan`,
    ...trunks.map((i) => `${shortName(i.name).padEnd(12)}${'on'.padEnd(13)}${'802.1q'.padEnd(15)}${'trunking'.padEnd(14)}${i.switchport!.nativeVlan}`),
    ...section('Vlans allowed on trunk', (i) => allowedText(i.switchport!.allowed)),
    ...section('Vlans allowed and active in management domain', activeList),
    ...section('Vlans in spanning tree forwarding state and not pruned', activeList),
  ];
}

function renderSwitchport(s: Snapshot, i: Iface): string[] {
  const sp = i.switchport!;
  const up = statusOf(s, i).status === 'up';
  const admin = sp.mode === 'trunk' ? 'trunk' : sp.mode === 'access' ? 'static access' : 'dynamic auto';
  const oper = !up ? 'down' : sp.mode === 'trunk' ? 'trunk' : 'static access';
  return [
    `Name: ${shortName(i.name)}`, 'Switchport: Enabled', `Administrative Mode: ${admin}`, `Operational Mode: ${oper}`,
    'Administrative Trunking Encapsulation: dot1q', `Operational Trunking Encapsulation: ${oper === 'trunk' ? 'dot1q' : 'native'}`,
    `Negotiation of Trunking: ${sp.mode === 'dynamic' ? 'On' : 'Off'}`,
    `Access Mode VLAN: ${sp.accessVlan} (${s.vlans[sp.accessVlan] ?? 'Inactive'})`,
    `Trunking Native Mode VLAN: ${sp.nativeVlan} (${s.vlans[sp.nativeVlan] ?? 'Inactive'})`,
    `Trunking VLANs Enabled: ${sp.allowed === 'all' ? 'ALL' : allowedText(sp.allowed)}`,
  ];
}

function classful(ip: number): { net: string; prefix: number } {
  const a = ip >>> 24;
  const prefix = a < 128 ? 8 : a < 192 ? 16 : 24;
  return { net: intToIp(networkAddress(ip, prefix)), prefix };
}

function renderRoutes(s: Snapshot): string[] {
  const routes: Array<{ code: 'C' | 'L'; ip: number; prefix: number; via: string }> = [];
  for (const i of Object.values(s.interfaces)) {
    if (!i.ip || !i.mask || statusOf(s, i).status !== 'up') continue;
    const prefix = maskToPrefix(i.mask)!;
    const ip = parseIp(i.ip)!;
    routes.push({ code: 'C', ip: networkAddress(ip, prefix), prefix, via: i.name }, { code: 'L', ip, prefix: 32, via: i.name });
  }
  const out = ['Codes: L - local, C - connected, S - static, O - OSPF', 'Gateway of last resort is not set', ''];
  if (routes.length === 0) return out.slice(0, 2);
  const groups = new Map<string, typeof routes>();
  for (const r of routes) {
    const c = classful(r.ip);
    const key = `${c.net}/${c.prefix}`;
    groups.set(key, [...(groups.get(key) ?? []), r]);
  }
  for (const [key, list] of [...groups.entries()].sort()) {
    out.push(`      ${key} is variably subnetted, ${list.length} subnets, ${new Set(list.map((r) => r.prefix)).size} masks`);
    for (const r of list.sort((a, b) => a.ip - b.ip || a.prefix - b.prefix)) out.push(`${r.code}        ${intToIp(r.ip)}/${r.prefix} is directly connected, ${r.via}`);
  }
  return out;
}

export function renderConfig(s: Snapshot, running: boolean): string[] {
  const body: string[] = ['!', `hostname ${s.hostname}`, '!'];
  if (s.enableSecret) body.push('enable secret 5 $1$SIMU$hashed', '!');
  if (!s.domainLookup) body.push('no ip domain lookup', '!');
  if (s.banner) body.push(`banner motd ^C${s.banner}^C`, '!');
  for (const i of Object.values(s.interfaces)) {
    body.push(`interface ${i.name}`);
    if (i.description) body.push(` description ${i.description}`);
    if (i.dot1q !== null) body.push(` encapsulation dot1Q ${i.dot1q}`);
    const sp = i.switchport;
    if (sp) {
      if (sp.mode === 'trunk') {
        if (sp.nativeVlan !== 1) body.push(` switchport trunk native vlan ${sp.nativeVlan}`);
        if (sp.allowed !== 'all') body.push(` switchport trunk allowed vlan ${allowedText(sp.allowed)}`);
        body.push(' switchport mode trunk');
      } else {
        if (sp.accessVlan !== 1) body.push(` switchport access vlan ${sp.accessVlan}`);
        if (sp.mode === 'access') body.push(' switchport mode access');
      }
    } else {
      body.push(i.ip && i.mask ? ` ip address ${i.ip} ${i.mask}` : ' no ip address');
    }
    if (i.shutdown) body.push(' shutdown');
    body.push('!');
  }
  body.push('end');
  const bytes = body.join('\n').length;
  return running
    ? ['Building configuration...', '', `Current configuration : ${bytes} bytes`, ...body]
    : [`Using ${bytes} out of 262144 bytes`, ...body];
}

// ---------------------------------------------------------------------------
// Helpers for commands
// ---------------------------------------------------------------------------

interface Exec {
  d: Device;
  out?: string[];
  /** Ordinal of the argument that was rejected (0 = first argument). */
  invalidArg?: number;
  /** Index of the command word that was rejected (used when a whole command is unavailable here). */
  invalidAt?: number;
}

interface Spec {
  words: string[];
  modes: Mode[];
  /** Only offered on this device kind (default: both). */
  kind?: Kind;
  desc: string;
  exec: (d: Device, args: string[]) => Exec;
}

const EXEC: Mode[] = ['user', 'priv'];
const ANYCFG: Mode[] = ['config', 'config-if', 'config-subif', 'config-vlan'];
const IFM: Mode[] = ['config-if', 'config-subif'];

const TYPE_RE = '(gigabitethernet|gigabit|gig|gi|g|fastethernet|fast|fa|f)';
const canonType = (t: string) => (t.toLowerCase().startsWith('g') ? 'GigabitEthernet' : 'FastEthernet');

function parseIfName(text: string): { name: string; sub: number | null } | null {
  const m = new RegExp(`^${TYPE_RE}(\\d+(?:/\\d+)+)(?:\\.(\\d+))?$`, 'i').exec(text.replace(/\s+/g, ''));
  if (!m) return null;
  return { name: `${canonType(m[1]!)}${m[2]}`, sub: m[3] ? Number(m[3]) : null };
}

function parseRange(text: string, d: Device): string[] | null {
  const m = new RegExp(`^${TYPE_RE}(\\d+)/(\\d+)-(?:[a-z]*\\d+/)?(\\d+)$`, 'i').exec(text.replace(/\s+/g, ''));
  if (!m) return null;
  const from = Number(m[3]);
  const to = Number(m[4]);
  if (from > to || to - from > 47) return null;
  const names = Array.from({ length: to - from + 1 }, (_, k) => `${canonType(m[1]!)}${m[2]}/${from + k}`);
  return names.every((n) => d.interfaces[n]) ? names : null;
}

const setMode = (d: Device, mode: Mode, patch: Partial<Device> = {}): Device => ({
  ...d, currentIf: null, currentRange: [], currentVlan: null, ...patch, mode, visited: d.visited.includes(mode) ? d.visited : [...d.visited, mode],
});

const targets = (d: Device): string[] => (d.currentRange.length ? d.currentRange : d.currentIf ? [d.currentIf] : []);

function withIfaces(d: Device, patch: (i: Iface) => Partial<Iface>): Device {
  const interfaces = { ...d.interfaces };
  for (const name of targets(d)) interfaces[name] = { ...interfaces[name]!, ...patch(interfaces[name]!) };
  return { ...d, interfaces };
}

function overlaps(aIp: string, aPrefix: number, bIp: string, bPrefix: number): boolean {
  const a = parseIp(aIp)!;
  const b = parseIp(bIp)!;
  const p = Math.min(aPrefix, bPrefix);
  return networkAddress(a, p) === networkAddress(b, p);
}

function pingResult(d: Device, target: string): boolean {
  const ip = parseIp(target);
  if (ip === null) return false;
  for (const i of Object.values(d.interfaces)) {
    if (!i.ip || !i.mask || statusOf(d, i).status !== 'up') continue;
    const prefix = maskToPrefix(i.mask)!;
    if (i.ip === target) return true;
    if (d.reachable.includes(target) && networkAddress(ip, prefix) === networkAddress(parseIp(i.ip)!, prefix)) return true;
  }
  return false;
}

/** True when a ping to `target` would succeed on this device right now. */
export const canPing = pingResult;

const parseVlanId = (text: string): number | null => (/^\d+$/.test(text) && Number(text) >= 1 && Number(text) <= 4094 ? Number(text) : null);
const vlanName = (id: number) => (id === 1 ? 'default' : `VLAN${String(id).padStart(4, '0')}`);

function stepOne(d: Device, line: string): StepResult {
  return run(d, line);
}

function switchportGuard(d: Device): Exec | null {
  return d.mode === 'config-if' && targets(d).every((n) => d.interfaces[n]!.switchport) ? null : { d, invalidAt: 0 };
}

const SPECS: Spec[] = [
  // ----- mode changes
  { words: ['enable'], modes: ['user'], desc: 'Turn on privileged commands', exec: (d) => ({ d: setMode(d, 'priv') }) },
  { words: ['disable'], modes: ['priv'], desc: 'Turn off privileged commands', exec: (d) => ({ d: setMode(d, 'user') }) },
  { words: ['configure', 'terminal'], modes: ['priv'], desc: 'Enter configuration mode from the terminal', exec: (d) => ({ d: setMode(d, 'config'), out: ['Enter configuration commands, one per line.  End with CNTL/Z.'] }) },
  { words: ['exit'], modes: ['priv'], desc: 'Log out (returns to user EXEC in this simulator)', exec: (d) => ({ d: setMode(d, 'user') }) },
  { words: ['exit'], modes: ['config'], desc: 'Exit from configure mode', exec: (d) => ({ d: setMode(d, 'priv') }) },
  { words: ['exit'], modes: ['config-if', 'config-subif', 'config-vlan'], desc: 'Exit from this configuration mode', exec: (d) => ({ d: setMode(d, 'config') }) },
  { words: ['end'], modes: ANYCFG, desc: 'Return to privileged EXEC mode', exec: (d) => ({ d: setMode(d, 'priv') }) },

  // ----- show
  { words: ['show', 'ip', 'interface', 'brief'], modes: EXEC, desc: 'Brief summary of IP status and configuration', exec: (d) => ({ d, out: renderBrief(d) }) },
  { words: ['show', 'ip', 'route'], modes: EXEC, kind: 'router', desc: 'IP routing table', exec: (d) => ({ d, out: renderRoutes(d) }) },
  { words: ['show', 'vlan', 'brief'], modes: EXEC, kind: 'switch', desc: 'VLAN membership summary', exec: (d) => ({ d, out: renderVlanBrief(d) }) },
  { words: ['show', 'interfaces', 'trunk'], modes: EXEC, kind: 'switch', desc: 'Interface trunk information', exec: (d) => ({ d, out: renderTrunks(d) }) },
  {
    words: ['show', 'interfaces', '<interface>', 'switchport'], modes: EXEC, kind: 'switch', desc: 'Show interface switchport information',
    exec: (d, [n]) => { const p = parseIfName(n!); return p && d.interfaces[p.name] ? { d, out: renderSwitchport(d, d.interfaces[p.name]!) } : { d, invalidArg: 0 }; },
  },
  {
    words: ['show', 'interfaces', '<type>', '<number>', 'switchport'], modes: EXEC, kind: 'switch', desc: 'Show interface switchport information',
    exec: (d, [t, n]) => { const p = parseIfName(`${t}${n}`); return p && d.interfaces[p.name] ? { d, out: renderSwitchport(d, d.interfaces[p.name]!) } : { d, invalidArg: 0 }; },
  },
  { words: ['show', 'running-config'], modes: ['priv'], desc: 'Current operating configuration', exec: (d) => ({ d, out: renderConfig(d, true) }) },
  { words: ['show', 'startup-config'], modes: ['priv'], desc: 'Contents of the startup configuration', exec: (d) => ({ d, out: d.startup ? renderConfig(d.startup, false) : ['startup-config is not present'] }) },
  { words: ['show', 'history'], modes: EXEC, desc: 'Display the session command history', exec: (d) => ({ d, out: d.history.filter((h) => !/^show\s+hist/i.test(h)).slice(-10) }) },
  { words: ['show', 'version'], modes: EXEC, desc: 'System hardware and software status', exec: (d) => ({ d, out: ['Cisco IOS Software (simulated for CCNA Mastery practice — not a real device)', `${d.hostname} uptime is 5 minutes`] }) },

  // ----- file / system
  { words: ['copy', 'running-config', 'startup-config'], modes: ['priv'], desc: 'Save the configuration to NVRAM', exec: (d) => ({ d: { ...d, startup: snapshotOf(d) }, out: ['Destination filename [startup-config]?', 'Building configuration...', '[OK]'] }) },
  { words: ['erase', 'startup-config'], modes: ['priv'], desc: 'Erase the saved configuration', exec: (d) => ({ d: { ...d, startup: null }, out: ['Erasing the nvram filesystem will remove all configuration files! Continue? [confirm]', '[OK]', 'Erase of nvram: complete'] }) },
  {
    words: ['reload'], modes: ['priv'], desc: 'Halt and perform a cold restart',
    exec: (d) => {
      const factory = newDevice({ kind: d.kind, interfaces: Object.values(d.interfaces).filter((i) => !isSub(i.name)).map((i) => ({ name: i.name, connected: i.connected })) });
      const restored = cloneSnapshot(d.startup ?? factory);
      // The VLAN database lives in vlan.dat, separate from the startup-config, so VLANs survive a reload.
      const next: Device = setMode({ ...d, ...restored, vlans: { ...d.vlans } }, 'user', { visited: ['user'] });
      const what = d.kind === 'switch' ? 'Switch' : 'Router';
      return {
        d: { ...next, visited: ['user'] },
        out: ['Proceed with reload? [confirm]', d.startup ? `${what} restarted with the SAVED configuration. Unsaved changes were lost.` : `No saved configuration: ${what.toLowerCase()} restarted with factory defaults.`]
          .concat(d.kind === 'switch' ? ['Note: VLANs are stored in vlan.dat, so they survive a reload even when the startup-config is empty.'] : []),
      };
    },
  },
  {
    words: ['ping', '<address>'], modes: EXEC, kind: 'router', desc: 'Send echo messages',
    exec: (d, [target]) => {
      if (parseIp(target!) === null) return { d, out: ['% Unrecognized host or address, or protocol not running.'] };
      const ok = pingResult(d, target!);
      return {
        d,
        out: ['Type escape sequence to abort.', `Sending 5, 100-byte ICMP Echos to ${target}, timeout is 2 seconds:`, ok ? '!!!!!' : '.....',
          ok ? 'Success rate is 100 percent (5/5), round-trip min/avg/max = 1/1/2 ms' : 'Success rate is 0 percent (0/5)'],
      };
    },
  },

  // ----- global configuration
  {
    words: ['hostname', '<name>'], modes: ['config'], desc: 'Set system’s network name',
    exec: (d, [name]) => (/^[A-Za-z][A-Za-z0-9_-]{0,62}$/.test(name!) ? { d: { ...d, hostname: name! } } : { d, out: ['% Hostname contains one or more illegal characters.'] }),
  },
  { words: ['no', 'ip', 'domain-lookup'], modes: ['config'], desc: 'Disable DNS lookup of mistyped commands', exec: (d) => ({ d: { ...d, domainLookup: false } }) },
  { words: ['ip', 'domain-lookup'], modes: ['config'], desc: 'Enable DNS lookup', exec: (d) => ({ d: { ...d, domainLookup: true } }) },
  { words: ['enable', 'secret', '<password>'], modes: ['config'], desc: 'Assign the privileged EXEC secret', exec: (d) => ({ d: { ...d, enableSecret: true } }) },
  {
    words: ['banner', 'motd', '<text*>'], modes: ['config'], desc: 'Set message of the day banner',
    exec: (d, [text]) => {
      const t = text!.trim();
      const delim = t[0];
      if (t.length < 3 || !delim || /[A-Za-z0-9\s]/.test(delim) || t[t.length - 1] !== delim) return { d, invalidArg: 0 };
      return { d: { ...d, banner: t.slice(1, -1) } };
    },
  },
  {
    words: ['vlan', '<vlan-id>'], modes: ['config', 'config-if', 'config-subif', 'config-vlan'], kind: 'switch', desc: 'Create a VLAN and enter VLAN configuration mode',
    exec: (d, [id]) => {
      const n = parseVlanId(id!);
      if (n === null) return { d, invalidArg: 0 };
      const next = d.vlans[n] ? d : { ...d, vlans: { ...d.vlans, [n]: vlanName(n) } };
      return { d: setMode(next, 'config-vlan', { currentVlan: n }) };
    },
  },
  {
    words: ['name', '<text*>'], modes: ['config-vlan'], desc: 'Ascertain the VLAN name',
    exec: (d, [text]) => (/^[A-Za-z0-9_-]{1,32}$/.test(text!.trim()) ? { d: { ...d, vlans: { ...d.vlans, [d.currentVlan!]: text!.trim() } } } : { d, invalidArg: 0 }),
  },
  {
    words: ['interface', 'range', '<range*>'], modes: ['config', 'config-if', 'config-subif', 'config-vlan'], desc: 'Configure a range of interfaces',
    exec: (d, [text]) => {
      const names = parseRange(text!, d);
      return names ? { d: setMode(d, 'config-if', { currentIf: names[0]!, currentRange: names }) } : { d, invalidArg: 0 };
    },
  },
  {
    words: ['interface', '<interface*>'], modes: ['config', 'config-if', 'config-subif', 'config-vlan'], desc: 'Select an interface to configure',
    exec: (d, [text]) => {
      const p = parseIfName(text!);
      if (!p) return { d, invalidArg: 0 };
      const base = d.interfaces[p.name];
      if (!base) return { d, invalidArg: 0 };
      if (p.sub === null) return { d: setMode(d, 'config-if', { currentIf: p.name, currentRange: [] }) };
      if (d.kind !== 'router' || p.sub < 1 || p.sub > 4294967) return { d, invalidArg: 0 };
      const subName = `${p.name}.${p.sub}`;
      const withSub = d.interfaces[subName] ? d : { ...d, interfaces: { ...d.interfaces, [subName]: { name: subName, ip: null, mask: null, description: '', shutdown: false, connected: base.connected, switchport: null, dot1q: null } } };
      return { d: setMode(withSub, 'config-subif', { currentIf: subName }) };
    },
  },
  {
    words: ['do', '<command*>'], modes: ANYCFG, desc: 'To run exec commands in config mode',
    exec: (d, [cmd]) => {
      const inner = stepOne({ ...d, mode: 'priv' }, cmd!);
      // Keep the learner in their configuration mode; keep any saved-config changes made by the command.
      return { d: { ...inner.device, mode: d.mode, currentIf: d.currentIf, currentRange: d.currentRange, currentVlan: d.currentVlan, visited: d.visited }, out: inner.output };
    },
  },

  // ----- interface configuration (router)
  {
    words: ['ip', 'address', '<address>', '<mask>'], modes: IFM, kind: 'router', desc: 'Set the IP address of an interface',
    exec: (d, [addr, mask]) => {
      const ip = parseIp(addr!);
      if (ip === null) return { d, invalidArg: 0 };
      const prefix = maskToPrefix(mask!);
      if (prefix === null || prefix === 0) return { d, invalidArg: 1 };
      const cur = d.interfaces[d.currentIf!]!;
      if (isSub(cur.name) && cur.dot1q === null) {
        return { d, out: ['% Configuring IP routing on a LAN subinterface is only allowed if that subinterface is already configured as part of an IEEE 802.10, IEEE 802.1Q, or ISL vLAN.'] };
      }
      if (prefix < 31 && (ip === networkAddress(ip, prefix) || ip === broadcastAddress(ip, prefix))) return { d, out: [`Bad mask /${prefix} for address ${addr}`] };
      for (const other of Object.values(d.interfaces)) {
        if (other.name !== d.currentIf && other.ip && other.mask && overlaps(addr!, prefix, other.ip, maskToPrefix(other.mask)!)) {
          return { d, out: [`% ${intToIp(networkAddress(ip, prefix))} overlaps with ${other.name}`] };
        }
      }
      return { d: withIfaces(d, () => ({ ip: addr!, mask: mask! })) };
    },
  },
  { words: ['no', 'ip', 'address'], modes: IFM, kind: 'router', desc: 'Remove the IP address', exec: (d) => ({ d: withIfaces(d, () => ({ ip: null, mask: null })) }) },
  {
    words: ['encapsulation', 'dot1q', '<vlan-id>'], modes: ['config-subif'], kind: 'router', desc: 'Set 802.1Q encapsulation for this subinterface',
    exec: (d, [id]) => {
      const n = parseVlanId(id!);
      return n === null ? { d, invalidArg: 0 } : { d: withIfaces(d, () => ({ dot1q: n })) };
    },
  },

  // ----- interface configuration (both)
  { words: ['description', '<text*>'], modes: IFM, desc: 'Interface specific description', exec: (d, [text]) => ({ d: withIfaces(d, () => ({ description: text!.trim() })) }) },
  {
    words: ['shutdown'], modes: IFM, desc: 'Shutdown the selected interface',
    exec: (d) => {
      const out: string[] = [];
      for (const n of targets(d)) if (!d.interfaces[n]!.shutdown) out.push(`%LINK-5-CHANGED: Interface ${n}, changed state to administratively down`);
      return { d: withIfaces(d, () => ({ shutdown: true })), out };
    },
  },
  {
    words: ['no', 'shutdown'], modes: IFM, desc: 'Enable the selected interface',
    exec: (d) => {
      const out: string[] = [];
      for (const n of targets(d)) {
        const i = d.interfaces[n]!;
        if (i.shutdown && (isSub(n) ? statusOf(d, { ...i, shutdown: false }).status === 'up' : i.connected)) {
          out.push(`%LINK-5-CHANGED: Interface ${n}, changed state to up`, `%LINEPROTO-5-UPDOWN: Line protocol on Interface ${n}, changed state to up`);
        }
      }
      return { d: withIfaces(d, () => ({ shutdown: false })), out };
    },
  },

  // ----- switchport configuration (switch)
  {
    words: ['switchport', 'mode', 'access'], modes: ['config-if'], kind: 'switch', desc: 'Set trunking mode to ACCESS unconditionally',
    exec: (d) => switchportGuard(d) ?? { d: withIfaces(d, (i) => ({ switchport: { ...i.switchport!, mode: 'access' } })) },
  },
  {
    words: ['switchport', 'mode', 'trunk'], modes: ['config-if'], kind: 'switch', desc: 'Set trunking mode to TRUNK unconditionally',
    exec: (d) => switchportGuard(d) ?? { d: withIfaces(d, (i) => ({ switchport: { ...i.switchport!, mode: 'trunk' } })) },
  },
  {
    words: ['switchport', 'mode', 'dynamic', 'auto'], modes: ['config-if'], kind: 'switch', desc: 'Set trunking mode to dynamic auto (the default)',
    exec: (d) => switchportGuard(d) ?? { d: withIfaces(d, (i) => ({ switchport: { ...i.switchport!, mode: 'dynamic' } })) },
  },
  {
    words: ['switchport', 'access', 'vlan', '<vlan-id>'], modes: ['config-if'], kind: 'switch', desc: 'Set the access VLAN when the interface is in access mode',
    exec: (d, [id]) => {
      const guard = switchportGuard(d);
      if (guard) return guard;
      const n = parseVlanId(id!);
      if (n === null) return { d, invalidArg: 0 };
      const created = !d.vlans[n];
      const next = created ? { ...d, vlans: { ...d.vlans, [n]: vlanName(n) } } : d;
      return { d: withIfaces(next, (i) => ({ switchport: { ...i.switchport!, accessVlan: n } })), out: created ? [`% Access VLAN does not exist. Creating vlan ${n}`] : [] };
    },
  },
  {
    words: ['switchport', 'trunk', 'native', 'vlan', '<vlan-id>'], modes: ['config-if'], kind: 'switch', desc: 'Set the native VLAN when the interface is in trunking mode',
    exec: (d, [id]) => {
      const guard = switchportGuard(d);
      if (guard) return guard;
      const n = parseVlanId(id!);
      return n === null ? { d, invalidArg: 0 } : { d: withIfaces(d, (i) => ({ switchport: { ...i.switchport!, nativeVlan: n } })) };
    },
  },
  {
    words: ['switchport', 'trunk', 'allowed', 'vlan', '<vlans*>'], modes: ['config-if'], kind: 'switch', desc: 'Set the VLANs allowed on the trunk (list, add, remove, all, none, except)',
    exec: (d, [text]) => {
      const guard = switchportGuard(d);
      if (guard) return guard;
      const tokens = text!.trim().split(/\s+/);
      const head = tokens[0]!.toLowerCase();
      const rest = tokens.slice(1).join('');
      const parse = (s: string) => parseVlanList(s);
      let list: number[] | null;
      let result: 'all' | number[];
      if (head === 'all' && tokens.length === 1) result = 'all';
      else if (head === 'none' && tokens.length === 1) result = [];
      else if (['add', 'remove', 'except'].includes(head) && tokens.length === 2 && (list = parse(rest)) !== null) {
        result = 'all'; // placeholder, computed per interface below
        const l = list;
        return {
          d: withIfaces(d, (i) => {
            const cur = allowedSet(i.switchport!.allowed);
            const next = head === 'add' ? [...new Set([...cur, ...l])] : head === 'remove' ? cur.filter((v) => !l.includes(v)) : allowedSet('all').filter((v) => !l.includes(v));
            return { switchport: { ...i.switchport!, allowed: next.length === 4094 ? 'all' : next.sort((a, b) => a - b) } };
          }),
        };
      } else if (tokens.length === 1 && (list = parse(head)) !== null) result = list;
      else return { d, invalidArg: 0 };
      return { d: withIfaces(d, (i) => ({ switchport: { ...i.switchport!, allowed: result } })) };
    },
  },
  {
    words: ['no', 'switchport', 'trunk', 'allowed', 'vlan'], modes: ['config-if'], kind: 'switch', desc: 'Allow all VLANs on the trunk again',
    exec: (d) => switchportGuard(d) ?? { d: withIfaces(d, (i) => ({ switchport: { ...i.switchport!, allowed: 'all' } })) },
  },
  {
    words: ['no', 'switchport', 'trunk', 'native', 'vlan'], modes: ['config-if'], kind: 'switch', desc: 'Return the native VLAN to VLAN 1',
    exec: (d) => switchportGuard(d) ?? { d: withIfaces(d, (i) => ({ switchport: { ...i.switchport!, nativeVlan: 1 } })) },
  },
];

const specsFor = (d: Pick<Device, 'mode' | 'kind'>): Spec[] => SPECS.filter((s) => s.modes.includes(d.mode) && (!s.kind || s.kind === d.kind));

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

type Matched =
  | { spec: Spec; args: string[]; argTokens: number[] }
  | { error: 'invalid'; at: number }
  | { error: 'ambiguous'; token: string; options: string[] }
  | { error: 'incomplete' };

const isArg = (w: string) => w.startsWith('<');
const isRest = (w: string) => w.endsWith('*>');

function match(d: Pick<Device, 'mode' | 'kind'>, tokens: string[]): Matched {
  let cands = specsFor(d);
  const args: string[] = [];
  const argTokens: number[] = [];
  let consumedRest = false;
  for (let i = 0; i < tokens.length && !consumedRest; i++) {
    const low = tokens[i]!.toLowerCase();
    const here = cands.filter((s) => s.words.length > i);
    const kws = [...new Set(here.map((s) => s.words[i]!).filter((w) => !isArg(w)))];
    const exact = kws.find((k) => k === low);
    const prefixed = kws.filter((k) => k.startsWith(low));
    if (!exact && prefixed.length > 1) return { error: 'ambiguous', token: tokens[i]!, options: prefixed };
    const chosen = exact ?? prefixed[0];
    if (chosen) { cands = here.filter((s) => s.words[i] === chosen); continue; }
    const argSpecs = here.filter((s) => isArg(s.words[i]!));
    if (argSpecs.length === 0) return { error: 'invalid', at: i };
    argTokens.push(i);
    if (argSpecs.some((s) => isRest(s.words[i]!))) {
      args.push(tokens.slice(i).join(' '));
      cands = argSpecs.filter((s) => isRest(s.words[i]!));
      consumedRest = true;
    } else {
      args.push(tokens[i]!);
      cands = argSpecs;
    }
  }
  const complete = consumedRest ? cands : cands.filter((s) => s.words.length === tokens.length);
  if (complete.length === 0) return { error: 'incomplete' };
  return { spec: complete[0]!, args, argTokens };
}

function tokenize(line: string): { tokens: string[]; starts: number[] } {
  const tokens: string[] = [];
  const starts: number[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) { tokens.push(m[0]); starts.push(m.index); }
  return { tokens, starts };
}

// ---------------------------------------------------------------------------
// Output filters:  | include | exclude | begin | section
// ---------------------------------------------------------------------------

function applyFilter(lines: string[], kind: string, text: string): string[] {
  const t = text.toLowerCase();
  const has = (l: string) => l.toLowerCase().includes(t);
  if (kind === 'include') return lines.filter(has);
  if (kind === 'exclude') return lines.filter((l) => !has(l));
  if (kind === 'begin') { const i = lines.findIndex(has); return i < 0 ? [] : lines.slice(i); }
  const out: string[] = [];
  let block: string[] = [];
  const flush = () => { if (block.some(has)) out.push(...block); block = []; };
  for (const l of lines) { if (!/^\s/.test(l)) flush(); block.push(l); }
  flush();
  return out;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface StepResult {
  device: Device;
  output: string[];
}

const caret = (prompt: string, start: number) => `${' '.repeat(prompt.length + 1 + start)}^`;
const INVALID = "% Invalid input detected at '^' marker.";

export function run(device: Device, rawLine: string): StepResult {
  const prompt = promptOf(device);
  const line = rawLine.trim();
  if (line === '') return { device, output: [] };
  const history = [...device.history, line].slice(-50);

  // Split off an output filter.
  let commandText = line;
  let filter: { kind: string; text: string } | null = null;
  const pipe = line.indexOf('|');
  if (pipe >= 0) {
    commandText = line.slice(0, pipe).trim();
    const f = tokenize(line.slice(pipe + 1)).tokens;
    const kinds = ['include', 'exclude', 'begin', 'section'].filter((k) => f[0] && k.startsWith(f[0].toLowerCase()));
    if (kinds.length !== 1 || f.length < 2) return { device: { ...device, history }, output: [caret(prompt, pipe + 1), INVALID] };
    filter = { kind: kinds[0]!, text: f.slice(1).join(' ') };
  }

  const { tokens, starts } = tokenize(commandText);
  const m = match(device, tokens);
  if ('error' in m) {
    const base = { ...device, history };
    if (m.error === 'incomplete') return { device: base, output: ['% Incomplete command.'] };
    if (m.error === 'ambiguous') return { device: base, output: [`% Ambiguous command:  "${m.token}"`] };
    return { device: base, output: [caret(prompt, starts[m.at]!), INVALID] };
  }

  const res = m.spec.exec(device, m.args);
  if (res.invalidAt !== undefined) return { device: { ...device, history }, output: [caret(prompt, starts[res.invalidAt] ?? 0), INVALID] };
  if (res.invalidArg !== undefined) {
    const tokenIdx = m.argTokens[res.invalidArg] ?? 0;
    return { device: { ...device, history }, output: [caret(prompt, starts[tokenIdx]!), INVALID] };
  }
  let out = res.out ?? [];
  if (filter) {
    const isShow = /^(show|do)$/.test(m.spec.words[0]!);
    if (!isShow) return { device: { ...device, history }, output: [caret(prompt, pipe + 1), INVALID] };
    out = applyFilter(out, filter.kind, filter.text);
  }
  return { device: { ...res.d, history }, output: out };
}

function narrow(d: Pick<Device, 'mode' | 'kind'>, fixed: string[]): { cands: Spec[]; unknown: boolean; rest: boolean } {
  let cands = specsFor(d);
  for (let i = 0; i < fixed.length; i++) {
    const low = fixed[i]!.toLowerCase();
    const here = cands.filter((s) => s.words.length > i);
    const kws = [...new Set(here.map((s) => s.words[i]!).filter((w) => !isArg(w)))];
    const chosen = kws.find((k) => k === low) ?? (kws.filter((k) => k.startsWith(low)).length === 1 ? kws.find((k) => k.startsWith(low)) : undefined);
    if (chosen) { cands = here.filter((s) => s.words[i] === chosen); continue; }
    const args = here.filter((s) => isArg(s.words[i]!));
    if (args.length === 0) return { cands: [], unknown: true, rest: false };
    if (args.some((s) => isRest(s.words[i]!))) return { cands: args, unknown: false, rest: true };
    cands = args;
  }
  return { cands, unknown: false, rest: false };
}

/** Help text shown when the learner types “?” (the text before the question mark is `line`). */
export function help(device: Device, line: string): string[] {
  const trailing = line === '' || /\s$/.test(line);
  const { tokens } = tokenize(line);
  const fixed = trailing ? tokens : tokens.slice(0, -1);
  const partial = trailing ? '' : tokens[tokens.length - 1]!.toLowerCase();

  const { cands, unknown, rest } = narrow(device, fixed);
  if (unknown) return ['% Unrecognized command'];
  if (rest) return ['  LINE  Rest of the command line', '  <cr>'];
  const pos = fixed.length;
  const next = cands.filter((s) => s.words.length > pos);
  const words = [...new Set(next.map((s) => s.words[pos]!))];

  if (!trailing) {
    const found = words.filter((w) => !isArg(w) && w.startsWith(partial));
    return found.length ? [found.join('  ')] : ['% Unrecognized command'];
  }
  const out: string[] = [];
  for (const w of words) {
    const spec = next.filter((s) => s.words[pos] === w).sort((a, b) => a.words.length - b.words.length)[0]!;
    out.push(isArg(w) ? `  ${'WORD'.padEnd(20)}${w.replace(/[<>*]/g, '')}` : `  ${w.padEnd(20)}${spec.desc}`);
  }
  if (cands.some((s) => s.words.length === pos)) out.push('  <cr>');
  return out;
}

/** Tab completion: returns the completed line, or null if the last word has no unique completion. */
export function complete(device: Device, line: string): string | null {
  if (/\s$/.test(line) || line.trim() === '') return null;
  const { tokens, starts } = tokenize(line);
  const idx = tokens.length - 1;
  const { cands } = narrow(device, tokens.slice(0, idx));
  const kws = [...new Set(cands.filter((s) => s.words.length > idx).map((s) => s.words[idx]!).filter((w) => !isArg(w)))];
  const low = tokens[idx]!.toLowerCase();
  const hits = kws.filter((k) => k.startsWith(low));
  if (hits.length !== 1) return null;
  return `${line.slice(0, starts[idx])}${hits[0]} `;
}
