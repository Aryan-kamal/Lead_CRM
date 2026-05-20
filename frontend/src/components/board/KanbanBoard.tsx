import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useMemo, useState } from 'react';
import { STATUSES, useLeads } from '../../context/LeadsContext';
import type { Lead, LeadStatus } from '../../types/lead';
import {
  STATUS_LABELS,
  canTransition,
  isTerminal,
} from '../../utils/status';
import { KanbanColumn } from './KanbanColumn';

export function KanbanBoard() {
  const {
    filteredLeads,
    changeStatusOptimistic,
    actionError,
    clearActionError,
  } = useLeads();

  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [invalidTarget, setInvalidTarget] = useState<LeadStatus | null>(null);
  const [dropError, setDropError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const byStatus = useMemo(() => {
    const map: Record<LeadStatus, Lead[]> = {
      NEW: [],
      CONTACTED: [],
      QUALIFIED: [],
      CONVERTED: [],
      LOST: [],
    };
    for (const lead of filteredLeads) {
      map[lead.status].push(lead);
    }
    return map;
  }, [filteredLeads]);

  function handleDragStart(event: DragStartEvent) {
    setDropError(null);
    clearActionError();
    const lead = event.active.data.current?.lead as Lead | undefined;
    setActiveLead(lead ?? null);
    setInvalidTarget(null);
  }

  function handleDragOver(event: DragOverEvent) {
    const lead = activeLead;
    const overId = event.over?.id as LeadStatus | undefined;
    if (!lead || !overId || !STATUSES.includes(overId)) {
      setInvalidTarget(null);
      return;
    }
    if (overId === lead.status) {
      setInvalidTarget(null);
      return;
    }
    setInvalidTarget(canTransition(lead.status, overId) ? null : overId);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const lead = activeLead;
    setActiveLead(null);
    setInvalidTarget(null);

    const overId = event.over?.id as LeadStatus | undefined;
    if (!lead || !overId || overId === lead.status) return;

    if (!canTransition(lead.status, overId)) {
      setDropError(
        `Cannot move from ${STATUS_LABELS[lead.status]} to ${STATUS_LABELS[overId]}. Only one step forward or to Lost is allowed.`,
      );
      return;
    }

    if (isTerminal(lead.status)) return;

    setDropError(null);
    try {
      await changeStatusOptimistic(lead.id, overId);
    } catch {
      // actionError set in context
    }
  }

  function handleDragCancel() {
    setActiveLead(null);
    setInvalidTarget(null);
  }

  return (
    <div className="flex h-full flex-col p-4">
      {(dropError || actionError) && (
        <div
          className="mb-3 flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
          role="alert"
        >
          <span>{dropError ?? actionError}</span>
          <button
            type="button"
            className="text-xs underline"
            onClick={() => {
              setDropError(null);
              clearActionError();
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto pb-2">
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              leads={byStatus[status]}
              isInvalidTarget={invalidTarget === status}
            />
          ))}
        </div>
        <DragOverlay>
          {activeLead ? (
            <div className="w-[220px] rounded-md border border-teal-400 bg-white p-3 shadow-lg">
              <p className="text-sm font-medium text-gray-900">{activeLead.name}</p>
              <p className="text-xs text-gray-500">{activeLead.email}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
