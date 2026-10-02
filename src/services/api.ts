import { WebsiteSettings, WebsiteContent, Enquiry, AuditLog, DashboardStats, AdminUser } from '../types/admin';
import initialDb from '../data/db.json';

const STORAGE_KEYS = {
  SETTINGS: 'ke_website_settings_v2',
  CONTENT: 'ke_website_content_v2',
  ENQUIRIES: 'ke_website_enquiries_v2',
  AUDIT_LOGS: 'ke_website_audit_logs_v2',
  AUTH_TOKEN: 'ke_admin_auth_token_v2',
  ADMIN_USER: 'ke_admin_user_v2',
};

// Seed localStorage if empty
function initializeLocalStorage() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialDb.settings));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTENT)) {
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(initialDb.content));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(initialDb.enquiries));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(initialDb.auditLogs));
  }
}

initializeLocalStorage();

export const api = {
  // 1. Auth
  async login(username: string, password: string): Promise<{ success: boolean; user: AdminUser; token: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
        localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(data.user));
        return data;
      }
    } catch {
      // Fallback local authentication
    }

    // Local authentication fallback
    if (
      (username === 'superadmin' || username === 'admin' || username === 'kasturienterprises199@gmail.com') &&
      (password === 'AdminPassword@2026' || password === 'admin123' || password === 'Kasturi@2026')
    ) {
      const user: AdminUser = {
        id: 'admin-1',
        username: 'superadmin',
        name: 'Kasturi Super Admin',
        email: 'kasturienterprises199@gmail.com',
        role: 'Super Admin',
      };
      const token = `token-${Date.now()}`;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(user));
      await this.logAction('Admin Login', 'Authentication', 'Super Admin logged in');
      return { success: true, user, token };
    }

    throw new Error('Invalid credentials');
  },

  logout(): void {
    try {
      fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    } catch {}
    this.logAction('Admin Logout', 'Authentication', 'Super Admin logged out');
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
  },

  getCurrentUser(): AdminUser | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // 2. Settings
  async getSettings(): Promise<WebsiteSettings> {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data));
        return data;
      }
    } catch {}
    const local = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return local ? JSON.parse(local) : (initialDb.settings as WebsiteSettings);
  },

  async updateSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    let updated: WebsiteSettings;
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const data = await res.json();
        updated = data.settings;
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
        return updated;
      }
    } catch {}

    const current = await this.getSettings();
    updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    await this.logAction('Settings Updated', 'Global Settings', 'Updated website global settings & WhatsApp contact');
    return updated;
  },

  // 3. Content
  async getContent(): Promise<WebsiteContent> {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(data));
        return data;
      }
    } catch {}
    const local = localStorage.getItem(STORAGE_KEYS.CONTENT);
    return local ? JSON.parse(local) : (initialDb.content as unknown as WebsiteContent);
  },

  async updateContent(content: Partial<WebsiteContent>): Promise<WebsiteContent> {
    let updated: WebsiteContent;
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        const data = await res.json();
        updated = data.content;
        localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(updated));
        return updated;
      }
    } catch {}

    const current = await this.getContent();
    updated = { ...current, ...content };
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(updated));
    await this.logAction('Content Updated', 'Website Content', 'Updated website sections (Hero, About, FAQs, etc.)');
    return updated;
  },

  // 4. Enquiries
  async getEnquiries(): Promise<Enquiry[]> {
    try {
      const res = await fetch('/api/enquiries');
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(data));
        return data;
      }
    } catch {}
    const local = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    return local ? JSON.parse(local) : (initialDb.enquiries as Enquiry[]);
  },

  async createEnquiry(enquiryData: Partial<Enquiry>): Promise<Enquiry> {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryData),
      });
      if (res.ok) {
        const data = await res.json();
        const existing = await this.getEnquiries();
        const updatedList = [data.enquiry, ...existing.filter((e) => e.id !== data.enquiry.id)];
        localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(updatedList));
        return data.enquiry;
      }
    } catch {}

    // Fallback local creation
    const newEnquiry: Enquiry = {
      id: `enq-${Date.now()}`,
      reference: `KE-ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: enquiryData.name || 'Anonymous Client',
      email: enquiryData.email || '',
      phone: enquiryData.phone || '',
      whatsapp: enquiryData.whatsapp || enquiryData.phone || '+91 75909 071',
      organization: enquiryData.organization || '',
      subject: enquiryData.subject || 'Website Inquiry',
      message: enquiryData.message || '',
      source: enquiryData.source || 'Contact Form',
      status: 'New',
      priority: enquiryData.priority || 'Standard',
      createdAt: new Date().toISOString(),
      isRead: false,
      notes: [],
      productsRequested: enquiryData.productsRequested || [],
    };

    const current = await this.getEnquiries();
    const updated = [newEnquiry, ...current];
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(updated));
    await this.logAction('Enquiry Received', `Enquiry #${newEnquiry.reference}`, `New enquiry received from ${newEnquiry.name} (${newEnquiry.source})`);
    return newEnquiry;
  },

  async updateEnquiry(id: string, updates: Partial<Enquiry>): Promise<Enquiry> {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        const current = await this.getEnquiries();
        const updated = current.map((e) => (e.id === id ? data.enquiry : e));
        localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(updated));
        return data.enquiry;
      }
    } catch {}

    const current = await this.getEnquiries();
    const item = current.find((e) => e.id === id);
    if (!item) throw new Error('Enquiry not found');

    const prevStatus = item.status;
    const updatedItem = { ...item, ...updates };
    const updatedList = current.map((e) => (e.id === id ? updatedItem : e));
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(updatedList));

    if (updates.status && updates.status !== prevStatus) {
      await this.logAction('Enquiry Status Changed', `Enquiry #${item.reference}`, `Status changed from '${prevStatus}' to '${updates.status}'`);
    }

    return updatedItem;
  },

  async deleteEnquiry(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const current = await this.getEnquiries();
        const filtered = current.filter((e) => e.id !== id);
        localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(filtered));
        return true;
      }
    } catch {}

    const current = await this.getEnquiries();
    const toDelete = current.find((e) => e.id === id);
    const filtered = current.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(filtered));
    await this.logAction('Enquiry Deleted', toDelete ? `Enquiry #${toDelete.reference}` : id, 'Enquiry removed by Super Admin');
    return true;
  },

  // 5. Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const res = await fetch('/api/audit-logs');
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(data));
        return data;
      }
    } catch {}
    const local = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return local ? JSON.parse(local) : (initialDb.auditLogs as AuditLog[]);
  },

  async logAction(action: string, record: string, description: string): Promise<void> {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      user: 'superadmin',
      timestamp: new Date().toISOString(),
      record,
      description,
    };
    try {
      const current = await this.getAuditLogs();
      const updated = [newLog, ...current];
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
    } catch {}
  },

  // 6. Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const enquiries = await this.getEnquiries();
    const logs = await this.getAuditLogs();

    return {
      totalEnquiries: enquiries.length,
      unreadEnquiries: enquiries.filter((e) => !e.isRead).length,
      contactEnquiries: enquiries.filter((e) => e.source === 'Contact Form').length,
      rfqEnquiries: enquiries.filter((e) => e.source === 'RFQ Drawer').length,
      whatsappEnquiries: enquiries.filter((e) => e.source === 'WhatsApp Click').length,
      convertedEnquiries: enquiries.filter((e) => e.status === 'Converted').length,
      recentEnquiries: enquiries.slice(0, 5),
      recentActivity: logs.slice(0, 6),
    };
  },
};
