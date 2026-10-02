import { Testimonial } from './index';

export interface WebsiteSettings {
  websiteName: string;
  tagline: string;
  phone: string;
  phoneFormatted: string;
  whatsappNumber: string;
  whatsappUrl: string;
  email: string;
  address: string;
  locality: string;
  pincode: string;
  state: string;
  operatingHours: string;
  gstNumber: string;
  metaTitle: string;
  metaDescription: string;
  bannerNotice: string;
  showBanner: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface WebsiteContent {
  hero: {
    kicker: string;
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaSecondaryText: string;
    badgeText: string;
  };
  about: {
    headline: string;
    story: string;
    experienceYears: string;
    clientsServed: string;
    productsSupplied: string;
    certifications: string;
  };
  services: ServiceItem[];
  faqs: FaqItem[];
  testimonials: Testimonial[];
}

export type EnquiryStatus =
  | 'New'
  | 'Contacted'
  | 'In Progress'
  | 'Follow-up'
  | 'Converted'
  | 'Closed'
  | 'Spam';

export interface EnquiryNote {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Enquiry {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  organization: string;
  subject: string;
  message: string;
  source: 'Contact Form' | 'WhatsApp Click' | 'RFQ Drawer' | 'Product Inquiry';
  status: EnquiryStatus;
  priority: 'Standard' | 'Urgent' | 'Emergency';
  createdAt: string;
  isRead: boolean;
  notes: EnquiryNote[];
  productsRequested?: Array<{
    name: string;
    sku: string;
    qty: number;
    packSize: string;
  }>;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'Super Admin';
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  record: string;
  description: string;
}

export interface DashboardStats {
  totalEnquiries: number;
  unreadEnquiries: number;
  contactEnquiries: number;
  rfqEnquiries: number;
  whatsappEnquiries: number;
  convertedEnquiries: number;
  recentEnquiries: Enquiry[];
  recentActivity: AuditLog[];
}
