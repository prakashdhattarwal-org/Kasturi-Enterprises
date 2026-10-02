import React, { useState } from 'react';
import { Phone, ShoppingCart, Menu, X, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  rfqCount: number;
  onOpenRfq: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  rfqCount,
  onOpenRfq,
  activeSection,
  onNavigate,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings, isAdminAuthenticated, unreadCount } = useApp();

  const navLinks = [
    { label: 'Catalog', id: 'catalog' },
    { label: 'Live Stock', id: 'live-stock' },
    { label: 'Pune Logistics', id: 'logistics' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  const whatsappHref = settings.whatsappUrl || 'https://wa.me/9175909071';

  return (
    <>
      {/* Precision Top Utility Bar with Pune Warehouse Live Dispatch info & Announcement */}
      {settings.showBanner && (
        <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="font-medium text-white truncate">
                {settings.bannerNotice || 'Pune Central Warehouse (Sr No 3/4 Avadoot Arced): Active Dispatching'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs shrink-0">
              <div className="hidden md:flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>{settings.operatingHours || '9:00 AM – 7:30 PM'}</span>
              </div>
              <a
                href={`tel:${settings.phone}`}
                className="text-white hover:text-sky-300 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3 h-3 text-sky-400" />
                <span className="font-mono">{settings.phoneFormatted}</span>
              </a>
              {/* Discrete Super Admin portal entry */}
              <button
                onClick={onOpenAdmin}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-sky-300 transition-colors pl-2 border-l border-slate-700"
                title="Super Admin Portal"
              >
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                <span>Admin</span>
                {unreadCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Bar Contract: Zone 1 (Brand), Zone 2 (4-6 nav links), Zone 3 (1-2 primary actions) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Zone 1: Brand wordmark element */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="flex items-center text-left focus:outline-none group"
            aria-label="Kasturi Enterprises Home"
          >
            <Logo variant="compact" size="md" />
          </button>

          {/* Zone 2: 4-6 text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap ${
                    isActive ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary action button + RFQ Cart Trigger + WhatsApp Enquiry */}
          <div className="flex items-center gap-3">
            {/* Prominent WhatsApp Enquiry CTA (Requirement #1: https://wa.me/9175909071) */}
            <a
              href={`${whatsappHref}?text=Hello%20Kasturi%20Enterprises,%20I%20would%20like%20to%20make%20an%20enquiry%20regarding%20scientific%20equipment%20and%20chemicals.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              title={`WhatsApp: ${settings.whatsappNumber}`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Enquiry</span>
            </a>

            {/* RFQ Cart Button */}
            <button
              onClick={onOpenRfq}
              className="relative inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              aria-label={`Quotation Cart with ${rfqCount} items`}
            >
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">RFQ Quote</span>
              {rfqCount > 0 ? (
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-white bg-blue-600 rounded-full">
                  {rfqCount}
                </span>
              ) : (
                <span className="text-[11px] text-slate-500 font-normal hidden sm:inline">(0)</span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left px-3 py-2 text-base font-medium rounded-md ${
                    activeSection === link.id
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {/* WhatsApp Enquiry Button Mobile */}
              <a
                href={`${whatsappHref}?text=Hello%20Kasturi%20Enterprises,%20I%20would%20like%20to%20make%20an%20enquiry%20regarding%20scientific%20supplies.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Enquiry ({settings.whatsappNumber})</span>
              </a>

              <a
                href={`tel:${settings.phone}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Call {settings.phoneFormatted}</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center justify-center gap-2 w-full py-2 px-4 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Super Admin Portal {unreadCount > 0 ? `(${unreadCount} Unread)` : ''}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
