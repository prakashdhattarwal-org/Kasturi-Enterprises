import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactSection: React.FC = () => {
  const { settings, submitNewEnquiry } = useApp();

  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Inquiry / Price List');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitNewEnquiry({
        name: fullName,
        organization,
        phone,
        email,
        whatsapp: phone || settings.whatsappNumber,
        subject,
        message,
        source: 'Contact Form',
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit enquiry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappBase = settings.whatsappUrl || 'https://wa.me/9175909071';

  const handleSendViaWhatsApp = () => {
    // Log tracked lead to database
    submitNewEnquiry({
      name: fullName || 'WhatsApp Inquirer',
      organization,
      phone,
      whatsapp: settings.whatsappNumber,
      subject: `WhatsApp Enquiry: ${subject}`,
      message: message || 'Inquiry forwarded directly to official WhatsApp number',
      source: 'WhatsApp Click',
    }).catch(() => {});

    const text = `*NEW INQUIRY FROM WEBSITE*%0A%0A*Name:* ${encodeURIComponent(fullName || 'Client')}%0A*Lab/Company:* ${encodeURIComponent(organization || 'N/A')}%0A*Phone:* ${phone || 'N/A'}%0A*Email:* ${email || 'N/A'}%0A*Subject:* ${encodeURIComponent(subject)}%0A%0A*Message:*%0A${encodeURIComponent(message || 'I would like to inquire about laboratory chemicals and equipment.')}`;
    window.open(`${whatsappBase}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Connect with Pune Sales & Warehouse Desk</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Pune 411041</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Contact {settings.websiteName}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Reach out for bulk laboratory chemical pricing, instrument specifications, customized glassware fabrications, or tender requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contact Details & Landmark */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              {/* Address Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Registered Address & Depot
                    </h3>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {settings.websiteName}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {settings.address}
                    </p>
                    <div className="mt-3">
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Avadoot+Arcade+Pune+411041"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone & WhatsApp Card with Requested Number +91 75909 071 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Official WhatsApp Enquiry Desk
                      </h3>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Fast Reply
                      </span>
                    </div>

                    <div className="mt-1 flex items-baseline gap-2">
                      <a
                        href={`${whatsappBase}?text=Hello%20Kasturi%20Enterprises,%20I%20have%20an%20enquiry%20regarding%20scientific%20supplies.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-bold font-mono text-emerald-700 hover:text-emerald-800 transition-colors"
                      >
                        {settings.whatsappNumber}
                      </a>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Direct WhatsApp enquiry number for quotations, batch COA, and orders
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={`${whatsappBase}?text=Hello%20Kasturi%20Enterprises,%20I%20have%20an%20enquiry%20regarding%20scientific%20supplies.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp ({settings.whatsappNumber})</span>
                      </a>
                      <a
                        href={`tel:${settings.phone}`}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        <span>Call {settings.phoneFormatted}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Official Inquiries & Tenders Email
                    </h3>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors block mt-1 break-all"
                    >
                      {settings.email}
                    </a>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Send POs, university tender schedules, and vendor registration forms.
                    </p>
                  </div>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Operating Hours
                    </h3>
                    <p className="text-xs text-slate-800 font-medium mt-1">
                      {settings.operatingHours}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Same-day pickup counter available for urgent lab runs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Send an Online Inquiry / Quote Request
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Our Pune technical team will review your specifications and reply with price, COA availability, and delivery terms.
            </p>

            {isSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-emerald-900">Inquiry Received & Stored in Database</h4>
                  <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
                    Thank you, <strong>{fullName}</strong>. Your inquiry for <strong>{organization || 'your organization'}</strong> has been registered in our system. You can also forward it directly to our desk on WhatsApp for instant confirmation.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                  <button
                    onClick={handleSendViaWhatsApp}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Confirm on WhatsApp ({settings.whatsappNumber})</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setMessage('');
                    }}
                    className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Name / Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Rohan Mehta"
                      className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Institute / College / Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Pune University / Lab Diagnostics"
                      className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9096759191"
                      className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. purchase@company.com"
                      className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Inquiry Nature
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Product Inquiry / Price List">Product Inquiry / Price List</option>
                    <option value="Urgent Chemical Batch Requisition">Urgent Chemical Batch Requisition</option>
                    <option value="Instrument Demo & Installation (Spectrophotometer / Balance)">Instrument Demo & Installation</option>
                    <option value="Bulk College / University Semester Order">Bulk College / University Semester Order</option>
                    <option value="Custom Borosilicate Glassware Fabrication">Custom Borosilicate Glassware Fabrication</option>
                    <option value="Annual Rate Contract (ARC) Quotation">Annual Rate Contract (ARC) Quotation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Chemical Names, Specifications, or Quantities Needed <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="List chemical names (CAS number if applicable), grades (AR/LR/HPLC), volume/pack sizes, or specific equipment models..."
                    className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Recording...' : 'Submit Inquiry'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendViaWhatsApp}
                    className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                    title={`WhatsApp: ${settings.whatsappNumber}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Enquiry ({settings.whatsappNumber})</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
