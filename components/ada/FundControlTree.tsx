import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { FundControlNode } from '../../types';
import { useFundHierarchy } from './useFundHierarchy';
import FundNodeRow from './FundNodeRow';
import FundNodeModal from './FundNodeModal';

const FundControlTree: React.FC = () => {
  const { hierarchy, expandedNodes, toggleExpand, calculateRisk, saveNode, determineNextLevel } = useFundHierarchy();
  const [viewState, setViewState] = useState<'TREE' | 'EDIT'>('TREE');
  const [editingNode, setEditingNode] = useState<FundControlNode | null>(null);
  const [addingChildTo, setAddingChildTo] = useState<FundControlNode | null>(null);

  const renderRecursive = (node: FundControlNode, level: number) => {
      const isExpanded = expandedNodes[node.id];
      const hasChildren = node.children && node.children.length > 0;
      return (
          <div key={node.id} className="relative space-y-4">
              <div className="flex items-start gap-3" style={{ marginLeft: `${level * 2}rem` }}>
                  <button onClick={() => toggleExpand(node.id)} className={`mt-10 p-1 text-zinc-400 ${!hasChildren ? 'invisible' : ''}`}>
                      {!isExpanded ? <ChevronRight size={16} /> : <div className="w-4" />}
                  </button>
                  <div className="flex-1">
                      <FundNodeRow 
                          node={node} risk={calculateRisk(node)} canAddChild={determineNextLevel(node.level) !== null}
                          onEdit={() => { setEditingNode(node); setViewState('EDIT'); }}
                          onAddChild={() => { setAddingChildTo(node); setViewState('EDIT'); }}
                          onHistory={() => {}}
                      />
                  </div>
              </div>
              {isExpanded && hasChildren && node.children.map(child => renderRecursive(child, level + 1))}
          </div>
      );
  };

  if (viewState === 'EDIT') {
      return <FundNodeModal node={editingNode} parentNode={addingChildTo} onClose={() => setViewState('TREE')} onSave={(n) => { saveNode(n); setViewState('TREE'); }} />;
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
        {hierarchy.map(node => renderRecursive(node, 0))}
    </div>
  );
};
export default FundControlTree;