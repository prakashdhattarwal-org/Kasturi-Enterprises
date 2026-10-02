import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, ArrowUp, MessageSquare, Lock } from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const { settings } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappBase = settings.whatsappUrl || 'https://wa.me/9175909071';

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Address */}
          <div className="lg:col-span-5 space-y-4">
            <Logo variant="full" theme="dark" size="md" />
            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              Providing precision scientific equipment, analytical instruments, high-purity laboratory chemicals, and borosilicate glassware to Pune’s research, educational, and pharmaceutical ecosystem.
            </p>

            <div className="pt-2 space-y-2.5 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`${whatsappBase}?text=Hello%20Kasturi%20Enterprises,%20I%20have%20an%20enquiry.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 font-mono font-bold transition-colors"
                >
                  WhatsApp: {settings.whatsappNumber}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white font-mono transition-colors">
                  Call: {settings.phoneFormatted}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Product Categories
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Laboratory Chemicals (AR & HPLC)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Analytical Instruments & Balances
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Borosilicate 3.3 Glassware
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Micropipettes & Consumables
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Chemical Spill & Cleanroom Safety
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Navigation & Operating Info */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Pune Warehouse & Logistics
            </h4>
            <div className="space-y-2 text-slate-300">
              <p>
                <strong className="text-white">Operating Hours:</strong> {settings.operatingHours}
              </p>
              <p>
                <strong className="text-white">Delivery Hubs:</strong> Same-day dispatch to Kothrud, Hinjawadi, Bhosari MIDC, Sinhagad Road, COEP & SPPU Pune.
              </p>
              <div className="pt-2 flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-medium">GST Registered ({settings.gstNumber})</span>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to Top</span>
              </button>

              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-medium border border-slate-800 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Super Admin Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Regulatory Note & Quiet Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} {settings.websiteName}. All rights reserved. Scientific equipment and chemical supplier in Pune, Maharashtra.
          </p>
          <div className="flex items-center gap-4">
            <span>State: {settings.state}</span>
            <span aria-hidden="true">·</span>
            <span>Pin: {settings.pincode}</span>
            <span aria-hidden="true">·</span>
            <a
              href={`${whatsappBase}?text=Hello%20Kasturi%20Enterprises,%20I%20need%20a%20quotation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline font-mono"
            >
              WhatsApp: {settings.whatsappNumber}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
