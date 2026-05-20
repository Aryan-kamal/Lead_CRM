import { Phone } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import type { Lead } from '../../types/lead';
import { useLeads } from '../../context/LeadsContext';
import { pathWithFilters } from '../../utils/urlFilters';
import { isTerminal } from '../../utils/status';
import { Avatar } from '../ui/Avatar';

type Props = {
  lead: Lead;
};

export function KanbanCard({ lead }: Props) {
  const { filterParams } = useLeads();
  const locked = isTerminal(lead.status);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: lead.id,
      data: { lead },
      disabled: locked,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-md border bg-white p-2.5 shadow-sm ${
        isDragging ? 'border-teal-400 opacity-90 shadow-md' : 'border-gray-200'
      } ${locked ? 'opacity-80' : ''}`}
    >
      <div className="flex items-start gap-2">
        <Avatar name={lead.name} />
        <div className="min-w-0 flex-1">
          <Link
            to={pathWithFilters(`/leads/${lead.id}`, filterParams)}
            className="block truncate text-sm font-medium text-gray-900 hover:text-teal-700"
            onClick={(e) => e.stopPropagation()}
          >
            {lead.name}
          </Link>
          <p className="truncate text-xs text-gray-500">{lead.email}</p>
          {lead.phone && (
            <p className="mt-0.5 inline-flex items-center gap-1 truncate text-xs text-gray-500">
              <Phone className="h-3 w-3 shrink-0 text-gray-400" />
              {lead.phone}
            </p>
          )}
          {lead.source && (
            <p className="mt-1 truncate text-xs text-gray-400">{lead.source}</p>
          )}
        </div>
      </div>
      {!locked && (
        <div
          {...listeners}
          {...attributes}
          className="mt-2 cursor-grab rounded border border-dashed border-gray-200 py-1 text-center text-[10px] text-gray-400 active:cursor-grabbing"
        >
          Drag to move
        </div>
      )}
      {locked && (
        <p className="mt-2 text-center text-[10px] text-gray-400">Locked</p>
      )}
    </div>
  );
}
