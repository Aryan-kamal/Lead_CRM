export type LeadAction =
  | 'loadLeads'
  | 'loadLead'
  | 'createLead'
  | 'updateLead'
  | 'deleteLead'
  | 'changeStatus';

const ACTION_MESSAGES: Record<
  LeadAction,
  { failed: string; offline: string }
> = {
  loadLeads: {
    failed: 'Could not load the leads list.',
    offline:
      'Could not load the leads list. Start the mock server (npm start in mock-server, port 4000).',
  },
  loadLead: {
    failed: 'Could not load this lead.',
    offline:
      'Could not load this lead. Start the mock server (npm start in mock-server, port 4000).',
  },
  createLead: {
    failed: 'Could not create the lead.',
    offline: 'Could not create the lead. The mock server may be down.',
  },
  updateLead: {
    failed: 'Could not save changes to this lead.',
    offline: 'Could not save changes. The mock server may be down.',
  },
  deleteLead: {
    failed: 'Could not delete this lead.',
    offline: 'Could not delete this lead. The mock server may be down.',
  },
  changeStatus: {
    failed: 'Could not update the lead status.',
    offline: 'Could not update status. The mock server may be down.',
  },
};

function isNetworkError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    err.name === 'TypeError' ||
    msg.includes('failed to fetch') ||
    msg.includes('network') ||
    msg.includes('load failed')
  );
}

export function formatActionError(action: LeadAction, err: unknown): string {
  const { failed, offline } = ACTION_MESSAGES[action];

  if (isNetworkError(err)) return offline;

  if (err instanceof Error && err.message.trim()) {
    const detail = err.message;
    if (detail === failed || detail === offline || detail.startsWith(failed)) {
      return detail;
    }
    return `${failed} ${detail}`;
  }

  return failed;
}

export async function withActionError<T>(
  action: LeadAction,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    throw new Error(formatActionError(action, err));
  }
}
