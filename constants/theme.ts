
export const REMIS_THEME = {
    colors: {
        primary: '#064e3b', // Army Green Dark
        secondary: '#065f46', // Emerald Dark
        accent: '#10b981', // Emerald 500 (Authoritative)
        risk: '#be123c', // Rose 700 (Critical)
        warning: '#d97706', // Amber 600
        info: '#2563eb', // Blue 600
        terminal: '#09090b', // Zinc 950
        surface: '#fafafa', // Zinc 50
        border: '#e4e4e7', // Zinc 200
    },
    // Fluid Typography using CSS clamp for dynamic resizing
    typography: {
        h1: "text-[clamp(1.5rem,4vw,2.5rem)] font-black tracking-tighter leading-none",
        h2: "text-[clamp(1.25rem,3vw,2rem)] font-bold tracking-tight leading-tight",
        h3: "text-[clamp(1rem,2vw,1.5rem)] font-bold tracking-tight",
        body: "text-sm md:text-base leading-relaxed text-pretty",
        label: "text-[clamp(0.6rem,1vw,0.7rem)] font-black uppercase tracking-[0.25em] text-zinc-400",
        mono: "font-mono font-bold tracking-tighter tabular-nums",
    },
    radii: {
        xl: '4px',
        '2xl': '6px',
        '3xl': '6px',
        full: '9999px'
    },
    enterprise: {
        container: "bg-white border border-zinc-200/60 rounded-md shadow-sm overflow-hidden",
        panel: "bg-white border border-zinc-200/60 rounded shadow-sm overflow-hidden",
        hud: "bg-[#09090b] border border-zinc-800 rounded-md shadow-2xl p-6 relative overflow-hidden",
        header: "p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center",
        dataRow: "hover:bg-zinc-50/80 transition-colors border-b border-zinc-50 last:border-0",
        label: "text-[clamp(0.6rem,1vw,0.7rem)] font-black uppercase tracking-[0.25em] text-zinc-400",
        interactive: "hover:border-rose-400 hover:shadow-xl transition-all duration-300 active:scale-[0.98]",
    },
    classes: {
        statusActive: 'bg-emerald-50 text-emerald-800 border border-emerald-200/50 rounded-sm px-3 py-1 font-black uppercase text-[9px] tracking-widest shadow-sm',
        statusRisk: 'bg-rose-50 text-rose-800 border border-rose-200/50 rounded-sm px-3 py-1 font-black uppercase text-[9px] tracking-widest animate-pulse shadow-sm',
        cardHover: 'hover:shadow-lg hover:border-emerald-300/50 transition-all duration-300',
        iconContainer: 'bg-zinc-50 border border-zinc-100 p-2.5 rounded-sm shadow-inner',
        iconColor: 'text-zinc-600 group-hover:text-emerald-600 transition-colors',
        inputFocus: 'focus:border-emerald-500 focus:ring-emerald-500/10 focus:bg-white',
        buttonPrimary: 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-md shadow-zinc-200 active:scale-95 transition-all rounded-sm',
        tableRowHover: 'hover:bg-zinc-50/50',
        badge: {
            warning: 'bg-amber-50 text-amber-900 border border-amber-200/50',
            info: 'bg-blue-50 text-blue-900 border-blue-200/50',
            success: 'bg-emerald-50 text-emerald-800 border-emerald-200/50',
            danger: 'bg-rose-50 text-rose-900 border-rose-200/50',
        },
    }
};
