import { useEffect, useState } from 'react';
import { fetchLead } from '../api/leads';
import { useLeads } from '../context/LeadsContext';
import type { Lead } from '../types/lead';

export function useLead(id: string | undefined) {
  const { getLeadById, loading: listLoading } = useLeads();
  const cached = id ? getLeadById(id) : undefined;
  const [lead, setLead] = useState<Lead | undefined>(cached);
  const [loading, setLoading] = useState(!cached && !!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fromCache = getLeadById(id);
    if (fromCache) {
      setLead(fromCache);
      setLoading(false);
      return;
    }
    if (listLoading) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchLead(id)
      .then((data) => {
        if (!cancelled) setLead(data);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Could not load this lead.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, getLeadById, listLoading]);

  useEffect(() => {
    if (cached) setLead(cached);
  }, [cached]);

  return { lead, loading: loading || (listLoading && !lead), error };
}
