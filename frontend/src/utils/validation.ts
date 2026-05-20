import type { LeadInput } from '../types/lead';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLeadForm(data: LeadInput): string[] {
  const errors: string[] = [];
  if (!data.name.trim()) errors.push('Name is required');
  if (!data.email.trim()) errors.push('Email is required');
  else if (!EMAIL_RE.test(data.email.trim())) errors.push('Enter a valid email');
  return errors;
}

export function isFormValid(data: LeadInput): boolean {
  return validateLeadForm(data).length === 0;
}
