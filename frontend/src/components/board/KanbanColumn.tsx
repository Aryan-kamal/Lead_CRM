import { useDroppable } from '@dnd-kit/core';
import type { Lead, LeadStatus } from '../../types/lead';
import { STATUS_LABELS, isTerminal } from '../../utils/status';
import { KanbanCard } from './KanbanCard';

type Props = {
  status: LeadStatus;
  leads: Lead[];
  isInvalidTarget: boolean;
};

export function KanbanColumn({ status, leads, isInvalidTarget }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const locked = isTerminal(status);

  let ring = 'border-gray-200';
  if (isOver && isInvalidTarget) ring = 'border-red-400 bg-red-50/50';
  else if (isOver) ring = 'border-teal-400 bg-teal-50/30';

  return (
    <section
      className={`flex min-w-[220px] flex-1 flex-col rounded-lg border bg-gray-50/80 ${ring}`}
    >
      <header className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-600">
          {STATUS_LABELS[status]}
        </h2>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-600">
          {leads.length}
        </span>
      </header>
      {locked && (
        <p className="border-b border-gray-100 px-3 py-1 text-[10px] text-gray-400">
          Locked column
        </p>
      )}
      <ul
        ref={setNodeRef}
        className="flex max-h-[calc(100vh-220px)] min-h-[120px] flex-1 flex-col gap-2 overflow-y-auto p-2"
      >
        {leads.length === 0 ? (
          <li className="py-6 text-center text-xs text-gray-400">No leads</li>
        ) : (
          leads.map((lead) => (
            <li key={lead.id}>
              <KanbanCard lead={lead} />
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
