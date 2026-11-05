import React from 'react';
import { ArrowRight, Shield, Zap, RefreshCw } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenTracking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenTracking }) => {
  return (
    <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial & Value Proposition */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500">
              <span>Collection 2026</span>
              <span aria-hidden="true">·</span>
              <span>Precision Acoustics &amp; Objects</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 font-display leading-[1.08] text-balance">
              Sensory clarity, designed for lifetime endurance.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              An intentional curation of biocellulose acoustic monitors, milled grade-5 titanium wearables, and hand-thrown stoneware. Engineered with zero compromises.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenTracking}
                className="px-5 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
              >
                Track Live Order
              </button>
            </div>

            {/* Adjacent Trust Elements */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-900 shrink-0" />
                <span>Express Courier Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-slate-900 shrink-0" />
                <span>30-Day Home Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-900 shrink-0" />
                <span>2-Year Hardware Warranty</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-16/10 bg-slate-200 border border-slate-300/60">
              <img
                src="/src/assets/images/hero_modern_lifestyle_1793895216456.jpg"
                alt="AURA Lifestyle Collection - Wireless Headphones, Titanium Watch, and Artisan Tumbler"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs flex justify-between items-center pointer-events-none">
                <span className="font-medium tracking-wide">Studio Flagship Trio · In Stock</span>
                <span className="font-mono text-slate-300">Live stock sync enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
