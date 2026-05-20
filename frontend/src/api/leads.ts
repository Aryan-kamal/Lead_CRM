import type { Lead, LeadInput, LeadStatus } from '../types/lead';
import { withActionError } from '../utils/errors';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (body?.error) return String(body.error);
  } catch {
    // ignore
  }
  return res.statusText || 'Request failed';
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });
  } catch (err) {
    throw err;
  }
  if (!res.ok) throw new Error(await parseError(res));
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function fetchLeads(): Promise<Lead[]> {
  return withActionError('loadLeads', () => request<Lead[]>('/leads'));
}

export function fetchLead(id: string): Promise<Lead> {
  return withActionError('loadLead', () => request<Lead>(`/leads/${id}`));
}

export function createLead(data: LeadInput): Promise<Lead> {
  return withActionError('createLead', () =>
    request<Lead>('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  );
}

export function updateLead(id: string, data: LeadInput): Promise<Lead> {
  return withActionError('updateLead', () =>
    request<Lead>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  );
}

export function deleteLead(id: string): Promise<void> {
  return withActionError('deleteLead', () =>
    request<void>(`/leads/${id}`, { method: 'DELETE' }),
  );
}

export function patchLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  return withActionError('changeStatus', () =>
    request<Lead>(`/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  );
}
