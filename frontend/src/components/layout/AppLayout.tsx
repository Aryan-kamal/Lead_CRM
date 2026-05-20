import { Outlet } from 'react-router-dom';
import { FilterBar } from './FilterBar';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader />
        <FilterBar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
