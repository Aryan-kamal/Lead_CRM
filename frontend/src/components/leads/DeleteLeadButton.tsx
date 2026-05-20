import { useState } from 'react';
import { useLeads } from '../../context/LeadsContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';

type Props = {
  id: string;
  name: string;
};

export function DeleteLeadButton({ id, name }: Props) {
  const { deleteLead } = useLeads();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function confirm() {
    setLoading(true);
    try {
      await deleteLead(id);
      setOpen(false);
    } catch {
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-red-600 hover:text-red-800"
      >
        Delete
      </button>
      <ConfirmDialog
        open={open}
        title="Delete lead?"
        message={`Remove ${name}? The lead stays in the list until the server confirms deletion.`}
        loading={loading}
        onConfirm={confirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
