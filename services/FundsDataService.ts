import { Appropriation, FundControlNode, Distribution, TransferAction } from '../types';
import { MOCK_APPROPRIATIONS, COMMAND_HIERARCHY, MOCK_TRANSFERS } from '../constants';

class FundsDataService {
    private appropriations: Appropriation[] = JSON.parse(JSON.stringify(MOCK_APPROPRIATIONS));
    private fundHierarchy: FundControlNode[] = [JSON.parse(JSON.stringify(COMMAND_HIERARCHY))];
    private transfers: TransferAction[] = JSON.parse(JSON.stringify(MOCK_TRANSFERS));
    private listeners: Set<Function> = new Set();

    getAppropriations(): Appropriation[] { return this.appropriations; }
    getHierarchy(): FundControlNode[] { return this.fundHierarchy; }
    getTransfers(): TransferAction[] { return this.transfers; }

    addDistribution(appropriationId: string, distribution: Distribution) {
        this.appropriations = this.appropriations.map(a => 
            a.id === appropriationId ? { ...a, distributions: [...a.distributions, distribution] } : a
        );
        this.updateHierarchyFromDistribution(distribution);
        this.notifyListeners();
    }

    updateHierarchyNode(updatedNode: FundControlNode) {
        const updateRecursive = (nodes: FundControlNode[]): FundControlNode[] => {
            return nodes.map(node => {
                if (node.id === updatedNode.id) return updatedNode;
                if (node.children) {
                    return { ...node, children: updateRecursive(node.children) };
                }
                return node;
            });
        };
        this.fundHierarchy = updateRecursive(this.fundHierarchy);
        this.notifyListeners();
    }

    addTransfer(transfer: TransferAction) {
        this.transfers = [transfer, ...this.transfers];
        this.notifyListeners();
    }

    private updateHierarchyFromDistribution(dist: Distribution) {
        const traverseAndUpdate = (nodes: FundControlNode[]): FundControlNode[] => {
            return nodes.map(node => {
                if (node.name.includes(dist.toUnit) || node.id === dist.toUnit) {
                    return {
                        ...node,
                        totalAuthority: node.totalAuthority + dist.amount,
                        amountDistributed: node.amountDistributed + dist.amount
                    };
                }
                if (node.children) {
                    return { ...node, children: traverseAndUpdate(node.children) };
                }
                return node;
            });
        };
        this.fundHierarchy = traverseAndUpdate(this.fundHierarchy);
    }

    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l());
    }
}

export const fundsService = new FundsDataService();