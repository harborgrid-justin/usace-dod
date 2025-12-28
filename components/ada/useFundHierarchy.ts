
import { useState, useEffect } from 'react';
import { FundControlNode, FundControlLevel } from '../../types';
import { fundsService } from '../../services/FundsDataService';

type RiskLevel = 'Low' | 'Warning' | 'Critical';

export const useFundHierarchy = () => {
    const [hierarchy, setHierarchy] = useState<FundControlNode[]>(fundsService.getHierarchy());
    const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({'OMB-CW-24': true, 'USACE-HQ-CW-24': true, 'LRL-DISTRICT-24': true, 'SAJ-DISTRICT-24': true, 'DOD-ROOT': true, 'ARMY-ROOT': true});

    useEffect(() => {
        const unsubscribe = fundsService.subscribe(() => {
            setHierarchy([...fundsService.getHierarchy()]);
        });
        return unsubscribe;
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const calculateRisk = (node: FundControlNode): RiskLevel => {
        // 31 USC 1517 Checks (Administrative Control)
        if (node.amountDistributed > node.totalAuthority) return 'Critical'; // Distributed more than held
        if (node.amountCommitted > node.totalAuthority) return 'Critical'; // Committed more than held
        if (node.amountObligated > node.totalAuthority) return 'Critical'; // Obligated more than held (31 USC 1341)
        if (node.amountExpended > node.amountObligated) return 'Critical'; // Expended more than obligated
        
        // Burn rate check
        const consumption = Math.max(node.amountDistributed, node.amountCommitted, node.amountObligated, node.amountExpended);
        if (node.totalAuthority > 0 && (consumption / node.totalAuthority > 0.95)) return 'Warning';
        
        return 'Low';
    };

    const determineNextLevel = (currentLevel: FundControlLevel): FundControlLevel | null => {
        const nextLevelMap: Record<FundControlLevel, FundControlLevel | null> = {
            'Apportionment': 'Allotment',
            'Allotment': 'Allocation',
            'Allocation': 'Suballocation',
            'Suballocation': null,
            'Suballotment': 'Allocation'
        };
        return nextLevelMap[currentLevel];
    };

    const saveNode = (savedNode: FundControlNode) => {
        fundsService.updateHierarchyNode(savedNode);
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
