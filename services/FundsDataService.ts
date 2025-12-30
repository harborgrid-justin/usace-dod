import { Appropriation, FundControlNode, Distribution, TransferAction } from '../types';
import { MOCK_APPROPRIATIONS, COMMAND_HIERARCHY, MOCK_TRANSFERS } from '../constants';

class FundsDataService {
    private appropriations: Appropriation[] = JSON.parse(JSON.stringify(MOCK_APPROPRIATIONS));
    private fundHierarchy: FundControlNode[] = [JSON.parse(JSON.stringify(COMMAND_HIERARCHY))];
    private transfers: TransferAction[] = JSON.parse(JSON.stringify(MOCK_TRANSFERS));
    private listeners = new Set<Function>();

    getAppropriations = () => this.appropriations;
    getHierarchy = () => this.fundHierarchy;
    getTransfers = () => this.transfers;

    addDistribution = (appropriationId: string, distribution: Distribution) => {
        this.appropriations = this.appropriations.map(a => 
            a.id === appropriationId ? { ...a, distributions: [...a.distributions, distribution] } : a
        );
        this.updateHierarchyFromDistribution(distribution);
        this.notify();
    }

    updateHierarchyNode = (updatedNode: FundControlNode) => {
        const updateRecursive = (nodes: FundControlNode[]): FundControlNode[] => {
            return nodes.map(node => {
                if (node.id === updatedNode.id) return updatedNode;
                if (node.children) return { ...node, children: updateRecursive(node.children) };
                return node;
            });
        };
        this.fundHierarchy = updateRecursive(this.fundHierarchy);
        this.notify();
    }

    addTransfer = (transfer: TransferAction) => {
        this.transfers = [transfer, ...this.transfers];
        this.notify();
    }

    private updateHierarchyFromDistribution = (dist: Distribution) => {
        const traverseAndUpdate = (nodes: FundControlNode[]): FundControlNode[] => {
            return nodes.map(node => {
                if (node.name.includes(dist.toUnit) || node.id === dist.toUnit) {
                    return {
                        ...node,
                        totalAuthority: node.totalAuthority + dist.amount,
                        amountDistributed: node.amountDistributed + dist.amount
                    };
                }
                if (node.children) return { ...node, children: traverseAndUpdate(node.children) };
                return node;
            });
        };
        this.fundHierarchy = traverseAndUpdate(this.fundHierarchy);
    }

    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    private notify = () => this.listeners.forEach(l => l());
}

export const fundsService = new FundsDataService();