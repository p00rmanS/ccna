/** Builds the per-question wrong-note list: `m` maps a question index to its notes; other questions get none. */
export const wrongNotes = (count: number, m: Record<number, Record<number, string>>): Array<Record<number, string>> =>
  Array.from({ length: count }, (_, i) => m[i] ?? {});
