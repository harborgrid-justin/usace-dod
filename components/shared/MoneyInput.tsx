
import React from 'react';
import { DollarSign } from 'lucide-react';

interface MoneyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number | '';
  onChangeValue: (val: number | '') => void;
}

const MoneyInput: React.FC<MoneyInputProps> = ({ value, onChangeValue, className, ...props }) => {
  return (
    <div className="relative">
      <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => {
            const val = e.target.value;
            onChangeValue(val === '' ? '' : parseFloat(val));
        }}
        className={`w-full pl-8 pr-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-400 font-mono ${className}`}
        placeholder="0.00"
        {...props}
      />
    </div>
  );
};

export default MoneyInput;
