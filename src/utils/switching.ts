import { isGroupAddress, toCisco } from './mac';

export interface MacEntry {
  mac: string;
  port: number;
}

export type Decision = 'forward' | 'flood' | 'filter';
export type Learned = 'new' | 'moved' | 'refreshed' | 'none';

export interface FrameIn {
  srcMac: string;
  dstMac: string;
  ingress: number;
}

export interface SwitchResult {
  table: MacEntry[];
  learned: Learned;
  decision: Decision;
  outPorts: number[];
  reason: string;
}

/**
 * Models what a Layer 2 switch does with one frame in one VLAN:
 * 1. LEARN the source MAC on the ingress port.
 * 2. DECIDE using the destination MAC: forward, flood or filter.
 */
export function processFrame(table: readonly MacEntry[], frame: FrameIn, allPorts: readonly number[]): SwitchResult {
  const src = toCisco(frame.srcMac);
  const dst = toCisco(frame.dstMac);
  if (!src || !dst) throw new Error('Invalid MAC address in frame');

  let next = table.map((e) => ({ ...e }));
  let learned: Learned = 'none';
  // A group address (broadcast/multicast) is never a valid source, so it is never learned.
  if (!isGroupAddress(src)) {
    const existing = next.find((e) => e.mac === src);
    if (!existing) {
      next = [...next, { mac: src, port: frame.ingress }];
      learned = 'new';
    } else if (existing.port !== frame.ingress) {
      existing.port = frame.ingress;
      learned = 'moved';
    } else {
      learned = 'refreshed';
    }
  }

  const others = allPorts.filter((p) => p !== frame.ingress);
  if (isGroupAddress(dst)) {
    return {
      table: next, learned, decision: 'flood', outPorts: others,
      reason: `${dst} is a broadcast/multicast address, so the switch floods it out every other port in the VLAN.`,
    };
  }
  const known = next.find((e) => e.mac === dst);
  if (!known) {
    return {
      table: next, learned, decision: 'flood', outPorts: others,
      reason: `${dst} is not in the MAC address table (unknown unicast), so the switch floods the frame out every other port.`,
    };
  }
  if (known.port === frame.ingress) {
    return {
      table: next, learned, decision: 'filter', outPorts: [],
      reason: `${dst} is reachable through the same port the frame arrived on, so the switch filters (drops) it.`,
    };
  }
  return {
    table: next, learned, decision: 'forward', outPorts: [known.port],
    reason: `${dst} is in the table on port ${known.port}, so the switch forwards the frame out that port only.`,
  };
}
