import { ChevronDown, Download, Plus, RefreshCw, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLeads } from '../../context/LeadsContext';
import { downloadCsv } from '../../utils/csv';
import { pathWithFilters } from '../../utils/urlFilters';
import { ViewToggle } from './ViewToggle';

export function TopHeader() {
  const {
    searchQuery,
    setSearchQuery,
    refreshLeads,
    loading,
    filteredLeads,
    filterParams,
  } = useLeads();
  const addLeadPath = pathWithFilters('/leads/new', filterParams);

  function handleSaveCsv() {
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(filteredLeads, `superleap-leads-${date}.csv`);
  }

  return (
    <header className="flex shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <span className="font-medium text-gray-900">Leads</span>
        <span className="text-gray-300">/</span>
        <button type="button" className="flex items-center gap-0.5 hover:text-gray-900">
          All Leads
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="relative mx-auto w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
          aria-label="Search leads"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ViewToggle />
        <button
          type="button"
          onClick={handleSaveCsv}
          disabled={loading || filteredLeads.length === 0}
          className="hidden items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex"
        >
          <Download className="h-4 w-4" />
          Save
        </button>
        <Link
          to={addLeadPath}
          className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Add Lead
        </Link>
        <button
          type="button"
          onClick={() => refreshLeads()}
          disabled={loading}
          className="rounded-md border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          aria-label="Refresh leads"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  );
}
