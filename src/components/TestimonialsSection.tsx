import React, { useState } from 'react';
import { Star, Building2, Quote, Award, HelpCircle, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TestimonialsSection: React.FC = () => {
  const { content } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const testimonials = content.testimonials || [];
  const faqs = content.faqs || [];

  return (
    <section id="testimonials" className="py-12 lg:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Testimonials Header */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Institutional Trust & Client Reviews</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Pune & Maharashtra</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ textWrap: 'balance' }}>
              Trusted by Leading Research Institutes, Universities & Pharma Labs
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Read verified feedback from Pune laboratory in-charges, research scientists, and industrial QA/QC departments relying on Kasturi Enterprises.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Top Rating & Institution Tag */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {t.date}
                    </span>
                  </div>

                  {/* Quote Body */}
                  <p className="text-slate-700 text-sm leading-relaxed relative">
                    <Quote className="w-6 h-6 text-blue-100 absolute -top-2 -left-2 -z-10" />
                    "{t.content}"
                  </p>
                </div>

                {/* Attribution Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {t.name}
                    </h4>
                    <p className="text-xs text-blue-600 font-medium">
                      {t.role}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{t.organization}, {t.location}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Supplied</span>
                    <span className="text-[11px] font-medium text-slate-700 max-w-[140px] truncate block">
                      {t.verifiedPurchase}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic FAQ Accordion Section (Managed by Super Admin) */}
        {faqs.length > 0 && (
          <div className="pt-8 border-t border-slate-200">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Frequently Asked Questions</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Common Inquiries & Laboratory Procurement
              </h3>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full py-4 px-5 text-left flex items-center justify-between gap-3 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Institutional Client Logos / Proof Ribbon */}
        <div className="pt-6 border-t border-slate-200 text-center">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-4">
            Supplying Materials & Calibration Across Pune Academic & Industrial Clusters
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold text-slate-600">
            <span>Savitribai Phule Pune University (SPPU) Labs</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>COEP Technological University</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Bhosari & Chakan MIDC Industrial QA</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Hinjawadi Biotech Facilities</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Environmental Testing Labs</span>
          </div>
        </div>
      </div>
    </section>
  );
};
