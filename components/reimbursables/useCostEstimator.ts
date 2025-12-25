
import { useState, useEffect } from 'react';
import { ReimbursableCustomerType } from '../../types';
import { REIMBURSABLE_RATES } from '../../constants';

export interface CostBreakdown {
    baseCost: number;
    assetUseCharge: number;
    unfundedCivRetirement: number;
    unfundedHealthBenefits: number;
    contractAdmin: number;
    milLaborAccel: number;
    totalBillable: number;
}

export const useCostEstimator = () => {
    const [customerType, setCustomerType] = useState<ReimbursableCustomerType>('Intra-DoD');
    const [inputs, setInputs] = useState({
        labor: 0,
        material: 0,
        contract: 0,
        milLabor: 0
    });
    const [flags, setFlags] = useState({
        isDwcf: false,
        isNonReimbursable: false
    });

    const [breakdown, setBreakdown] = useState<CostBreakdown>({
        baseCost: 0,
        assetUseCharge: 0,
        unfundedCivRetirement: 0,
        unfundedHealthBenefits: 0,
        contractAdmin: 0,
        milLaborAccel: 0,
        totalBillable: 0
    });

    useEffect(() => {
        let assetCharge = 0;
        let unfundedCiv = 0;
        let unfundedHealth = 0;
        let contractAdmin = 0;
        let milAccel = 0;
        let billableMilLabor = inputs.milLabor;

        const base = inputs.labor + inputs.material + inputs.contract;

        // 1. Military Labor Exclusion
        if (customerType === 'Intra-DoD' && !flags.isDwcf) {
            billableMilLabor = 0; 
        }

        // 2. Private/FMS Charges
        if (customerType === 'Private Party' || customerType === 'FMS') {
            assetCharge = base * REIMBURSABLE_RATES.assetUseCharge;
            unfundedCiv = inputs.labor * REIMBURSABLE_RATES.unfundedCivRetirement;
            unfundedHealth = inputs.labor * REIMBURSABLE_RATES.postRetirementHealth;
        }

        // 3. Contract Admin Charge
        if (customerType !== 'Intra-DoD' && inputs.contract > 0) {
            contractAdmin = inputs.contract * REIMBURSABLE_RATES.contractAdminCharge;
        }

        // 4. Military Labor Acceleration
        if (customerType !== 'Intra-DoD') {
            milAccel = inputs.milLabor * REIMBURSABLE_RATES.milLaborAcceleration;
        }

        const total = base + billableMilLabor + assetCharge + unfundedCiv + unfundedHealth + contractAdmin + milAccel;

        setBreakdown({
            baseCost: base + billableMilLabor,
            assetUseCharge: assetCharge,
            unfundedCivRetirement: unfundedCiv,
            unfundedHealthBenefits: unfundedHealth,
            contractAdmin: contractAdmin,
            milLaborAccel: milAccel,
            totalBillable: flags.isNonReimbursable ? 0 : total
        });

    }, [customerType, inputs, flags]);

    const handleInputChange = (field: keyof typeof inputs, value: number) => {
        setInputs(prev => ({ ...prev, [field]: value }));
    };

    const handleFlagChange = (field: keyof typeof flags, value: boolean) => {
        setFlags(prev => ({ ...prev, [field]: value }));
    };

    return {
        customerType,
        setCustomerType,
        inputs,
        flags,
        breakdown,
        handleInputChange,
        handleFlagChange
    };
};
