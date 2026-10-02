import React, { useState } from 'react';
import { X, Check, Plus, MessageSquare, Phone, ShieldCheck, FileText, MapPin, Truck, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToRfq: (product: Product, quantity: number, needCoa: boolean, needMsds: boolean) => void;
  isAlreadyInRfq: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToRfq,
  isAlreadyInRfq,
}) => {
  const { settings, submitNewEnquiry } = useApp();

  if (!product) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [needCoa, setNeedCoa] = useState<boolean>(true);
  const [needMsds, setNeedMsds] = useState<boolean>(true);

  const whatsappBase = settings.whatsappUrl || 'https://wa.me/9175909071';

  const handleWhatsApp = () => {
    // Log inquiry lead to database
    submitNewEnquiry({
      name: 'Product Modal Inquirer',
      source: 'WhatsApp Click',
      subject: `Modal Inquiry: ${product.name}`,
      message: `Client requested quotation for ${quantity} x ${product.packSize} of ${product.name} (SKU: ${product.sku}) with COA: ${needCoa ? 'Yes' : 'No'} and MSDS: ${needMsds ? 'Yes' : 'No'}`,
      whatsapp: settings.whatsappNumber,
      productsRequested: [
        {
          name: product.name,
          sku: product.sku,
          qty: quantity,
          packSize: product.packSize,
        },
      ],
    }).catch(() => {});

    const text = `Hello Kasturi Enterprises,%0A%0AI would like to place an inquiry for:%0A*Product:* ${encodeURIComponent(product.name)}%0A*SKU:* ${product.sku}%0A*Pack:* ${encodeURIComponent(product.packSize)}%0A*Quantity:* ${quantity}%0A*Warehouse:* ${encodeURIComponent(product.puneWarehouseLocation)}%0A*COA Required:* ${needCoa ? 'Yes' : 'No'}%0A*MSDS Required:* ${needMsds ? 'Yes' : 'No'}%0A%0APlease provide current pricing, batch COA, and Pune delivery timeline.`;
    window.open(`${whatsappBase}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleAdd = () => {
    onAddToRfq(product, quantity, needCoa, needMsds);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              {product.sku}
            </span>
            <span className="text-xs text-slate-500 font-medium truncate">{product.category}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: Image & Stock pill */}
            <div className="md:col-span-5 space-y-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Warehouse Location Info Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pune Warehouse Stock</span>
                </div>
                <div className="text-slate-600 leading-snug">
                  {product.puneWarehouseLocation}
                </div>
                <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Dispatch Speed:</span>
                  <span className="text-emerald-700 font-semibold">{product.dispatchTime}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Current Lot:</span>
                  <span className="font-mono font-medium text-slate-800">{product.stockUnits} units on hand</span>
                </div>
              </div>

              {/* Storage Condition */}
              {product.storageCondition && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Storage Condition: </span>
                    <span>{product.storageCondition}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Technical Details & Specifications */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {product.name}
                </h2>

                {/* Subtitle / Chemical Details */}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                  {product.casNumber && (
                    <span className="font-mono">
                      <strong className="text-slate-700">CAS:</strong> {product.casNumber}
                    </span>
                  )}
                  {product.chemicalFormula && (
                    <span className="font-mono">
                      <strong className="text-slate-700">Formula:</strong> {product.chemicalFormula}
                    </span>
                  )}
                  {product.purityGrade && (
                    <span>
                      <strong className="text-slate-700">Grade:</strong> {product.purityGrade}
                    </span>
                  )}
                </div>

                <div className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </div>
              </div>

              {/* Technical Specifications Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100/80 px-3.5 py-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Technical Specifications & Assay
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="grid grid-cols-2 px-3.5 py-2 bg-white">
                    <span className="text-slate-500 font-medium">Standard Pack Size</span>
                    <span className="text-slate-900 font-semibold">{product.packSize}</span>
                  </div>
                  <div className="grid grid-cols-2 px-3.5 py-2 bg-slate-50/50">
                    <span className="text-slate-500 font-medium">Brand / Manufacturer</span>
                    <span className="text-slate-900 font-semibold">{product.brand}</span>
                  </div>
                  {product.keySpecs.map((spec, i) => (
                    <div key={i} className={`grid grid-cols-2 px-3.5 py-2 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                      <span className="text-slate-500 font-medium">{spec.label}</span>
                      <span className="text-slate-900 font-semibold font-mono">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance & Document Toggles */}
              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Quality Assurance & Documentation</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needCoa}
                      onChange={(e) => setNeedCoa(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Attach Batch Certificate of Analysis (COA)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needMsds}
                      onChange={(e) => setNeedMsds(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Attach Material Safety Data Sheet (MSDS)</span>
                  </label>
                </div>
              </div>

              {/* Quantity Stepper & Price */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">Estimated Price</span>
                  <div className="text-xl font-bold font-mono text-slate-900">
                    {product.priceEstimate || 'Quote on Request'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 font-medium">Quantity:</span>
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-mono font-bold text-slate-900 min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors flex-1 sm:flex-initial"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>Call Pune Desk</span>
            </a>
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex-1 sm:flex-initial shadow-xs"
              title={`WhatsApp: ${settings.whatsappNumber}`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Enquiry ({settings.whatsappNumber})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex-1 sm:flex-initial"
            >
              {isAlreadyInRfq ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Update in RFQ</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to RFQ Quotation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
