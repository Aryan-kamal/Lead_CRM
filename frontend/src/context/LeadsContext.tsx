import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as api from '../api/leads';
import type { Lead, LeadInput, LeadStatus } from '../types/lead';
import { STATUSES } from '../types/lead';

type LeadsContextValue = {
  leads: Lead[];
  filteredLeads: Lead[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: LeadStatus[];
  actionError: string | null;
  setSearchQuery: (q: string) => void;
  toggleStatusFilter: (status: LeadStatus) => void;
  clearStatusFilter: () => void;
  refreshLeads: () => Promise<void>;
  getLeadById: (id: string) => Lead | undefined;
  createLead: (data: LeadInput) => Promise<Lead>;
  updateLead: (id: string, data: LeadInput) => Promise<Lead>;
  deleteLead: (id: string) => Promise<void>;
  changeStatus: (id: string, status: LeadStatus) => Promise<Lead>;
  clearActionError: () => void;
};

const LeadsContext = createContext<LeadsContextValue | null>(null);

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus[]>([]);

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
    return leads.filter((lead) => {
      if (statusFilter.length > 0 && !statusFilter.includes(lead.status)) {
        return false;
      }
      if (!q) return true;
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q)
      );
    });
  }, [leads, searchQuery, statusFilter]);

  const toggleStatusFilter = useCallback((status: LeadStatus) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  }, []);

  const clearStatusFilter = useCallback(() => setStatusFilter([]), []);

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

  const value: LeadsContextValue = {
    leads,
    filteredLeads,
    loading,
    error,
    searchQuery,
    statusFilter,
    actionError,
    setSearchQuery,
    toggleStatusFilter,
    clearStatusFilter,
    refreshLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
    changeStatus,
    clearActionError: () => setActionError(null),
  };

  return (
    <LeadsContext.Provider value={value}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error('useLeads must be used inside LeadsProvider');
  return ctx;
}

export { STATUSES };
