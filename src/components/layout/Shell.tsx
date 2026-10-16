import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FLASHCARDS } from '../../data';
import { cardsDue } from '../../store/derived';
import { clearLoadWarning, dispatch, getLoadWarning, isPersistent, useAppState } from '../../store/store';
import type { ThemeSetting } from '../../store/state';

const NAV: Array<{ to: string; label: string; icon: string; end?: boolean }> = [
  { to: '/', label: 'Dashboard', icon: '00', end: true },
  { to: '/learn', label: 'Learn', icon: '01' },
  { to: '/labs', label: 'Labs', icon: '02' },
  { to: '/cli', label: 'CLI practice', icon: '03' },
  { to: '/subnetting', label: 'Subnetting', icon: '04' },
  { to: '/flashcards', label: 'Flashcards', icon: '05' },
  { to: '/quizzes', label: 'Quizzes', icon: '06' },
  { to: '/exams', label: 'Practice exams', icon: '07' },
  { to: '/commands', label: 'Commands', icon: '08' },
  { to: '/notes', label: 'Notes', icon: '09' },
  { to: '/progress', label: 'Progress', icon: '10' },
];

function applyTheme(theme: ThemeSetting) {
  const root = document.documentElement;
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
}

export default function Shell() {
  const state = useAppState();
  const [open, setOpen] = useState(false);
  const [warning, setWarning] = useState<string | null>(getLoadWarning());
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const due = useMemo(() => cardsDue(state, FLASHCARDS, Date.now()), [state]);

  useEffect(() => applyTheme(state.settings.theme), [state.settings.theme]);
  useEffect(() => setOpen(false), [location.pathname]);
  // After every navigation: name the tab after the page and move focus to the content, so screen-reader and
  // keyboard users land at the top. Pages load lazily, so we wait for the new heading to appear.
  const pending = useRef(false);
  const firstNav = useRef(true);
  const lastHeading = useRef('');
  useEffect(() => {
    if (firstNav.current) { firstNav.current = false; } else { pending.current = true; }
    const main = document.getElementById('main');
    const sync = (force = false) => {
      const h1 = document.querySelector('main h1')?.textContent?.trim() ?? '';
      if (h1) document.title = `${h1} · CCNA Mastery`;
      if (pending.current && (force || (h1 && h1 !== lastHeading.current))) {
        pending.current = false;
        main?.focus({ preventScroll: true });
      }
      if (h1) lastHeading.current = h1;
    };
    sync();
    const observer = main ? new MutationObserver(() => sync()) : null;
    if (main && observer) observer.observe(main, { childList: true, subtree: true, characterData: true });
    const fallback = window.setTimeout(() => sync(true), 500);
    return () => { observer?.disconnect(); window.clearTimeout(fallback); };
  }, [location.pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
      if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
        window.setTimeout(() => searchRef.current?.focus(), 0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const goSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
    searchRef.current?.blur();
  };

  return (
    <div className="shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="topbar">
        <button type="button" className="btn btn-sm" aria-expanded={open} aria-controls="sidebar" onClick={() => setOpen(!open)}>☰ Menu</button>
        <strong>CCNA Mastery</strong>
      </div>
      {open && <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
      <aside id="sidebar" className="sidebar" data-open={open} aria-label="Sidebar">
        <Link to="/" className="brand" aria-label="CCNA Mastery home">
          <span className="brand-mark" aria-hidden="true">
            {">_"}
          </span>
          <span className="brand-name">CCNA Mastery<span className="brand-sub">Field notebook</span></span>
        </Link>
        <form role="search" onSubmit={goSearch} className="side-search">
          <label htmlFor="global-search" className="sr-only">Search the course</label>
          <input id="global-search" ref={searchRef} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…   ( / )" autoComplete="off" />
        </form>
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              <span><span className="nav-index" aria-hidden="true">{n.icon}</span>{n.label}</span>
              {n.to === '/flashcards' && due > 0 && <span className="nav-count" aria-label={`${due} cards due`}>{due}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <label htmlFor="theme">Theme</label>
          <select id="theme" value={state.settings.theme} onChange={(e) => dispatch({ type: 'setSettings', settings: { theme: e.target.value as ThemeSetting } })} style={{ width: '100%' }}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <p style={{ marginTop: 10, marginBottom: 0 }}>Not affiliated with or endorsed by Cisco. “CCNA” and “Cisco” are trademarks of Cisco Systems.</p>
        </div>
      </aside>
      <div className="main" inert={open}>
        <main id="main" className="content" tabIndex={-1}>
          {!isPersistent() && (
            <div className="notice" role="alert">
              <span>Your browser is blocking local storage (private mode or blocked site data), so progress cannot be saved between visits. Export from the Progress page before you leave.</span>
            </div>
          )}
          {warning && (
            <div className="notice" role="alert">
              <span>{warning}</span>
              <button type="button" className="btn btn-sm" onClick={() => { clearLoadWarning(); setWarning(null); }}>Dismiss</button>
            </div>
          )}
          <Outlet />
          <p className="footer-note">Original explanations, questions and labs for study purposes. Verify current exam objectives on Cisco’s official 200-301 CCNA page before booking the exam.</p>
        </main>
      </div>
    </div>
  );
}
