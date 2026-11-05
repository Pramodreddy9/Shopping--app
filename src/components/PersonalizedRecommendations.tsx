import React, { useMemo } from 'react';
import { Sparkles, ArrowRight, Plus } from 'lucide-react';
import { Product, CartItem } from '../types';

interface PersonalizedRecommendationsProps {
  products: Product[];
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  products,
  cartItems,
  onAddToCart,
  onSelectProduct,
}) => {
  // Generate recommendations based on active bag or defaults
  const recommendations = useMemo(() => {
    const cartProductIds = new Set(cartItems.map((i) => i.product.id));

    return products
      .filter((p) => !cartProductIds.has(p.id))
      .slice(0, 4)
      .map((product) => {
        let reason = 'Trending in curated design';
        if (product.category === 'Living') {
          reason = 'Complements modern desk & studio setup';
        } else if (product.category === 'Audio') {
          reason = 'Top-rated audiophile acoustic profile';
        } else if (product.category === 'Wearables') {
          reason = 'Engineered aerospace titanium pairing';
        } else if (product.category === 'Leather') {
          reason = 'Tuscan vegetable-tanned handcrafted patina';
        }

        return {
          product,
          reason,
        };
      });
  }, [products, cartItems]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Recommendation Engine</span>
            <span aria-hidden="true">·</span>
            <span>Based on Shopping Activity</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-950 mt-1">
            Personalized For Your Lifestyle
          </h2>
        </div>

        <p className="text-xs text-slate-500 max-w-sm">
          Intelligent object pairings matched with your active cart selections and material preferences.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map(({ product, reason }) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer"
          >
            {/* Image */}
            <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500"
              />
              <div className="absolute bottom-2 left-2 right-2">
                <span className="text-[10px] font-medium text-slate-900 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded shadow-xs block truncate">
                  {reason}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col justify-between flex-1 gap-3">
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  {product.category} · ★ {product.rating}
                </span>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1">
                  {product.name}
                </h4>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="font-mono font-bold text-slate-950 text-sm">
                  ${product.price.toFixed(2)}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Add to Bag"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
