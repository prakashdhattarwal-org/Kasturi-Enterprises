import React, { useState, useMemo } from 'react';
import { Search, Plus, Check, MessageSquare, Eye, SlidersHorizontal, AlertCircle, FileCheck2, FlaskConical } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { CATEGORIES } from '../data/products';
import { useApp } from '../context/AppContext';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenProductDetail: (product: Product) => void;
  onAddToRfq: (product: Product) => void;
  rfqItemIds: string[];
  inStockOnly: boolean;
  onToggleInStockOnly: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenProductDetail,
  onAddToRfq,
  rfqItemIds,
  inStockOnly,
  onToggleInStockOnly,
}) => {
  const { settings, submitNewEnquiry } = useApp();
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'stock'>('featured');

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'All' && product.category !== selectedCategory) {
          return false;
        }

        // In-stock filter
        if (inStockOnly && product.stockStatus !== 'In Stock') {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(query);
          const matchSku = product.sku.toLowerCase().includes(query);
          const matchCas = product.casNumber ? product.casNumber.toLowerCase().includes(query) : false;
          const matchFormula = product.chemicalFormula ? product.chemicalFormula.toLowerCase().includes(query) : false;
          const matchSub = product.subCategory.toLowerCase().includes(query);
          const matchBrand = product.brand.toLowerCase().includes(query);
          const matchDesc = product.description.toLowerCase().includes(query);
          const matchApps = product.applications ? product.applications.some(a => a.toLowerCase().includes(query)) : false;

          return matchName || matchSku || matchCas || matchFormula || matchSub || matchBrand || matchDesc || matchApps;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'stock') {
          return b.stockUnits - a.stockUnits;
        }
        // Featured default
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [products, selectedCategory, inStockOnly, searchQuery, sortBy]);

  const whatsappBase = settings.whatsappUrl || 'https://wa.me/9175909071';

  const handleWhatsAppProduct = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hello Kasturi Enterprises, I am inquiring about: ${product.name} (SKU: ${product.sku}, Pack: ${product.packSize}). Is it currently available at your Pune warehouse?`;
    
    // Log enquiry lead
    submitNewEnquiry({
      name: 'Product Inquirer',
      source: 'WhatsApp Click',
      subject: `Product Inquiry: ${product.name}`,
      message: `User inquired about ${product.name} (SKU: ${product.sku}) via WhatsApp CTA`,
      whatsapp: settings.whatsappNumber,
      productsRequested: [
        {
          name: product.name,
          sku: product.sku,
          qty: 1,
          packSize: product.packSize,
        },
      ],
    }).catch(() => {});

    const url = `${whatsappBase}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="catalog" className="py-12 lg:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <span>Verified Laboratory Inventory</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Direct Pune Stock</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>COA & MSDS Included</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Scientific Equipment & Chemical Catalog
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Browse our inventory of analytical grade chemicals, laboratory instruments, and Class A borosilicate glassware ready for immediate dispatch from our Pune warehouse.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono">
              Showing <span className="font-semibold text-slate-900">{filteredProducts.length}</span> items
            </span>
          </div>
        </div>

        {/* Filter & Search Bar Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 space-y-4">
          {/* Top row: Category Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Bottom row: Search input, Stock toggle, Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2 border-t border-slate-100">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Filter by chemical name, CAS # (e.g. 67-56-1), SKU, or instrument..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 text-slate-900 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {/* In-Stock Only Toggle */}
            <div className="sm:col-span-3 flex items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={onToggleInStockOnly}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="font-medium">In Stock Only (Pune)</span>
              </label>
            </div>

            {/* Sort Select */}
            <div className="sm:col-span-3 flex items-center justify-end gap-2 text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured First</option>
                <option value="name">Product Name (A-Z)</option>
                <option value="stock">Highest Stock Units</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Products Matched Your Query</h3>
            <p className="text-xs text-slate-500 mt-1">
              We carry custom reagents and specialized laboratory equipment beyond the standard online catalog.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => {
                  onSearchChange('');
                  onSelectCategory('All');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
              >
                Reset Search Filters
              </button>
              <a
                href={`${whatsappBase}?text=Hello%20Kasturi%20Enterprises,%20I%20am%20looking%20for%20a%20product%20not%20found%20in%20the%20catalog:%20${encodeURIComponent(searchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Enquiry ({settings.whatsappNumber})</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isAdded = rfqItemIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => onOpenProductDetail(product)}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer group"
                >
                  {/* Image Container with Fallback */}
                  <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    
                    {/* Stock Status Pill Overlay */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-md px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1.5 shadow-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        product.stockStatus === 'In Stock' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      <span className={product.stockStatus === 'In Stock' ? 'text-emerald-700' : 'text-amber-700'}>
                        {product.stockStatus} ({product.stockUnits} units in Pune)
                      </span>
                    </div>

                    {/* Quick Specs Peek */}
                    {product.casNumber && (
                      <div className="absolute bottom-2.5 right-3 bg-slate-900/80 backdrop-blur-sm text-white rounded px-2 py-0.5 text-[10px] font-mono">
                        CAS: {product.casNumber}
                      </div>
                    )}
                  </div>

                  {/* Card Content Area */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Quiet Unboxed Metadata Line */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mb-1">
                        <span className="font-mono text-blue-600 font-semibold">{product.sku}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{product.subCategory}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{product.brand}</span>
                      </div>

                      {/* Product Title */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h3>

                      {/* Chemical Formula / Purity Grade Line */}
                      {(product.chemicalFormula || product.purityGrade) && (
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          {product.chemicalFormula && (
                            <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                              {product.chemicalFormula}
                            </span>
                          )}
                          {product.purityGrade && (
                            <span className="text-slate-600 text-xs truncate">
                              {product.purityGrade}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Description snippet */}
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Key Technical Specs List */}
                      <div className="mt-3 pt-2 border-t border-slate-100 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                        {product.keySpecs.slice(0, 2).map((spec, i) => (
                          <div key={i} className="truncate">
                            <span className="text-slate-400 font-normal">{spec.label}: </span>
                            <span className="text-slate-700 font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Pricing & Action Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Pack & Pricing</div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-bold font-mono text-slate-900">
                            {product.priceEstimate || 'Quote on Request'}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                            / {product.packSize.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleWhatsAppProduct(product, e)}
                          title={`WhatsApp Enquiry: ${settings.whatsappNumber}`}
                          className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onAddToRfq(product)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to RFQ</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
