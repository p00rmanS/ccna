import { describe, expect, it } from 'vitest';
import { compareBridges, computeStp, costForSpeed, effectivePriority, electRoot, isValidPriority, type Bridge, type Link } from './stp';

const br = (id: string, mac: string, priority = 32768, vlan?: number): Bridge => ({ id, mac, priority, vlan });
const role = (r: ReturnType<typeof computeStp>, bridge: string, peer: string) => r!.ports.find((p) => p.bridge === bridge && p.peer === peer)!.role;

describe('bridge ID and root election', () => {
  it('lowest priority wins even with a higher MAC', () => {
    const a = br('A', '0000.0000.0001', 32768);
    const b = br('B', '00ff.ffff.ffff', 4096);
    expect(electRoot([a, b])!.id).toBe('B');
  });
  it('the lowest MAC breaks a priority tie, in any notation', () => {
    const a = br('A', 'aa:bb:cc:00:00:02');
    const b = br('B', 'AABB.CC00.0001');
    const c = br('C', 'aa-bb-cc-00-00-03');
    expect(electRoot([a, b, c])!.id).toBe('B');
    expect(compareBridges(a, b)).toBeGreaterThan(0);
    expect(compareBridges(b, b)).toBe(0);
  });
  it('PVST+ adds the VLAN id to the priority', () => {
    expect(effectivePriority({ priority: 32768, vlan: 10 })).toBe(32778);
    expect(effectivePriority({ priority: 32768 })).toBe(32768);
    expect(electRoot([br('A', '0000.0000.0001', 32768, 10), br('B', '0000.0000.0002', 24576, 10)])!.id).toBe('B');
  });
  it('validates priorities as multiples of 4096', () => {
    expect(isValidPriority(0)).toBe(true);
    expect(isValidPriority(61440)).toBe(true);
    expect(isValidPriority(32768)).toBe(true);
    expect(isValidPriority(1000)).toBe(false);
    expect(isValidPriority(65536)).toBe(false);
    expect(isValidPriority(-4096)).toBe(false);
  });
  it('an empty topology has no root', () => {
    expect(electRoot([])).toBeNull();
    expect(computeStp([], [])).toBeNull();
  });
  it('knows the classic path costs', () => {
    expect([10, 100, 1000, 10000].map(costForSpeed)).toEqual([100, 19, 4, 2]);
    expect(costForSpeed(40)).toBeNull();
  });
});

describe('port roles in a triangle', () => {
  const bridges = [br('A', '0000.0000.000a'), br('B', '0000.0000.000b'), br('C', '0000.0000.000c')];
  const links: Link[] = [{ a: 'A', b: 'B', cost: 4 }, { a: 'A', b: 'C', cost: 4 }, { a: 'B', b: 'C', cost: 4 }];

  it('elects the lowest MAC as root and blocks exactly one port', () => {
    const r = computeStp(bridges, links)!;
    expect(r.root).toBe('A');
    expect(r.rootPathCost).toEqual({ A: 0, B: 4, C: 4 });
    expect(r.ports).toHaveLength(6);
    expect(r.ports.filter((p) => !p.forwarding)).toHaveLength(1);
  });
  it('every port on the root bridge is designated', () => {
    const r = computeStp(bridges, links);
    expect(role(r, 'A', 'B')).toBe('designated');
    expect(role(r, 'A', 'C')).toBe('designated');
  });
  it('non-root bridges get a root port toward the root', () => {
    const r = computeStp(bridges, links);
    expect(role(r, 'B', 'A')).toBe('root');
    expect(role(r, 'C', 'A')).toBe('root');
  });
  it('the segment tie between B and C goes to the lower bridge ID; C blocks', () => {
    const r = computeStp(bridges, links);
    expect(role(r, 'B', 'C')).toBe('designated');
    expect(role(r, 'C', 'B')).toBe('alternate');
  });
  it('a bigger priority number loses even if its MAC is lowest', () => {
    const r = computeStp([br('A', '0000.0000.000a', 32768), br('B', '0000.0000.000b', 32768), br('C', '0000.0000.0001', 61440)], links)!;
    expect(r.root).toBe('A');
    expect(role(r, 'C', 'A')).toBe('root');
  });
  it('lowest priority on any switch makes it the root', () => {
    const r = computeStp([br('A', '0000.0000.000a'), br('B', '0000.0000.000b'), br('C', '0000.0000.000c', 4096)], links)!;
    expect(r.root).toBe('C');
    expect(role(r, 'A', 'C')).toBe('root');
    expect(role(r, 'B', 'C')).toBe('root');
    // A and B tie on cost, so A (lower bridge ID) keeps the A–B segment designated and B blocks
    expect(role(r, 'A', 'B')).toBe('designated');
    expect(role(r, 'B', 'A')).toBe('alternate');
  });
});

