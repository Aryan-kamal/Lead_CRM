import { Link } from 'react-router-dom';
import { KanbanBoard } from '../components/board/KanbanBoard';
import { useLeads } from '../context/LeadsContext';
import { pathWithFilters } from '../utils/urlFilters';

export function BoardPage() {
  const { loading, error, filteredLeads, filterParams } = useLeads();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-500">
        Loading board…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 my-8 rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-800">{error}</p>
      </div>
    );
  }

  if (filteredLeads.length === 0) {
    return (
      <div className="mx-4 my-8 rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-sm font-medium text-gray-900">No leads on the board</p>
        <p className="mt-1 text-sm text-gray-500">
          Adjust search or filters, or add a lead from the list view.
        </p>
        <Link
          to={pathWithFilters('/leads', filterParams)}
          className="mt-4 inline-block text-sm font-medium text-teal-600 hover:underline"
        >
          Go to list view
        </Link>
      </div>
    );
  }

  return <KanbanBoard />;
}
