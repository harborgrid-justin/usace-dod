import React from 'react';
import { DollarSign } from 'lucide-react';

interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number | '';
  onChangeValue: (val: number | '') => void;
}

const MoneyInput: React.FC<MoneyInputProps> = ({ value, onChangeValue, className, ...props }) => {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
        <DollarSign size={14} className="text-zinc-400 group-focus-within:text-emerald-600 transition-colors" />
      </div>
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => {
            const val = e.target.value;
            onChangeValue(val === '' ? '' : parseFloat(val));
        }}
        className={`w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-mono font-bold focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm ${className}`}
        placeholder="0.00"
        {...props}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-zinc-300 uppercase tracking-widest pointer-events-none">
        USD
      </div>
    </div>
  );
};

export default MoneyInput;