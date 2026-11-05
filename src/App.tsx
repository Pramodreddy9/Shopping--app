import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { OrderHistoryView } from './components/OrderHistoryView';
import { PersonalizedRecommendations } from './components/PersonalizedRecommendations';
import { AiSupportDrawer } from './components/AiSupportDrawer';
import { SetupGuideModal } from './components/SetupGuideModal';
import { AuthModal } from './components/AuthModal';
import { Product, CartItem, Order, User } from './types';
import { getProducts, getStoredUser, signOutUser } from './lib/supabase';
import { Sparkles, ArrowUpRight, LogIn } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'tracking' | 'history' | 'recommendations'>('catalog');
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  // Active coupon & discount
  const [activeDiscount, setActiveDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  // Active tracking order ID
  const [activeTrackingId, setActiveTrackingId] = useState<string>('ORD-89210');

  // Load products on mount
  useEffect(() => {
    async function loadData() {
      const data = await getProducts();
      setProducts(data);
    }
    loadData();
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleOpenCheckout = (discountAmount: number, code: string) => {
    setActiveDiscount(discountAmount);
    setAppliedCoupon(code);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setIsCheckoutOpen(false);
    setCartItems([]);
    setActiveTrackingId(newOrder.id);
    setActiveTab('tracking');
  };

  const handleReorder = (items: CartItem[]) => {
    setCartItems((prev) => {
      const map = new Map<string, CartItem>();
      prev.forEach((i) => map.set(i.product.id, { ...i }));
      items.forEach((i) => {
        if (map.has(i.product.id)) {
          const current = map.get(i.product.id)!;
          map.set(i.product.id, { ...current, quantity: current.quantity + i.quantity });
        } else {
          map.set(i.product.id, { ...i });
        }
      });
      return Array.from(map.values());
    });
    setIsCartOpen(true);
  };

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 flex flex-col selection:bg-slate-900 selection:text-white">
      {/* Top Banner (Promotional & Account prompt) */}
      <div className="bg-slate-900 text-slate-100 text-[11px] font-mono py-1.5 px-4 flex justify-between items-center border-b border-slate-800">
        <span className="truncate">
          Complimentary Express Delivery over $150 · Use code <strong>WELCOME10</strong>
        </span>
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {currentUser ? (
            <span className="text-emerald-400 font-mono">
              Signed in as {currentUser.fullName}
            </span>
          ) : (
            <button
              onClick={() => handleOpenAuth('signin')}
              className="text-slate-300 hover:text-white underline cursor-pointer flex items-center gap-1"
            >
              <LogIn className="w-3 h-3" />
              <span>Customer Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        currentUser={currentUser}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAiSupport={() => setIsAiOpen(true)}
        onOpenSetupGuide={() => setIsSetupOpen(true)}
        onOpenAuth={() => handleOpenAuth('signin')}
        onSignOut={handleSignOut}
        isAiOpen={isAiOpen}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1">
        {activeTab === 'catalog' && (
          <>
            <Hero
              onExploreClick={() => {
                const element = document.getElementById('catalog-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenTracking={() => {
                setActiveTrackingId('ORD-89210');
                setActiveTab('tracking');
              }}
            />
            <ProductCatalog
              products={products}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
            <PersonalizedRecommendations
              products={products}
              cartItems={cartItems}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          </>
        )}

        {activeTab === 'tracking' && (
          <OrderTrackingView
            initialOrderId={activeTrackingId}
            onSelectProductById={(id) => {
              const p = products.find((prod) => prod.id === id);
              if (p) setSelectedProduct(p);
            }}
          />
        )}

        {activeTab === 'history' && (
          <OrderHistoryView
            onTrackOrder={(orderId) => {
              setActiveTrackingId(orderId);
              setActiveTab('tracking');
            }}
            onReorder={handleReorder}
          />
        )}

        {activeTab === 'recommendations' && (
          <PersonalizedRecommendations
            products={products}
            cartItems={cartItems}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}
      </main>

      {/* Floating Quick Action for AI Support */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsAiOpen(true)}
          aria-label="Open AI Customer Concierge"
          className="flex items-center gap-2.5 px-4 py-3 bg-slate-950 text-white rounded-full shadow-xl hover:bg-slate-800 transition-all hover:scale-103 border border-slate-700/60 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold">Need Help? Ask AI Concierge</span>
        </button>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* Modals & Slide-over Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenTracking={() => {
          setSelectedProduct(null);
          setActiveTab('tracking');
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleOpenCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discount={activeDiscount}
        appliedCoupon={appliedCoupon}
        currentUser={currentUser}
        onOrderPlaced={handleOrderPlaced}
      />

      <AiSupportDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onNavigateToTracking={(orderId) => {
          if (orderId) setActiveTrackingId(orderId);
          setActiveTab('tracking');
          setIsAiOpen(false);
        }}
      />

      <SetupGuideModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-display font-black text-sm text-slate-900 tracking-wider">AURA</span>
            <span aria-hidden="true">·</span>
            <span>Contemporary Commerce &amp; Real-Time Order Intelligence</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {!currentUser ? (
              <button
                onClick={() => handleOpenAuth('signin')}
                className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Customer Login</span>
              </button>
            ) : (
              <button
                onClick={handleSignOut}
                className="text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
              >
                <span>Sign Out ({currentUser.fullName})</span>
              </button>
            )}

            <button
              onClick={() => setIsSetupOpen(true)}
              className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Supabase &amp; Vercel Deployment Checklist</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsAiOpen(true)}
              className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Gemini 2.5 Flash Concierge</span>
            </button>
          </div>

          <div className="font-mono text-[11px] text-slate-400">
            © 2026 AURA Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
