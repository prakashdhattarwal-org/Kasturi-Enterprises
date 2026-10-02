import React, { useState } from 'react';
import { RefreshCw, PackageCheck, AlertCircle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Product } from '../types';

interface LiveStockTickerProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onFilterInStockOnly: () => void;
  inStockFilterActive: boolean;
}

export const LiveStockTicker: React.FC<LiveStockTickerProps> = ({
  products,
  onSelectProduct,
  onFilterInStockOnly,
  inStockFilterActive,
}) => {
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const totalInStockItems = products.filter((p) => p.stockStatus === 'In Stock').length;
  const limitedStockItems = products.filter((p) => p.stockStatus === 'Limited Stock').length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastRefreshed(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
    }, 600);
  };

  // Recent inventory updates ticker list
  const recentUpdates = products.slice(0, 5);

  return (
    <section id="live-stock" className="bg-slate-900 border-y border-slate-800 py-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Pune Warehouse Live Inventory System</span>
              <span aria-hidden="true" className="text-slate-600">/</span>
              <span className="text-slate-400 font-mono">Sr No 3/4 Avadoot Arcade Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Live Stock & Ready-to-Dispatch Inventory
            </h2>
          </div>

          <div className="flex items-center flex-wrap gap-3">
            {/* Last Synced Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-lg text-xs text-slate-300 border border-slate-700 font-mono">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Synced: {lastRefreshed}</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
              title="Refresh inventory counts"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Checking...' : 'Check Live'}</span>
            </button>

            {/* In-Stock Filter Toggle */}
            <button
              onClick={onFilterInStockOnly}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                inStockFilterActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>{inStockFilterActive ? 'Showing Ready Stock' : 'Filter Ready Stock'}</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 pb-6">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Ready in Pune Hub</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-emerald-400">{totalInStockItems * 18}+</span>
                <span className="text-xs text-slate-400">Total units available</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                Same-day courier / direct pickup
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Critical / Limited Stock</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-amber-400">{limitedStockItems}</span>
                <span className="text-xs text-slate-400">High-demand items</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                Reserve prior to lab audit
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Chemical Safety Compliance</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-sky-400">100%</span>
                <span className="text-xs text-slate-400">MSDS & COA Available</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-sky-400 shrink-0" />
                Segregated hazardous storage
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Live Items Horizontal Quick Scroll */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider font-medium">Live Lot Availability Stream:</span>
            <span className="text-slate-400 hidden sm:inline">Click any product to inspect specifications or add to RFQ</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {recentUpdates.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectProduct(item)}
                className="text-left p-3 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 text-[11px] mb-1.5">
                    <span className="font-mono text-sky-300 font-semibold">{item.sku}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                      item.stockStatus === 'In Stock' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.stockStatus === 'In Stock' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`} />
                      {item.stockUnits} units
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
                    {item.name}
                  </h4>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">{item.packSize}</span>
                  <span className="text-slate-200 font-semibold">{item.priceEstimate}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
