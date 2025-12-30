import React, { useState } from 'react';
import { LaborRate, LaborStandard } from '../../types';
import RateTable from './RateTable';
import StandardsTable from './StandardsTable';

interface Props {
    laborRates: LaborRate[];
    laborStandards: LaborStandard[];
}

const WWPConfig: React.FC<Props> = ({ laborRates: initialRates, laborStandards }) => {
    const [rates, setRates] = useState(initialRates);
    const [editing, setEditing] = useState<string | null>(null);
    const [val, setVal] = useState(0);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full overflow-y-auto custom-scrollbar p-2">
            <RateTable 
                rates={rates} editingId={editing} editVal={val} 
                onEdit={r => { setEditing(r.laborCategory); setVal(r.rate); }} 
                onValChange={setVal} 
                onSave={() => { setRates(rates.map(r => r.laborCategory === editing ? {...r, rate: val} : r)); setEditing(null); }}
            />
            <StandardsTable standards={laborStandards} />
        </div>
    );
};
export default WWPConfig;