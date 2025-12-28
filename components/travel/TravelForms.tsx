import React from 'react';
import { TravelOrder, TravelVoucher } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { Landmark, FileText, User, ShieldCheck, Lock } from 'lucide-react';

export const DD1610Preview: React.FC<{ order: TravelOrder }> = ({ order }) => (
    <div className="bg-white p-12 border border-zinc-200 shadow-2xl rounded-sm font-mono text-[11px] text-zinc-900 relative">
        <div className="border-2 border-zinc-900 p-1 mb-8">
            <div className="border-b border-zinc-900 p-2 text-center">
                <h1 className="text-base font-bold uppercase">Request and Authorization for TDY Travel of DoD Personnel</h1>
                <p className="font-bold">DD FORM 1610, MAY 2003</p>
            </div>
            <div className="grid grid-cols-12 border-b border-zinc-900">
                <div className="col-span-8 p-2 border-r border-zinc-900"><p className="font-bold mb-1 uppercase text-[9px]">1. NAME (Last, First, Middle Initial)</p><p className="text-sm font-bold">{order.traveler.toUpperCase()}</p></div>
                <div className="col-span-4 p-2"><p className="font-bold mb-1 uppercase text-[9px]">2. GRADE</p><p className="text-sm font-bold">GS-13 / CIV</p></div>
            </div>
            <div className="grid grid-cols-12 border-b border-zinc-900 h-24">
                <div className="col-span-12 p-2"><p className="font-bold mb-1 uppercase text-[9px]">11. ITINERARY AND PURPOSE</p><p className="leading-relaxed">{order.purpose}</p></div>
            </div>
            <div className="grid grid-cols-12 border-b border-zinc-900">
                <div className="col-span-4 p-2 border-r border-zinc-900"><p className="font-bold mb-1 uppercase text-[9px]">12. DEPARTURE DATE</p><p className="text-sm">{order.startDate}</p></div>
                <div className="col-span-8 p-2"><p className="font-bold mb-1 uppercase text-[9px]">13. DESTINATION</p><p className="text-sm font-bold">{order.destination.toUpperCase()}</p></div>
            </div>
            <div className="p-2 bg-zinc-50 border-b border-zinc-900"><p className="font-bold mb-1 uppercase text-[9px]">15. FINANCIAL DATA (LOA)</p><p className="font-mono text-xs">21 2020 0000 1111 S12123 . . . . . {formatCurrency(order.estCost)}</p></div>
        </div>
        <div className="absolute top-6 right-8 opacity-20 pointer-events-none rotate-12"><Landmark size={80} /></div>
        <div className="flex justify-between items-end mt-12 pt-8 border-t-2 border-zinc-900">
            <div className="w-1/2 p-4 border border-zinc-200 bg-zinc-50 text-center rounded">
                <ShieldCheck size={32} className="mx-auto text-emerald-600 mb-2 opacity-50"/>
                <p className="font-bold">DIGITALLY SIGNED</p>
                <p className="text-[9px] mt-1">PKI Verified: 0x8821AF</p>
            </div>
            <div className="text-right">
                <p className="font-bold uppercase">Authorizing Official</p>
                <p className="text-sm">G-8 BUDGET OFFICER</p>
            </div>
        </div>
    </div>
);

export const DD1351_2Preview: React.FC<{ voucher: TravelVoucher }> = ({ voucher }) => (
    <div className="bg-white p-12 border border-zinc-200 shadow-2xl rounded-sm font-mono text-[10px] text-zinc-900 relative">
        <div className="text-center border-b-4 border-zinc-900 pb-4 mb-6">
            <h1 className="text-lg font-bold uppercase tracking-tight">Travel Voucher or Subvoucher</h1>
            <p className="font-bold">DD FORM 1351-2, MAY 2011</p>
        </div>
        <div className="grid grid-cols-12 border-2 border-zinc-900">
            <div className="col-span-6 p-2 border-r border-zinc-900 border-b border-zinc-900">1. NAME: <span className="font-bold text-xs ml-2">{voucher.traveler}</span></div>
            <div className="col-span-6 p-2 border-b border-zinc-900">2. SSN: <span className="blur-[3px]">***-**-****</span></div>
            <div className="col-span-12 p-2 bg-zinc-50 border-b border-zinc-900 font-bold uppercase">15. ITINERARY / REIMBURSABLE EXPENSES</div>
            {voucher.expenses.map((ex, i) => (
                <React.Fragment key={i}>
                    <div className="col-span-2 p-2 border-r border-zinc-900 border-b border-zinc-900">{ex.date}</div>
                    <div className="col-span-8 p-2 border-r border-zinc-900 border-b border-zinc-900">{ex.description} ({ex.category})</div>
                    <div className="col-span-2 p-2 border-b border-zinc-900 text-right font-bold">{formatCurrency(ex.amount)}</div>
                </React.Fragment>
            ))}
            <div className="col-span-10 p-4 font-bold text-right text-xs uppercase">Total Claimed:</div>
            <div className="col-span-2 p-4 font-bold text-right text-xs bg-zinc-100">{formatCurrency(voucher.totalClaimed)}</div>
        </div>
        <div className="mt-12 flex justify-between items-start">
             <div className="border border-zinc-400 p-4 w-64 bg-zinc-50">
                <p className="font-bold text-center mb-6">20. TRAVELER SIGNATURE</p>
                <div className="h-8 border-b border-zinc-400 mb-1" />
                <p className="text-center text-[8px]">{new Date().toLocaleString()}</p>
             </div>
             <div className="text-right space-y-1">
                 <p className="font-bold uppercase">Payment Certification</p>
                 <p className="text-[9px]">EFT ENROLLED: YES</p>
                 <p className="text-[9px]">DISBURSING OFFICER: DFAS-IN</p>
             </div>
        </div>
    </div>
);