import React, { createContext, useContext, useState, useEffect } from 'react';
import { WebsiteSettings, WebsiteContent, Enquiry, AuditLog, AdminUser, EnquiryStatus } from '../types/admin';
import { api } from '../services/api';
import initialDb from '../data/db.json';

interface AppContextType {
  settings: WebsiteSettings;
  content: WebsiteContent;
  enquiries: Enquiry[];
  auditLogs: AuditLog[];
  adminUser: AdminUser | null;
  unreadCount: number;
  isLoading: boolean;
  isAdminAuthenticated: boolean;
  
  // Auth methods
  loginAdmin: (user: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => void;

  // Management methods
  updateWebsiteSettings: (newSettings: Partial<WebsiteSettings>) => Promise<boolean>;
  updateWebsiteContent: (newContent: Partial<WebsiteContent>) => Promise<boolean>;
  
  // Enquiry methods
  submitNewEnquiry: (enquiry: Partial<Enquiry>) => Promise<Enquiry>;
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => Promise<void>;
  markEnquiryAsRead: (id: string, isRead: boolean) => Promise<void>;
  addEnquiryNote: (id: string, noteText: string) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;

  // Audit log methods
  addAuditLog: (action: string, record: string, description: string) => Promise<void>;
  
  // Refresh
  refreshAll: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(initialDb.settings as WebsiteSettings);
  const [content, setContent] = useState<WebsiteContent>(initialDb.content as unknown as WebsiteContent);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialDb.enquiries as Enquiry[]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialDb.auditLogs as AuditLog[]);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(api.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAll = async () => {
    try {
      const [s, c, e, a] = await Promise.all([
        api.getSettings(),
        api.getContent(),
        api.getEnquiries(),
        api.getAuditLogs(),
      ]);
      setSettings(s);
      setContent(c);
      setEnquiries(e);
      setAuditLogs(a);
    } catch (err) {
      console.error('Failed to refresh data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const loginAdmin = async (user: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.login(user, pass);
      if (res.success) {
        setAdminUser(res.user);
        await refreshAll();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logoutAdmin = () => {
    api.logout();
    setAdminUser(null);
  };

  const updateWebsiteSettings = async (newSettings: Partial<WebsiteSettings>): Promise<boolean> => {
    try {
      const updated = await api.updateSettings(newSettings);
      setSettings(updated);
      const logs = await api.getAuditLogs();
      setAuditLogs(logs);
      return true;
    } catch (err) {
      console.error('Failed to update settings:', err);
      return false;
    }
  };

  const updateWebsiteContent = async (newContent: Partial<WebsiteContent>): Promise<boolean> => {
    try {
      const updated = await api.updateContent(newContent);
      setContent(updated);
      const logs = await api.getAuditLogs();
      setAuditLogs(logs);
      return true;
    } catch (err) {
      console.error('Failed to update content:', err);
      return false;
    }
  };

  const submitNewEnquiry = async (enquiryData: Partial<Enquiry>): Promise<Enquiry> => {
    const created = await api.createEnquiry(enquiryData);
    setEnquiries((prev) => [created, ...prev.filter((e) => e.id !== created.id)]);
    const logs = await api.getAuditLogs();
    setAuditLogs(logs);
    return created;
  };

  const updateEnquiryStatus = async (id: string, status: EnquiryStatus) => {
    const updated = await api.updateEnquiry(id, { status });
    setEnquiries((prev) => prev.map((e) => (e.id === id ? updated : e)));
    const logs = await api.getAuditLogs();
    setAuditLogs(logs);
  };

  const markEnquiryAsRead = async (id: string, isRead: boolean) => {
    const updated = await api.updateEnquiry(id, { isRead });
    setEnquiries((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const addEnquiryNote = async (id: string, noteText: string) => {
    const target = enquiries.find((e) => e.id === id);
    if (!target) return;
    const newNote = {
      id: `n-${Date.now()}`,
      author: adminUser?.name || 'Super Admin',
      text: noteText,
      date: new Date().toISOString(),
    };
    const updatedNotes = [...(target.notes || []), newNote];
    const updated = await api.updateEnquiry(id, { notes: updatedNotes });
    setEnquiries((prev) => prev.map((e) => (e.id === id ? updated : e)));
    const logs = await api.getAuditLogs();
    setAuditLogs(logs);
  };

  const deleteEnquiry = async (id: string) => {
    await api.deleteEnquiry(id);
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    const logs = await api.getAuditLogs();
    setAuditLogs(logs);
  };

  const addAuditLog = async (action: string, record: string, description: string) => {
    await api.logAction(action, record, description);
    const logs = await api.getAuditLogs();
    setAuditLogs(logs);
  };

  const unreadCount = enquiries.filter((e) => !e.isRead).length;

  return (
    <AppContext.Provider
      value={{
        settings,
        content,
        enquiries,
        auditLogs,
        adminUser,
        unreadCount,
        isLoading,
        isAdminAuthenticated: !!adminUser,
        loginAdmin,
        logoutAdmin,
        updateWebsiteSettings,
        updateWebsiteContent,
        submitNewEnquiry,
        updateEnquiryStatus,
        markEnquiryAsRead,
        addEnquiryNote,
        deleteEnquiry,
        addAuditLog,
        refreshAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
