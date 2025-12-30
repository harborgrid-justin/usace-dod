export const PO_QUESTIONS = {
    'q1': {
        id: 'q1',
        text: 'Is the provider a DoD-owned establishment or the USCG?',
        description: 'Includes WCF activities, labs, depots, and arsenals. Contractor-operated facilities do not qualify.',
        yesNext: 'q2', noNext: 'r_invalid_provider',
        citation: 'FMR Vol 11A, Ch 2, Para 2.2'
    },
    'q2': {
        id: 'q2',
        text: 'Will the order be issued to a unit under the same activity commander?',
        description: 'An entity cannot enter into a formal contract with itself.',
        yesNext: 'r_same_commander', noNext: 'q3',
        citation: 'FMR Vol 11A, Ch 2, Para 5.2'
    },
    'q3': {
        id: 'q3',
        text: 'Is the work "Entire" (Non-Severable)?',
        description: 'Does it call for a single unified outcome or product where benefit is only received upon full completion?',
        yesNext: 'q4', noNext: 'r_economy_act',
        citation: 'FMR Vol 11A, Ch 2, Para 5.9'
    }
};

export const TRANSFER_QUESTIONS = {
    'q1': {
        id: 'q1',
        text: 'Does the action move funds between different appropriations?',
        description: 'For example, moving funds from O&M to Procurement, or RDTE to O&M.',
        yesNext: 'q2', noNext: 'r_reprogramming',
        citation: 'FMR Vol 3, Ch 3, Para 030102'
    },
    'q2': {
        id: 'q2',
        text: 'Is there a specific statutory authority for this transfer?',
        description: 'E.g., MilCon (10 USC 2803), Working Capital Fund (10 USC 2208).',
        yesNext: 'r_specific_authority', noNext: 'q3',
        citation: 'FMR Vol 3, Ch 3, Para 030201'
    }
};