import React, { useState, useEffect } from 'react';
import { 
  Search, Truck, CheckCircle2, Clock, MapPin, 
  Phone, User, ShieldCheck, Play, Pause, RefreshCw, AlertCircle
} from 'lucide-react';
import { Order } from '../types';
import { getOrders, advanceOrderStatus } from '../lib/supabase';

interface OrderTrackingViewProps {
  initialOrderId?: string;
  onSelectProductById: (productId: string) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  initialOrderId,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchId, setSearchId] = useState(initialOrderId || '');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Load orders
  useEffect(() => {
    async function loadData() {
      const data = await getOrders();
      setOrders(data);
      if (initialOrderId) {
        const found = data.find((o) => o.id.toUpperCase() === initialOrderId.toUpperCase());
        if (found) {
          setSelectedOrder(found);
          setSearchId(found.id);
          return;
        }
      }
      if (data.length > 0) {
        setSelectedOrder(data[0]);
        setSearchId(data[0].id);
      }
    }
    loadData();
  }, [initialOrderId]);

  // Real-time automatic simulation interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating && selectedOrder && selectedOrder.orderStatus !== 'delivered') {
      timer = setInterval(async () => {
        setIsUpdating(true);
        const updated = await advanceOrderStatus(selectedOrder.id);
        if (updated) {
          setSelectedOrder({ ...updated });
          setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
          if (updated.orderStatus === 'delivered') {
            setIsSimulating(false);
          }
        }
        setIsUpdating(false);
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isSimulating, selectedOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const cleaned = searchId.trim().toUpperCase();
    const found = orders.find((o) => o.id.toUpperCase() === cleaned);
    if (found) {
      setSelectedOrder(found);
    } else {
      setSearchError(`No order found matching "${searchId}". Try ORD-89210 or check Order History.`);
    }
  };

  const handleManualAdvance = async () => {
    if (!selectedOrder || selectedOrder.orderStatus === 'delivered') return;
    setIsUpdating(true);
    const updated = await advanceOrderStatus(selectedOrder.id);
    if (updated) {
      setSelectedOrder({ ...updated });
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    }
    setIsUpdating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      {/* Search & Quick Switch Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-500">
            <span>AURA Courier Intelligence</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">Live GPS Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-950 mt-1">
            Real-Time Order &amp; Delivery Tracking
          </h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Order ID (e.g. ORD-89210)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Track
          </button>
        </form>
      </div>

      {searchError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{searchError}</span>
        </div>
      )}

      {/* Quick Order Tabs */}
      {orders.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 shrink-0 font-medium">Recent Orders:</span>
          {orders.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setSelectedOrder(o);
                setSearchId(o.id);
                setSearchError(null);
              }}
              className={`px-3 py-1.5 rounded-lg border font-mono transition-all shrink-0 cursor-pointer ${
                selectedOrder?.id === o.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {o.id} ({o.orderStatus.replace(/_/g, ' ')})
            </button>
          ))}
        </div>
      )}

      {selectedOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Tracking Timeline & Courier Visual */}
          <div className="lg:col-span-8 space-y-6">
            {/* Live Progress Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span>Tracking Number: {selectedOrder.trackingNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>Carrier: {selectedOrder.trackingCarrier}</span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-900 mt-1 capitalize">
                    Status: {selectedOrder.orderStatus.replace(/_/g, ' ')}
                  </h3>
                </div>

                {/* Simulation Control Toolbar */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={selectedOrder.orderStatus === 'delivered' || isUpdating}
                    onClick={handleManualAdvance}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                    <span>Advance Stage</span>
                  </button>

                  <button
                    disabled={selectedOrder.orderStatus === 'delivered'}
                    onClick={() => setIsSimulating(!isSimulating)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSimulating
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isSimulating ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Simulating Live GPS</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Auto-Simulate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3.5 sm:before:left-4.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {selectedOrder.trackingMilestones.map((milestone) => (
                  <div key={milestone.id} className="relative flex items-start gap-4">
                    {/* Step Icon */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        milestone.completed
                          ? 'bg-slate-950 border-slate-950 text-white'
                          : 'bg-white border-slate-300 text-slate-400'
                      } ${milestone.current ? 'ring-4 ring-slate-900/10' : ''}`}
                    >
                      {milestone.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Step Text */}
                    <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-950">
                          {milestone.title}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {milestone.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {milestone.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2 font-mono">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{milestone.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courier Driver Details Card */}
            {selectedOrder.driver && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 shrink-0">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span>Assigned Courier Specialist</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-600 font-bold">★ {selectedOrder.driver.rating}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-950">
                      {selectedOrder.driver.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {selectedOrder.driver.vehicle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block uppercase font-mono">Estimated Arrival</span>
                    <span className="text-base font-bold font-mono text-emerald-700">
                      {selectedOrder.orderStatus === 'delivered'
                        ? 'Package Arrived'
                        : `~${selectedOrder.driver.estimatedArrivalMinutes} Minutes`}
                    </span>
                  </div>

                  <a
                    href={`tel:${selectedOrder.driver.phone}`}
                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs font-semibold cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Contact Courier</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Details & Address */}
          <div className="lg:col-span-4 space-y-6">
            {/* Destination Address */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-slate-900" />
                <span>Delivery Address</span>
              </div>

              <div className="text-xs text-slate-700 space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div className="font-bold text-slate-950 text-sm">
                  {selectedOrder.shippingAddress.fullName}
                </div>
                <div>{selectedOrder.shippingAddress.street}</div>
                {selectedOrder.shippingAddress.apartment && (
                  <div>{selectedOrder.shippingAddress.apartment}</div>
                )}
                <div>
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                </div>
                <div className="text-slate-500 font-mono pt-1">
                  {selectedOrder.shippingAddress.country} · {selectedOrder.customerPhone}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                <div className="flex justify-between text-slate-500">
                  <span>Payment Gateway:</span>
                  <span className="font-semibold text-slate-900 uppercase">
                    {selectedOrder.paymentMethod.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono font-bold text-slate-950 text-sm">
                    ${selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Itemized Order Manifest */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-slate-900" />
                  <span>Parcel Contents</span>
                </div>
                <span className="font-mono text-slate-400 font-normal">
                  {selectedOrder.items.length} unique items
                </span>
              </div>

              <div className="space-y-3">
                {selectedOrder.items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80"
                  >
                    <div className="w-12 h-12 rounded-lg bg-white overflow-hidden border border-slate-200 shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <h5 className="font-bold text-slate-900 truncate">{product.name}</h5>
                      <span className="text-slate-500 font-mono">Qty: {quantity} · ${product.price.toFixed(2)}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-950">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Includes tamper-evident seal &amp; verified transit insurance</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-800">No order selected for tracking.</p>
          <p className="text-xs text-slate-500 mt-1">Place an order or search using order ID ORD-89210.</p>
        </div>
      )}
    </div>
  );
};
