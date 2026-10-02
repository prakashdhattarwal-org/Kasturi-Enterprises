import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  FileEdit,
  Settings,
  History,
  ExternalLink,
  LogOut,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Logo } from '../Logo';
import { useApp } from '../../context/AppContext';

export type AdminTab = 'dashboard' | 'enquiries' | 'content' | 'settings' | 'audit-logs';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onViewPublicSite: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onViewPublicSite,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { adminUser, logoutAdmin, unreadCount } = useApp();

  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'enquiries' as AdminTab,
      label: 'Enquiries',
      icon: Inbox,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      id: 'content' as AdminTab,
      label: 'Content Management',
      icon: FileEdit,
      badge: null,
    },
    {
      id: 'settings' as AdminTab,
      label: 'Website Settings',
      icon: Settings,
      badge: null,
    },
    {
      id: 'audit-logs' as AdminTab,
      label: 'Audit Logs',
      icon: History,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand & Mobile Close */}
          <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
            <Logo variant="compact" theme="dark" size="sm" />
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Super Admin User Profile Pill */}
          <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-sky-400 flex items-center justify-center font-bold font-mono text-sm">
                SA
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">
                  {adminUser?.name || 'Super Admin'}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-sky-400 font-semibold uppercase tracking-wider mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-sky-400" />
                  <span>Super Admin Role</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        isActive ? 'bg-white text-blue-700' : 'bg-rose-500 text-white animate-pulse'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/30">
          <button
            onClick={onViewPublicSite}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
