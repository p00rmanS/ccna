import { describe, expect, it } from 'vitest';
import { processFrame, type MacEntry } from './switching';

const A = '00aa.aaaa.aaaa';
const B = '00bb.bbbb.bbbb';
const C = '00cc.cccc.cccc';
const BCAST = 'ffff.ffff.ffff';
const ports = [1, 2, 3, 4];

describe('processFrame', () => {
  it('learns the SOURCE and floods an unknown destination', () => {
    const r = processFrame([], { srcMac: A, dstMac: B, ingress: 1 }, ports);
    expect(r.table).toEqual([{ mac: A, port: 1 }]);
    expect(r.learned).toBe('new');
    expect(r.decision).toBe('flood');
    expect(r.outPorts).toEqual([2, 3, 4]);
  });
  it('forwards known unicast out exactly one port', () => {
    const table: MacEntry[] = [{ mac: A, port: 1 }, { mac: B, port: 2 }];
    const r = processFrame(table, { srcMac: A, dstMac: B, ingress: 1 }, ports);
    expect(r.decision).toBe('forward');
    expect(r.outPorts).toEqual([2]);
    expect(r.learned).toBe('refreshed');
  });
  it('floods broadcasts and never learns a broadcast source', () => {
    const r = processFrame([], { srcMac: A, dstMac: BCAST, ingress: 3 }, ports);
    expect(r.decision).toBe('flood');
    expect(r.outPorts).toEqual([1, 2, 4]);
    const bad = processFrame([], { srcMac: BCAST, dstMac: A, ingress: 3 }, ports);
    expect(bad.table).toEqual([]);
    expect(bad.learned).toBe('none');
  });
  it('filters a frame whose destination is on the ingress port', () => {
    const table: MacEntry[] = [{ mac: A, port: 1 }, { mac: C, port: 1 }];
    const r = processFrame(table, { srcMac: A, dstMac: C, ingress: 1 }, ports);
    expect(r.decision).toBe('filter');
    expect(r.outPorts).toEqual([]);
  });
  it('updates an entry when a host moves ports', () => {
    const r = processFrame([{ mac: A, port: 1 }], { srcMac: A, dstMac: BCAST, ingress: 4 }, ports);
    expect(r.learned).toBe('moved');
    expect(r.table).toEqual([{ mac: A, port: 4 }]);
  });
  it('does not mutate its input table', () => {
    const table: MacEntry[] = [{ mac: A, port: 1 }];
    processFrame(table, { srcMac: A, dstMac: BCAST, ingress: 4 }, ports);
    expect(table).toEqual([{ mac: A, port: 1 }]);
  });
  it('accepts any MAC spelling and normalises to Cisco format', () => {
    const r = processFrame([], { srcMac: '00:AA:AA:AA:AA:AA', dstMac: '00-BB-BB-BB-BB-BB', ingress: 2 }, ports);
    expect(r.table[0]!.mac).toBe(A);
  });
  it('the full A->B / B->A story: first frame floods, reply is forwarded', () => {
    let table: MacEntry[] = [];
    const first = processFrame(table, { srcMac: A, dstMac: B, ingress: 1 }, ports);
    table = first.table;
    const reply = processFrame(table, { srcMac: B, dstMac: A, ingress: 2 }, ports);
    expect(reply.decision).toBe('forward');
    expect(reply.outPorts).toEqual([1]);
    expect(reply.table).toHaveLength(2);
  });
  it('rejects invalid MACs', () => {
    expect(() => processFrame([], { srcMac: 'nope', dstMac: B, ingress: 1 }, ports)).toThrow();
  });
});
