import type { Lead } from '../types/lead';

function escapeCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function leadsToCsv(leads: Lead[]): string {
  const headers = [
    'id',
    'name',
    'email',
    'phone',
    'status',
    'source',
    'created_at',
    'updated_at',
  ];
  const rows = leads.map((lead) =>
    [
      lead.id,
      lead.name,
      lead.email,
      lead.phone ?? '',
      lead.status,
      lead.source ?? '',
      lead.created_at,
      lead.updated_at,
    ]
      .map(String)
      .map(escapeCell)
      .join(','),
  );
  return [headers.join(','), ...rows].join('\n');
}

export function downloadCsv(leads: Lead[], filename = 'leads-export.csv') {
  const csv = leadsToCsv(leads);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
