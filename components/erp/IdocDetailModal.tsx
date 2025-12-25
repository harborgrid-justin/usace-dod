
import React from 'react';
import { X, Clock, Server, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { IDOCInterface } from '../../types';

interface Props {
  idoc: IDOCInterface;
  onClose: () => void;
}

const IdocDetailModal: React.FC<Props> = ({ idoc, onClose }) => {
  return (
    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300 p-4">
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in slide-in-from-top-2">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">IDOC Detail</h3>
            <p className="text-xs text-zinc-500 font-mono">{idoc.id}</p>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-800 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="space-y-4 text-sm">
           <div className="flex justify-between items-center">
              <span className="font-medium text-zinc-500">Status</span>
              <div className="flex items-center gap-2">
                 {idoc.status === 'Success' && <CheckCircle2 size={14} className="text-emerald-500" />}
                 {idoc.status === 'Warning' && <AlertTriangle size={14} className="text-amber-500" />}
                 {idoc.status === 'Error' && <AlertTriangle size={14} className="text-rose-500" />}
                 <span className={`font-bold font-mono text-xs ${
                    idoc.status === 'Success' ? 'text-emerald-600' :
                    idoc.status === 'Warning' ? 'text-amber-600' : 'text-rose-600'
                 }`}>{idoc.status.toUpperCase()}</span>
              </div>
           </div>
           <div className="flex justify-between items-center">
              <span className="font-medium text-zinc-500">Direction</span>
              <span className="font-mono text-zinc-800 font-medium text-xs">{idoc.direction}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="font-medium text-zinc-500">Partner System</span>
              <span className="font-mono text-zinc-800 font-medium text-xs">{idoc.partner}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="font-medium text-zinc-500">Message Type</span>
              <span className="font-mono text-zinc-800 font-medium text-xs">{idoc.messageType}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="font-medium text-zinc-500">Timestamp</span>
              <span className="font-mono text-zinc-800 font-medium text-xs">{idoc.timestamp}</span>
           </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-end">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-zinc-900 rounded-lg text-[10px] font-bold uppercase tracking-wide text-white hover:bg-zinc-800 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};

export default IdocDetailModal;
