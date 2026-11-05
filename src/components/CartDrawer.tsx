import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Plus, Minus, Tag, Check } from 'lucide-react';
import { CartItem } from '../types';
import { AVAILABLE_COUPONS } from '../lib/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (couponDiscount: number, appliedCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Calculate discount
  let discountAmount = 0;
  let isFreeShipping = subtotal >= 150;

  if (appliedCoupon) {
    const couponObj = AVAILABLE_COUPONS.find((c) => c.code === appliedCoupon);
    if (couponObj) {
      if (couponObj.discountPercent) {
        discountAmount = (subtotal * couponObj.discountPercent) / 100;
      }
      if (couponObj.freeShipping) {
        isFreeShipping = true;
      }
    }
  }

  const shippingFee = isFreeShipping || subtotal === 0 ? 0 : 15;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.08;
  const total = taxableAmount + shippingFee + tax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();

    const match = AVAILABLE_COUPONS.find((c) => c.code === code);
    if (!match) {
      setCouponError('Invalid coupon code. Try WELCOME10 or FREESHIP');
      return;
    }

    if (match.minAmount && subtotal < match.minAmount) {
      setCouponError(`Requires minimum order of $${match.minAmount}`);
      return;
    }

    setAppliedCoupon(match.code);
    setCouponCode('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-slate-900" />
            <h2 className="text-lg font-bold font-display text-slate-950">Your Shopping Bag</h2>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {items.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Cart"
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">Your bag is empty</p>
                <p className="text-xs text-slate-500 max-w-xs">
                  Discover our acoustic monitors, titanium wearables, and artisan objects.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 items-center justify-between"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-slate-200">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {product.name}
                  </h4>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    ${product.price.toFixed(2)} each
                  </div>

                  {/* Quantity Steppers */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-slate-300 rounded bg-white">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-mono text-[11px] font-semibold text-slate-900">
                        {quantity}
                      </span>
                      <button
                        disabled={quantity >= product.stockQuantity}
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(product.id)}
                      aria-label="Remove item"
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Line Total */}
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-950 tabular-nums">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Total Breakdown */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-slate-50/80 space-y-4">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. WELCOME10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                  <span className="flex items-center gap-1 font-mono">
                    <Check className="w-3 h-3" /> Code {appliedCoupon} applied
                  </span>
                  <button
                    type="button"
                    onClick={() => setAppliedCoupon(null)}
                    className="text-slate-400 hover:text-slate-700 underline text-[10px]"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-600">{couponError}</p>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-slate-900">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Promotional Discount</span>
                  <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Express Courier Shipping</span>
                <span className="font-mono tabular-nums text-slate-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono tabular-nums text-slate-900">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-slate-950 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => onCheckout(discountAmount, appliedCoupon || '')}
              className="w-full py-3.5 px-4 text-xs font-bold text-white bg-slate-950 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
