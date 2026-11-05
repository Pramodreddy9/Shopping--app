import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, Check, SlidersHorizontal } from 'lucide-react';
import { Product, ProductCategory } from '../types';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onAddToCart,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const categories: ProductCategory[] = ['All', 'Audio', 'Wearables', 'Living', 'Leather'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId((current) => (current === product.id ? null : current));
    }, 1500);
  };

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-6 py-12">
      {/* Catalog Controls: Categories, Search, and Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200">
        {/* Interactive Segmented Filter Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar & Sorter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products or specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="relative shrink-0 flex items-center">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="pl-8 pr-7 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer appearance-none"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Count & Stock Availability Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 py-4">
        <span>Showing {filteredProducts.length} curated design objects</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-emerald-700 font-medium">Real-time Stock Synchronization</span>
          <span aria-hidden="true">·</span>
          <span>Orders dispatch in 24h</span>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-sm font-medium text-slate-600">No products match your search or filter.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-3 px-4 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const isJustAdded = addedProductId === product.id;
            const isLowStock = product.stockQuantity <= 10 && product.stockQuantity > 0;
            const isOutOfStock = product.stockQuantity <= 0;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Product Image Stage (65-70% height) with Fallback Container */}
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to placeholder color in case of offline/network failure
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Stock & Origin Badges (Max 1 quiet tag) */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.badge && (
                      <span className="text-[11px] font-semibold text-slate-900 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md shadow-xs">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    {isOutOfStock ? (
                      <span className="text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Out of stock
                      </span>
                    ) : isLowStock ? (
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {product.stockQuantity} left in stock
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        In stock ({product.stockQuantity})
                      </span>
                    )}
                  </div>

                  {/* Quick Action Overlay on Hover */}
                  <div className="absolute inset-x-0 bottom-3 px-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="flex-1 py-2 text-xs font-semibold text-slate-800 bg-white/95 hover:bg-white backdrop-blur-md rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Specifications</span>
                    </button>
                    <button
                      disabled={isOutOfStock}
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white'
                          : isOutOfStock
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    {/* Unboxed Metadata with Typographic Separator */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                      <span className="font-medium text-slate-600 uppercase tracking-wider">{product.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>★ {product.rating.toFixed(1)} ({product.reviewsCount})</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing row with Tabular Numerals */}
                  <div className="flex items-baseline justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold font-mono text-slate-950 tabular-nums">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs font-mono text-slate-400 line-through tabular-nums">
                          ${product.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-slate-400">
                      SKU: {product.id.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
