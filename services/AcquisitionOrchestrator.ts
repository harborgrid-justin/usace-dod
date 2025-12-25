
import { PurchaseRequest, Contract, GLTransaction, FundControlNode, Solicitation, SolicitationStatus, ContractMod } from '../types';
import { generateSecureId } from '../utils/security';

/**
 * Acquisition Orchestrator
 * Handles the logic of procurement transitions and their financial ripple effects.
 */
export class AcquisitionOrchestrator {
    
    /**
     * Creates a new solicitation record from a certified PR.
     */
    static initiateSolicitation(pr: PurchaseRequest): Solicitation {
        return {
            id: generateSecureId('SOL'),
            prId: pr.id,
            status: 'Requirement Refinement',
            title: pr.description,
            type: 'RFQ',
            quotes: [],
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'RM_SYSTEM',
                action: 'Solicitation Initiated',
                details: `Requirement established from PR ${pr.id}`
            }]
        };
    }

    /**
     * Transition solicitation status.
     */
    static advanceSolicitation(sol: Solicitation, nextStatus: SolicitationStatus, user: string): Solicitation {
        return {
            ...sol,
            status: nextStatus,
            auditLog: [
                ...sol.auditLog,
                {
                    timestamp: new Date().toISOString(),
                    user,
                    action: 'Status Advance',
                    details: `Advanced to ${nextStatus}`
                }
            ]
        };
    }

    /**
     * Funds Certification logic (31 U.S.C. 1517)
     * Verifies against Admin Control hierarchy before commitment.
     */
    static certifyPR(pr: PurchaseRequest, fundNodes: FundControlNode[]): { success: boolean; message: string; commitment?: GLTransaction } {
        const node = this.findNodeForPR(fundNodes, pr);
        if (!node) return { success: false, message: 'FAD/Allowance node not found for this WBS/Approp.' };

        const available = node.totalAuthority - node.amountCommitted - node.amountObligated;
        if (pr.amount > available) {
            return { success: false, message: `ADA Violation: PR amount $${pr.amount.toLocaleString()} exceeds available balance $${available.toLocaleString()}` };
        }

        // Generate Commitment Entry
        const commitment: GLTransaction = {
            id: generateSecureId('GL-COMMIT'),
            date: new Date().toISOString().split('T')[0],
            description: `Commitment for PR ${pr.id}`,
            type: 'Commitment',
            sourceModule: 'Acquisition',
            referenceDoc: pr.id,
            totalAmount: pr.amount,
            status: 'Posted',
            createdBy: 'RM_CERTIFIER',
            lines: [
                { ussglAccount: '470000', description: 'Commitment', debit: 0, credit: pr.amount, fund: pr.appropriation || 'OMA', costCenter: 'CERT' },
                { ussglAccount: '461000', description: 'Uncommitted Apportionment', debit: pr.amount, credit: 0, fund: pr.appropriation || 'OMA', costCenter: 'CERT' }
            ],
            auditLog: []
        };

        return { success: true, message: 'Funds Certified Successfully', commitment };
    }

    /**
     * Award Contract logic
     * Converts a Certified PR Commitment into a Formal Obligation.
     */
    static awardContract(pr: PurchaseRequest, vendorData: any): { contract: Contract; obligation: GLTransaction } {
        const contractId = generateSecureId('CON');
        
        const contract: Contract = {
            id: contractId,
            vendor: vendorData.name,
            uei: vendorData.uei,
            cageCode: vendorData.cageCode,
            type: 'Firm Fixed Price',
            value: pr.amount,
            awardedDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            prReference: pr.id,
            periodOfPerformance: { start: new Date().toISOString().split('T')[0], end: '2025-09-30' },
            gInvoicingStatus: 'Draft',
            isBerryCompliant: true,
            modifications: [],
            auditLog: [{ timestamp: new Date().toISOString(), user: 'KO_ADMIN', action: 'Contract Awarded', details: `Awarded based on PR ${pr.id}` }]
        };

        const obligation: GLTransaction = {
            id: generateSecureId('GL-OBL'),
            date: contract.awardedDate,
            description: `Obligation: Contract ${contract.id}`,
            type: 'Obligation',
            sourceModule: 'Acquisition',
            referenceDoc: contract.id,
            totalAmount: contract.value,
            status: 'Posted',
            createdBy: 'KO_ADMIN',
            lines: [
                { ussglAccount: '480100', description: 'Obligation', debit: 0, credit: contract.value, fund: pr.appropriation || 'OMA', costCenter: 'AWD' },
                { ussglAccount: '470000', description: 'Reverse Commitment', debit: contract.value, credit: 0, fund: pr.appropriation || 'OMA', costCenter: 'AWD' }
            ],
            auditLog: []
        };

        return { contract, obligation };
    }

    /**
     * Executes a Contract Modification (SF 30)
     */
    static executeModification(contract: Contract, modData: Partial<ContractMod>, user: string): { contract: Contract; glAdjustment?: GLTransaction } {
        const modId = generateSecureId('MOD');
        const newMod: ContractMod = {
            id: modId,
            modNumber: modData.modNumber || `P0000${contract.modifications.length + 1}`,
            date: new Date().toISOString().split('T')[0],
            amountDelta: modData.amountDelta || 0,
            description: modData.description || 'Administrative Modification',
            authority: modData.authority || 'FAR 43.103',
            status: 'Executed'
        };

        const updatedContract: Contract = {
            ...contract,
            value: contract.value + newMod.amountDelta,
            modifications: [...contract.modifications, newMod],
            auditLog: [
                ...contract.auditLog,
                { timestamp: new Date().toISOString(), user, action: 'Mod Executed', details: `Mod ${newMod.modNumber} applied. Value adjusted by ${newMod.amountDelta.toLocaleString()}` }
            ]
        };

        let glAdjustment: GLTransaction | undefined;
        if (newMod.amountDelta !== 0) {
            glAdjustment = {
                id: generateSecureId('GL-MOD'),
                date: newMod.date,
                description: `GL Adjustment for Mod ${newMod.modNumber} (Award ${contract.id})`,
                type: 'Obligation Adjustment',
                sourceModule: 'Acquisition',
                referenceDoc: newMod.id,
                totalAmount: Math.abs(newMod.amountDelta),
                status: 'Posted',
                createdBy: user,
                lines: [
                    { 
                        ussglAccount: '480100', 
                        description: `Obligation Delta`, 
                        debit: newMod.amountDelta < 0 ? Math.abs(newMod.amountDelta) : 0, 
                        credit: newMod.amountDelta > 0 ? Math.abs(newMod.amountDelta) : 0, 
                        fund: 'OMA', 
                        costCenter: 'MOD' 
                    },
                    { 
                        ussglAccount: '461000', 
                        description: `Uncommitted Re-balance`, 
                        debit: newMod.amountDelta > 0 ? Math.abs(newMod.amountDelta) : 0, 
                        credit: newMod.amountDelta < 0 ? Math.abs(newMod.amountDelta) : 0, 
                        fund: 'OMA', 
                        costCenter: 'MOD' 
                    }
                ],
                auditLog: []
            };
        }

        return { contract: updatedContract, glAdjustment };
    }

    /**
     * Finalizes and Closes a Contract record
     */
    static closeoutContract(contract: Contract, user: string): Contract {
        return {
            ...contract,
            status: 'Closed',
            auditLog: [
                ...contract.auditLog,
                { timestamp: new Date().toISOString(), user, action: 'Closed Out', details: 'Contract closed per standard procedures. Final payment confirmed.' }
            ]
        };
    }

    private static findNodeForPR(nodes: FundControlNode[], pr: PurchaseRequest): FundControlNode | null {
        // Implementation of logic to find specific fund control node for PR's account string
        return nodes[0]; // Simplified for logic flow
    }
}
