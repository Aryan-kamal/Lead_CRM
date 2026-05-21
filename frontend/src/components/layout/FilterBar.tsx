import { ArrowDown, ArrowUp, ChevronDown, Filter } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { SOURCE_FILTER_OPTIONS } from '../../constants/sources';
import { STATUSES, useLeads, type SortField } from '../../context/LeadsContext';
import { STATUS_LABELS } from '../../utils/status';

const SORT_FIELDS: { field: SortField; label: string }[] = [
  { field: 'updated_at', label: 'Updated' },
  { field: 'created_at', label: 'Created' },
  { field: 'name', label: 'Name' },
];

export function FilterBar() {
  const {
    statusFilter,
    sourceFilter,
    sortField,
    sortDir,
    toggleStatusFilter,
    clearStatusFilter,
    toggleSourceFilter,
    clearSourceFilter,
    setSortField,
    toggleSortDir,
    clearAllFilters,
    activeFilterCount,
  } = useLeads();

  const [sortOpen, setSortOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const t = e.target as Node;
      if (sortRef.current && !sortRef.current.contains(t)) setSortOpen(false);
      if (statusRef.current && !statusRef.current.contains(t)) setStatusOpen(false);
      if (sourceRef.current && !sourceRef.current.contains(t)) setSourceOpen(false);
      if (filterRef.current && !filterRef.current.contains(t)) setFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const sortLabel =
    SORT_FIELDS.find((o) => o.field === sortField)?.label ?? 'Sort by';

  const statusLabel =
    statusFilter.length === 0
      ? 'Status'
      : statusFilter.length === 1
        ? STATUS_LABELS[statusFilter[0]]
        : `${statusFilter.length} statuses`;

  const sourceLabel =
    sourceFilter.length === 0
      ? 'Source'
      : sourceFilter.length === 1
        ? sourceFilter[0]
        : `${sourceFilter.length} sources`;

  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 py-2">
      <div className="flex items-center gap-1.5" ref={sortRef}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50"
            aria-expanded={sortOpen}
          >
            {sortLabel}
            <ChevronDown className="h-3 w-3" />
          </button>
          {sortOpen && (
            <DropdownPanel title="Sort by">
              <ul className="py-1">
                {SORT_FIELDS.map((opt) => (
                  <li key={opt.field}>
                    <button
                      type="button"
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                        opt.field === sortField
                          ? 'bg-teal-50 font-medium text-teal-800'
                          : 'text-gray-700'
                      }`}
                      onClick={() => {
                        setSortField(opt.field);
                        setSortOpen(false);
                      }}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </DropdownPanel>
          )}
        </div>
        <button
          type="button"
          onClick={toggleSortDir}
          className="inline-flex items-center justify-center rounded-md border border-gray-200 p-1 text-gray-700 hover:bg-gray-50"
          aria-label={sortDir === 'asc' ? 'Sort ascending' : 'Sort descending'}
          title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
        >
          {sortDir === 'asc' ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      <div className="relative ml-3" ref={filterRef}>
        <button
          type="button"
          onClick={() => setFilterOpen((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs ${
            activeFilterCount > 0
              ? 'border-teal-300 bg-teal-50 text-teal-800'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
          aria-label="Filter summary"
          aria-expanded={filterOpen}
        >
          <Filter className="h-3.5 w-3.5" />
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-teal-600 px-1.5 text-[10px] font-medium text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        {filterOpen && (
          <DropdownPanel
            title="Active filters"
            onClear={
              activeFilterCount > 0
                ? () => {
                    clearAllFilters();
                    setFilterOpen(false);
                  }
                : undefined
            }
          >
            <div className="px-3 py-2 text-sm text-gray-600">
              {activeFilterCount === 0 ? (
                <p>No filters applied. Use Status or Source to narrow results.</p>
              ) : (
                <ul className="list-inside list-disc space-y-1">
                  {statusFilter.length > 0 && (
                    <li>Status: {statusFilter.map((s) => STATUS_LABELS[s]).join(', ')}</li>
                  )}
                  {sourceFilter.length > 0 && (
                    <li>Source: {sourceFilter.join(', ')}</li>
                  )}
                </ul>
              )}
            </div>
          </DropdownPanel>
        )}
      </div>

      <div className="relative" ref={statusRef}>
        <FilterButton
          label={statusLabel}
          active={statusFilter.length > 0}
          onClick={() => setStatusOpen((v) => !v)}
          expanded={statusOpen}
        />
        {statusOpen && (
          <DropdownPanel
            title="Status"
            onClear={statusFilter.length > 0 ? clearStatusFilter : undefined}
          >
            <ul className="px-2 py-1">
              {STATUSES.map((status) => (
                <CheckboxRow
                  key={status}
                  label={STATUS_LABELS[status]}
                  checked={statusFilter.includes(status)}
                  onChange={() => toggleStatusFilter(status)}
                />
              ))}
            </ul>
          </DropdownPanel>
        )}
      </div>

      <div className="relative" ref={sourceRef}>
        <FilterButton
          label={sourceLabel}
          active={sourceFilter.length > 0}
          onClick={() => setSourceOpen((v) => !v)}
          expanded={sourceOpen}
        />
        {sourceOpen && (
          <DropdownPanel
            title="Source"
            onClear={sourceFilter.length > 0 ? clearSourceFilter : undefined}
          >
            <ul className="max-h-56 overflow-y-auto px-2 py-1">
              {SOURCE_FILTER_OPTIONS.map((source) => (
                <CheckboxRow
                  key={source}
                  label={source}
                  checked={sourceFilter.includes(source)}
                  onChange={() => toggleSourceFilter(source)}
                />
              ))}
            </ul>
          </DropdownPanel>
        )}
      </div>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
  expanded,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  expanded: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs ${
        active
          ? 'border-teal-300 bg-teal-50 text-teal-800'
          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
      }`}
      aria-expanded={expanded}
    >
      {label}
      <ChevronDown className="h-3 w-3" />
    </button>
  );
}

function DropdownPanel({
  title,
  children,
  onClear,
}: {
  title: string;
  children: React.ReactNode;
  onClear?: () => void;
}) {
  return (
    <div className="absolute left-0 z-20 mt-1 w-52 rounded-md border border-gray-200 bg-white shadow-lg">
      <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
        <span className="text-xs font-medium text-gray-700">{title}</span>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-teal-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <li>
      <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-50">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="rounded border-gray-300"
        />
        <span className="capitalize">{label}</span>
      </label>
    </li>
  );
}
