import React, { useState } from 'react';
import { X, Lock, CreditCard, CheckCircle2, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import { CartItem, PaymentMethodType, ShippingAddress, Order, User } from '../types';
import { createOrder } from '../lib/supabase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discount: number;
  appliedCoupon: string;
  currentUser?: User | null;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discount,
  currentUser,
  onOrderPlaced,
}) => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'processing'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Shipping Form State
  const [shipping, setShipping] = useState<ShippingAddress>(() => {
    if (currentUser?.defaultShippingAddress) {
      return { ...currentUser.defaultShippingAddress };
    }
    return {
      fullName: currentUser?.fullName || 'Eleanor Vance',
      email: currentUser?.email || 'eleanor.vance@studio.design',
      phone: currentUser?.phone || '+1 (555) 234-8910',
      street: '742 Evergreen Terrace',
      apartment: 'Apt 4B',
      city: 'Portland',
      state: 'OR',
      postalCode: '97201',
      country: 'United States',
    };
  });

  // Card details state
  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardName: currentUser?.fullName || 'Eleanor Vance',
    expiry: '12/28',
    cvv: '884',
  });

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= 150 ? 0 : 15;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = taxableAmount * 0.08;
  const total = taxableAmount + shippingFee + tax;

  const handleFillDemoCard = () => {
    setCardData({
      cardNumber: '4242 4242 4242 4242',
      cardName: shipping.fullName || 'Eleanor Vance',
      expiry: '12/28',
      cvv: '884',
    });
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.fullName || !shipping.email || !shipping.street || !shipping.city || !shipping.postalCode) {
      setErrorMsg('Please complete all required shipping fields.');
      return;
    }
    setErrorMsg(null);
    setStep('payment');
  };

  const handleCompleteOrder = async () => {
    setIsSubmitting(true);
    setStep('processing');
    setErrorMsg(null);

    // Simulate payment gateway handshake (Stripe / Apple Pay verification)
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();

    const newOrder: Order = {
      id: orderId,
      createdAt: now.toISOString(),
      customerName: shipping.fullName,
      customerEmail: shipping.email,
      customerPhone: shipping.phone,
      shippingAddress: shipping,
      items: [...items],
      subtotal,
      discount,
      shippingFee,
      tax,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'cod_pending' : 'paid',
      orderStatus: 'confirmed',
      trackingCarrier: 'Aura Express Courier',
      trackingNumber: `AURA-EXP-${orderId.replace('ORD-', '')}-EXP`,
      estimatedDeliveryDate: new Date(now.getTime() + 86400 * 1000 * 2).toISOString(),
      driver: {
        name: 'Jordan Miller',
        phone: '+1 (555) 349-8812',
        vehicle: 'Aura Electric Courier Van #18',
        rating: 4.97,
        currentMilestone: 'Order assigned to fulfillment center',
        estimatedArrivalMinutes: 48,
      },
      trackingMilestones: [
        {
          id: 'ms-1',
          status: 'confirmed',
          title: 'Order Confirmed & Authorized',
          description: paymentMethod === 'cod' 
            ? 'Order verified for Cash on Delivery payment.' 
            : 'Payment authorized successfully via 256-bit encrypted gateway.',
          location: 'Aura Commerce Fulfillment Hub',
          timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          current: true,
        },
        {
          id: 'ms-2',
          status: 'processing',
          title: 'Packaging & Quality Inspection',
          description: 'Acoustic shock testing and bespoke packaging.',
          location: 'Fulfillment Center Bin A-14',
          timestamp: 'Scheduled today',
          completed: false,
        },
        {
          id: 'ms-3',
          status: 'shipped',
          title: 'Dispatched to Transit Depot',
          description: 'Loaded onto regional express carrier vehicle.',
          location: 'Metro Distribution Terminal',
          timestamp: 'Pending dispatch',
          completed: false,
        },
        {
          id: 'ms-4',
          status: 'out_for_delivery',
          title: 'Courier Out for Delivery',
          description: 'Final mile residential delivery route.',
          location: 'Local Delivery Corridor',
          timestamp: 'Expected in 1-2 days',
          completed: false,
        },
        {
          id: 'ms-5',
          status: 'delivered',
          title: 'Delivered to Recipient',
          description: 'Delivery confirmation and digital receipt signoff.',
          location: shipping.street,
          timestamp: 'Pending arrival',
          completed: false,
        },
      ],
    };

    try {
      await createOrder(newOrder);
      setIsSubmitting(false);
      onOrderPlaced(newOrder);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
      setStep('payment');
      setErrorMsg('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h3 className="text-base font-bold font-display text-slate-950">
              Secure Checkout &amp; Order Placement
            </h3>
          </div>

          {step !== 'processing' && (
            <button
              onClick={onClose}
              aria-label="Close Checkout"
              className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Multi-step Content */}
        <div className="p-6 sm:p-8">
          {step === 'processing' ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-900">
                <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 font-display">Authorizing Secure Transaction...</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Connecting with banking gateway, syncing inventory reservations, and registering courier dispatch tracking.
                </p>
              </div>
              <div className="flex justify-center items-center gap-2 text-[11px] font-mono text-emerald-700 bg-emerald-50 max-w-xs mx-auto py-1 px-3 rounded">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>256-Bit SSL Encrypted Connection</span>
              </div>
            </div>
          ) : step === 'shipping' ? (
            <form onSubmit={handleNextToPayment} className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Step 1: Shipping &amp; Recipient Information
                </span>
                <span className="text-xs font-mono text-slate-400">1 of 2</span>
              </div>

              {errorMsg && (
                <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Email Address (Order Confirmation)</label>
                  <input
                    type="email"
                    required
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Phone (SMS Delivery Updates)</label>
                  <input
                    type="tel"
                    required
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-slate-700">Street Address</label>
                  <input
                    type="text"
                    required
                    value={shipping.street}
                    onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                    placeholder="e.g. 742 Evergreen Terrace"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">City</label>
                  <input
                    type="text"
                    required
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">State / Region</label>
                    <input
                      type="text"
                      required
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={shipping.postalCode}
                      onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Order Quick Summary */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                <span className="text-slate-600">
                  {items.length} items · Total including tax:
                </span>
                <span className="font-mono font-bold text-slate-950 text-sm">
                  ${total.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Return to Bag
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Step 2: Select Secure Payment Method
                </span>
                <button
                  onClick={() => setStep('shipping')}
                  className="text-xs text-slate-500 hover:text-slate-900 underline"
                >
                  Edit Shipping Address
                </button>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs font-medium">Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'apple_pay'
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold text-sm"> Pay</span>
                  <span className="text-xs font-medium">Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('google_pay')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'google_pay'
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold text-sm">G Pay</span>
                  <span className="text-xs font-medium">Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span className="text-xs font-medium">Pay on Delivery</span>
                </button>
              </div>

              {/* Method Detail Panels */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">Card Credentials (Stripe Simulation)</span>
                    <button
                      type="button"
                      onClick={handleFillDemoCard}
                      className="text-[11px] font-mono text-emerald-700 hover:underline cursor-pointer"
                    >
                      Fill Demo Test Card
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">Expiration (MM/YY)</label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">CVC / CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                  <div className="font-bold text-sm text-slate-900">Apple Pay Express Checkout</div>
                  <p className="text-xs text-slate-500">
                    Your Apple Wallet default payment card and shipping address will be validated via Touch ID or Face ID upon clicking confirm.
                  </p>
                </div>
              )}

              {paymentMethod === 'google_pay' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                  <div className="font-bold text-sm text-slate-900">Google Pay One-Click</div>
                  <p className="text-xs text-slate-500">
                    Payment will be securely processed through your saved Google Account cards.
                  </p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold">Cash on Delivery Verification</div>
                  <p className="text-amber-800">
                    You can pay the courier via Cash, Mobile POS, or QR code upon package inspection at your doorstep: <span className="font-semibold">{shipping.street}, {shipping.city}</span>.
                  </p>
                </div>
              )}

              {/* Total Summary */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-xs text-slate-500">Final Authorized Amount</span>
                  <p className="text-[11px] text-slate-400">Includes express shipping &amp; 8% sales tax</p>
                </div>
                <span className="text-2xl font-bold font-mono text-slate-950 tabular-nums">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Back to Shipping
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCompleteOrder}
                  className="px-6 py-3 text-xs font-bold text-white bg-slate-950 rounded-xl hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Authorize &amp; Place Order (${total.toFixed(2)})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
