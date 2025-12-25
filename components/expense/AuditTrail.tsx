
import React, { useState } from 'react';
import { History, User, Check, DollarSign, Send } from 'lucide-react';
import { Expense } from '../../types';
import Modal from '../shared/Modal';

interface Props {
    expense: Expense;
}

const iconMap: { [key: string]: React.ElementType } = {
    'created': Send,
    'approved': Check,
    'disbursed': DollarSign
};

const AuditTrail: React.FC<Props> = ({ expense }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900">
                <History size={14} /> View Audit Trail
            </button>

            {isOpen && (
                <Modal title={`Audit Trail: ${expense.id}`} onClose={() => setIsOpen(false)}>
                    <div className="space-y-4">
                        {expense.auditLog.map((log, index) => {
                            const Icon = iconMap[log.action.toLowerCase().split(' ')[1]] || History;
                            return (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="mt-1 p-2 bg-zinc-100 rounded-full border border-zinc-200">
                                        <Icon size={16} className="text-zinc-600"/>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold text-sm">{log.action}</p>
                                            <p className="text-xs font-mono text-zinc-400">{new Date(log.timestamp).toLocaleString()}</p>
                                        </div>
                                        <p className="text-xs text-zinc-600 mt-1">{log.details}</p>
                                        <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1"><User size={12}/>{log.user}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Modal>
            )}
        </>
    );
};

export default AuditTrail;
