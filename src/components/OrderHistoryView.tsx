import React, { useState, useEffect } from 'react';
import { 
  History, ArrowRight, Truck, RefreshCw, FileText, 
  CheckCircle2, Clock, X, Printer 
} from 'lucide-react';
import { Order, CartItem } from '../types';
import { getOrders } from '../lib/supabase';

interface OrderHistoryViewProps {
  onTrackOrder: (orderId: string) => void;
  onReorder: (items: CartItem[]) => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  onTrackOrder,
  onReorder,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getOrders();
      setOrders(data);
    }
    load();
  }, []);

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-500">
            <span>Customer Account Portal</span>
            <span aria-hidden="true">·</span>
            <span>Verified Purchases</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-950 mt-1">
            Order History &amp; Receipts
          </h1>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          <span>{orders.length} historical transactions registered</span>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 space-y-3">
          <History className="w-10 h-10 mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-slate-900">No previous orders found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your completed purchases and delivery receipts will automatically populate here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isDelivered = order.orderStatus === 'delivered';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-6 hover:border-slate-300 transition-colors"
              >
                {/* Order Top Bar: ID, Date, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-slate-950">
                        {order.id}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded capitalize ${
                          isDelivered
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-mono">
                      <span>Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="mx-2">·</span>
                      <span>Payment: {order.paymentMethod.replace(/_/g, ' ').toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Actions: Track & Invoice */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onTrackOrder(order.id)}
                      className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Shipment</span>
                    </button>

                    <button
                      onClick={() => setSelectedInvoice(order)}
                      className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Invoice Receipt</span>
                    </button>

                    <button
                      onClick={() => onReorder(order.items)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {order.items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80"
                    >
                      <div className="w-14 h-14 bg-white rounded-lg overflow-hidden border border-slate-200 shrink-0">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        <h4 className="font-bold text-slate-900 truncate">{product.name}</h4>
                        <div className="text-slate-500 font-mono mt-0.5">
                          Qty: {quantity} × ${product.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Destination & Financial Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-2 text-slate-600 gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900">Ship to:</span>
                    <span>
                      {order.shippingAddress.fullName}, {order.shippingAddress.street}, {order.shippingAddress.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-slate-700">
                    <span>
                      Subtotal: <strong className="font-mono">${order.subtotal.toFixed(2)}</strong>
                    </span>
                    <span>
                      Total Paid: <strong className="font-mono text-slate-950 text-sm">${order.total.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div 
            className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8 p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Invoice Top Actions */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-900" />
                <h3 className="font-bold font-display text-slate-950 text-lg">
                  Tax Invoice &amp; Payment Receipt
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintInvoice}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Print Invoice"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Body */}
            <div className="space-y-6 text-xs text-slate-700">
              {/* Header Details */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xl font-black font-display text-slate-950 tracking-wider">AURA</div>
                  <p className="text-slate-500 text-[11px] mt-0.5">Contemporary Commerce &amp; Acoustics LLC</p>
                  <p className="text-slate-500 text-[11px]">Tax ID: US-920148-AURA</p>
                </div>

                <div className="text-right font-mono">
                  <div className="font-bold text-slate-950 text-sm">{selectedInvoice.id}</div>
                  <div className="text-slate-500 text-[11px]">
                    Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-emerald-700 font-semibold text-[11px]">
                    STATUS: PAID IN FULL
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Billed &amp; Shipped To:</span>
                  <div>{selectedInvoice.shippingAddress.fullName}</div>
                  <div>{selectedInvoice.shippingAddress.street}</div>
                  <div>
                    {selectedInvoice.shippingAddress.city}, {selectedInvoice.shippingAddress.state} {selectedInvoice.shippingAddress.postalCode}
                  </div>
                  <div className="text-slate-500 font-mono mt-1">{selectedInvoice.customerEmail}</div>
                </div>

                <div>
                  <span className="font-bold text-slate-900 block mb-1">Dispatch Logistics:</span>
                  <div>Carrier: {selectedInvoice.trackingCarrier}</div>
                  <div className="font-mono text-slate-600">AWB: {selectedInvoice.trackingNumber}</div>
                  <div>Method: {selectedInvoice.paymentMethod.replace(/_/g, ' ').toUpperCase()}</div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase">
                    <tr>
                      <th className="p-3">Item Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {selectedInvoice.items.map(({ product, quantity }) => (
                      <tr key={product.id}>
                        <td className="p-3 font-sans font-medium text-slate-900">{product.name}</td>
                        <td className="p-3 text-center">{quantity}</td>
                        <td className="p-3 text-right">${product.price.toFixed(2)}</td>
                        <td className="p-3 text-right font-bold">${(product.price * quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="space-y-1.5 font-mono text-xs max-w-xs ml-auto text-right">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>${selectedInvoice.subtotal.toFixed(2)}</span>
                </div>
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-${selectedInvoice.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Express Courier:</span>
                  <span>${selectedInvoice.shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Sales Tax (8%):</span>
                  <span>${selectedInvoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-950 text-sm pt-2 border-t border-slate-200">
                  <span>Total Paid:</span>
                  <span>${selectedInvoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
