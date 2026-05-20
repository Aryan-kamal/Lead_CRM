import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Lead, LeadStatus } from '../../types/lead';
import { getNextStatuses, isTerminal, STATUS_LABELS } from '../../utils/status';

type Props = {
  lead: Lead;
  onChange: (status: LeadStatus) => Promise<void>;
  compact?: boolean;
};

export function StatusMenu({ lead, onChange, compact }: Props) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const next = getNextStatuses(lead.status);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function toggleOpen() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = next.length * 40 + 16;
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUp(spaceBelow < menuHeight);
    }
    setOpen((v) => !v);
  }

  if (isTerminal(lead.status)) {
    return (
      <span className="text-xs text-gray-500" title="Status cannot be changed">
        Final status
      </span>
    );
  }

  async function pick(status: LeadStatus) {
    setBusy(true);
    setOpen(false);
    try {
      await onChange(status);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        ref={buttonRef}
        type="button"
        disabled={busy || next.length === 0}
        onClick={toggleOpen}
        className={`inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 ${
          compact ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-sm'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        Move status
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <ul
          role="listbox"
          className={`absolute right-0 z-50 min-w-[10rem] rounded-md border border-gray-200 bg-white py-1 shadow-lg ${
            openUp ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
        >
          {next.map((status) => (
            <li key={status}>
              <button
                type="button"
                role="option"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                onClick={() => pick(status)}
              >
                Mark as {STATUS_LABELS[status]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
