import { useSyncExternalStore } from 'react';
import { defaultState, reduce, sanitizeState, type Action, type AppState } from './state';

const KEY = 'ccna-mastery/v1';
const CORRUPT_KEY = 'ccna-mastery/v1.corrupt-backup';

let persistent = true;
let loadWarning: string | null = null;

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    try {
      return sanitizeState(JSON.parse(raw));
    } catch {
      // Unparseable data: keep a copy so nothing is silently destroyed, then start fresh.
      try {
        localStorage.setItem(CORRUPT_KEY, raw);
      } catch {
        /* ignore */
      }
      loadWarning = 'Your saved progress could not be read, so the app started fresh. A backup of the unreadable data was kept in this browser.';
      return defaultState();
    }
  } catch {
    persistent = false;
    return defaultState();
  }
}

let state: AppState = load();
const listeners = new Set<() => void>();

function persist(next: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    persistent = true;
  } catch {
    persistent = false;
  }
}

export function dispatch(action: Action): void {
  const next = reduce(state, action, Date.now());
  if (next === state) return;
  state = next;
  persist(state);
  listeners.forEach((l) => l());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSnapshot = () => state;

/** The whole app state; components derive what they need with useMemo. */
export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export const getState = (): AppState => state;
export const isPersistent = (): boolean => persistent;
export const getLoadWarning = (): string | null => loadWarning;
export const clearLoadWarning = (): void => {
  loadWarning = null;
  listeners.forEach((l) => l());
};

// Keep several open tabs in sync.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY || e.newValue === null) return;
    try {
      state = sanitizeState(JSON.parse(e.newValue));
      listeners.forEach((l) => l());
    } catch {
      /* ignore a bad write from another tab */
    }
  });
}

export function exportJson(): string {
  return JSON.stringify(state, null, 2);
}
