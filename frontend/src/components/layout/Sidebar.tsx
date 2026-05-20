import {
  Building2,
  ChevronDown,
  Home,
  LayoutGrid,
  Search,
  Users,
} from 'lucide-react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { pathWithFilters } from '../../utils/urlFilters';

const workspaceItems = [
  'Opportunities',
  'Contacts',
  'Deal Support',
  'Tasks',
];

export function Sidebar() {
  const [searchParams] = useSearchParams();
  const leadsPath = pathWithFilters('/leads', searchParams);
  const boardPath = pathWithFilters('/board', searchParams);

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-3 py-3">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
        >
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            Superleap
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="search"
            placeholder="Quick Search..."
            className="w-full rounded-md border border-gray-200 py-1.5 pl-8 pr-2 text-xs text-gray-700 placeholder:text-gray-400"
            disabled
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 text-sm">
        <NavLink
          to={leadsPath}
          className={({ isActive }) =>
            `mb-0.5 flex items-center gap-2 rounded-md px-2 py-1.5 ${
              isActive ? 'bg-teal-50 text-teal-800' : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <Home className="h-4 w-4" />
          Home
        </NavLink>
        <button
          type="button"
          className="mb-3 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-gray-600 hover:bg-gray-50"
        >
          <span className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Reports
          </span>
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        <p className="mb-1 px-2 text-[10px] font-semibold tracking-wide text-gray-400">
          WORKSPACE
        </p>
        <NavLink
          to={leadsPath}
          end
          className={({ isActive }) =>
            `mb-0.5 flex items-center gap-2 rounded-md px-2 py-1.5 font-medium ${
              isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <Users className="h-4 w-4" />
          Leads
        </NavLink>
        <NavLink
          to={boardPath}
          className={({ isActive }) =>
            `mb-0.5 flex items-center gap-2 rounded-md px-2 py-1.5 font-medium ${
              isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <LayoutGrid className="h-4 w-4" />
          Board
        </NavLink>
        {workspaceItems.map((item) => (
          <button
            key={item}
            type="button"
            disabled
            className="mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-gray-400"
          >
            <span className="h-4 w-4" />
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
