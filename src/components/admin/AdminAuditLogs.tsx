import React, { useState, useMemo } from 'react';
import { History, Search, Filter, ShieldCheck, User, Clock, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  const actionTypes = useMemo(() => {
    const set = new Set<string>();
    auditLogs.forEach((l) => set.add(l.action));
    return ['All', ...Array.from(set)];
  }, [auditLogs]);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (actionFilter !== 'All' && log.action !== actionFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          log.action.toLowerCase().includes(q) ||
          log.record.toLowerCase().includes(q) ||
          log.description.toLowerCase().includes(q) ||
          log.user.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [auditLogs, actionFilter, searchQuery]);

  const getActionBadge = (action: string) => {
    if (action.includes('Login')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (action.includes('Logout')) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (action.includes('Deleted')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (action.includes('Status')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (action.includes('Settings')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (action.includes('Content')) return 'bg-sky-50 text-sky-700 border-sky-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Administrative Governance & Security</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Immutable Trail</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Audit Activity Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically timestamped trail of all Super Admin logins, content updates, enquiry modifications, and deletions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>Total Recorded Events: <strong className="text-slate-900 font-bold">{auditLogs.length}</strong></span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by action, description, record ID, or administrator..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-4 flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Filter Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {actionTypes.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Target Record</th>
                <th className="py-3 px-4">Description / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-sans">
                    No audit records found matching your search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border font-sans ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-700 font-semibold font-sans">
                      {log.user}
                    </td>

                    <td className="py-3 px-4 text-blue-600 font-bold font-sans">
                      {log.record}
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-sans leading-relaxed">
                      {log.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
