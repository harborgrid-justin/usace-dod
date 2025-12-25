
import React, { useState } from 'react';
import { ChevronRight, Plus, Edit, AlertTriangle, ShieldCheck, History } from 'lucide-react';
import { FundControlNode } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import FundNodeModal from './FundNodeModal';
import AEAHistoryModal from './AEAHistoryModal';
import { useFundHierarchy } from './useFundHierarchy';

const FundNodeRow = ({ 
    node, 
    level, 
    risk, 
    canAddChild, 
    onEdit, 
    onAddChild,
    onHistory
}: {
    node: FundControlNode;
    level: number;
    risk: 'Low' | 'Warning' | 'Critical';
    canAddChild: boolean;
    onEdit: () => void;
    onAddChild: () => void;
    onHistory: () => void;
}) => {
    const availableBalance = node.totalAuthority - node.amountObligated;
    const obligationPercent = (node.amountObligated / node.totalAuthority) * 100;

    const riskStyles = {
        'Low': 'border-zinc-200 bg-white',
        'Warning': 'border-amber-300 bg-amber-50/50',
        'Critical': 'border-rose-300 bg-rose-50/50',
    };

    return (
        <div 
            className={`flex items-stretch border rounded-xl shadow-sm transition-all hover:shadow-md ${riskStyles[risk]}`}
            style={{ marginLeft: `${level * 1.5}rem` }}
        >
            {/* Left Section: Info & Hierarchy */}
            <div className="p-4 border-r border-zinc-100 flex-grow">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <span className="text-xs font-bold text-zinc-900">{node.name}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-mono bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-200">{node.level}</span>
                           {risk === 'Critical' && <span className="text-[9px] font-bold uppercase bg-rose-500 text-white px-1.5 py-0.5 rounded">ADA Alert</span>}
                           {risk === 'Warning' && <span className="text-[9px] font-bold uppercase bg-amber-500 text-white px-1.5 py-0.5 rounded">High Use</span>}
                        </div>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            <span>Obligation</span>
                            <span>{obligationPercent.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden mt-1">
                            <div className={`h-full rounded-full ${risk === 'Critical' ? 'bg-rose-500' : 'bg-zinc-800'}`} style={{ width: `${obligationPercent}%` }} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Authority:</span>
                            <span className="font-mono font-semibold">{formatCurrency(node.totalAuthority)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-zinc-500">Available:</span>
                            <span className={`font-mono font-bold ${availableBalance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{formatCurrency(availableBalance)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Right Section: Execution Breakdown */}
            <div className="w-64 p-4 shrink-0 grid grid-rows-4 gap-2">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium">Committed</span>
                    <span className="font-mono font-semibold">{formatCurrency(node.amountCommitted)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium">Obligated</span>
                    <span className="font-mono font-semibold">{formatCurrency(node.amountObligated)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium">Expended</span>
                    <span className="font-mono font-semibold">{formatCurrency(node.amountExpended)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium">Distributed</span>
                    <span className="font-mono font-semibold">{formatCurrency(node.amountDistributed)}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col border-l border-zinc-100">
                {canAddChild && <button onClick={onAddChild} className="flex-1 px-3 text-zinc-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Plus size={16}/></button>}
                <button onClick={onEdit} className="flex-1 px-3 text-zinc-400 hover:bg-amber-50 hover:text-amber-700 transition-colors"><Edit size={16}/></button>
                <button onClick={onHistory} className="flex-1 px-3 text-zinc-400 hover:bg-purple-50 hover:text-purple-700 transition-colors"><History size={16}/></button>
            </div>
        </div>
    );
};

const FundControlTree: React.FC = () => {
  const { hierarchy, expandedNodes, toggleExpand, calculateRisk, saveNode, determineNextLevel } = useFundHierarchy();
  
  const [editingNode, setEditingNode] = useState<FundControlNode | null>(null);
  const [addingChildTo, setAddingChildTo] = useState<FundControlNode | null>(null);
  const [historyNode, setHistoryNode] = useState<FundControlNode | null>(null);

  const handleSave = (node: FundControlNode) => {
      saveNode(node);
      setEditingNode(null);
      setAddingChildTo(null);
  };

  const renderRecursive = (node: FundControlNode, level: number) => {
      const isExpanded = expandedNodes[node.id];
      const hasChildren = node.children && node.children.length > 0;
      
      return (
          <div key={node.id} className="relative">
              {/* Vertical Connector */}
              {level > 0 && <div className="absolute top-0 -left-5 h-full w-px bg-zinc-200" />}
              {/* Horizontal Connector */}
              <div className="absolute top-1/2 -left-5 w-5 h-px bg-zinc-200" />
              
              <div className="flex items-start gap-3">
                  <button 
                      onClick={() => toggleExpand(node.id)} 
                      className={`mt-10 p-1 text-zinc-400 hover:text-zinc-600 ${!hasChildren ? 'invisible' : ''}`}
                  >
                      {isExpanded ? <div className="w-4 h-4" /> : <ChevronRight size={16} />}
                  </button>
                  <div className="flex-1">
                      <FundNodeRow 
                          node={node}
                          level={0} // Indentation is handled by margin instead
                          risk={calculateRisk(node)}
                          canAddChild={determineNextLevel(node.level) !== null}
                          onEdit={() => setEditingNode(node)}
                          onAddChild={() => setAddingChildTo(node)}
                          onHistory={() => setHistoryNode(node)}
                      />
                  </div>
              </div>
              {isExpanded && hasChildren && (
                  <div className="mt-4 space-y-4 pl-8">
                      {node.children.map(child => renderRecursive(child, level + 1))}
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="flex flex-col h-full">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Appropriation Expenditure Authority (AEA) Hierarchy</h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
            {hierarchy.map(node => renderRecursive(node, 0))}
        </div>
        
        {(editingNode || addingChildTo) && (
            <FundNodeModal 
                node={editingNode} 
                parentNode={addingChildTo}
                onClose={() => { setEditingNode(null); setAddingChildTo(null); }}
                onSave={handleSave}
            />
        )}
        {historyNode && <AEAHistoryModal node={historyNode} onClose={() => setHistoryNode(null)} />}
    </div>
  );
};

export default FundControlTree;
