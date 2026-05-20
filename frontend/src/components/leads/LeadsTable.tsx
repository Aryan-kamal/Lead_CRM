import { Mail, Phone } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PAGE_SIZE } from '../../constants/pagination';
import { useLeads } from '../../context/LeadsContext';
import { formatDate } from '../../utils/format';
import { pathWithFilters } from '../../utils/urlFilters';
import { Avatar } from '../ui/Avatar';
import { Pagination } from '../ui/Pagination';
import { StatusBadge } from '../ui/StatusBadge';
import { DeleteLeadButton } from './DeleteLeadButton';
import { StatusMenu } from './StatusMenu';

export function LeadsTable() {
  const {
    filteredLeads,
    loading,
    error,
    changeStatus,
    actionError,
    clearActionError,
    searchQuery,
    statusFilter,
    sourceFilter,
    sortField,
    sortDir,
    filterParams,
  } = useLeads();

  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE));

  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredLeads.slice(start, start + PAGE_SIZE);
  }, [filteredLeads, page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, sourceFilter, sortField, sortDir]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-500">
        Loading leads…
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
        <p className="text-sm font-medium text-gray-900">No leads found</p>
        <p className="mt-1 text-sm text-gray-500">
          Try changing your search or status filters, or add a new lead.
        </p>
        <Link
          to={pathWithFilters('/leads/new', filterParams)}
          className="mt-4 inline-block text-sm font-medium text-teal-600 hover:underline"
        >
          Add your first lead
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      {actionError && (
        <div
          className="mb-3 flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {actionError}
          <button type="button" onClick={clearActionError} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </span>
              </th>
              <th className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  Phone
                </span>
              </th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="overflow-visible">
            {paginatedLeads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/80"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={lead.name} />
                    <Link
                      to={pathWithFilters(`/leads/${lead.id}`, filterParams)}
                      className="font-medium text-gray-900 hover:text-teal-700"
                    >
                      {lead.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                <td className="px-4 py-3 text-gray-600">
                  {lead.phone ?? <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3 text-gray-600">{lead.source ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(lead.updated_at)}</td>
                <td className="relative overflow-visible px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={pathWithFilters(`/leads/${lead.id}`, filterParams)}
                      className="text-xs font-medium text-gray-600 hover:text-gray-900"
                    >
                      View
                    </Link>
                    <Link
                      to={pathWithFilters(`/leads/${lead.id}/edit`, filterParams)}
                      className="text-xs font-medium text-gray-600 hover:text-gray-900"
                    >
                      Edit
                    </Link>
                    <DeleteLeadButton id={lead.id} name={lead.name} />
                    <StatusMenu
                      lead={lead}
                      compact
                      onChange={async (status) => {
                        await changeStatus(lead.id, status);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={filteredLeads.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
