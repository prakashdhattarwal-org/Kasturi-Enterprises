import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  HelpCircle,
  Award,
  Layers,
  Info,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WebsiteContent } from '../../types/admin';

type ContentSubTab = 'hero' | 'about' | 'services' | 'faqs' | 'testimonials' | 'banner';

interface AdminContentManagerProps {
  onViewPublicSite: () => void;
}

export const AdminContentManager: React.FC<AdminContentManagerProps> = ({ onViewPublicSite }) => {
  const { content, updateWebsiteContent, settings, updateWebsiteSettings } = useApp();
  const [activeTab, setActiveTab] = useState<ContentSubTab>('hero');
  const [formData, setFormData] = useState<WebsiteContent>(JSON.parse(JSON.stringify(content)));
  const [bannerNotice, setBannerNotice] = useState(settings.bannerNotice);
  const [showBanner, setShowBanner] = useState(settings.showBanner);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync if context updates
  React.useEffect(() => {
    setFormData(JSON.parse(JSON.stringify(content)));
  }, [content]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setIsSaved(false);

    try {
      await Promise.all([
        updateWebsiteContent(formData),
        updateWebsiteSettings({ bannerNotice, showBanner }),
      ]);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (err) {
      console.error('Error saving content:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper methods for dynamic arrays
  const addService = () => {
    const newService = {
      id: `srv-${Date.now()}`,
      title: 'New Laboratory Service',
      description: 'Comprehensive supply, testing, and compliance documentation support for research and industrial labs.',
    };
    setFormData({ ...formData, services: [...formData.services, newService] });
  };

  const removeService = (id: string) => {
    setFormData({
      ...formData,
      services: formData.services.filter((s) => s.id !== id),
    });
  };

  const addFaq = () => {
    const newFaq = {
      id: `faq-${Date.now()}`,
      question: 'Frequently Asked Question regarding chemical supplies?',
      answer: 'Detailed response outlining purity, delivery turnaround, and compliance standards.',
    };
    setFormData({ ...formData, faqs: [...formData.faqs, newFaq] });
  };

  const removeFaq = (id: string) => {
    setFormData({
      ...formData,
      faqs: formData.faqs.filter((f) => f.id !== id),
    });
  };

  const addTestimonial = () => {
    const newTestimonial = {
      id: `test-${Date.now()}`,
      name: 'Dr. New Customer',
      role: 'Research Scientist',
      organization: 'Pune Research Institute',
      department: 'Department of Chemistry',
      location: 'Pune, Maharashtra',
      content: 'Kasturi Enterprises provides exceptional delivery speed and pristine batch certification for our laboratory needs.',
      rating: 5,
      verifiedPurchase: 'AR Chemicals & Glassware',
      date: 'October 2026',
    };
    setFormData({
      ...formData,
      testimonials: [...formData.testimonials, newTestimonial],
    });
  };

  const removeTestimonial = (id: string) => {
    setFormData({
      ...formData,
      testimonials: formData.testimonials.filter((t) => t.id !== id),
    });
  };

  const subTabs = [
    { id: 'hero' as ContentSubTab, label: 'Hero & Headlines', icon: Sparkles },
    { id: 'about' as ContentSubTab, label: 'About & Metrics', icon: Info },
    { id: 'services' as ContentSubTab, label: 'Services & Solutions', icon: Layers },
    { id: 'faqs' as ContentSubTab, label: 'FAQs', icon: HelpCircle },
    { id: 'testimonials' as ContentSubTab, label: 'Testimonials', icon: Award },
    { id: 'banner' as ContentSubTab, label: 'Notice Banners', icon: AlertCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Website Content Management System</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Live Sync to Frontend</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Edit Public Website Content
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Every change saved here updates the database and immediately updates the live public website.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onViewPublicSite}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Preview Public Site</span>
          </button>

          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving to Database...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Content Published Successfully! </span>
              <span>The database has been updated and the public website now reflects your new content.</span>
            </div>
          </div>
          <button
            onClick={onViewPublicSite}
            className="underline font-bold text-emerald-800 hover:text-emerald-950 shrink-0 ml-4"
          >
            Check Live Site →
          </button>
        </div>
      )}

      {/* Tab Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap border-b-2 -mb-px ${
                isActive
                  ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Form Body */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        {/* 1. HERO SECTION */}
        {activeTab === 'hero' && (
          <div className="space-y-5 max-w-3xl">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Homepage Hero Section</h3>
              <p className="text-xs text-slate-500">Edit the primary headline, value proposition, and CTA buttons seen by visitors.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kicker / Trust Label (Top Pill)
                </label>
                <input
                  type="text"
                  value={formData.hero.kicker}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, kicker: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Main Headline (H1)
                </label>
                <textarea
                  rows={2}
                  value={formData.hero.headline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, headline: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Subheadline / Body Paragraph
                </label>
                <textarea
                  rows={3}
                  value={formData.hero.subheadline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, subheadline: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.hero.ctaText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, ctaText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Secondary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.hero.ctaSecondaryText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, ctaSecondaryText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Live Stock Badge Text
                  </label>
                  <input
                    type="text"
                    value={formData.hero.badgeText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, badgeText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ABOUT SECTION */}
        {activeTab === 'about' && (
          <div className="space-y-5 max-w-3xl">
            <div>
              <h3 className="text-sm font-bold text-slate-900">About Kasturi Enterprises</h3>
              <p className="text-xs text-slate-500">Edit company background, years in operation, and laboratory milestones.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  About Section Headline
                </label>
                <input
                  type="text"
                  value={formData.about.headline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, headline: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Company Story / Mission
                </label>
                <textarea
                  rows={4}
                  value={formData.about.story}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, story: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Experience Metric
                  </label>
                  <input
                    type="text"
                    value={formData.about.experienceYears}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, experienceYears: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Labs & Clients Served
                  </label>
                  <input
                    type="text"
                    value={formData.about.clientsServed}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, clientsServed: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Active Catalog SKUs
                  </label>
                  <input
                    type="text"
                    value={formData.about.productsSupplied}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, productsSupplied: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Certifications & Compliance Line
                </label>
                <input
                  type="text"
                  value={formData.about.certifications}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, certifications: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. SERVICES SECTION */}
        {activeTab === 'services' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Laboratory Services & Offerings</h3>
                <p className="text-xs text-slate-500">Manage specialized services displayed to prospective institutional buyers.</p>
              </div>
              <button
                type="button"
                onClick={addService}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.services.map((service, index) => (
                <div key={service.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 font-mono">Service #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeService(service.id)}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                    <div className="sm:col-span-5">
                      <label className="block font-medium text-slate-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => {
                          const updated = [...formData.services];
                          updated[index].title = e.target.value;
                          setFormData({ ...formData, services: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                      />
                    </div>
                    <div className="sm:col-span-7">
                      <label className="block font-medium text-slate-700 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={service.description}
                        onChange={(e) => {
                          const updated = [...formData.services];
                          updated[index].description = e.target.value;
                          setFormData({ ...formData, services: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. FAQS SECTION */}
        {activeTab === 'faqs' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Frequently Asked Questions (FAQs)</h3>
                <p className="text-xs text-slate-500">Address common questions regarding COA, dispatch, payment, and hazardous solvents.</p>
              </div>
              <button
                type="button"
                onClick={addFaq}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.faqs.map((faq, index) => (
                <div key={faq.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 font-mono">FAQ #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFaq(faq.id)}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Question</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const updated = [...formData.faqs];
                          updated[index].question = e.target.value;
                          setFormData({ ...formData, faqs: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Answer</label>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = [...formData.faqs];
                          updated[index].answer = e.target.value;
                          setFormData({ ...formData, faqs: updated });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. TESTIMONIALS SECTION */}
        {activeTab === 'testimonials' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Customer Testimonials & Case Reviews</h3>
                <p className="text-xs text-slate-500">Manage verified reviews from Pune educational, pharma, and research clients.</p>
              </div>
              <button
                type="button"
                onClick={addTestimonial}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Testimonial</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.testimonials.map((test, index) => (
                <div key={test.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 font-mono">Testimonial #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeTestimonial(test.id)}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Author Name</label>
                      <input
                        type="text"
                        value={test.name}
                        onChange={(e) => {
                          const updated = [...formData.testimonials];
                          updated[index].name = e.target.value;
                          setFormData({ ...formData, testimonials: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Role / Designation</label>
                      <input
                        type="text"
                        value={test.role}
                        onChange={(e) => {
                          const updated = [...formData.testimonials];
                          updated[index].role = e.target.value;
                          setFormData({ ...formData, testimonials: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Organization / College</label>
                      <input
                        type="text"
                        value={test.organization}
                        onChange={(e) => {
                          const updated = [...formData.testimonials];
                          updated[index].organization = e.target.value;
                          setFormData({ ...formData, testimonials: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block font-medium text-slate-700 mb-1">Quote Content</label>
                    <textarea
                      rows={2}
                      value={test.content}
                      onChange={(e) => {
                        const updated = [...formData.testimonials];
                        updated[index].content = e.target.value;
                        setFormData({ ...formData, testimonials: updated });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Verified Purchase Tag</label>
                      <input
                        type="text"
                        value={test.verifiedPurchase}
                        onChange={(e) => {
                          const updated = [...formData.testimonials];
                          updated[index].verifiedPurchase = e.target.value;
                          setFormData({ ...formData, testimonials: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Date Stamp</label>
                      <input
                        type="text"
                        value={test.date}
                        onChange={(e) => {
                          const updated = [...formData.testimonials];
                          updated[index].date = e.target.value;
                          setFormData({ ...formData, testimonials: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. BANNER & ANNOUNCEMENTS */}
        {activeTab === 'banner' && (
          <div className="space-y-5 max-w-3xl">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Website Announcement Banner</h3>
              <p className="text-xs text-slate-500">Configure the top notice ribbon displayed at the highest layer of the public website.</p>
            </div>

            <div className="space-y-4 text-xs">
              <label className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBanner}
                  onChange={(e) => setShowBanner(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Show Top Announcement Banner</span>
                  <span className="text-[11px] text-slate-500">Controls visibility of the top header ribbon</span>
                </div>
              </label>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Banner Notice Text
                </label>
                <input
                  type="text"
                  value={bannerNotice}
                  onChange={(e) => setBannerNotice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Save Bar at bottom */}
        <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Unsaved changes will be discarded if you navigate away without clicking Save.
          </span>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish Live to Website'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
