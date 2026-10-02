import React, { useState } from 'react';
import {
  Menu,
  Bell,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminContentManager } from './AdminContentManager';
import { AdminEnquiriesManager } from './AdminEnquiriesManager';
import { AdminSettingsManager } from './AdminSettingsManager';
import { AdminAuditLogs } from './AdminAuditLogs';
import { useApp } from '../../context/AppContext';
import { Enquiry } from '../../types/admin';

interface AdminLayoutProps {
  onViewPublicSite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onViewPublicSite }) => {
  const { adminUser, logoutAdmin, unreadCount, refreshAll } = useApp();
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSelectEnquiryFromDashboard = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setCurrentTab('enquiries');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAll();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const tabLabels: Record<AdminTab, string> = {
    dashboard: 'Dashboard Overview',
    enquiries: 'Enquiry Management',
    content: 'Website Content Management',
    settings: 'Website Settings & WhatsApp',
    'audit-logs': 'Audit Logs',
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans antialiased text-slate-900">
      {/* Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onViewPublicSite={onViewPublicSite}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="text-slate-400">Super Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-bold">{tabLabels[currentTab]}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sync / Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
              title="Refresh database data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            {/* Notification Bell with Unread Badge */}
            <button
              onClick={() => setCurrentTab('enquiries')}
              className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title={`${unreadCount} unread enquiries`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {/* View Live Public Site CTA */}
            <button
              onClick={onViewPublicSite}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>Live Website</span>
            </button>

            {/* Super Admin Pill */}
            <div className="border-l border-slate-200 pl-3 flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold text-slate-900 leading-none">
                  {adminUser?.name || 'Super Admin'}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  Authenticated
                </div>
              </div>
              <button
                onClick={logoutAdmin}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic View Tab Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <AdminDashboardOverview
              onNavigateTab={setCurrentTab}
              onSelectEnquiry={handleSelectEnquiryFromDashboard}
            />
          )}

          {currentTab === 'content' && (
            <AdminContentManager onViewPublicSite={onViewPublicSite} />
          )}

          {currentTab === 'enquiries' && (
            <AdminEnquiriesManager
              selectedEnquiryFromDashboard={selectedEnquiry}
              onClearSelectedEnquiry={() => setSelectedEnquiry(null)}
            />
          )}

          {currentTab === 'settings' && (
            <AdminSettingsManager onViewPublicSite={onViewPublicSite} />
          )}

          {currentTab === 'audit-logs' && <AdminAuditLogs />}
        </main>
      </div>
    </div>
  );
};
