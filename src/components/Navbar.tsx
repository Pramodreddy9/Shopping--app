import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Truck, History, ShieldCheck, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: 'catalog' | 'tracking' | 'history' | 'recommendations';
  setActiveTab: (tab: 'catalog' | 'tracking' | 'history' | 'recommendations') => void;
  cartCount: number;
  currentUser: User | null;
  onOpenCart: () => void;
  onOpenAiSupport: () => void;
  onOpenSetupGuide: () => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
  isAiOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  currentUser,
  onOpenCart,
  onOpenAiSupport,
  onOpenSetupGuide,
  onOpenAuth,
  onSignOut,
  isAiOpen,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('catalog')}
          className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded"
        >
          <span className="font-display tracking-widest text-2xl font-black text-slate-950">AURA</span>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">EST. 2026</span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
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
            Supabase Setup
          </button>
        </nav>

        {/* Zone 3: Primary action & Auth buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {/* User Auth Control */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-800 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-mono">
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.fullName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.fullName}</p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</p>
                  </div>

                  <button
                    onClick={() => setActiveTab('history')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Past Orders</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('tracking')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Track Live Delivery</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={onSignOut}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <UserIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign In</span>
            </button>
          )}

          {/* AI Support Concierge Button */}
          <button
            onClick={onOpenAiSupport}
            aria-label="Open AI Concierge Support"
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
              isAiOpen
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Concierge</span>
          </button>

          {/* Cart Bag Button */}
          <button
            onClick={onOpenCart}
            aria-label={`Shopping Cart with ${cartCount} items`}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
