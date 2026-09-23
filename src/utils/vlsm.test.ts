import { describe, expect, it } from 'vitest';
import { planVlsm, prefixForHosts } from './vlsm';

describe('prefixForHosts', () => {
  it('picks the smallest block that fits hosts + network + broadcast', () => {
    const table: Array<[number, number]> = [
      [1, 30], [2, 30], [3, 29], [6, 29], [7, 28], [14, 28], [15, 27], [30, 27], [31, 26], [62, 26],
      [63, 25], [100, 25], [126, 25], [127, 24], [254, 24], [255, 23], [510, 23], [511, 22], [1000, 22],
    ];
    for (const [hosts, prefix] of table) expect(prefixForHosts(hosts)).toBe(prefix);
  });
  it('rejects nonsense', () => {
    expect(() => prefixForHosts(0)).toThrow();
    expect(() => prefixForHosts(2.5)).toThrow();
  });
});

describe('planVlsm', () => {
  const spec = [
    { name: 'HQ LAN', hosts: 100 }, { name: 'Sales LAN', hosts: 50 }, { name: 'IT LAN', hosts: 20 },
    { name: 'WAN Link 1', hosts: 2 }, { name: 'WAN Link 2', hosts: 2 },
  ];
  it('solves the worked example from the PROJECT.md capstone scenario', () => {
    const r = planVlsm('192.168.100.0/24', spec);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.allocations.map((a) => `${a.name} ${a.network}/${a.prefix}`)).toEqual([
      'HQ LAN 192.168.100.0/25', 'Sales LAN 192.168.100.128/26', 'IT LAN 192.168.100.192/27',
      'WAN Link 1 192.168.100.224/30', 'WAN Link 2 192.168.100.228/30',
    ]);
    expect(r.freeAddresses).toBe(24);
    expect(r.allocations[0]).toMatchObject({ broadcast: '192.168.100.127', firstHost: '192.168.100.1', lastHost: '192.168.100.126', usable: 126 });
  });
  it('allocates largest-first regardless of input order', () => {
    const shuffled = [spec[3]!, spec[0]!, spec[4]!, spec[2]!, spec[1]!];
    const a = planVlsm('192.168.100.0/24', shuffled);
    const b = planVlsm('192.168.100.0/24', spec);
    expect(a).toEqual(b);
  });
  it('normalises a base address that is not the network address', () => {
    const r = planVlsm('192.168.100.77/24', [{ name: 'A', hosts: 10 }]);
    expect(r.ok && r.base).toBe('192.168.100.0/24');
  });
  it('reports when the plan does not fit', () => {
    const r = planVlsm('192.168.100.0/24', [{ name: 'A', hosts: 200 }, { name: 'B', hosts: 100 }]);
    expect(r.ok).toBe(false);
    expect(!r.ok && r.error).toMatch(/Not enough space/);
  });
  it('validates input', () => {
    expect(planVlsm('nope', spec).ok).toBe(false);
    expect(planVlsm('10.0.0.0/24', []).ok).toBe(false);
    expect(planVlsm('10.0.0.0/24', [{ name: 'A', hosts: 0 }]).ok).toBe(false);
    expect(planVlsm('10.0.0.0/30', [{ name: 'A', hosts: 1 }]).ok).toBe(false);
  });
  it('never overlaps, stays aligned and inside the base for random plans', () => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    let planned = 0;
    for (let i = 0; i < 500; i++) {
      const reqs = Array.from({ length: 1 + Math.floor(rnd() * 7) }, (_, k) => ({ name: `N${k}`, hosts: 1 + Math.floor(rnd() * 120) }));
      const r = planVlsm('10.10.0.0/22', reqs);
      if (!r.ok) continue;
      planned++;
      const sorted = [...r.allocations].sort((a, b) => a.offset - b.offset);
      for (let k = 0; k < sorted.length; k++) {
        const a = sorted[k]!;
        expect(a.offset % a.size).toBe(0);
        expect(a.offset + a.size).toBeLessThanOrEqual(r.baseSize);
        expect(a.usable).toBeGreaterThanOrEqual(a.hosts);
        if (k > 0) expect(sorted[k - 1]!.offset + sorted[k - 1]!.size).toBeLessThanOrEqual(a.offset);
      }
      expect(r.freeAddresses).toBe(r.baseSize - r.allocations.reduce((n, a) => n + a.size, 0));
    }
    expect(planned).toBeGreaterThan(300);
  });
});
