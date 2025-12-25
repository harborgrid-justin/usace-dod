
import React from 'react';
import { FundControlNode, AEAHistoryEvent } from '../../types';
import Modal from '../shared/Modal';
import { formatCurrency } from '../../utils/formatting';
import { User, Plus, Minus, FilePlus, Edit } from 'lucide-react';

interface Props {
  node: FundControlNode;
  onClose: () => void;
}

const AEAHistoryModal: React.FC<Props> = ({ node, onClose }) => {
  const getIcon = (action: AEAHistoryEvent['action']) => {
    switch (action) {
      case 'Created': return <FilePlus size={16} className="text-blue-600" />;
      case 'Increased': return <Plus size={16} className="text-emerald-600" />;
      case 'Decreased': return <Minus size={16} className="text-rose-600" />;
      case 'Updated': return <Edit size={16} className="text-amber-600" />;
      default: return null;
    }
  };

  return (
    <Modal title={`History for ${node.name}`} subtitle={node.id} onClose={onClose}>
      <div className="space-y-4">
        {node.history && node.history.length > 0 ? (
          [...node.history].reverse().map((event, index) => (
            <div key={index} className="flex items-start gap-4 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
              <div className="p-2 bg-white rounded-full border border-zinc-200 mt-1">{getIcon(event.action)}</div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-zinc-800">
                    {event.action === 'Updated' ? 'Record Updated' : `Authority ${event.action} by ${formatCurrency(event.amount)}`}
                  </p>
                  <p className="text-xs font-mono text-zinc-400">{new Date(event.timestamp).toLocaleDateString()}</p>
                </div>
                <p className="text-xs text-zinc-600 mt-1 italic">"{event.justification}"</p>
                <div className="flex items-center gap-1 text-xs text-zinc-500 mt-2">
                  <User size={12} />
                  <span>{event.user}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-zinc-500 py-8">No history recorded for this node.</p>
        )}
      </div>
    </Modal>
  );
};

export default AEAHistoryModal;
