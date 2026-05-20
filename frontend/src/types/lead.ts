export const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'] as const;

export type LeadStatus = (typeof STATUSES)[number];

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: LeadStatus;
  source: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadInput = {
  name: string;
  email: string;
  phone?: string;
  source?: string;
};
