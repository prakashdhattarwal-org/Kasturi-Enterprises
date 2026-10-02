import React from 'react';
import {
  Inbox,
  MessageSquare,
  FileCheck2,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileEdit,
  Settings,
  PhoneCall,
  History,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminTab } from './AdminSidebar';
import { Enquiry } from '../../types/admin';

interface AdminDashboardOverviewProps {
  onNavigateTab: (tab: AdminTab) => void;
  onSelectEnquiry: (enquiry: Enquiry) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  onNavigateTab,
  onSelectEnquiry,
}) => {
  const { enquiries, auditLogs, settings, unreadCount } = useApp();

  const totalEnquiries = enquiries.length;
  const contactFormEnquiries = enquiries.filter((e) => e.source === 'Contact Form').length;
  const rfqEnquiries = enquiries.filter((e) => e.source === 'RFQ Drawer').length;
  const whatsAppEnquiries = enquiries.filter((e) => e.source === 'WhatsApp Click').length;
  const convertedEnquiries = enquiries.filter((e) => e.status === 'Converted').length;

  const recentEnquiries = enquiries.slice(0, 5);
  const recentLogs = auditLogs.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Contacted':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Converted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Spam':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Super Admin Live Control Panel</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{settings.websiteName}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Welcome back, Super Admin
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            All content edits, enquiries, and global settings are synchronized live with the database and immediately reflected on the public website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('enquiries')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Inbox className="w-4 h-4" />
            <span>Manage Enquiries ({unreadCount} New)</span>
          </button>
          <button
            onClick={() => onNavigateTab('content')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <FileEdit className="w-4 h-4 text-sky-400" />
            <span>Edit Website Content</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Enquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enquiries</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-slate-900">{totalEnquiries}</span>
            <span className="text-xs text-slate-500 font-medium">All-time received</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Contact forms: <strong className="text-slate-800 font-mono">{contactFormEnquiries}</strong></span>
            <span>RFQ carts: <strong className="text-slate-800 font-mono">{rfqEnquiries}</strong></span>
          </div>
        </div>

        {/* Unread Enquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New / Unread</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-rose-600">{unreadCount}</span>
            <span className="text-xs text-slate-500 font-medium">Awaiting response</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Requires follow-up</span>
            <button
              onClick={() => onNavigateTab('enquiries')}
              className="text-blue-600 font-semibold hover:underline"
            >
              View list →
            </button>
          </div>
        </div>

        {/* WhatsApp Enquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">WhatsApp Clicks</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-emerald-600">{whatsAppEnquiries}</span>
            <span className="text-xs text-slate-500 font-medium">Tracked leads</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 truncate">
            <span className="truncate">Active No: <strong className="font-mono text-slate-800">{settings.whatsappNumber}</strong></span>
          </div>
        </div>

        {/* Converted Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Converted Orders</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-purple-600">{convertedEnquiries}</span>
            <span className="text-xs text-slate-500 font-medium">
              ({totalEnquiries > 0 ? Math.round((convertedEnquiries / totalEnquiries) * 100) : 0}% rate)
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> High conversion
            </span>
            <span>Pune & MH</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Enquiries & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Enquiries Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Customer & Laboratory Enquiries</h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time submissions from contact forms, WhatsApp, and RFQ</p>
              </div>
              <button
                onClick={() => onNavigateTab('enquiries')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All ({totalEnquiries})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Client / Institution</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentEnquiries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No enquiries received yet.
                      </td>
                    </tr>
                  ) : (
                    recentEnquiries.map((enq) => (
                      <tr
                        key={enq.id}
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                          !enq.isRead ? 'bg-blue-50/20 font-medium' : ''
                        }`}
                        onClick={() => onSelectEnquiry(enq)}
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{enq.name}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                            {enq.organization || enq.phone}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-slate-800 line-clamp-1 max-w-[200px]">{enq.subject}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {new Date(enq.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                            {enq.source}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(
                              enq.status
                            )}`}
                          >
                            {enq.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectEnquiry(enq);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing top {recentEnquiries.length} recent submissions</span>
            <button
              onClick={() => onNavigateTab('enquiries')}
              className="text-blue-600 hover:underline font-medium"
            >
              Open Complete Enquiry Management →
            </button>
          </div>
        </div>

        {/* Right Column: Quick Management & Audit Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Quick Administrative Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab('content')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <FileEdit className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                      Edit Homepage Hero
                    </div>
                    <div className="text-[11px] text-slate-500">Update headline, kicker, and live badge</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
              </button>

              <button
                onClick={() => onNavigateTab('settings')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                      Update WhatsApp Number
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Current: {settings.whatsappNumber}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
              </button>

              <button
                onClick={() => onNavigateTab('content')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                      Manage FAQs & Testimonials
                    </div>
                    <div className="text-[11px] text-slate-500">Edit institutional trust content</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600" />
              </button>
            </div>
          </div>

          {/* Recent Audit Activity */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>Recent Admin Activity</span>
              </h3>
              <button
                onClick={() => onNavigateTab('audit-logs')}
                className="text-[11px] text-blue-600 hover:underline font-semibold"
              >
                All Logs →
              </button>
            </div>

            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="text-xs pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                    <span className="font-semibold text-slate-700">{log.action}</span>
                    <span className="font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-snug">{log.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
