import type { SortDir, SortField } from '../context/LeadsContext';
import { STATUSES, type LeadStatus } from '../types/lead';

export function parseListParam(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(',').filter(Boolean);
}

export function parseStatusFilter(raw: string | null): LeadStatus[] {
  return parseListParam(raw).filter((s): s is LeadStatus =>
    STATUSES.includes(s as LeadStatus),
  );
}

export function pathWithFilters(path: string, params: URLSearchParams): string {
  const q = params.toString();
  return q ? `${path}?${q}` : path;
}

export function parseSortField(raw: string | null): SortField {
  return raw === 'created_at' ? 'created_at' : 'updated_at';
}

export function parseSortDir(raw: string | null): SortDir {
  return raw === 'asc' ? 'asc' : 'desc';
}
