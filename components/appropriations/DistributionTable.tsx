import React from 'react';
import { Distribution } from '../../types';
import { formatCurrency } from '../../utils/formatting';

interface Props {
  distributions: Distribution[];
  onSelectThread: (threadId: string) => void;
}

const StatusBadge: React.FC<{ status: Distribution['status'] }> = ({ status }) => {
  const baseClasses = 'px-2 py-0.5 rounded text-[9px] font-bold uppercase whitespace-nowrap border';
  const statusClasses = {
    Approved: 'bg-blue-50 text-blue-700 border-blue-100',
    Pending: 'bg-amber-50 text-amber-700 border-amber-100',
    Executed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-100'
  };
  return <div className={`inline-block ${baseClasses} ${statusClasses[status]}`}>{status}</div>;
};

const DistributionTable: React.FC<Props> = ({ distributions, onSelectThread }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 h-full shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
      <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4">Distribution Ledger</h3>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="pb-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-2">Recipient</th>
              <th className="pb-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Amount</th>
              <th className="pb-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
              <th className="pb-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {distributions.map(dist => (
              <tr 
                key={dist.id} 
                className={`transition-colors ${dist.linkedThreadId ? 'hover:bg-blue-50/50 cursor-pointer' : 'hover:bg-zinc-50/50'}`}
                onClick={() => dist.linkedThreadId && onSelectThread(dist.linkedThreadId)}
              >
                <td className="py-3 pl-2">
                  <p className="text-sm font-semibold text-zinc-800">{dist.toUnit}</p>
                  <p className="text-[10px] text-zinc-400">{dist.purpose}</p>
                </td>
                <td className="py-3 text-sm font-mono text-zinc-700 text-right">{formatCurrency(dist.amount)}</td>
                <td className="py-3"><StatusBadge status={dist.status} /></td>
                <td className="py-3 text-[10px] font-mono text-zinc-400">{dist.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistributionTable;