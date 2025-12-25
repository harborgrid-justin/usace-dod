
import React, { useState } from 'react';
import { FileText, ArrowRight, Clock, CheckCircle2, Server, Hammer, Plus, DollarSign } from 'lucide-react';
import { ReimbursableAgreement, ReimbursableOrder, ProjectOrder } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import AgreementForm from './AgreementForm';
import ReimbursableOrderForm from './ReimbursableOrderForm';

interface Props {
    agreements: ReimbursableAgreement[];
    orders: ReimbursableOrder[];
    projectOrders: ProjectOrder[];
    onCreateAgreement: (a: ReimbursableAgreement) => void;
    onCreateOrder: (o: ReimbursableOrder) => void;
}

const AgreementManager: React.FC<Props> = ({ agreements, orders, projectOrders, onCreateAgreement, onCreateOrder }) => {
    const [isAgreementFormOpen, setIsAgreementFormOpen] = useState(false);
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
    const [selectedAgreementId, setSelectedAgreementId] = useState<string | undefined>(undefined);

    const handleOpenOrderForm = (agreementId: string) => {
        setSelectedAgreementId(agreementId);
        setIsOrderFormOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                <div>
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Inter-Agency Agreements</h3>
                    <p className="text-xs text-zinc-500">G-Invoicing Integration • FS Form 7600A/B</p>
                </div>
                <button 
                    onClick={() => setIsAgreementFormOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors"
                >
                    <Plus size={12} /> New Agreement
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {agreements.map(agreement => {
                    const linkedOrders = orders.filter(o => o.agreementId === agreement.id);
                    // Match Project Orders by GT&C Number reference in documents or direct ID match
                    const linkedProjectOrders = projectOrders.filter(po => po.documents.fs7600a === agreement.gtcNumber || po.documents.fs7600a === agreement.id);
                    
                    const totalStandardObligated = linkedOrders.reduce((sum, o) => sum + o.amount, 0);
                    const totalProjectOrdersObligated = linkedProjectOrders.reduce((sum, po) => sum + po.totalAmount, 0);
                    const totalObligated = totalStandardObligated + totalProjectOrdersObligated;
                    const remainingCeiling = agreement.estimatedTotalValue - totalObligated;
                    
                    return (
                        <div key={agreement.id} className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:border-zinc-300 transition-all flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-bold text-zinc-900">{agreement.buyer}</h4>
                                        <ArrowRight size={12} className="text-zinc-400" />
                                        <h4 className="text-sm font-bold text-zinc-900">{agreement.seller}</h4>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] text-zinc-500 font-mono bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-100">
                                            GT&C: {agreement.gtcNumber}
                                        </p>
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                            <Server size={10} /> Live
                                        </div>
                                    </div>
                                </div>
                                <span className="px-2 py-1 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    {agreement.status}
                                </span>
                            </div>
                            
                            <div className="mb-4">
                                <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                                    <span>Obligated</span>
                                    <span>Ceiling</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden mb-1">
                                    <div 
                                        className={`h-full ${totalObligated > agreement.estimatedTotalValue ? 'bg-rose-500' : 'bg-zinc-800'}`} 
                                        style={{ width: `${Math.min(100, (totalObligated / agreement.estimatedTotalValue) * 100)}%` }} 
                                    />
                                </div>
                                <div className="flex justify-between text-xs font-mono font-medium text-zinc-700">
                                    <span>{formatCurrency(totalObligated)}</span>
                                    <span>{formatCurrency(agreement.estimatedTotalValue)}</span>
                                </div>
                            </div>

                            <div className="space-y-2 mt-auto pt-4 border-t border-zinc-100">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Orders (FS Form 7600B)</p>
                                    <button 
                                        onClick={() => handleOpenOrderForm(agreement.id)} 
                                        className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                                    >
                                        <Plus size={10}/> Add Order
                                    </button>
                                </div>
                                
                                {/* Standard Reimbursable Orders */}
                                {linkedOrders.map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-2 bg-zinc-50 rounded border border-zinc-100">
                                        <div className="flex items-center gap-3">
                                            <FileText size={14} className="text-zinc-400"/>
                                            <div>
                                                <p className="text-xs font-bold text-zinc-800">{order.orderNumber}</p>
                                                <p className="text-[9px] text-zinc-500">{order.authority.split('(')[0]}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-mono font-bold text-zinc-900">{formatCurrency(order.amount)}</p>
                                            <p className="text-[9px] text-zinc-500">{order.billingFrequency}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Project Orders */}
                                {linkedProjectOrders.map(po => (
                                    <div key={po.id} className="flex items-center justify-between p-2 bg-indigo-50/50 rounded border border-indigo-100">
                                        <div className="flex items-center gap-3">
                                            <Hammer size={14} className="text-indigo-500"/>
                                            <div>
                                                <p className="text-xs font-bold text-zinc-800">{po.orderNumber}</p>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[9px] text-indigo-600 font-bold uppercase">Project Order</span>
                                                    <span className="text-[9px] text-zinc-400">• {po.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-mono font-bold text-indigo-700">{formatCurrency(po.totalAmount)}</p>
                                            <p className="text-[9px] text-zinc-500">{po.percentInHouse}% In-House</p>
                                        </div>
                                    </div>
                                ))}

                                {linkedOrders.length === 0 && linkedProjectOrders.length === 0 && <p className="text-xs text-zinc-400 italic text-center py-2">No active orders linked.</p>}
                            </div>
                        </div>
                    );
                })}
            </div>

            {isAgreementFormOpen && (
                <AgreementForm 
                    onClose={() => setIsAgreementFormOpen(false)} 
                    onSubmit={(a) => { onCreateAgreement(a); setIsAgreementFormOpen(false); }} 
                />
            )}

            {isOrderFormOpen && (
                <ReimbursableOrderForm 
                    agreements={agreements}
                    preSelectedAgreementId={selectedAgreementId}
                    onClose={() => setIsOrderFormOpen(false)}
                    onSubmit={(o) => { onCreateOrder(o); setIsOrderFormOpen(false); }}
                />
            )}
        </div>
    );
};

export default AgreementManager;
