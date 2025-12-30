
import { RealPropertyAsset, GLTransaction, Asset, Outgrant, RelocationBenefit, RelocationCase } from '../../types';
import { generateSecureId } from '../../utils/security';
import { glService } from '../GLDataService';

export class AssetIntegration {
    static handleLifecycleEvent(asset: RealPropertyAsset, event: 'create' | 'dispose') {
        const glEntry: GLTransaction = {
            id: generateSecureId(event === 'create' ? 'GL-CAP' : 'GL-DISP'),
            date: new Date().toISOString().split('T')[0],
            description: `${event === 'create' ? 'Capitalization' : 'Disposal'} of Asset ${asset.rpuid}`,
            type: event === 'create' ? 'Capitalization' : 'Disposal',
            sourceModule: 'REMIS', referenceDoc: asset.rpuid, totalAmount: asset.currentValue,
            status: 'Posted', createdBy: 'SYSTEM', lines: [], auditLog: []
        };
        glService.addTransaction(glEntry);
    }

    /**
     * Fix: Added missing generateDepreciationJournal for AssetBatchProcessor
     */
    static generateDepreciationJournal(asset: Asset): GLTransaction {
        const amount = (asset.acquisitionCost / asset.usefulLife) / 4; // Quarterly depreciation
        const glEntry: GLTransaction = {
            id: generateSecureId('GL-DEP'),
            date: new Date().toISOString().split('T')[0],
            description: `Depreciation: ${asset.name}`,
            type: 'Depreciation',
            sourceModule: 'Asset Mgmt',
            referenceDoc: asset.id,
            totalAmount: amount,
            status: 'Posted',
            createdBy: 'SYSTEM',
            lines: [],
            auditLog: []
        };
        glService.addTransaction(glEntry);
        return glEntry;
    }

    /**
     * Fix: Added missing createRemisAsset for REMISAssetManager
     */
    static createRemisAsset(asset: RealPropertyAsset) {
        // Logic to handle asset creation across modules
        this.handleLifecycleEvent(asset, 'create');
    }

    /**
     * Fix: Added missing handleOutgrantBilling for OutgrantDetail
     */
    static handleOutgrantBilling(outgrant: Outgrant) {
        const amount = outgrant.annualRent / (outgrant.paymentFrequency === 'Monthly' ? 12 : outgrant.paymentFrequency === 'Quarterly' ? 4 : 1);
        const glEntry: GLTransaction = {
            id: generateSecureId('GL-REV'),
            date: new Date().toISOString().split('T')[0],
            description: `Outgrant Revenue: ${outgrant.grantee}`,
            type: 'Revenue',
            sourceModule: 'REMIS',
            referenceDoc: outgrant.id,
            totalAmount: amount,
            status: 'Posted',
            createdBy: 'SYSTEM',
            lines: [],
            auditLog: []
        };
        glService.addTransaction(glEntry);
    }

    /**
     * Fix: Added missing generateExpenseFromRelocationBenefit for BenefitManager
     */
    static generateExpenseFromRelocationBenefit(benefit: RelocationBenefit, caseData: RelocationCase) {
        const glEntry: GLTransaction = {
            id: generateSecureId('GL-REL'),
            date: new Date().toISOString().split('T')[0],
            description: `Relocation Benefit: ${benefit.type} for ${caseData.displacedPersonName}`,
            type: 'Expense',
            sourceModule: 'REMIS',
            referenceDoc: benefit.id,
            totalAmount: benefit.amount,
            status: 'Posted',
            createdBy: 'SYSTEM',
            lines: [],
            auditLog: []
        };
        glService.addTransaction(glEntry);
    }
}
