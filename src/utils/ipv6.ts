import { parseMac } from './mac';

/** An IPv6 address as eight 16-bit groups. */
export type Groups = number[];

/** Parses standard IPv6 text (with optional "::"). Returns null when invalid. Embedded IPv4 and zone IDs are not supported. */
export function parseIpv6(text: string): Groups | null {
  const t = text.trim();
  if (t === '' || /[^0-9a-fA-F:]/.test(t)) return null;
  const halves = t.split('::');
  if (halves.length > 2) return null;
  const toGroups = (s: string): Groups | null => {
    if (s === '') return [];
    const out: Groups = [];
    for (const part of s.split(':')) {
      if (!/^[0-9a-fA-F]{1,4}$/.test(part)) return null;
      out.push(parseInt(part, 16));
    }
    return out;
  };
  if (halves.length === 1) {
    const g = toGroups(t);
    return g && g.length === 8 ? g : null;
  }
  const head = toGroups(halves[0]!);
  const tail = toGroups(halves[1]!);
  if (!head || !tail) return null;
  const missing = 8 - head.length - tail.length;
  if (missing < 1) return null;
  return [...head, ...new Array<number>(missing).fill(0), ...tail];
}

/** Full form: eight groups of four hex digits. */
export const expandIpv6 = (g: Groups): string => g.map((x) => x.toString(16).padStart(4, '0')).join(':');

/** Shortest standard form (RFC 5952): no leading zeros, the longest run of zero groups (2+, first on a tie) becomes "::". */
export function compressIpv6(g: Groups): string {
  let bestStart = -1;
  let bestLen = 0;
  for (let i = 0; i < 8; ) {
    if (g[i] !== 0) { i++; continue; }
    let j = i;
    while (j < 8 && g[j] === 0) j++;
    if (j - i > bestLen) { bestStart = i; bestLen = j - i; }
    i = j;
  }
  const hex = g.map((x) => x.toString(16));
  if (bestLen < 2) return hex.join(':');
  return `${hex.slice(0, bestStart).join(':')}::${hex.slice(bestStart + bestLen).join(':')}`;
}

export type Ipv6Type = 'unspecified' | 'loopback' | 'multicast' | 'link-local' | 'unique-local' | 'global-unicast' | 'other';

export interface Ipv6Class {
  type: Ipv6Type;
  label: string;
  prefix: string;
  detail: string;
}

const KNOWN_MULTICAST: Array<[Groups, string]> = [
  [[0xff02, 0, 0, 0, 0, 0, 0, 1], 'All nodes on the link'],
  [[0xff02, 0, 0, 0, 0, 0, 0, 2], 'All routers on the link'],
  [[0xff02, 0, 0, 0, 0, 0, 0, 5], 'All OSPFv3 routers'],
  [[0xff02, 0, 0, 0, 0, 0, 0, 6], 'OSPFv3 designated routers'],
  [[0xff02, 0, 0, 0, 0, 0, 0, 0xa], 'All EIGRP routers'],
];
const SCOPES: Record<number, string> = { 1: 'interface-local', 2: 'link-local', 4: 'admin-local', 5: 'site-local', 8: 'organisation-local', 0xe: 'global' };

export function classifyIpv6(g: Groups): Ipv6Class {
  const first = g[0]!;
  if (g.every((x) => x === 0)) return { type: 'unspecified', label: 'Unspecified address', prefix: '::/128', detail: 'A host that does not have an address yet uses :: as its source.' };
  if (g.slice(0, 7).every((x) => x === 0) && g[7] === 1) return { type: 'loopback', label: 'Loopback', prefix: '::1/128', detail: 'Means “this device”, like 127.0.0.1 in IPv4.' };
  if (first >> 8 === 0xff) {
    const scope = SCOPES[first & 0xf] ?? 'other scope';
    const known = KNOWN_MULTICAST.find(([k]) => k.every((x, i) => x === g[i]));
    const solicited = first === 0xff02 && g.slice(1, 5).every((x) => x === 0) && g[5] === 1 && g[6]! >> 8 === 0xff;
    return { type: 'multicast', label: 'Multicast', prefix: 'FF00::/8', detail: `Scope: ${scope}.${known ? ` ${known[1]}.` : solicited ? ' Solicited-node multicast (used by neighbour discovery instead of ARP).' : ''} IPv6 has no broadcast; multicast does that job.` };
  }
  if ((first & 0xffc0) === 0xfe80) return { type: 'link-local', label: 'Link-local unicast', prefix: 'FE80::/10', detail: 'Only valid on the local link. Never routed. Every IPv6 interface has one.' };
  if ((first & 0xfe00) === 0xfc00) return { type: 'unique-local', label: 'Unique local unicast', prefix: 'FC00::/7', detail: 'Private addressing inside an organisation, like RFC 1918 in IPv4 (in practice FD00::/8 is used).' };
  if ((first & 0xe000) === 0x2000) {
    const doc = first === 0x2001 && g[1] === 0x0db8;
    return { type: 'global-unicast', label: 'Global unicast', prefix: '2000::/3', detail: `Publicly routable, like a public IPv4 address.${doc ? ' 2001:db8::/32 is reserved for documentation and lab examples.' : ''}` };
  }
  return { type: 'other', label: 'Reserved or unassigned', prefix: '—', detail: 'Not in a range normally seen on the CCNA.' };
}

export interface Eui64 {
  /** Four 16-bit groups of the interface identifier. */
  groups: Groups;
  short: string;
  linkLocal: string;
}

/** Modified EUI-64: split the MAC, insert FFFE in the middle and flip the universal/local bit. */
export function macToEui64(mac: string): Eui64 | null {
  const info = parseMac(mac);
  if (!info) return null;
  const b = info.bytes;
  const id = [b[0]! ^ 0x02, b[1]!, b[2]!, 0xff, 0xfe, b[3]!, b[4]!, b[5]!];
  const groups = [(id[0]! << 8) | id[1]!, (id[2]! << 8) | id[3]!, (id[4]! << 8) | id[5]!, (id[6]! << 8) | id[7]!];
  return {
    groups,
    short: groups.map((x) => x.toString(16)).join(':'),
    linkLocal: compressIpv6([0xfe80, 0, 0, 0, ...groups]),
  };
}
