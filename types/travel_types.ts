export interface TravelOrder {
    id: string;
    traveler: string;
    destination: string;
    purpose: string;
    startDate: string;
    endDate: string;
    estCost: number;
    status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
    fiscalYear: number;
}

export interface TravelVoucher {
    id: string;
    orderId: string;
    traveler: string;
    status: 'Draft' | 'Pending Review' | 'Approved' | 'Paid';
    dateSubmitted?: string;
    totalClaimed: number;
    expenses: TravelExpense[];
}

export interface TravelExpense {
    id: string;
    date: string;
    category: 'Airfare' | 'Lodging' | 'Meals' | 'Misc';
    amount: number;
    description: string;
}