import { useState } from 'react';
import type { Lead, LeadInput } from '../../types/lead';
import { isFormValid, validateLeadForm } from '../../utils/validation';
import { StatusBadge } from '../ui/StatusBadge';

type Props = {
  initial?: Lead;
  onSubmit: (data: LeadInput) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
};

const empty: LeadInput = { name: '', email: '', phone: '', source: '' };

export function LeadForm({ initial, onSubmit, onCancel, submitLabel }: Props) {
  const [form, setForm] = useState<LeadInput>(() =>
    initial
      ? {
          name: initial.name,
          email: initial.email,
          phone: initial.phone ?? '',
          source: initial.source ?? '',
        }
      : { ...empty },
  );
  const [touched, setTouched] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const errors = validateLeadForm(form);
  const valid = isFormValid(form);

  function update(field: keyof LeadInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setServerError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    setSubmitting(true);
    setServerError(null);
    try {
      await onSubmit({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone?.trim() || undefined,
        source: form.source?.trim() || undefined,
      });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Could not save the lead.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {initial && (
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <span>Current status:</span>
          <StatusBadge status={initial.status} />
          <span className="text-xs text-gray-400">(change status from the lead detail page)</span>
        </div>
      )}

      <div className="space-y-4">
        <Field
          label="Name"
          id="name"
          required
          value={form.name}
          onChange={(v) => update('name', v)}
          error={touched && !form.name.trim() ? 'Name is required' : undefined}
        />
        <Field
          label="Email"
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(v) => update('email', v)}
          error={
            touched && errors.find((e) => e.toLowerCase().includes('email'))
              ? errors.find((e) => e.toLowerCase().includes('email'))
              : undefined
          }
        />
        <Field
          label="Phone"
          id="phone"
          value={form.phone ?? ''}
          onChange={(v) => update('phone', v)}
        />
        <Field
          label="Source"
          id="source"
          value={form.source ?? ''}
          onChange={(v) => update('source', v)}
          placeholder="website, referral, campaign…"
        />
      </div>

      {serverError && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {serverError}
        </p>
      )}

      <div className="mt-6 flex gap-2">
        <button
          type="submit"
          disabled={!valid || submitting}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  error,
  required,
  type = 'text',
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
            : 'border-gray-300 focus:border-teal-400 focus:ring-teal-400'
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