describe('cost decides the root port', () => {
  it('takes the cheaper path even when it is longer', () => {
    // A (root) — B costs 100 directly (10 Mbps) but 4+4 through C
    const r = computeStp(
      [br('A', '0000.0000.000a'), br('B', '0000.0000.000b'), br('C', '0000.0000.000c')],
      [{ a: 'A', b: 'B', cost: 100 }, { a: 'A', b: 'C', cost: 4 }, { a: 'C', b: 'B', cost: 4 }],
    )!;
    expect(r.rootPathCost.B).toBe(8);
    expect(role(r, 'B', 'C')).toBe('root');
    expect(role(r, 'B', 'A')).toBe('alternate');
    expect(role(r, 'A', 'B')).toBe('designated');
  });
  it('a lower root path cost owns the designated port on a segment, regardless of MAC', () => {
    // root A; B reaches A at cost 19, C at cost 4. B–C: C offers 4, B offers 19 → C designated even though B has the lower ID
    const r = computeStp(
      [br('A', '0000.0000.000a'), br('B', '0000.0000.000b'), br('C', '0000.0000.000c')],
      [{ a: 'A', b: 'B', cost: 19 }, { a: 'A', b: 'C', cost: 4 }, { a: 'B', b: 'C', cost: 4 }],
    )!;
    expect(r.rootPathCost.B).toBe(8);
    expect(role(r, 'C', 'B')).toBe('designated');
    expect(role(r, 'B', 'C')).toBe('root');
    expect(role(r, 'B', 'A')).toBe('alternate');
  });
  it('a tie in cost goes to the neighbour with the lower bridge ID', () => {
    // D reaches root A through B or C at equal cost; B has the lower ID so D's root port faces B
    const r = computeStp(
      [br('A', '0000.0000.000a'), br('B', '0000.0000.000b'), br('C', '0000.0000.000c'), br('D', '0000.0000.000d')],
      [{ a: 'A', b: 'B', cost: 4 }, { a: 'A', b: 'C', cost: 4 }, { a: 'B', b: 'D', cost: 4 }, { a: 'C', b: 'D', cost: 4 }],
    )!;
    expect(role(r, 'D', 'B')).toBe('root');
    expect(role(r, 'D', 'C')).toBe('alternate');
    expect(role(r, 'C', 'D')).toBe('designated');
  });
});

describe('structural properties', () => {
  it('a tree has no blocked ports; a ring of n switches has exactly one blocked port', () => {
    const ids = ['A', 'B', 'C', 'D', 'E'];
    const bridges = ids.map((id, i) => br(id, `0000.0000.00${i + 1}0`));
    const chain: Link[] = ids.slice(1).map((id, i) => ({ a: ids[i]!, b: id, cost: 4 }));
    expect(computeStp(bridges, chain)!.ports.every((p) => p.forwarding)).toBe(true);
    const ring: Link[] = [...chain, { a: 'E', b: 'A', cost: 4 }];
    const r = computeStp(bridges, ring)!;
    expect(r.ports.filter((p) => !p.forwarding)).toHaveLength(1);
  });
  it('each non-root bridge has exactly one root port and no root bridge has one', () => {
    const bridges = ['A', 'B', 'C', 'D'].map((id, i) => br(id, `0000.0000.00${i + 1}0`, 32768 + (i % 2) * 4096));
    const links: Link[] = [{ a: 'A', b: 'B', cost: 19 }, { a: 'B', b: 'C', cost: 4 }, { a: 'C', b: 'D', cost: 19 }, { a: 'D', b: 'A', cost: 4 }, { a: 'A', b: 'C', cost: 2 }];
    const r = computeStp(bridges, links)!;
    for (const b of bridges) {
      const n = r.ports.filter((p) => p.bridge === b.id && p.role === 'root').length;
      expect(n, b.id).toBe(b.id === r.root ? 0 : 1);
    }
    // every link has exactly one designated end
    for (let i = 0; i < links.length; i++) expect(r.ports.filter((p) => p.link === i && p.role === 'designated')).toHaveLength(1);
  });
  it('reports bridges with no path to the root and ignores bad links', () => {
    const r = computeStp([br('A', '0000.0000.000a'), br('B', '0000.0000.000b'), br('Z', '0000.0000.00ff')], [{ a: 'A', b: 'B', cost: 4 }, { a: 'A', b: 'A', cost: 4 }, { a: 'A', b: 'nope', cost: 4 }])!;
    expect(r.unreachable).toEqual(['Z']);
    expect(r.ports).toHaveLength(2);
  });
});
