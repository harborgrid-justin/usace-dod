import React from 'react';
import { AuditLogEntry } from '../../types';
import Modal from '../shared/Modal';
import { History, User } from 'lucide-react';

interface Props {
  title: string;
  log: AuditLogEntry[];
  onClose: () => void;
}

const CWA_AuditLogViewer: React.FC<Props> = ({ title, log, onClose }) => {
    return (
        <Modal title={`Audit Log: ${title}`} onClose={onClose}>
            <div className="space-y-4">
                {log.length > 0 ? [...log].reverse().map((entry) => (
                    <div key={`${entry.timestamp}-${entry.action}`} className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100 animate-in fade-in">
                        <div className="p-2 bg-white rounded-full border border-zinc-200 mt-1">
                          <History size={14} className="text-zinc-500"/>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-bold text-zinc-800">{entry.action}</p>
                                <p className="text-xs font-mono text-zinc-400">{new Date(entry.timestamp).toLocaleString()}</p>
                            </div>
                            {entry.details && <p className="text-xs text-zinc-600 mt-1 italic">"{entry.details}"</p>}
                            <div className="flex items-center gap-1 text-xs text-zinc-500 mt-2">
                                <User size={12} />
                                <span>{entry.user}</span>
                            </div>
                        </div>
                    </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                    <History size={32} className="opacity-20 mb-2"/>
                    <p className="text-sm font-medium">No history recorded.</p>
                  </div>
                )}
            </div>
        </Modal>
    );
};

export default CWA_AuditLogViewer;