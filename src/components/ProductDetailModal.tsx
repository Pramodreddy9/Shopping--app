import React, { useState } from 'react';
import { X, Check, Shield, Truck, RotateCcw, Minus, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenTracking: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity <= 10 && product.stockQuantity > 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product modal"
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-800 bg-white/80 backdrop-blur-md rounded-full border border-slate-200/80 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Gallery / Image Left Half */}
        <div className="md:w-1/2 bg-slate-100 flex flex-col justify-between relative overflow-hidden">
          <div className="aspect-square md:aspect-auto md:h-full relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 text-xs font-semibold text-slate-900 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md shadow-xs">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Contiguous Purchase Module Right Half */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category and Rating */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 uppercase tracking-widest">{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-600 font-semibold">★ {product.rating.toFixed(1)}</span>
              <span>({product.reviewsCount} customer reviews)</span>
            </div>

            <h2 className="text-2xl font-bold font-display text-slate-950 leading-snug">
              {product.name}
            </h2>

            {/* Price Row */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold font-mono text-slate-950 tabular-nums">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-base font-mono text-slate-400 line-through tabular-nums">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
              {product.compareAtPrice && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Save ${(product.compareAtPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Stock Availability Telemetry */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">Inventory Status:</span>
                {isOutOfStock ? (
                  <span className="font-semibold text-rose-600 font-mono">Out of Stock</span>
                ) : isLowStock ? (
                  <span className="font-semibold text-amber-600 font-mono">Only {product.stockQuantity} remaining</span>
                ) : (
                  <span className="font-semibold text-emerald-700 font-mono">In Stock ({product.stockQuantity} available)</span>
                )}
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOutOfStock ? 'bg-rose-500 w-0' : isLowStock ? 'bg-amber-500 w-1/4' : 'bg-emerald-600 w-4/5'
                  }`}
                />
              </div>
            </div>

            {/* Feature Highlights */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Engineered Highlights</span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-slate-400 font-mono">·</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Materials & Dimensions */}
            {(product.materials || product.dimensions) && (
              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                {product.materials && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Materials</span>
                    <span className="text-slate-700 font-medium">{product.materials}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Dimensions &amp; Weight</span>
                    <span className="text-slate-700 font-medium">{product.dimensions}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Zone: Quantity Stepper & Add Button */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-1">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-40 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-mono text-xs font-semibold text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= product.stockQuantity || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                  className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                disabled={isOutOfStock}
                onClick={handleAdd}
                className={`flex-1 py-3 px-6 text-sm font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Item Sold Out</span>
                ) : (
                  <span>Add to Bag · ${(product.price * quantity).toFixed(2)}</span>
                )}
              </button>
            </div>

            {/* Reassurances */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3 text-slate-400" /> Free express shipping over $150
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-slate-400" /> 30-day home trial
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-slate-400" /> 2-year warranty
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
