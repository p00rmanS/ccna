import { Suspense, lazy } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Shell from './components/layout/Shell';
import { EmptyState } from './components/common/Common';

// Route-based code splitting: each page loads on demand.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Learn = lazy(() => import('./pages/Learn'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const Labs = lazy(() => import('./pages/Labs'));
const LabPage = lazy(() => import('./pages/LabPage'));
const Subnetting = lazy(() => import('./pages/Subnetting'));
const Flashcards = lazy(() => import('./pages/Flashcards'));
const Quizzes = lazy(() => import('./pages/Quizzes'));
const Commands = lazy(() => import('./pages/Commands'));
const Notes = lazy(() => import('./pages/Notes'));
const Progress = lazy(() => import('./pages/Progress'));
const CliLab = lazy(() => import('./pages/CliLab'));
const Exams = lazy(() => import('./pages/Exams'));
const Search = lazy(() => import('./pages/Search'));

export default function App() {
  return (
    <Suspense fallback={<p role="status" className="muted" style={{ padding: 32 }}>Loading…</p>}>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Dashboard />} />
          <Route path="learn" element={<Learn />} />
          <Route path="learn/:lessonId" element={<LessonPage />} />
          <Route path="labs" element={<Labs />} />
          <Route path="labs/:labId" element={<LabPage />} />
          <Route path="subnetting" element={<Subnetting />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="commands" element={<Commands />} />
          <Route path="notes" element={<Notes />} />
          <Route path="progress" element={<Progress />} />
          <Route path="cli" element={<CliLab />} />
          <Route path="exams" element={<Exams />} />
          <Route path="search" element={<Search />} />
          <Route path="*" element={<EmptyState title="Page not found" action={<Link className="btn btn-primary" to="/">Go to the dashboard</Link>}>That address does not exist.</EmptyState>} />
        </Route>
      </Routes>
    </Suspense>
  );
}
