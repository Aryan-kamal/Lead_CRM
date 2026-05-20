import type { LeadStatus } from '../types/lead';

const NEXT: Record<LeadStatus, LeadStatus[]> = {
  NEW: ['CONTACTED', 'LOST'],
  CONTACTED: ['QUALIFIED', 'LOST'],
  QUALIFIED: ['CONVERTED', 'LOST'],
  CONVERTED: [],
  LOST: [],
};

export function getNextStatuses(status: LeadStatus): LeadStatus[] {
  return NEXT[status];
}

export function isTerminal(status: LeadStatus): boolean {
  return status === 'CONVERTED' || status === 'LOST';
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  CONVERTED: 'Converted',
  LOST: 'Lost',
};
