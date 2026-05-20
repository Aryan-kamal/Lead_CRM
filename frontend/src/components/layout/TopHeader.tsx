import { ChevronDown, Plus, RefreshCw, Search, Settings, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLeads } from '../../context/LeadsContext';

export function TopHeader() {
  const { searchQuery, setSearchQuery, refreshLeads, loading } = useLeads();

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
          placeholder="Search leads by name or email..."
          className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-16 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
          aria-label="Search leads"
        />
        <span className="pointer-events-none absolute right-3 top-2 rounded border border-gray-200 bg-gray-50 px-1.5 text-[10px] text-gray-400">
          ⌘K
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="hidden rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 sm:inline-block"
        >
          Save view
        </button>
        <Link
          to="/leads/new"
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
        <button
          type="button"
          className="rounded-md border border-gray-300 p-2 text-gray-600 hover:bg-gray-50"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md bg-teal-400 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-500"
        >
          <Sparkles className="h-4 w-4" />
          Super
        </button>
      </div>
    </header>
  );
}
