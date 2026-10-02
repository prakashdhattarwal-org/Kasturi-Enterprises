import React, { useState } from 'react';
import { X, Trash2, Send, MessageSquare, Printer, CheckCircle2, Building, Mail, Phone, MapPin, FileCheck, ArrowRight } from 'lucide-react';
import { RfqItem } from '../types';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';

interface RfqDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: RfqItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const RfqDrawer: React.FC<RfqDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const { settings, submitNewEnquiry } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('Pune City & Suburbs');
  const [gstin, setGstin] = useState('');
  const [urgency, setUrgency] = useState<'Standard' | 'Urgent (< 24h)' | 'Emergency'>('Standard');
  const [notes, setNotes] = useState('');

  const [submittedRfqRef, setSubmittedRfqRef] = useState<string | null>(null);
  const [showProformaPreview, setShowProformaPreview] = useState(false);

  if (!isOpen) return null;

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const generateRfqRef = () => {
    return `KE-RFQ-${Date.now().toString().slice(-6)}`;
  };

  const whatsappBase = settings.whatsappUrl || 'https://wa.me/9175909071';

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = generateRfqRef();
    setSubmittedRfqRef(ref);

    // Save to database
    submitNewEnquiry({
      name: customerName || 'Procurement Client',
      email: email,
      phone: phone,
      whatsapp: phone || settings.whatsappNumber,
      organization: organization || 'Laboratory Requisition',
      subject: `RFQ Requisition [${ref}] - ${items.length} Products`,
      message: `Delivery Destination: ${deliveryArea}\nGSTIN: ${gstin || 'N/A'}\nUrgency: ${urgency}\nNotes: ${notes || 'None'}\nProducts:\n${items
        .map((i) => `• ${i.product.name} (Qty: ${i.quantity}, ${i.packSize})`)
        .join('\n')}`,
      source: 'RFQ Drawer',
      priority: urgency === 'Emergency' ? 'Emergency' : urgency === 'Urgent (< 24h)' ? 'Urgent' : 'Standard',
      productsRequested: items.map((i) => ({
        name: i.product.name,
        sku: i.product.sku,
        qty: i.quantity,
        packSize: i.packSize,
      })),
    }).catch(() => {});

    let message = `*REQUEST FOR QUOTATION (RFQ)*%0A*Ref:* ${ref}%0A*To:* KASTURI ENTERPRISES, Pune%0A%0A`;
    message += `*CLIENT DETAILS:*%0A`;
    message += `• *Name:* ${customerName || 'Procurement Officer'}%0A`;
    message += `• *Institution/Company:* ${organization || 'Research / Industrial Lab'}%0A`;
    message += `• *Phone:* ${phone || 'Not provided'}%0A`;
    message += `• *Email:* ${email || 'Not provided'}%0A`;
    message += `• *Delivery Locality:* ${deliveryArea}%0A`;
    if (gstin) message += `• *GSTIN:* ${gstin}%0A`;
    message += `• *Urgency:* ${urgency}%0A%0A`;

    message += `*REQUESTED CHEMICALS & INSTRUMENTS:*%0A`;
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*%0A`;
      message += `   SKU: ${item.product.sku} | Pack: ${item.packSize}%0A`;
      message += `   Qty: *${item.quantity}* | COA: ${item.needCoa ? 'Yes' : 'No'} | MSDS: ${item.needMsds ? 'Yes' : 'No'}%0A`;
    });

    if (notes) {
      message += `%0A*Special Notes:* ${encodeURIComponent(notes)}%0A`;
    }

    message += `%0A_Please provide your official B2B quotation, tax invoice, and Pune delivery timeline._`;

    const url = `${whatsappBase}?text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = generateRfqRef();
    setSubmittedRfqRef(ref);

    // Save to database
    submitNewEnquiry({
      name: customerName || 'Procurement Client',
      email: email,
      phone: phone,
      whatsapp: phone,
      organization: organization || 'Laboratory Requisition',
      subject: `Email RFQ [${ref}]: Laboratory Supplies for ${organization || customerName}`,
      message: `Destination: ${deliveryArea}\nUrgency: ${urgency}\nItems:\n${items
        .map((i) => `• ${i.product.name} (Qty: ${i.quantity})`)
        .join('\n')}`,
      source: 'RFQ Drawer',
      productsRequested: items.map((i) => ({
        name: i.product.name,
        sku: i.product.sku,
        qty: i.quantity,
        packSize: i.packSize,
      })),
    }).catch(() => {});

    const subject = encodeURIComponent(`RFQ [${ref}]: Laboratory Equipment & Chemicals for ${organization || customerName}`);
    let body = `To: Kasturi Enterprises (${settings.email})\n`;
    body += `From: ${customerName} (${organization})\n`;
    body += `Contact: ${phone} | Email: ${email}\n`;
    body += `Delivery Address: ${deliveryArea}, Pune, Maharashtra\n`;
    if (gstin) body += `GSTIN: ${gstin}\n`;
    body += `Urgency: ${urgency}\n\n`;
    body += `Requested Items:\n`;
    items.forEach((item, i) => {
      body += `${i + 1}. ${item.product.name} (SKU: ${item.product.sku}) - Qty: ${item.quantity} [${item.packSize}] (COA: ${item.needCoa ? 'Yes' : 'No'}, MSDS: ${item.needMsds ? 'Yes' : 'No'})\n`;
    });
    if (notes) body += `\nSpecial Notes:\n${notes}\n`;

    const mailto = `mailto:${settings.email}?subject=${subject}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Logo variant="compact" theme="dark" size="sm" />
            <div className="border-l border-slate-700 pl-3">
              <h2 className="text-sm font-bold text-white tracking-tight">
                Request for Quotation (RFQ)
              </h2>
              <p className="text-[11px] text-slate-400">
                {items.length} product(s) · {totalItemCount} total units
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close RFQ Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Your Quotation Cart is Empty</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Explore the chemical and equipment catalog and click "Add to RFQ" to compile your batch requisition.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Browse Product Catalog
              </button>
            </div>
          ) : (
            <>
              {/* Submission Confirmation Banner if submitted */}
              {submittedRfqRef && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      RFQ Reference: {submittedRfqRef} Recorded
                    </h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Your inquiry has been stored in our system and forwarded to the sales desk. Kasturi Enterprises will provide the official commercial quote and COA.
                    </p>
                  </div>
                </div>
              )}

              {/* Selected Products List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Selected Items ({items.length})
                  </h3>
                  <button
                    onClick={onClearCart}
                    className="text-[11px] text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                  {items.map((item) => (
                    <div key={item.product.id} className="p-3.5 bg-white flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-0.5">
                          <span className="font-mono text-blue-600 font-bold">{item.product.sku}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{item.product.category}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug truncate">
                          {item.product.name}
                        </h4>
                        <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-600">
                          <span>Pack: <strong className="text-slate-800">{item.packSize}</strong></span>
                          <span>Est: <strong className="font-mono text-slate-800">{item.product.priceEstimate}</strong></span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded">
                            COA: {item.needCoa ? 'Requested' : 'No'}
                          </span>
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded">
                            MSDS: {item.needMsds ? 'Requested' : 'No'}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white text-xs">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 py-1 font-mono font-bold text-slate-900 min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client & Institutional Details Form */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    <span>Requisitioner & Organization Details</span>
                  </h3>
                  <span className="text-[10px] text-slate-500">For Pune tax invoice & dispatch</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Contact Person / Scientist <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Shinde"
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Organization / College / Lab <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. SPPU Chemistry / Serum Institute"
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Contact Phone (10 digits) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9822012345"
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. lab.purchasing@institute.edu"
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Delivery Destination</label>
                    <select
                      value={deliveryArea}
                      onChange={(e) => setDeliveryArea(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Pune - Kothrud / Deccan / Shivaji Nagar">Pune - Kothrud / Deccan / Shivaji Nagar</option>
                      <option value="Pune - Hinjawadi Infotech Park">Pune - Hinjawadi Infotech Park</option>
                      <option value="Pune - Bhosari / Chakan MIDC">Pune - Bhosari / Chakan MIDC</option>
                      <option value="Pune - Sinhagad Road / Narhe (Local Hub)">Pune - Sinhagad Road / Narhe (Local Hub)</option>
                      <option value="Pune - Hadapsar / Magarpatta">Pune - Hadapsar / Magarpatta</option>
                      <option value="Pune - SPPU / NCL / IISER Pashan">Pune - SPPU / NCL / IISER Pashan</option>
                      <option value="Other Maharashtra Location (Rest of State)">Other Maharashtra Location</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">GSTIN Number (Optional)</label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="e.g. 27ABCDE1234F1Z5"
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-xs">
                    Dispatch Urgency
                  </label>
                  <div className="flex gap-2 text-xs">
                    {(['Standard', 'Urgent (< 24h)', 'Emergency'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setUrgency(mode)}
                        className={`flex-1 py-1.5 px-2 rounded-lg font-medium border transition-colors ${
                          urgency === mode
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1 text-xs">
                    Special Packaging / Certification Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specific bottle type, custom lot COA parameters, or gate delivery instructions..."
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* On-screen Printable Preview Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowProformaPreview(!showProformaPreview)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{showProformaPreview ? 'Hide Formal Proforma Preview' : 'Preview Formal B2B Quotation Sheet'}</span>
                </button>

                {showProformaPreview && (
                  <div className="mt-3 p-5 border-2 border-dashed border-slate-300 rounded-xl bg-white text-slate-900 font-sans text-xs space-y-4 shadow-inner">
                    <div className="flex items-start justify-between border-b pb-3">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{settings.websiteName}</h4>
                        <p className="text-[11px] text-slate-600 max-w-xs">{settings.address}</p>
                        <p className="text-[11px] text-slate-600 font-mono">
                          Ph: {settings.phoneFormatted} | WhatsApp: {settings.whatsappNumber} | {settings.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-1 rounded">PROFORMA RFQ</span>
                        <p className="text-[10px] text-slate-400 mt-1">Date: {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[11px] bg-slate-50 p-2.5 rounded">
                      <div>
                        <strong>Inquiry For:</strong> {customerName || 'N/A'}<br />
                        <strong>Organization:</strong> {organization || 'N/A'}<br />
                        <strong>Contact:</strong> {phone || 'N/A'}
                      </div>
                      <div>
                        <strong>Delivery Area:</strong> {deliveryArea}<br />
                        <strong>GSTIN:</strong> {gstin || settings.gstNumber || 'Unregistered / Exempt'}<br />
                        <strong>Urgency:</strong> {urgency}
                      </div>
                    </div>

                    <table className="w-full text-[11px] border border-slate-200">
                      <thead className="bg-slate-100 border-b">
                        <tr>
                          <th className="p-1.5 text-left">#</th>
                          <th className="p-1.5 text-left">Item Description</th>
                          <th className="p-1.5 text-left">SKU</th>
                          <th className="p-1.5 text-center">Qty</th>
                          <th className="p-1.5 text-right">Est. Unit Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {items.map((it, idx) => (
                          <tr key={it.product.id}>
                            <td className="p-1.5">{idx + 1}</td>
                            <td className="p-1.5 font-medium">{it.product.name}</td>
                            <td className="p-1.5 font-mono text-[10px]">{it.product.sku}</td>
                            <td className="p-1.5 text-center font-bold font-mono">{it.quantity}</td>
                            <td className="p-1.5 text-right font-mono">{it.product.priceEstimate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="text-right pt-2 border-t text-[10px] text-slate-500">
                      Official commercial price quotation subject to prevailing GST rates & batch verification.
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* WhatsApp Submission (Primary Instant Pathway) */}
              <button
                type="button"
                onClick={handleWhatsAppSubmit}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                title={`WhatsApp: ${settings.whatsappNumber}`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Enquiry ({settings.whatsappNumber})</span>
              </button>

              {/* Email Submission */}
              <button
                type="button"
                onClick={handleEmailSubmit}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Submit RFQ via Email</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Direct Sales Contact: <strong className="text-slate-800 font-mono">{settings.phone}</strong></span>
              <button
                onClick={handlePrint}
                className="text-slate-600 hover:text-slate-900 underline flex items-center gap-1"
              >
                <Printer className="w-3 h-3" /> Print Proforma
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
