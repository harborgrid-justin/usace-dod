
export interface DWCFAccount {
    id: string;
    fundCode: string;
    accountName: string;
    totalCashBalance: number;
}

export interface DWCFActivity {
    id: string;
    name: string;
    collections: number;
    disbursements: number;
}

export interface DWCFOrder {
    id: string;
    dwcfActivityId: string;
    customer: string;
    description: string;
    totalAmount: number;
    status: 'Draft' | 'Issued' | 'Accepted' | 'Work In Progress' | 'Complete' | 'Canceled';
}

export type DWCFBillingStatus = 'Draft' | 'Sent' | 'Paid' | 'Canceled';

export interface DWCFBilling {
    id: string;
    orderId: string;
    billingDate: string;
    status: DWCFBillingStatus;
    total: number;
    isAdvanceBilling: boolean;
    costs: { labor: number; material: number; overhead: number; surcharge: number };
}

export interface DWCFRateProfile {
    id: string;
    activityId: string;
    fiscalYear: number;
    compositeRate: number;
    overheadRate: number;
    surchargeRate: number;
    netOperatingResult: number;
    accumulatedOperatingResult: number;
    status: 'Active' | 'Pending Approval';
}

// Added missing CDOCostPool for indirect cost management
export interface CDOCostPool {
    id: string;
    functionName: string;
    orgCode: string;
    fyBudget: number;
    obligated: number;
    currentRate: number;
    status: 'Active' | 'Inactive';
}

// Added missing CDOFunction
export type CDOFunction = 'Engineering' | 'Construction' | 'Operations' | 'General Admin';

// Added missing CDOTransaction
export interface CDOTransaction {
    id: string;
    date: string;
    type: 'Labor' | 'Non-Labor' | 'Accrual';
    amount: number;
    description: string;
    function: CDOFunction;
    employeeId?: string;
    hours?: number;
    isIncidental?: boolean;
}

// Added missing UnfundedCustomerOrder for FMR Vol 11B compliance
export interface UnfundedCustomerOrder {
    id: string;
    customer: string;
    amount: number;
    status: 'Requires Notification' | 'Pending OUSD(C)' | 'Cleared';
    notificationTimestamp?: number;
}

// Added missing DWCFTransaction for cash flow monitoring
export interface DWCFTransaction {
    id: string;
    date: string;
    type: 'Collection' | 'Disbursement' | 'Adjustment';
    amount: number;
    description: string;
}
