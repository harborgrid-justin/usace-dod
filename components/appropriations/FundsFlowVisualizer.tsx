
import React from 'react';
import { FundControlNode } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { ArrowRight, Landmark, Building2, Users } from 'lucide-react';

interface Props {
    hierarchy: FundControlNode[];
}

const FlowNode = ({ node, level }: { node: FundControlNode; level: number }) => {
    const isRoot = level === 0;
    const widthPercent = Math.max(20, (node.totalAuthority / (node.parentId ? 100000000000 : node.totalAuthority)) * 100);
    
    return (
        <div className="flex items-center mb-4 last:mb-0 animate-in slide-in-from-left-2" style={{ marginLeft: `${level * 2}rem` }}>
            <div className={`
                flex flex-col p-3 rounded-xl border shadow-sm min-w-[200px] bg-white relative z-10
                ${isRoot ? 'border-zinc-800' : 'border-zinc-200'}
            `}>
                <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg ${isRoot ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                        {isRoot ? <Landmark size={14}/> : level === 1 ? <Building2 size={14}/> : <Users size={14}/>}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{node.level}</p>
                        <p className="text-xs font-bold text-zinc-900">{node.name}</p>
                    </div>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-emerald-500" style={{ width: `${(node.amountObligated / node.totalAuthority) * 100}%` }} />
                </div>
                <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-500">Auth: {formatCurrency(node.totalAuthority)}</span>
                    <span className="font-bold text-emerald-600">{((node.amountObligated / node.totalAuthority) * 100).toFixed(0)}% Obs</span>
                </div>
            </div>
            
            {/* Visual Flow Connector */}
            {node.children && node.children.length > 0 && (
                <div className="ml-4 text-zinc-300">
                    <ArrowRight size={20} />
                </div>
            )}
        </div>
    );
};

const renderTree = (nodes: FundControlNode[], level: number): React.ReactNode => {
    return nodes.map(node => (
        <div key={node.id}>
            <FlowNode node={node} level={level} />
            {node.children && (
                <div className="relative">
                    {/* Vertical Flow Line */}
                    <div className="absolute left-[8.5rem] top-0 bottom-6 w-px bg-zinc-200 -z-0" style={{ marginLeft: `${level * 2}rem` }} />
                    {renderTree(node.children, level + 1)}
                </div>
            )}
        </div>
    ));
};

const FundsFlowVisualizer: React.FC<Props> = ({ hierarchy }) => {
    return (
        <div className="bg-zinc-50/50 p-8 rounded-xl border border-zinc-200 overflow-x-auto custom-scrollbar">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                <Landmark size={16} className="text-rose-700"/> Funding Stream Visualization
            </h3>
            <div className="min-w-max">
                {renderTree(hierarchy, 0)}
            </div>
        </div>
    );
};

export default FundsFlowVisualizer;
