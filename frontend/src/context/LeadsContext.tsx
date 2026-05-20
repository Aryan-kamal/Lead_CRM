import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import * as api from '../api/leads';
import type { Lead, LeadInput, LeadStatus } from '../types/lead';
import { KNOWN_SOURCES } from '../constants/sources';
import { STATUSES } from '../types/lead';
import {
  parseSortDir,
  parseSortField,
  parseStatusFilter,
  parseListParam,
} from '../utils/urlFilters';

export type SortField = 'updated_at' | 'created_at';
export type SortDir = 'asc' | 'desc';

type LeadsContextValue = {
  leads: Lead[];
  filteredLeads: Lead[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: LeadStatus[];
  sourceFilter: string[];
  sortField: SortField;
  sortDir: SortDir;
  actionError: string | null;
  filterParams: URLSearchParams;
  setSearchQuery: (q: string) => void;
  toggleStatusFilter: (status: LeadStatus) => void;
  clearStatusFilter: () => void;
  toggleSourceFilter: (source: string) => void;
  clearSourceFilter: () => void;
  setSort: (field: SortField, dir: SortDir) => void;
  setSortField: (field: SortField) => void;
  toggleSortDir: () => void;
  clearAllFilters: () => void;
  activeFilterCount: number;
  refreshLeads: () => Promise<void>;
  getLeadById: (id: string) => Lead | undefined;
  createLead: (data: LeadInput) => Promise<Lead>;
  updateLead: (id: string, data: LeadInput) => Promise<Lead>;
  deleteLead: (id: string) => Promise<void>;
  changeStatus: (id: string, status: LeadStatus) => Promise<Lead>;
  changeStatusOptimistic: (id: string, status: LeadStatus) => Promise<Lead>;
  clearActionError: () => void;
};

const LeadsContext = createContext<LeadsContextValue | null>(null);

function matchesSourceFilter(
  source: string | null,
  filter: string[],
): boolean {
  const wantsOthers = filter.includes('others');
  const named = filter.filter((s) => s !== 'others');
  const isOthers =
    !source || !(KNOWN_SOURCES as readonly string[]).includes(source);

  if (named.length > 0 && source && named.includes(source)) return true;
  if (wantsOthers && isOthers) return true;
  return false;
}

function compareTime(a: string, b: string, dir: SortDir): number {
  const diff = new Date(a).getTime() - new Date(b).getTime();
  return dir === 'asc' ? diff : -diff;
}

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const searchQuery = searchParams.get('q') ?? '';
  const statusFilter = useMemo(
    () => parseStatusFilter(searchParams.get('status')),
    [searchParams],
  );
  const sourceFilter = useMemo(
    () => parseListParam(searchParams.get('source')),
    [searchParams],
  );
  const sortField = parseSortField(searchParams.get('sort'));
  const sortDir = parseSortDir(searchParams.get('dir'));

  const patchParams = useCallback(
    (patch: {
      q?: string;
      status?: LeadStatus[];
      source?: string[];
      sort?: SortField;
      dir?: SortDir;
    }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (patch.q !== undefined) {
            if (patch.q.trim()) next.set('q', patch.q.trim());
            else next.delete('q');
          }
          if (patch.status !== undefined) {
            if (patch.status.length) next.set('status', patch.status.join(','));
            else next.delete('status');
          }
          if (patch.source !== undefined) {
            if (patch.source.length) next.set('source', patch.source.join(','));
            else next.delete('source');
          }
          if (patch.sort !== undefined) {
            next.set('sort', patch.sort);
          }
          if (patch.dir !== undefined) {
            next.set('dir', patch.dir);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setSearchQuery = useCallback(
    (q: string) => patchParams({ q }),
    [patchParams],
  );

  const toggleStatusFilter = useCallback(
    (status: LeadStatus) => {
      const next = statusFilter.includes(status)
        ? statusFilter.filter((s) => s !== status)
        : [...statusFilter, status];
      patchParams({ status: next });
    },
    [statusFilter, patchParams],
  );

  const clearStatusFilter = useCallback(
    () => patchParams({ status: [] }),
    [patchParams],
  );

  const toggleSourceFilter = useCallback(
    (source: string) => {
      const next = sourceFilter.includes(source)
        ? sourceFilter.filter((s) => s !== source)
        : [...sourceFilter, source];
      patchParams({ source: next });
    },
    [sourceFilter, patchParams],
  );

  const clearSourceFilter = useCallback(
    () => patchParams({ source: [] }),
    [patchParams],
  );

  const setSort = useCallback(
    (field: SortField, dir: SortDir) => patchParams({ sort: field, dir }),
    [patchParams],
  );

  const setSortFieldOnly = useCallback(
    (field: SortField) => patchParams({ sort: field }),
    [patchParams],
  );

  const toggleSortDir = useCallback(() => {
    patchParams({ dir: sortDir === 'asc' ? 'desc' : 'asc' });
  }, [sortDir, patchParams]);

  const clearAllFilters = useCallback(() => {
    patchParams({ q: '', status: [], source: [] });
  }, [patchParams]);

  const activeFilterCount =
    statusFilter.length + sourceFilter.length + (searchQuery.trim() ? 1 : 0);

  const refreshLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchLeads();
      setLeads(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load the leads list.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLeads();
  }, [refreshLeads]);

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = leads.filter((lead) => {
      if (statusFilter.length > 0 && !statusFilter.includes(lead.status)) {
        return false;
      }
      if (sourceFilter.length > 0 && !matchesSourceFilter(lead.source, sourceFilter)) {
        return false;
      }
      if (!q) return true;
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.phone?.toLowerCase().includes(q) ?? false)
      );
    });

    return [...filtered].sort((a, b) =>
      compareTime(a[sortField], b[sortField], sortDir),
    );
  }, [leads, searchQuery, statusFilter, sourceFilter, sortField, sortDir]);

  const getLeadById = useCallback(
    (id: string) => leads.find((l) => l.id === id),
    [leads],
  );

  const createLead = useCallback(async (data: LeadInput) => {
    setActionError(null);
    const lead = await api.createLead(data);
    setLeads((prev) => [lead, ...prev]);
    return lead;
  }, []);

  const updateLead = useCallback(async (id: string, data: LeadInput) => {
    setActionError(null);
    const updated = await api.updateLead(id, data);
    setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
    return updated;
  }, []);

  const deleteLead = useCallback(async (id: string) => {
    setActionError(null);
    try {
      await api.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : 'Could not delete this lead.';
      setActionError(msg);
      throw e;
    }
  }, []);

  const changeStatus = useCallback(async (id: string, status: LeadStatus) => {
    setActionError(null);
    try {
      const updated = await api.patchLeadStatus(id, status);
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
      return updated;
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : 'Could not update the lead status.';
      setActionError(msg);
      throw e;
    }
  }, []);

  const changeStatusOptimistic = useCallback(
    async (id: string, status: LeadStatus) => {
      const lead = leads.find((l) => l.id === id);
      if (!lead) throw new Error('Lead not found');
      const previousStatus = lead.status;
      setActionError(null);
      setLeads((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status, updated_at: new Date().toISOString() } : l,
        ),
      );
      try {
        const updated = await api.patchLeadStatus(id, status);
        setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
        return updated;
      } catch (e) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: previousStatus } : l)),
        );
        const msg =
          e instanceof Error ? e.message : 'Could not update the lead status.';
        setActionError(msg);
        throw e;
      }
    },
    [leads],
  );

  const value: LeadsContextValue = {
    leads,
    filteredLeads,
    loading,
    error,
    searchQuery,
    statusFilter,
    sourceFilter,
    sortField,
    sortDir,
    actionError,
    filterParams: searchParams,
    setSearchQuery,
    toggleStatusFilter,
    clearStatusFilter,
    toggleSourceFilter,
    clearSourceFilter,
    setSort,
    setSortField: setSortFieldOnly,
    toggleSortDir,
    clearAllFilters,
    activeFilterCount,
    refreshLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
    changeStatus,
    changeStatusOptimistic,
    clearActionError: () => setActionError(null),
  };

  return (
    <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>
  );
}

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error('useLeads must be used inside LeadsProvider');
  return ctx;
}

export { STATUSES };
