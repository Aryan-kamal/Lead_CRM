import { useNavigate } from 'react-router-dom';
import { LeadForm } from '../components/leads/LeadForm';
import { useLeads } from '../context/LeadsContext';

export function LeadCreatePage() {
  const navigate = useNavigate();
  const { createLead } = useLeads();

  return (
    <div className="p-4">
      <h1 className="mb-4 text-lg font-semibold text-gray-900">Add lead</h1>
      <LeadForm
        submitLabel="Create lead"
        onCancel={() => navigate('/leads')}
        onSubmit={async (data) => {
          const lead = await createLead(data);
          navigate(`/leads/${lead.id}`);
        }}
      />
    </div>
  );
}
