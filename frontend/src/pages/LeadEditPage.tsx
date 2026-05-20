import { Link, useNavigate, useParams } from 'react-router-dom';
import { LeadForm } from '../components/leads/LeadForm';
import { useLeads } from '../context/LeadsContext';
import { useLead } from '../hooks/useLead';

export function LeadEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateLead } = useLeads();
  const { lead, loading, error } = useLead(id);

  if (loading) {
    return <p className="p-8 text-sm text-gray-500">Loading…</p>;
  }

  if (error || !lead) {
    return (
      <div className="mx-4 my-8 text-center">
        <p className="text-sm text-red-700">{error ?? 'Lead not found'}</p>
        <Link to="/leads" className="mt-2 inline-block text-sm text-teal-600 hover:underline">
          Back to leads
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-lg font-semibold text-gray-900">Edit lead</h1>
      <LeadForm
        initial={lead}
        submitLabel="Save changes"
        onCancel={() => navigate(`/leads/${lead.id}`)}
        onSubmit={async (data) => {
          await updateLead(lead.id, data);
          navigate(`/leads/${lead.id}`);
        }}
      />
    </div>
  );
}
