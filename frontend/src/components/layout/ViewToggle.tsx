import { LayoutGrid, List } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLeads } from '../../context/LeadsContext';
import { pathWithFilters } from '../../utils/urlFilters';

export function ViewToggle() {
  const { filterParams } = useLeads();
  const listPath = pathWithFilters('/leads', filterParams);
  const boardPath = pathWithFilters('/board', filterParams);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium ${
      isActive
        ? 'bg-gray-900 text-white'
        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    }`;

  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      <NavLink to={listPath} className={linkClass} end>
        <List className="h-4 w-4" />
        List
      </NavLink>
      <NavLink to={boardPath} className={linkClass}>
        <LayoutGrid className="h-4 w-4" />
        Board
      </NavLink>
    </div>
  );
}
