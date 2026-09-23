import { broadcastAddress, firstHost, intToIp, lastHost, networkAddress, parseCidr, usableHostCount } from './subnet';

export interface VlsmRequest {
  name: string;
  hosts: number;
}

export interface VlsmAllocation {
  name: string;
  hosts: number;
  prefix: number;
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  usable: number;
  size: number;
  /** Offset of the block from the start of the base network. */
  offset: number;
}

export type VlsmResult =
  | { ok: true; base: string; baseSize: number; allocations: VlsmAllocation[]; freeAddresses: number }
  | { ok: false; error: string };

/** Smallest prefix whose usable host count covers `hosts`. Never returns /31 or /32 (the course uses /30 for point-to-point links). */
export function prefixForHosts(hosts: number): number {
  if (!Number.isInteger(hosts) || hosts < 1) throw new RangeError('Hosts must be a whole number of at least 1');
  let hostBits = 2;
  while (2 ** hostBits - 2 < hosts) hostBits++;
  return 32 - hostBits;
}

/** Allocates the requests from the base network, largest first, so every block stays aligned and nothing overlaps. */
export function planVlsm(baseText: string, requests: readonly VlsmRequest[]): VlsmResult {
  const base = parseCidr(baseText);
  if (!base) return { ok: false, error: 'Enter the base network as address/prefix, for example 192.168.100.0/24.' };
  if (base.prefix > 29) return { ok: false, error: 'The base network is too small — use /29 or larger.' };
  if (requests.length === 0) return { ok: false, error: 'Add at least one network to plan.' };
  for (const r of requests) {
    if (!Number.isInteger(r.hosts) || r.hosts < 1) return { ok: false, error: `“${r.name || 'Unnamed'}”: hosts must be a whole number of at least 1.` };
  }
  const baseNet = networkAddress(base.ip, base.prefix);
  const baseSize = 2 ** (32 - base.prefix);
  const end = baseNet + baseSize;
  const ordered = requests.map((r, i) => ({ ...r, i })).sort((a, b) => b.hosts - a.hosts || a.i - b.i);

  let cursor = baseNet;
  const allocations: VlsmAllocation[] = [];
  for (const r of ordered) {
    const prefix = prefixForHosts(r.hosts);
    const size = 2 ** (32 - prefix);
    cursor = Math.ceil(cursor / size) * size;
    if (cursor + size > end) {
      const used = cursor - baseNet;
      return { ok: false, error: `Not enough space: “${r.name || 'Unnamed'}” needs a /${prefix} (${size} addresses) but only ${Math.max(0, baseSize - used)} remain in ${intToIp(baseNet)}/${base.prefix}.` };
    }
    allocations.push({
      name: r.name || `Network ${r.i + 1}`, hosts: r.hosts, prefix,
      network: intToIp(cursor), broadcast: intToIp(broadcastAddress(cursor, prefix)),
      firstHost: intToIp(firstHost(cursor, prefix)), lastHost: intToIp(lastHost(cursor, prefix)),
      usable: usableHostCount(prefix), size, offset: cursor - baseNet,
    });
    cursor += size;
  }
  return { ok: true, base: `${intToIp(baseNet)}/${base.prefix}`, baseSize, allocations, freeAddresses: end - cursor };
}
