import React from 'react';
import { Search, ArrowRight, ShieldCheck, Truck, FileText, CheckCircle2, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCategory: (category: string) => void;
  onNavigateToCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onNavigateToCatalog,
}) => {
  const { content, settings, submitNewEnquiry } = useApp();

  const popularSearches = [
    'Methanol HPLC',
    'Sulphuric Acid AR',
    'UV-Vis Spectrophotometer',
    'Analytical Balance',
    'Borosilicate Flasks',
    'Micropipettes',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToCatalog();
  };

  const handleWhatsAppClick = () => {
    // Log tracked lead to database
    submitNewEnquiry({
      name: 'Website Visitor',
      source: 'WhatsApp Click',
      subject: 'Hero CTA WhatsApp Enquiry',
      message: 'Visitor clicked primary WhatsApp Enquiry CTA from homepage hero.',
      phone: settings.whatsappNumber,
      whatsapp: settings.whatsappNumber,
    }).catch(() => {});
  };

  const whatsappHref = settings.whatsappUrl || 'https://wa.me/9175909071';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-12 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Subtle Precision Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #60A5FA 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clean Unboxed Metadata Kicker (Anti-Pill compliant) */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-sky-400 uppercase">
              <span>{content.hero.kicker}</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span>Shop No A-4, Avadoot Arced, Pune 411041</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span>Same Day Dispatch</span>
            </div>

            {/* Display Headline with text-wrap: balance */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              {content.hero.headline}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {content.hero.subheadline}
            </p>

            {/* Action Buttons: Catalog + Prominent WhatsApp Enquiry CTA */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onNavigateToCatalog}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2"
              >
                <span>{content.hero.ctaText || 'Explore Product Catalog'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`${whatsappHref}?text=Hello%20Kasturi%20Enterprises,%20I%20would%20like%20to%20make%20an%20enquiry%20regarding%20scientific%20equipment%20and%20chemicals.`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2"
                title={`WhatsApp: ${settings.whatsappNumber}`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{content.hero.ctaSecondaryText || 'WhatsApp Enquiry'} ({settings.whatsappNumber})</span>
              </a>
            </div>

            {/* Interactive Search Bar in Hero */}
            <div className="pt-2 max-w-2xl">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-5 h-5 text-blue-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search chemicals by name or CAS #, or equipment (e.g. Methanol, Balance, Autoclave)..."
                  className="w-full pl-12 pr-32 py-3.5 bg-white text-slate-900 rounded-xl text-sm font-medium placeholder-slate-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Instant Search Suggestions */}
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-slate-300">
                <span className="text-slate-400">Common Searches:</span>
                {popularSearches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      onSearchChange(item);
                      onNavigateToCatalog();
                    }}
                    className="text-sky-300 hover:text-white underline decoration-sky-500/40 hover:decoration-sky-300 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Core Trust Pillars */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-900/60 text-sky-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Purity & COA</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Batch tested with Certificate of Analysis & MSDS</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-900/60 text-sky-400 shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Pune City Dispatch</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Express 2-4 hr delivery to Hinjawadi, Bhosari & Kothrud</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-900/60 text-sky-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Instant B2B Quotes</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Official RFQ generation with GSTIN tax invoices</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Laboratory Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-blue-800/50 bg-slate-800">
              {/* Image with fallback */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <img
                  src="/src/assets/images/hero_scientific_lab_pune_1790963209292.jpg"
                  alt="Modern scientific laboratory with analytical instrumentation and chemicals supplied by Kasturi Enterprises Pune"
                  className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Live Pune Inventory Badge */}
                <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md border border-slate-700 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold text-white">{content.hero.badgeText || 'Pune Stock Live: 450+ Active SKUs'}</span>
                </div>
              </div>

              {/* Quick Facility Details Box */}
              <div className="p-5 bg-slate-900/90 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium text-slate-300">Central Warehouse & Showroom:</span>
                  <span className="text-emerald-400 font-mono font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Walk-in & Dispatch
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-snug font-sans">
                  {settings.address}
                </p>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    onClick={onNavigateToCatalog}
                    className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg text-center transition-colors"
                  >
                    Explore Product Catalog
                  </button>
                  <a
                    href={`tel:${settings.phone}`}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg text-center transition-colors font-mono"
                  >
                    Call: {settings.phoneFormatted}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
