import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { LogRun } from './pages/LogRun';
import { RunDetail } from './pages/RunDetail';
import { History } from './pages/History';
import { Settings } from './pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'log', element: <LogRun /> },
      { path: 'log/:id', element: <LogRun /> },
      { path: 'runs', element: <History /> },
      { path: 'runs/:id', element: <RunDetail /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
