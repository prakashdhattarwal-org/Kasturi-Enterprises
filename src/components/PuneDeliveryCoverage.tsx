import React, { useState } from 'react';
import { Truck, MapPin, Shield, Clock, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PuneDeliveryCoverage: React.FC = () => {
  const { settings, submitNewEnquiry } = useApp();
  const [selectedHub, setSelectedHub] = useState<string>('pune-south');

  const corridors = [
    {
      id: 'pune-south',
      zone: 'Pune South / Local Hub',
      localities: 'Sinhagad Road, Narhe, Dhankawadi, Katraj, Ambegaon, NR Patil Pune 411041',
      speed: '60 – 90 Minutes Express',
      frequency: 'Continuous on-demand courier & counter pickup',
      type: 'Direct from Avadoot Arced Depot',
      highlight: 'Closest to Central Stockroom',
    },
    {
      id: 'pune-central',
      zone: 'Central Academic & Research Corridor',
      localities: 'Shivajinagar, COEP, SPPU Ganeshkhind, NCL Pashan, IISER, Deccan, Kothrud',
      speed: '2 – 3 Hours',
      frequency: 'Twice-daily scheduled university van',
      type: 'Laboratory Glassware & AR Reagents',
      highlight: 'Dedicated Academic Van',
    },
    {
      id: 'pune-west',
      zone: 'Hinjawadi IT & Biotech Park',
      localities: 'Hinjawadi Phase 1, 2, 3, Wakad, Baner, Balewadi, Mahalunge',
      speed: 'Same-Day (Dispatched by 11 AM)',
      frequency: 'Daily pharmaceutical runner service',
      type: 'HPLC Solvents & Analytical Instrumentation',
      highlight: 'Pharma & Biotech Hub',
    },
    {
      id: 'pune-north',
      zone: 'Bhosari & Chakan Industrial MIDC',
      localities: 'Bhosari MIDC, Chakan Auto Cluster, Pimpri, Chinchwad, Talawade, Moshi',
      speed: 'Same-Day Guaranteed',
      frequency: 'Daily heavy equipment & bulk chemical van',
      type: 'Bulk Acids, Drums, Analytical Balances',
      highlight: 'Industrial QA/QC Network',
    },
    {
      id: 'maharashtra',
      zone: 'Rest of Maharashtra',
      localities: 'Mumbai, Navi Mumbai, Nashik, Aurangabad / Chhatrapati Sambhajinagar, Kolhapur, Solapur',
      speed: '24 – 48 Hours',
      frequency: 'Insured hazardous chemical transport partners',
      type: 'All products with tamper-evident packaging',
      highlight: 'Statewide Express Logistics',
    },
  ];

  const activeCorridor = corridors.find((c) => c.id === selectedHub) || corridors[0];
  const whatsappBase = settings.whatsappUrl || 'https://wa.me/9175909071';

  const handleRequestDispatch = (zoneName: string) => {
    submitNewEnquiry({
      name: 'Logistics Inquirer',
      source: 'WhatsApp Click',
      subject: `Dispatch Inquiry for ${zoneName}`,
      message: `Client requested urgent delivery information for ${zoneName}`,
      whatsapp: settings.whatsappNumber,
    }).catch(() => {});
  };

  return (
    <section id="logistics" className="py-12 lg:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Logistics Overview */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                <Truck className="w-3.5 h-3.5" />
                <span>Rapid Pune Delivery Grid</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Pin: {settings.pincode}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Same-Day Supply Network Across Pune
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Operating directly from our fully stocked central facility at <strong>Shop No A-4, Avadoot Arced, NR patil, Pune 411041</strong>, we ensure uninterrupted supply chains for laboratories with strict temperature and solvent safety compliance.
              </p>
            </div>

            {/* Address & Facility Highlight Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Central Distribution Depot & Walk-In Counter:
                  </h4>
                  <p className="text-xs text-slate-700 mt-0.5 leading-snug">
                    {settings.address}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Dispatch Helpline:</span>
                <a
                  href={`tel:${settings.phone}`}
                  className="font-mono font-bold text-blue-600 hover:text-blue-700"
                >
                  {settings.phoneFormatted}
                </a>
              </div>
            </div>

            {/* Quality Logistics Guarantees */}
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>UN-certified leak-proof packaging for hazardous acids & solvents</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Shock-cushioned transit containers for high-precision Class A glassware</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Official Delivery Challan & Manufacturer COA included with consignments</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Pune Transit Corridor Selector */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span>Select Your Pune Lab Location</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Check guaranteed transit time and dispatch route from our 411041 warehouse.
              </p>
            </div>

            {/* Corridor Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {corridors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedHub(c.id)}
                  className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                    selectedHub === c.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-[10px] opacity-75 truncate">{c.highlight}</div>
                  <div className="truncate font-bold mt-0.5">{c.zone}</div>
                </button>
              ))}
            </div>

            {/* Selected Corridor Live Status Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                    {activeCorridor.zone}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">
                    Estimated Transit: <span className="text-emerald-600 font-mono">{activeCorridor.speed}</span>
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Warehouse Route</span>
                  <span className="font-mono text-xs font-semibold text-slate-800">411041 Express Hub</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Covered Areas: </span>
                  <span className="text-slate-800 font-medium">{activeCorridor.localities}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Dispatch Frequency: </span>
                  <span className="text-slate-800">{activeCorridor.frequency}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Primary Cargo Handled: </span>
                  <span className="text-slate-800">{activeCorridor.type}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500">Need urgent consignment right now?</span>
                <a
                  href={`${whatsappBase}?text=Hello%20Kasturi%20Enterprises,%20I%20need%20urgent%20dispatch%20to:%20${encodeURIComponent(activeCorridor.zone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleRequestDispatch(activeCorridor.zone)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Request Dispatch on WhatsApp ({settings.whatsappNumber})</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
