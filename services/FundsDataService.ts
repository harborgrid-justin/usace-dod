
import { Appropriation, FundControlNode, Distribution, TransferAction, FundControlLevel } from '../types';
import { MOCK_APPROPRIATIONS, COMMAND_HIERARCHY, MOCK_TRANSFERS } from '../constants';

/**
 * FundsDataService
 * Acts as the authoritative "Backend" for the application during the session.
 * Manages the double-entry logic between Appropriations (Source) and Funds Control (Target).
 */
class FundsDataService {
    private appropriations: Appropriation[];
    private fundHierarchy: FundControlNode[];
    private transfers: TransferAction[];
    private listeners: Function[] = [];

    constructor() {
        // Initialize with baseline data, but allow for mutation during session
        this.appropriations = JSON.parse(JSON.stringify(MOCK_APPROPRIATIONS));
        this.fundHierarchy = [JSON.parse(JSON.stringify(COMMAND_HIERARCHY))];
        this.transfers = JSON.parse(JSON.stringify(MOCK_TRANSFERS));
    }

    // --- Data Access ---
    getAppropriations(): Appropriation[] {
        return this.appropriations;
    }

    getHierarchy(): FundControlNode[] {
        return this.fundHierarchy;
    }

    getTransfers(): TransferAction[] {
        return this.transfers;
    }

    // --- Mutations ---

    addDistribution(appropriationId: string, distribution: Distribution) {
        const appropIndex = this.appropriations.findIndex(a => a.id === appropriationId);
        if (appropIndex === -1) throw new Error("Appropriation not found");

        // 1. Record Distribution in Appropriation Ledger
        this.appropriations[appropIndex].distributions.push(distribution);

        // 2. Update Funds Control Hierarchy (Integration Point)
        // Find the target node matching the recipient or create it if it doesn't exist
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
        this.transfers.push(transfer);
        this.notifyListeners();
    }

    // --- Logic ---

    private updateHierarchyFromDistribution(dist: Distribution) {
        // Logic: Find a node in the hierarchy that matches the distribution recipient
        // If found, increase its Distributed Authority.
        // For this platform, we map 'toUnit' to Node Names or IDs.
        
        let targetFound = false;

        const traverseAndUpdate = (nodes: FundControlNode[]): FundControlNode[] => {
            return nodes.map(node => {
                // Fuzzy match for demo resilience
                if (node.name.includes(dist.toUnit) || node.id === dist.toUnit) {
                    targetFound = true;
                    return {
                        ...node,
                        totalAuthority: node.totalAuthority + dist.amount,
                        amountDistributed: node.amountDistributed + dist.amount // Assuming immediate pass-through or holding
                    };
                }
                if (node.children) {
                    return { ...node, children: traverseAndUpdate(node.children) };
                }
                return node;
            });
        };

        this.fundHierarchy = traverseAndUpdate(this.fundHierarchy);

        if (!targetFound) {
            console.warn(`[FundsDataService] Warning: Distribution target '${dist.toUnit}' not found in hierarchy. Funds moved to suspense.`);
        }
    }

    // --- Subscription Pattern for Reactivity ---
    subscribe(listener: Function) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l());
    }
}

export const fundsService = new FundsDataService();
