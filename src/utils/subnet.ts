/**
 * IPv4 / subnetting maths. Every value a learner is asked for is computed here,
 * never hard-coded (PROJECT.md §87).
 */

/** An IPv4 address as an unsigned 32-bit integer. */
export type Ip = number;
export type Rng = () => number;

export function parseIp(text: string): Ip | null {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(text.trim());
  if (!m) return null;
  let n = 0;
  for (let i = 1; i <= 4; i++) {
    const octet = Number(m[i]);
    if (octet > 255) return null;
    n = n * 256 + octet;
  }
  return n;
}

export function intToIp(n: Ip): string {
  return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

export function prefixToInt(prefix: number): number {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) throw new RangeError(`Invalid prefix /${prefix}`);
  return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}

export function prefixToMask(prefix: number): string {
  return intToIp(prefixToInt(prefix));
}

/** Returns the prefix length for a dotted-decimal mask, or null if the mask is not contiguous. */
export function maskToPrefix(mask: string): number | null {
  const m = parseIp(mask);
  if (m === null) return null;
  const inverted = (~m) >>> 0;
  // A valid mask is 1s then 0s, so the inverted value is 2^h - 1.
  if ((inverted & (inverted + 1)) !== 0) return null;
  // The number of leading zero bits in the inverted mask equals the number of 1s in the mask.
  return Math.clz32(inverted);
}

export function parseCidr(text: string): { ip: Ip; prefix: number } | null {
  const m = /^\s*([\d.]+)\s*\/\s*(\d{1,2})\s*$/.exec(text);
  if (!m) return null;
  const ip = parseIp(m[1]!);
  const prefix = Number(m[2]);
  if (ip === null || prefix > 32) return null;
  return { ip, prefix };
}

/** Accepts "192.168.1.10/24" or "192.168.1.10 255.255.255.0". */
export function parseAddressAndMask(text: string): { ip: Ip; prefix: number } | null {
  const cidr = parseCidr(text);
  if (cidr) return cidr;
  const parts = text.trim().split(/[\s,]+/);
  if (parts.length !== 2) return null;
  const ip = parseIp(parts[0]!);
  const prefix = maskToPrefix(parts[1]!);
  if (ip === null || prefix === null) return null;
  return { ip, prefix };
}

export function networkAddress(ip: Ip, prefix: number): Ip {
  return (ip & prefixToInt(prefix)) >>> 0;
}

export function broadcastAddress(ip: Ip, prefix: number): Ip {
  return (networkAddress(ip, prefix) | (~prefixToInt(prefix) >>> 0)) >>> 0;
}

/** Total addresses in the subnet, including network and broadcast. */
export function totalAddresses(prefix: number): number {
  return 2 ** (32 - prefix);
}

/** Usable host addresses. /31 (RFC 3021 point-to-point) has 2, /32 is a single host. */
export function usableHostCount(prefix: number): number {
  if (prefix === 32) return 1;
  if (prefix === 31) return 2;
  return 2 ** (32 - prefix) - 2;
}

export function firstHost(ip: Ip, prefix: number): Ip {
  const net = networkAddress(ip, prefix);
  return prefix >= 31 ? net : net + 1;
}

export function lastHost(ip: Ip, prefix: number): Ip {
  const bc = broadcastAddress(ip, prefix);
  return prefix >= 31 ? bc : bc - 1;
}

export function sameSubnet(a: Ip, b: Ip, prefix: number): boolean {
  return networkAddress(a, prefix) === networkAddress(b, prefix);
}

export function toBinaryOctets(ip: Ip): string[] {
  return [ip >>> 24, (ip >>> 16) & 255, (ip >>> 8) & 255, ip & 255].map((o) => o.toString(2).padStart(8, '0'));
}

export interface SubnetFacts {
  ip: string;
  prefix: number;
  mask: string;
  wildcard: string;
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  totalAddresses: number;
  usableHosts: number;
  hostBits: number;
}

export function describeSubnet(ip: Ip, prefix: number): SubnetFacts {
  return {
    ip: intToIp(ip),
    prefix,
    mask: prefixToMask(prefix),
    wildcard: intToIp((~prefixToInt(prefix)) >>> 0),
    network: intToIp(networkAddress(ip, prefix)),
    broadcast: intToIp(broadcastAddress(ip, prefix)),
    firstHost: intToIp(firstHost(ip, prefix)),
    lastHost: intToIp(lastHost(ip, prefix)),
    totalAddresses: totalAddresses(prefix),
    usableHosts: usableHostCount(prefix),
    hostBits: 32 - prefix,
  };
}

