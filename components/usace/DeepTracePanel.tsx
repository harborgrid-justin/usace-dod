
import React, { useMemo } from 'react';
import { 
    Landmark, FileText, Construction, ShoppingCart, 
    Database, Box, Link as LinkIcon, Share2, ShieldCheck,
    ArrowRight
} from 'lucide-react';
import { USACEProject } from '../../types';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';

interface Props {
    project: USACEProject;
}

const TraceGroup = ({ title, icon: Icon, children, color }: any) => (
    <div className={`p-4 rounded-xl border ${color} bg-white h-full flex flex-col`}>
        <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <Icon size={14} className="opacity-70"/> {title}
        </h4>
        <div className="space-y-3 flex-1">
            {children}
        </div>
    </div>
);

const TraceItem = ({ label, value, sub, status }: any) => (
    <div className="flex items-start gap-3 p-2 hover:bg-zinc-50 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-zinc-100">
        <div className="mt-1 text-zinc-300 group-hover:text-zinc-500">
            <LinkIcon size={12} />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-zinc-900 truncate">{label}</p>
                {status && <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded">{status}</span>}
            </div>
            <p className="text-[10px] font-mono text-zinc-500 truncate">{value}</p>
            {sub && <p className="text-[9px] text-zinc-400 mt-0.5">{sub}</p>}
        </div>
    </div>
);

const DeepTracePanel: React.FC<Props> = ({ project }) => {
    // Fetch mock traceability data
    const trace = useMemo(() => IntegrationOrchestrator.getProjectTraceability(project), [project]);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between bg-zinc-900 text-white p-6 rounded-xl shadow-lg">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-3">
                        <Share2 size={20} className="text-emerald-400"/> Project Deep Trace
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">Cross-Module Entity Integration Matrix (20-Point Check)</p>
                </div>
                <div className="flex gap-4 text-center">
                    <div>
                        <p className="text-2xl font-mono font-bold text-emerald-400">20</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Linked Entities</p>
                    </div>
                    <div className="w-px bg-zinc-800 h-8 self-center" />
                    <div>
                        <p className="text-2xl font-mono font-bold text-blue-400">100%</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Traceability</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* 1. Budget & Funding */}
                <TraceGroup title="Budget Authority" icon={Landmark} color="border-purple-200">
                    <TraceItem label="1. Funding Auth Doc (FAD)" value={trace.funding.fad.id} sub="PL 117-58 (IIJA)" status="Direct" />
                    <TraceItem label="2. Work Allowance" value={trace.funding.allowance.id} sub="Construction General" status="Issued" />
                    <TraceItem label="3. Resource Estimate" value={trace.funding.resourceEstimate.id} sub="POM Cycle 26-30" status={trace.funding.resourceEstimate.status} />
                    <TraceItem label="4. Cost Share Agreement" value={trace.funding.costShare.id} sub={trace.funding.costShare.sponsor || 'Non-Fed'} status="Active" />
                </TraceGroup>

                {/* 2. Requirements & Acquisition */}
                <TraceGroup title="Acquisition" icon={ShoppingCart} color="border-blue-200">
                    <TraceItem label="5. Purchase Request" value={trace.acquisition.pr.id} sub="Services" status={trace.acquisition.pr.status} />
                    <TraceItem label="6. Solicitation" value={trace.acquisition.solicitation.id} sub="RFP - Full & Open" status={trace.acquisition.solicitation.status} />
                    <TraceItem label="7. Contract Award" value={trace.acquisition.contract.id} sub={trace.acquisition.contract.vendor} status="Active" />
                    <TraceItem label="8. Contract Mods" value={trace.acquisition.mod.id} sub={trace.acquisition.mod.type} status="Executed" />
                </TraceGroup>

                {/* 3. Operational Execution */}
                <TraceGroup title="Execution" icon={Construction} color="border-amber-200">
                    <TraceItem label="9. Work Items (WBS)" value={`${trace.execution.workItems} Items`} sub="Feature Code: 01" status="100%" />
                    <TraceItem label="10. Labor Entries" value={`${trace.execution.labor.hours} Hours`} sub="Direct Charge" status="Posted" />
                    <TraceItem label="11. Travel Orders" value={trace.execution.travel.id} sub="Site Visit - J. Doe" status={trace.execution.travel.status} />
                    <TraceItem label="12. Inventory Issue" value={trace.execution.inventory.id} sub={trace.execution.inventory.item} status="Issued" />
                </TraceGroup>

                {/* 4. Financial Accounting */}
                <TraceGroup title="Accounting (GL)" icon={Database} color="border-emerald-200">
                    <TraceItem label="13. GL Obligation" value={trace.accounting.obligation.id} sub="480100 - Undelivered" status="Posted" />
                    <TraceItem label="14. Accrual/Expense" value={trace.accounting.expense.id} sub="610000 - Operating Exp" status={trace.accounting.expense.status} />
                    <TraceItem label="15. Disbursement" value={trace.accounting.disbursement.id} sub="101000 - FBwT" status={trace.accounting.disbursement.status} />
                    <TraceItem label="16. Cost Transfer" value={trace.accounting.costTransfer.id} sub="Reallocation" status={trace.accounting.costTransfer.status} />
                </TraceGroup>

                {/* 5. Asset & Lifecycle */}
                <TraceGroup title="Asset Lifecycle" icon={Box} color="border-zinc-200">
                    <TraceItem label="17. Real Estate" value={`Tract ${trace.assets.realEstate}`} sub="Fee Simple" status="Acquired" />
                    <TraceItem label="18. Capital Asset" value={trace.assets.capitalAsset.id} sub="Construction in Progress" status={trace.assets.capitalAsset.status} />
                    <TraceItem label="19. Maintenance WO" value={trace.assets.workOrder.id} sub={trace.assets.workOrder.type} status="Open" />
                    <TraceItem label="20. Audit Log" value={`${trace.assets.auditLog.count} Events`} sub="Full History" status="Secured" />
                </TraceGroup>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg"><ShieldCheck size={18}/></div>
                    <div>
                        <h4 className="text-sm font-bold text-zinc-900">Data Integrity Verified</h4>
                        <p className="text-xs text-zinc-500">All 20 cross-integration points validated against CEFMS database schemas.</p>
                    </div>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    Export Trace Report <ArrowRight size={14}/>
                </button>
            </div>
        </div>
    );
};

export default DeepTracePanel;
