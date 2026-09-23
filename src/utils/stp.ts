/**
 * Spanning Tree Protocol model (classic 802.1D rules, which Rapid STP keeps for role selection).
 * Pure functions: root-bridge election and port-role selection for a connected switch topology.
 */

export interface Bridge {
  id: string;
  /** Configured priority, a multiple of 4096 (default 32768). */
  priority: number;
  /** VLAN the STP instance runs for; PVST+ adds it to the priority (extended system ID). */
  vlan?: number;
  /** Bridge MAC address, 12 hex digits in any common notation. */
  mac: string;
}

export interface Link {
  a: string;
  b: string;
  cost: number;
}

export type PortRole = 'root' | 'designated' | 'alternate';

export interface PortResult {
  bridge: string;
  peer: string;
  /** Index into the `links` array (needed when two switches share parallel links). */
  link: number;
  role: PortRole;
  /** Alternate ports block (STP) or discard (RSTP); root and designated ports forward. */
  forwarding: boolean;
  cost: number;
}

export interface StpResult {
  root: string;
  /** Root path cost per bridge (0 for the root). */
  rootPathCost: Record<string, number>;
  ports: PortResult[];
  /** Bridges with no path to the root (never happens in a connected topology). */
  unreachable: string[];
}

export const DEFAULT_PRIORITY = 32768;
export const PRIORITY_STEP = 4096;

/** Classic (“short”) STP path costs by link speed in Mbps. */
export const STP_COSTS: ReadonlyArray<{ speed: string; mbps: number; cost: number }> = [
  { speed: '10 Mbps', mbps: 10, cost: 100 },
  { speed: '100 Mbps (FastEthernet)', mbps: 100, cost: 19 },
  { speed: '1 Gbps (GigabitEthernet)', mbps: 1000, cost: 4 },
  { speed: '10 Gbps', mbps: 10000, cost: 2 },
];

export const costForSpeed = (mbps: number): number | null => STP_COSTS.find((c) => c.mbps === mbps)?.cost ?? null;

export const isValidPriority = (p: number): boolean => Number.isInteger(p) && p >= 0 && p <= 61440 && p % PRIORITY_STEP === 0;

/** Priority as it appears on the wire: configured priority plus the VLAN ID (extended system ID). */
export const effectivePriority = (b: Pick<Bridge, 'priority' | 'vlan'>): number => b.priority + (b.vlan ?? 0);

const macValue = (mac: string): bigint => BigInt(`0x${mac.replace(/[^0-9a-f]/gi, '') || '0'}`);

/** Negative when `a` is the better (lower) bridge ID. Priority is compared first, then MAC. */
export function compareBridges(a: Bridge, b: Bridge): number {
  const p = effectivePriority(a) - effectivePriority(b);
  if (p !== 0) return p;
  const ma = macValue(a.mac);
  const mb = macValue(b.mac);
  return ma < mb ? -1 : ma > mb ? 1 : 0;
}

/** The bridge every switch agrees is the root: the lowest bridge ID. */
export function electRoot(bridges: readonly Bridge[]): Bridge | null {
  return bridges.reduce<Bridge | null>((best, b) => (best === null || compareBridges(b, best) < 0 ? b : best), null);
}

export function computeStp(bridges: readonly Bridge[], links: readonly Link[]): StpResult | null {
  const root = electRoot(bridges);
  if (!root) return null;
  const byId = new Map(bridges.map((b) => [b.id, b]));
  const valid = links.map((l, i) => ({ ...l, i })).filter((l) => l.a !== l.b && byId.has(l.a) && byId.has(l.b));

  // Root path cost: cheapest sum of link costs to the root (Bellman-Ford; topologies are tiny).
  const rpc: Record<string, number> = Object.fromEntries(bridges.map((b) => [b.id, Infinity]));
  rpc[root.id] = 0;
  for (let round = 0; round < bridges.length; round++) {
    for (const l of valid) {
      if (rpc[l.a]! + l.cost < rpc[l.b]!) rpc[l.b] = rpc[l.a]! + l.cost;
      if (rpc[l.b]! + l.cost < rpc[l.a]!) rpc[l.a] = rpc[l.b]! + l.cost;
    }
  }

  // Root port: the port with the lowest path to the root. Ties go to the lower neighbour bridge ID, then the lower link.
  const rootPort = new Map<string, number>(); // bridge id -> link index
  for (const b of bridges) {
    if (b.id === root.id || !Number.isFinite(rpc[b.id]!)) continue;
    const options = valid
      .filter((l) => l.a === b.id || l.b === b.id)
      .map((l) => ({ link: l.i, peer: byId.get(l.a === b.id ? l.b : l.a)!, total: rpc[l.a === b.id ? l.b : l.a]! + l.cost }))
      .filter((o) => Number.isFinite(o.total));
    options.sort((x, y) => x.total - y.total || compareBridges(x.peer, y.peer) || x.link - y.link);
    if (options[0]) rootPort.set(b.id, options[0].link);
  }

  const ports: PortResult[] = [];
  for (const l of valid) {
    const A = byId.get(l.a)!;
    const B = byId.get(l.b)!;
    if (!Number.isFinite(rpc[A.id]!) || !Number.isFinite(rpc[B.id]!)) continue;
    // On each segment the switch with the lowest root path cost (then lowest bridge ID) owns the designated port.
    const aWins = rpc[A.id]! < rpc[B.id]! || (rpc[A.id]! === rpc[B.id]! && compareBridges(A, B) < 0);
    const roleFor = (self: Bridge, isDesignated: boolean): PortRole =>
      isDesignated ? 'designated' : rootPort.get(self.id) === l.i ? 'root' : 'alternate';
    for (const [self, peer, designated] of [[A, B, aWins], [B, A, !aWins]] as const) {
      const role = roleFor(self, designated);
      ports.push({ bridge: self.id, peer: peer.id, link: l.i, role, forwarding: role !== 'alternate', cost: l.cost });
    }
  }
  return {
    root: root.id,
    rootPathCost: Object.fromEntries(Object.entries(rpc).map(([k, v]) => [k, Number.isFinite(v) ? v : -1])),
    ports,
    unreachable: bridges.filter((b) => !Number.isFinite(rpc[b.id]!)).map((b) => b.id),
  };
}

export const ROLE_LABEL: Record<PortRole, string> = { root: 'Root port', designated: 'Designated port', alternate: 'Alternate (blocked)' };