/** Classifies an address for teaching purposes (special ranges first, then RFC 1918 / public). */
export function classifyIp(ip: Ip): string {
  const a = ip >>> 24;
  const b = (ip >>> 16) & 255;
  if (a === 0) return 'This-network (0.0.0.0/8) — not a normal host address';
  if (a === 127) return 'Loopback (127.0.0.0/8)';
  if (a === 169 && b === 254) return 'APIPA / link-local (169.254.0.0/16) — a host that failed to get DHCP';
  if (a === 10) return 'Private (RFC 1918: 10.0.0.0/8)';
  if (a === 172 && b >= 16 && b <= 31) return 'Private (RFC 1918: 172.16.0.0/12)';
  if (a === 192 && b === 168) return 'Private (RFC 1918: 192.168.0.0/16)';
  if (a >= 224 && a <= 239) return 'Multicast (224.0.0.0/4)';
  if (a >= 240) return 'Reserved / experimental (240.0.0.0/4)';
  return 'Public (globally routable)';
}

// ---------------------------------------------------------------------------
// Question generator
// ---------------------------------------------------------------------------

export type QuestionKind =
  | 'network'
  | 'broadcast'
  | 'first-host'
  | 'last-host'
  | 'host-count'
  | 'mask'
  | 'prefix'
  | 'same-subnet';

export type AnswerType = 'ip' | 'number' | 'prefix' | 'yesno';
export type Level = 1 | 2 | 3 | 4;

export interface SubnetQuestion {
  kind: QuestionKind;
  level: Level;
  prompt: string;
  /** Address shown in the prompt (may be empty for mask/prefix questions). */
  ip: string;
  ip2?: string;
  prefix: number;
  answerType: AnswerType;
  expected: string;
  steps: string[];
}

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(items: readonly T[], rng: Rng): T => items[Math.floor(rng() * items.length)]!;
const randInt = (min: number, max: number, rng: Rng) => min + Math.floor(rng() * (max - min + 1));

const LEVEL_PREFIXES: Record<Level, number[]> = {
  1: [8, 16, 24],
  2: [25, 26, 27, 28, 29, 30],
  3: [9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23],
  4: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
};

const LEVEL_KINDS: Record<Level, QuestionKind[]> = {
  1: ['network', 'broadcast', 'host-count', 'mask', 'prefix'],
  2: ['network', 'broadcast', 'first-host', 'last-host', 'host-count', 'mask', 'prefix', 'same-subnet'],
  3: ['network', 'broadcast', 'first-host', 'last-host', 'host-count', 'same-subnet'],
  4: ['network', 'broadcast', 'first-host', 'last-host', 'host-count', 'mask', 'prefix', 'same-subnet'],
};

export const LEVEL_LABELS: Record<Level, string> = {
  1: 'Level 1 — Classful boundaries (/8, /16, /24)',
  2: 'Level 2 — Last octet (/25–/30)',
  3: 'Level 3 — Middle octets (/9–/23)',
  4: 'Level 4 — Everything mixed',
};

function randomPrivateIp(rng: Rng, prefix = 24): Ip {
  // Short prefixes look natural in 10.0.0.0/8; mid prefixes in 172.16/12 or 192.168/16; long prefixes anywhere.
  const base = prefix <= 15 ? 0 : prefix <= 23 ? pick([1, 2], rng) : pick([0, 1, 2], rng);
  const o = () => randInt(0, 255, rng);
  if (base === 0) return ((10 << 24) | (o() << 16) | (o() << 8) | o()) >>> 0;
  if (base === 1) return ((172 << 24) | (randInt(16, 31, rng) << 16) | (o() << 8) | o()) >>> 0;
  return ((192 << 24) | (168 << 16) | (o() << 8) | o()) >>> 0;
}

function boundarySteps(ip: Ip, prefix: number): string[] {
  const mask = prefixToInt(prefix);
  const hostBits = 32 - prefix;
  const steps = [`/${prefix} = ${prefix} network bits and ${hostBits} host bits. The mask is ${intToIp(mask)}.`];
  if (prefix % 8 === 0) {
    steps.push(
      `The mask ends exactly on an octet boundary, so the first ${prefix / 8} octet(s) are the network and every remaining octet is host bits.`,
    );
    return steps;
  }
  const k = Math.ceil(prefix / 8);
  const shift = 8 * (4 - k);
  const maskOctet = (mask >>> shift) & 255;
  const block = 256 - maskOctet;
  const ipOctet = (ip >>> shift) & 255;
  const start = Math.floor(ipOctet / block) * block;
  steps.push(`The boundary falls inside octet ${k}, where the mask value is ${maskOctet}. Block size = 256 − ${maskOctet} = ${block}.`);
  steps.push(`Subnets in octet ${k} start at multiples of ${block}. ${ipOctet} sits in the block ${start}–${start + block - 1}.`);
  return steps;
}

