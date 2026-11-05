import React from 'react';
import { ShoppingBag, Sparkles, Truck, History, HelpCircle, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'catalog' | 'tracking' | 'history' | 'recommendations';
  setActiveTab: (tab: 'catalog' | 'tracking' | 'history' | 'recommendations') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAiSupport: () => void;
  onOpenSetupGuide: () => void;
  isAiOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onOpenAiSupport,
  onOpenSetupGuide,
  isAiOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('catalog')}
          className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded"
        >
          <span className="font-display tracking-widest text-2xl font-black text-slate-950">AURA</span>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">EST. 2026</span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'catalog' ? 'text-slate-950 font-semibold border-b-2 border-slate-900 pb-0.5' : 'hover:text-slate-900'
            }`}
          >
            Collection Catalog
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors ${
              activeTab === 'tracking' ? 'text-slate-950 font-semibold border-b-2 border-slate-900 pb-0.5' : 'hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4 text-slate-500" />
            Live Tracking
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors ${
              activeTab === 'history' ? 'text-slate-950 font-semibold border-b-2 border-slate-900 pb-0.5' : 'hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4 text-slate-500" />
            Order History
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors ${
              activeTab === 'recommendations' ? 'text-slate-950 font-semibold border-b-2 border-slate-900 pb-0.5' : 'hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            For You
          </button>
          <button
            onClick={onOpenSetupGuide}
            className="cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors text-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Supabase &amp; Vercel Setup
          </button>
        </nav>

        {/* Zone 3: Primary action & Support buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAiSupport}
            aria-label="Open AI Concierge Support"
            className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all flex items-center gap-2 cursor-pointer ${
              isAiOpen
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">AI Concierge</span>
          </button>

          <button
            onClick={onOpenCart}
            aria-label={`Shopping Cart with ${cartCount} items`}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5 shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
