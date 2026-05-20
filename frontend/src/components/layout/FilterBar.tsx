import { ChevronDown, Filter, List } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { STATUSES, useLeads } from '../../context/LeadsContext';
import type { LeadStatus } from '../../types/lead';
import { STATUS_LABELS } from '../../utils/status';

export function FilterBar() {
  const { statusFilter, toggleStatusFilter, clearStatusFilter } = useLeads();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const label =
    statusFilter.length === 0
      ? 'Status'
      : statusFilter.length === 1
        ? STATUS_LABELS[statusFilter[0]]
        : `${statusFilter.length} statuses`;

  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 py-2">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-600"
        disabled
      >
        Sort by Updated at
        <ChevronDown className="h-3 w-3" />
      </button>

      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs ${
            statusFilter.length > 0
              ? 'border-teal-300 bg-teal-50 text-teal-800'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          {label}
          <ChevronDown className="h-3 w-3" />
        </button>
        {open && (
          <div className="absolute left-0 z-20 mt-1 w-48 rounded-md border border-gray-200 bg-white py-2 shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-100 px-3 pb-2">
              <span className="text-xs font-medium text-gray-700">Filter by status</span>
              {statusFilter.length > 0 && (
                <button
                  type="button"
                  onClick={clearStatusFilter}
                  className="text-xs text-teal-600 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <ul className="px-2 pt-2">
              {STATUSES.map((status) => (
                <StatusCheckbox
                  key={status}
                  status={status}
                  checked={statusFilter.includes(status)}
                  onChange={() => toggleStatusFilter(status)}
                />
              ))}
            </ul>
          </div>
        )}
      </div>

      <button type="button" className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-400" disabled>
        Source
        <ChevronDown className="h-3 w-3" />
      </button>

      {statusFilter.length > 0 && (
        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">
          {statusFilter.length} active
        </span>
      )}

      <div className="ml-auto flex gap-2">
        <button type="button" className="inline-flex items-center gap-1 text-xs text-gray-500" disabled>
          <Filter className="h-3.5 w-3.5" />
          Filter
        </button>
        <button type="button" className="inline-flex items-center gap-1 text-xs text-gray-500" disabled>
          <List className="h-3.5 w-3.5" />
          View settings
        </button>
      </div>
    </div>
  );
}

function StatusCheckbox({
  status,
  checked,
  onChange,
}: {
  status: LeadStatus;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <li>
      <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-50">
        <input type="checkbox" checked={checked} onChange={onChange} className="rounded border-gray-300" />
        {STATUS_LABELS[status]}
      </label>
    </li>
  );
}