export function generateQuestion(level: Level, rng: Rng, kinds?: QuestionKind[]): SubnetQuestion {
  const kind = pick(kinds && kinds.length ? kinds : LEVEL_KINDS[level], rng);
  const prefix = pick(LEVEL_PREFIXES[level], rng);
  const ip = randomPrivateIp(rng, prefix);
  const facts = describeSubnet(ip, prefix);
  const cidr = `${facts.ip}/${prefix}`;

  switch (kind) {
    case 'network':
      return {
        kind, level, ip: facts.ip, prefix, answerType: 'ip', expected: facts.network,
        prompt: `What is the network address of ${cidr}?`,
        steps: [...boundarySteps(ip, prefix), `Keep the network bits and set every host bit to 0 → ${facts.network}.`],
      };
    case 'broadcast':
      return {
        kind, level, ip: facts.ip, prefix, answerType: 'ip', expected: facts.broadcast,
        prompt: `What is the broadcast address of ${cidr}?`,
        steps: [...boundarySteps(ip, prefix), `Network is ${facts.network}. Set every host bit to 1 → ${facts.broadcast}.`],
      };
    case 'first-host':
      return {
        kind, level, ip: facts.ip, prefix, answerType: 'ip', expected: facts.firstHost,
        prompt: `What is the first usable host address in the subnet containing ${cidr}?`,
        steps: [...boundarySteps(ip, prefix), `Network is ${facts.network}. The first usable host is network + 1 → ${facts.firstHost}.`],
      };
    case 'last-host':
      return {
        kind, level, ip: facts.ip, prefix, answerType: 'ip', expected: facts.lastHost,
        prompt: `What is the last usable host address in the subnet containing ${cidr}?`,
        steps: [...boundarySteps(ip, prefix), `Broadcast is ${facts.broadcast}. The last usable host is broadcast − 1 → ${facts.lastHost}.`],
      };
    case 'host-count':
      return {
        kind, level, ip: facts.ip, prefix, answerType: 'number', expected: String(facts.usableHosts),
        prompt: `How many usable host addresses are in a /${prefix} subnet?`,
        steps: [
          `/${prefix} leaves ${facts.hostBits} host bits.`,
          `Total addresses = 2^${facts.hostBits} = ${facts.totalAddresses}. Subtract the network and broadcast addresses: ${facts.totalAddresses} − 2 = ${facts.usableHosts}.`,
        ],
      };
    case 'mask':
      return {
        kind, level, ip: '', prefix, answerType: 'ip', expected: facts.mask,
        prompt: `What is the dotted-decimal subnet mask for /${prefix}?`,
        steps: [
          `Write ${prefix} ones followed by ${32 - prefix} zeros, then split into four octets.`,
          ...boundarySteps(ip, prefix).slice(0, 1),
        ],
      };
    case 'prefix':
      return {
        kind, level, ip: '', prefix, answerType: 'prefix', expected: String(prefix),
        prompt: `What prefix length matches the subnet mask ${facts.mask}?`,
        steps: [`Count the 1 bits in ${facts.mask} (in binary: ${toBinaryOctets(prefixToInt(prefix)).join('.')}) → /${prefix}.`],
      };
    case 'same-subnet': {
      const wantSame = rng() < 0.5;
      const net = networkAddress(ip, prefix);
      const size = totalAddresses(prefix);
      let other: Ip;
      if (wantSame) {
        other = net + randInt(0, size - 1, rng);
      } else {
        const neighbour = rng() < 0.5 && net + size < 2 ** 32 ? net + size : net - size;
        const safeNeighbour = neighbour >= 0 ? neighbour : net + size;
        other = safeNeighbour + randInt(0, size - 1, rng);
      }
      other = other >>> 0;
      const same = sameSubnet(ip, other, prefix);
      const otherFacts = describeSubnet(other, prefix);
      return {
        kind, level, ip: facts.ip, ip2: otherFacts.ip, prefix, answerType: 'yesno', expected: same ? 'yes' : 'no',
        prompt: `Are ${facts.ip} and ${otherFacts.ip} in the same subnet when the mask is /${prefix}?`,
        steps: [
          ...boundarySteps(ip, prefix),
          `${facts.ip} is in the network ${facts.network}; ${otherFacts.ip} is in the network ${otherFacts.network}.`,
          same ? 'The network addresses match, so the answer is yes.' : 'The network addresses differ, so the answer is no.',
        ],
      };
    }
  }
}

/** Checks a learner's raw text against the expected answer for a generated question. */
export function checkAnswer(q: SubnetQuestion, input: string): boolean {
  const text = input.trim().toLowerCase();
  switch (q.answerType) {
    case 'ip': {
      const got = parseIp(text);
      const want = parseIp(q.expected);
      return got !== null && want !== null && got === want;
    }
    case 'number':
      return text.replace(/[,\s]/g, '') === q.expected;
    case 'prefix':
      return text.replace(/^\//, '') === q.expected;
    case 'yesno':
      return (text === 'y' ? 'yes' : text === 'n' ? 'no' : text) === q.expected;
  }
}

/** Buckets prefix lengths so the weakness display stays readable. */
export function prefixBucket(prefix: number): string {
  if (prefix <= 15) return '/8–/15';
  if (prefix <= 23) return '/16–/23';
  if (prefix === 24) return '/24';
  return '/25–/30';
}
