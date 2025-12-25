import React from 'react';
import { CheckCircle, AlertCircle, Clock, Info } from 'lucide-react';
import { CashAuditOutcome, QuarterlyReviewStatus, ReconciliationStatus, ADAViolationStatus } from '../../types';

export const AuditOutcomeBadge: React.FC<{ status: CashAuditOutcome }> = ({ status }) => {
  const baseClasses = 'px-2 py-0.5 rounded text-[9px] font-bold uppercase whitespace-nowrap border';
  const statusClasses = {
    'Passed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Passed with Findings': 'bg-amber-50 text-amber-700 border-amber-100',
    'Failed': 'bg-rose-50 text-rose-700 border-rose-100'
  };
  return <div className={`inline-block ${baseClasses} ${statusClasses[status]}`}>{status}</div>;
};

export const QuarterlyReviewIndicator: React.FC<{ status: QuarterlyReviewStatus }> = ({ status }) => {
  const styles = {
    'Completed': { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    'Action Required': { icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-100' },
    'Pending': { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100' },
    'N/A': { icon: Info, color: 'text-zinc-400', bg: 'bg-zinc-200' }
  };
  const { bg } = styles[status];
  return (
    <div className="flex flex-col items-center gap-1 group relative">
      <div className={`w-2 h-2 rounded-full ${bg.replace('bg-','bg-opacity-50 ')}`}>
        <div className={`w-2 h-2 rounded-full ${bg} ${status === 'Pending' ? 'animate-pulse' : ''}`} />
      </div>
      <div className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 bg-zinc-800 text-white text-[10px] rounded-md shadow-lg whitespace-nowrap">
        {status}
      </div>
    </div>
  );
};

export const ReconciliationStatusBadge: React.FC<{ status: ReconciliationStatus }> = ({ status }) => {
    const statusClasses = {
        Open: 'bg-blue-100 text-blue-800',
        'In-Research': 'bg-amber-100 text-amber-800',
        Resolved: 'bg-emerald-100 text-emerald-800',
        Escalated: 'bg-rose-100 text-rose-800'
    };
    return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${statusClasses[status]}`}>{status}</span>;
};

export const ADAViolationStatusBadge: React.FC<{status: ADAViolationStatus}> = ({status}) => {
    const styles = {
        'Suspected': 'bg-amber-100 text-amber-800 border-amber-200',
        'Preliminary Review': 'bg-blue-100 text-blue-800 border-blue-200',
        'Formal Investigation': 'bg-purple-100 text-purple-800 border-purple-200',
        'Reported': 'bg-rose-100 text-rose-800 border-rose-200',
        'Closed - No Violation': 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border whitespace-nowrap ${styles[status]}`}>{status}</span>;
};