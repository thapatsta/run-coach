import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50">
      <BottomNav />
      {/* Content area: add bottom padding for mobile nav, left margin for desktop sidebar */}
      <main className="pb-24 sm:pb-0 sm:ml-56">
        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
