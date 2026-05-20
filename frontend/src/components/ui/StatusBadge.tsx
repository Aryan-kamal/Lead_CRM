import type { LeadStatus } from '../../types/lead';
import { STATUS_LABELS } from '../../utils/status';

const STYLES: Record<LeadStatus, string> = {
  NEW: 'bg-slate-100 text-slate-700',
  CONTACTED: 'bg-sky-50 text-sky-700',
  QUALIFIED: 'bg-violet-50 text-violet-700',
  CONVERTED: 'bg-emerald-50 text-emerald-700',
  LOST: 'bg-rose-50 text-rose-700',
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
