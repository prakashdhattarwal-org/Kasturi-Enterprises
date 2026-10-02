import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LiveStockTicker } from './components/LiveStockTicker';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { RfqDrawer } from './components/RfqDrawer';
import { PuneDeliveryCoverage } from './components/PuneDeliveryCoverage';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { AppProvider, useApp } from './context/AppContext';
import { PRODUCTS_DATA } from './data/products';
import { Product, ProductCategory, RfqItem } from './types';
import { ShoppingCart, MessageSquare, ShieldCheck } from 'lucide-react';

function AppContent() {
  const { settings, isAdminAuthenticated, submitNewEnquiry } = useApp();

  const [products] = useState<Product[]>(PRODUCTS_DATA);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Admin view state
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const search = new URLSearchParams(window.location.search);
      return hash === '#admin' || search.get('admin') === 'true';
    }
    return false;
  });

  // Listen to hash changes (e.g. #admin)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminView(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update browser document title based on settings
  useEffect(() => {
    if (settings.metaTitle) {
      document.title = settings.metaTitle;
    }
  }, [settings.metaTitle]);

  // RFQ Cart state
  const [rfqItems, setRfqItems] = useState<RfqItem[]>([
    {
      product: PRODUCTS_DATA[0], // Methanol HPLC
      quantity: 2,
      packSize: PRODUCTS_DATA[0].packSize,
      needCoa: true,
      needMsds: true,
    },
  ]);
  const [isRfqDrawerOpen, setIsRfqDrawerOpen] = useState<boolean>(false);

  // Detail Modal state
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToRfq = (
    product: Product,
    quantity: number = 1,
    needCoa: boolean = true,
    needMsds: boolean = true
  ) => {
    setRfqItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: quantity > 1 ? quantity : updated[existingIndex].quantity + 1,
          needCoa,
          needMsds,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity,
            packSize: product.packSize,
            needCoa,
            needMsds,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setRfqItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setRfqItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setRfqItems([]);
  };

  const rfqItemIds = rfqItems.map((item) => item.product.id);

  // WhatsApp Enquiry Link
  const whatsappHref = settings.whatsappUrl || 'https://wa.me/9175909071';

  const handleFloatingWhatsAppClick = () => {
    submitNewEnquiry({
      name: 'Floating Button Visitor',
      source: 'WhatsApp Click',
      subject: 'Floating WhatsApp CTA Enquiry',
      message: 'Visitor clicked persistent floating WhatsApp Enquiry button',
      whatsapp: settings.whatsappNumber,
    }).catch(() => {});
  };

  // If in Super Admin view
  if (isAdminView) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onBackToWebsite={() => {
            setIsAdminView(false);
            if (window.location.hash === '#admin') {
              window.history.pushState('', document.title, window.location.pathname);
            }
          }}
          onLoginSuccess={() => {}}
        />
      );
    }
    return (
      <AdminLayout
        onViewPublicSite={() => {
          setIsAdminView(false);
          if (window.location.hash === '#admin') {
            window.history.pushState('', document.title, window.location.pathname);
          }
        }}
      />
    );
  }

  // Public Website View
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        rfqCount={rfqItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenRfq={() => setIsRfqDrawerOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAdmin={() => {
          window.location.hash = '#admin';
          setIsAdminView(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat as ProductCategory);
            handleNavigate('catalog');
          }}
          onNavigateToCatalog={() => handleNavigate('catalog')}
        />

        {/* Live Stock Ticker & Monitor */}
        <LiveStockTicker
          products={products}
          onSelectProduct={(p) => setDetailProduct(p)}
          onFilterInStockOnly={() => {
            setInStockOnly(!inStockOnly);
            handleNavigate('catalog');
          }}
          inStockFilterActive={inStockOnly}
        />

        {/* Product Catalog with Search, Filters, and Product Cards */}
        <ProductCatalog
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenProductDetail={(p) => setDetailProduct(p)}
          onAddToRfq={(p) => handleAddToRfq(p, 1)}
          rfqItemIds={rfqItemIds}
          inStockOnly={inStockOnly}
          onToggleInStockOnly={() => setInStockOnly(!inStockOnly)}
        />

        {/* Pune Delivery Network & Corridor Estimator */}
        <PuneDeliveryCoverage />

        {/* Customer Testimonials & FAQs from Pune Institutes & Pharma */}
        <TestimonialsSection />

        {/* Contact Details & Inquiry Form */}
        <ContactSection />
      </main>

      {/* Site Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={() => {
          window.location.hash = '#admin';
          setIsAdminView(true);
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToRfq={(product, quantity, needCoa, needMsds) => {
          handleAddToRfq(product, quantity, needCoa, needMsds);
          setDetailProduct(null);
          setIsRfqDrawerOpen(true);
        }}
        isAlreadyInRfq={detailProduct ? rfqItemIds.includes(detailProduct.id) : false}
      />

      {/* RFQ Drawer */}
      <RfqDrawer
        isOpen={isRfqDrawerOpen}
        onClose={() => setIsRfqDrawerOpen(false)}
        items={rfqItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Floating Action Buttons on Bottom Right */}
      <aside aria-label="Quick inquiry and quotation actions" className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        {/* Prominent WhatsApp Enquiry CTA (+91 75909 071) */}
        <a
          href={`${whatsappHref}?text=Hello%20Kasturi%20Enterprises,%20I%20need%20scientific%20supplies%20and%20chemicals%20in%20Pune.`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleFloatingWhatsAppClick}
          className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center group"
          title={`WhatsApp Enquiry: ${settings.whatsappNumber}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold px-0 group-hover:px-2.5">
            WhatsApp Enquiry ({settings.whatsappNumber})
          </span>
        </a>

        {/* RFQ Cart Button */}
        <button
          onClick={() => setIsRfqDrawerOpen(true)}
          className="p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center relative group"
          title="Open RFQ Quotation Cart"
        >
          <ShoppingCart className="w-5 h-5" />
          {rfqItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs border-2 border-white">
              {rfqItems.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          )}
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-semibold px-0 group-hover:px-2">
            View RFQ Cart ({rfqItems.length})
          </span>
        </button>
      </aside>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
