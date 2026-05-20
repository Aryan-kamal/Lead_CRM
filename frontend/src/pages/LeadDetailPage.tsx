import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { StatusMenu } from '../components/leads/StatusMenu';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Avatar } from '../components/ui/Avatar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useLeads } from '../context/LeadsContext';
import { useLead } from '../hooks/useLead';
import { formatDate } from '../utils/format';
import { isTerminal } from '../utils/status';

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { changeStatus, deleteLead, actionError, clearActionError } = useLeads();
  const { lead, loading, error } = useLead(id);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (loading) {
    return <p className="p-8 text-sm text-gray-500">Loading lead…</p>;
  }

  if (error || !lead) {
    return (
      <div className="mx-4 my-8 rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-800">{error ?? 'Lead not found'}</p>
        <Link to="/leads" className="mt-3 inline-block text-sm text-teal-600 hover:underline">
          Back to leads
        </Link>
      </div>
    );
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteLead(lead!.id);
      navigate('/leads');
    } catch {
      // keep dialog open; error banner shows below
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-4">
      <Link
        to="/leads"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>

      {actionError && (
        <div className="mb-4 flex justify-between rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {actionError}
          <button type="button" onClick={clearActionError} className="underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={lead.name} size="md" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{lead.name}</h1>
              <p className="text-sm text-gray-600">{lead.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={lead.status} />
            {!isTerminal(lead.status) && (
              <StatusMenu
                lead={lead}
                onChange={async (s) => {
                  await changeStatus(lead.id, s);
                }}
              />
            )}
            {isTerminal(lead.status) && (
              <span className="text-xs text-gray-500">Status is final</span>
            )}
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-gray-500">Phone</dt>
            <dd className="font-medium text-gray-900">{lead.phone ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Source</dt>
            <dd className="font-medium text-gray-900">{lead.source ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Created</dt>
            <dd className="text-gray-900">{formatDate(lead.created_at)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Last updated</dt>
            <dd className="text-gray-900">{formatDate(lead.updated_at)}</dd>
          </div>
        </dl>

        <div className="mt-6 flex gap-2 border-t border-gray-100 pt-4">
          <Link
            to={`/leads/${lead.id}/edit`}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete lead?"
        message={`This will permanently remove ${lead.name}. This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
