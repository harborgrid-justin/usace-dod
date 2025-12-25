
import { useState } from 'react';
import { FundControlNode, FundControlLevel } from '../../types';
import { MOCK_FUND_HIERARCHY } from '../../constants';

type RiskLevel = 'Low' | 'Warning' | 'Critical';

export const useFundHierarchy = () => {
    const [hierarchy, setHierarchy] = useState<FundControlNode[]>(MOCK_FUND_HIERARCHY);
    const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({'OMB-CW-24': true, 'USACE-HQ-CW-24': true, 'LRL-DISTRICT-24': true, 'SAJ-DISTRICT-24': true});

    const toggleExpand = (id: string) => {
        setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const calculateRisk = (node: FundControlNode): RiskLevel => {
        // 31 USC 1517 Checks (Administrative Control)
        if (node.amountDistributed > node.totalAuthority) return 'Critical'; // Distributed more than held
        if (node.amountCommitted > node.totalAuthority) return 'Critical'; // Committed more than held
        if (node.amountObligated > node.totalAuthority) return 'Critical'; // Obligated more than held (31 USC 1341)
        if (node.amountExpended > node.amountObligated) return 'Critical'; // Expended more than obligated
        
        const consumption = Math.max(node.amountDistributed, node.amountCommitted, node.amountObligated, node.amountExpended);
        if (node.totalAuthority > 0 && (consumption / node.totalAuthority > 0.9)) return 'Warning';
        
        return 'Low';
    };

    const determineNextLevel = (currentLevel: FundControlLevel): FundControlLevel | null => {
        const nextLevelMap: Record<FundControlLevel, FundControlLevel | null> = {
            'Apportionment': 'Allotment',
            'Allotment': 'Allocation',
            'Allocation': 'Suballocation',
            'Suballocation': null,
            // Fallback for older types
            'Suballotment': 'Allocation'
        };
        return nextLevelMap[currentLevel];
    };

    const saveNode = (savedNode: FundControlNode) => {
        const updateRecursive = (nodes: FundControlNode[]): FundControlNode[] => {
            return nodes.map(node => {
                // Is this the node to edit?
                if (node.id === savedNode.id) {
                    return savedNode; // The savedNode from modal has everything needed.
                }

                // Is this the parent for a new node?
                if (node.id === savedNode.parentId && !node.children?.find(c => c.id === savedNode.id)) {
                    return {
                        ...node,
                        amountDistributed: node.amountDistributed + savedNode.totalAuthority,
                        children: [...(node.children || []), savedNode]
                    };
                }

                // Recurse into children
                if (node.children) {
                    const originalChildren = node.children;
                    const updatedChildren = updateRecursive(node.children);

                    // If children array changed, we need to check if a child's authority was updated
                    // and adjust this parent's distributed amount.
                    if (originalChildren !== updatedChildren) {
                        // Find the child that was edited (not added/removed)
                        const editedChildNew = updatedChildren.find(uc => 
                            originalChildren.some(oc => oc.id === uc.id && oc.totalAuthority !== uc.totalAuthority)
                        );
                        
                        if (editedChildNew) {
                            const editedChildOld = originalChildren.find(oc => oc.id === editedChildNew.id)!;
                            const difference = editedChildNew.totalAuthority - editedChildOld.totalAuthority;
                            return {
                                ...node,
                                children: updatedChildren,
                                amountDistributed: node.amountDistributed + difference
                            };
                        }
                        
                        // It was an addition (handled at the parent level) or a deeper nested edit.
                        return { ...node, children: updatedChildren };
                    }
                }

                return node;
            });
        };

        setHierarchy(prev => {
            // Handle case for adding a new root node
            if (!savedNode.parentId && !prev.find(n => n.id === savedNode.id)) {
                return [...prev, savedNode];
            }
            return updateRecursive(prev);
        });
    };

    return {
        hierarchy,
        expandedNodes,
        toggleExpand,
        calculateRisk,
        saveNode,
        determineNextLevel
    };
};
