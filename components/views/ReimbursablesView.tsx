
import React, { useState, useEffect } from 'react';
import { RefreshCcw, FileText, Calculator, ShieldCheck, PieChart, Landmark, Hammer } from 'lucide-react';
import AgreementManager from '../reimbursables/AgreementManager';
import CostEstimator from '../reimbursables/CostEstimator';
import ProjectOrderManager from '../reimbursables/ProjectOrderManager';
import { reimbursableService } from '../../services/ReimbursableDataService';
import { formatCurrency } from '../../utils/formatting';
import { AgencyContext, ReimbursableAgreement, ReimbursableOrder, ProjectOrder } from '../../types';

interface ReimbursablesViewProps {
    agency?: AgencyContext;
    onSelectProject?: (projectId: string) => void;
}

const ReimbursablesView: React.FC<ReimbursablesViewProps> = ({ agency, onSelectProject }) => {
    const [activeTab, setActiveTab] = useState<'agreements' | 'estimator' | 'projectOrders'>(
        agency === 'USACE_CEFMS' ? 'projectOrders' : 'agreements'
    );

    // Live State from Service
    const [agreements, setAgreements] = useState<ReimbursableAgreement[]>(reimbursableService.getAgreements());
    const [orders, setOrders] = useState<ReimbursableOrder[]>(reimbursableService.getOrders());
    const [projectOrders, setProjectOrders] = useState<ProjectOrder[]>(reimbursableService.getProjectOrders());

    useEffect(() => {
        const unsubscribe = reimbursableService.subscribe(() => {
            setAgreements([...reimbursableService.getAgreements()]);
            setOrders([...reimbursableService.getOrders()]);
            setProjectOrders([...reimbursableService.getProjectOrders()]);
        });
        return unsubscribe;
    }, []);

    const totalAuthority = agreements.reduce((s, a) => s + a.estimatedTotalValue, 0);
    
    // Aggregation Logic
    const totalStandardObligated = orders.reduce((s, o) => s + o.amount, 0);
    const totalProjectOrdersObligated = projectOrders
        .filter(po => ['Accepted', 'Work In Progress', 'Completed'].includes(po.status))
        .reduce((s, po) => s + po.totalAmount, 0);
        
    const totalObligated = totalStandardObligated + totalProjectOrdersObligated;

    const isOsd = agency === 'OSD_BRAC';

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <RefreshCcw size={24} className={isOsd ? "text-indigo-700" : "text-zinc-400"} /> 
                        {isOsd ? 'Office of Economic Adjustment' : 'Reimbursable Operations'}
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">
                        {isOsd ? 'Community Grants • Property Transfers • Public Benefit Conveyance' : 'DoD FMR Vol 11A Compliance • Order-to-Cash Lifecycle'}
                    </p>
                </div>
                <div className="w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 custom-scrollbar">
                    <div className="flex bg-zinc-100 p-1 rounded-lg min-w-max">
                        <button 
                            onClick={() => setActiveTab('agreements')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'agreements' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                        >
                            <FileText size={14} /> Agreements
                        </button>
                        <button 
                            onClick={() => setActiveTab('estimator')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'estimator' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                        >
                            <Calculator size={14} /> Cost Estimator
                        </button>
                        <button 
                            onClick={() => setActiveTab('projectOrders')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'projectOrders' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                        >
                            <Hammer size={14} /> Project Orders (41 USC 6307)
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Landmark size={20}/></div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Agreements Value</p>
                        <p className="text-xl font-mono font-bold text-zinc-900">{formatCurrency(totalAuthority)}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><PieChart size={20}/></div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Orders Accepted (All Types)</p>
                        <p className="text-xl font-mono font-bold text-zinc-900">{formatCurrency(totalObligated)}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><RefreshCcw size={20}/></div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Reimbursement Ratio</p>
                        <p className="text-xl font-mono font-bold text-zinc-900">{totalAuthority > 0 ? ((totalObligated / totalAuthority) * 100).toFixed(1) : 0}%</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 pb-2">
                {activeTab === 'agreements' && (
                    <AgreementManager 
                        agreements={agreements} 
                        orders={orders} 
                        projectOrders={projectOrders}
                        onCreateAgreement={(a) => reimbursableService.addAgreement(a)}
                        onCreateOrder={(o) => reimbursableService.addOrder(o)}
                    />
                )}
                {activeTab === 'estimator' && (
                    <CostEstimator />
                )}
                {activeTab === 'projectOrders' && (
                    <ProjectOrderManager 
                        projectOrders={projectOrders}
                        onSelectProject={onSelectProject} 
                    />
                )}
            </div>
        </div>
    );
};

export default ReimbursablesView;
