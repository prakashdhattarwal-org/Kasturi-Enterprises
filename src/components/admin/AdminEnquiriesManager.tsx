import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MessageSquare,
  Trash2,
  Check,
  Eye,
  Phone,
  Mail,
  Building,
  Calendar,
  Clock,
  Send,
  AlertCircle,
  FileCheck2,
  X,
  ExternalLink,
  Tag,
  ArrowUpDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Enquiry, EnquiryStatus } from '../../types/admin';

interface AdminEnquiriesManagerProps {
  selectedEnquiryFromDashboard?: Enquiry | null;
  onClearSelectedEnquiry?: () => void;
}

export const AdminEnquiriesManager: React.FC<AdminEnquiriesManagerProps> = ({
  selectedEnquiryFromDashboard,
  onClearSelectedEnquiry,
}) => {
  const {
    enquiries,
    updateEnquiryStatus,
    markEnquiryAsRead,
    addEnquiryNote,
    deleteEnquiry,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Active detail modal
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(
    selectedEnquiryFromDashboard || null
  );
  const [noteInput, setNoteInput] = useState('');
  const [enquiryToDelete, setEnquiryToDelete] = useState<Enquiry | null>(null);

  React.useEffect(() => {
    if (selectedEnquiryFromDashboard) {
      setActiveEnquiry(selectedEnquiryFromDashboard);
    }
  }, [selectedEnquiryFromDashboard]);

  const allStatuses: EnquiryStatus[] = [
    'New',
    'Contacted',
    'In Progress',
    'Follow-up',
    'Converted',
    'Closed',
    'Spam',
  ];

  const filteredEnquiries = useMemo(() => {
    return enquiries
      .filter((item) => {
        // Status filter
        if (statusFilter !== 'All' && item.status !== statusFilter) {
          return false;
        }
        // Source filter
        if (sourceFilter !== 'All' && item.source !== sourceFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = item.name.toLowerCase().includes(q);
          const matchEmail = item.email.toLowerCase().includes(q);
          const matchPhone = item.phone.toLowerCase().includes(q);
          const matchOrg = item.organization.toLowerCase().includes(q);
          const matchSubject = item.subject.toLowerCase().includes(q);
          const matchRef = item.reference.toLowerCase().includes(q);
          const matchMsg = item.message.toLowerCase().includes(q);

          return matchName || matchEmail || matchPhone || matchOrg || matchSubject || matchRef || matchMsg;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [enquiries, statusFilter, sourceFilter, searchQuery, sortBy]);

  const handleOpenDetail = (item: Enquiry) => {
    setActiveEnquiry(item);
    if (!item.isRead) {
      markEnquiryAsRead(item.id, true);
    }
  };

  const handleCloseDetail = () => {
    setActiveEnquiry(null);
    if (onClearSelectedEnquiry) {
      onClearSelectedEnquiry();
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEnquiry || !noteInput.trim()) return;
    await addEnquiryNote(activeEnquiry.id, noteInput.trim());
    setNoteInput('');
    // refresh active item from state
    const updated = enquiries.find((x) => x.id === activeEnquiry.id);
    if (updated) {
      setActiveEnquiry(updated);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!enquiryToDelete) return;
    await deleteEnquiry(enquiryToDelete.id);
    if (activeEnquiry?.id === enquiryToDelete.id) {
      setActiveEnquiry(null);
    }
    setEnquiryToDelete(null);
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Contacted':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Follow-up':
        return 'bg-sky-50 text-sky-700 border-sky-200';
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
      {/* Top Header & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Customer & Laboratory Communications</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Total: {enquiries.length} Enquiries</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Enquiry Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor, prioritize, assign internal notes, and update statuses for all incoming RFQs and WhatsApp messages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">
            Showing <strong className="text-slate-900 font-bold">{filteredEnquiries.length}</strong> matching records
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, institute, phone, subject, or Ref #..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3 flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses ({enquiries.length})</option>
              {allStatuses.map((st) => (
                <option key={st} value={st}>
                  {st} ({enquiries.filter((e) => e.status === st).length})
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div className="sm:col-span-2 flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Sources</option>
              <option value="Contact Form">Contact Form</option>
              <option value="RFQ Drawer">RFQ Drawer</option>
              <option value="WhatsApp Click">WhatsApp Click</option>
            </select>
          </div>

          {/* Sort Select */}
          <div className="sm:col-span-2 flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Client Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Enquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Ref & Date</th>
                <th className="py-3 px-4">Client / Institution</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Subject & Message</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No enquiries found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => (
                  <tr
                    key={enq.id}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                      !enq.isRead ? 'bg-blue-50/20 font-medium' : ''
                    }`}
                    onClick={() => handleOpenDetail(enq)}
                  >
                    {/* Ref & Date */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {!enq.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" title="Unread" />
                        )}
                        <span className="font-mono font-bold text-slate-900">{enq.reference}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {new Date(enq.createdAt).toLocaleDateString()} · {new Date(enq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Client / Organization */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{enq.name}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                        {enq.organization || 'Individual Lab Requisition'}
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1 font-mono text-slate-800">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{enq.phone || 'N/A'}</span>
                      </div>
                      {enq.email && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate max-w-[140px] mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{enq.email}</span>
                        </div>
                      )}
                    </td>

                    {/* Subject & Message */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 line-clamp-1 max-w-[200px]">
                        {enq.subject}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 max-w-[220px] mt-0.5">
                        {enq.message}
                      </div>
                    </td>

                    {/* Source */}
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                        {enq.source}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={enq.status}
                        onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as EnquiryStatus)}
                        className={`text-[10px] font-bold py-1 px-2 rounded border focus:outline-none cursor-pointer ${getStatusBadge(
                          enq.status
                        )}`}
                      >
                        {allStatuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {enq.phone && (
                          <a
                            href={`https://wa.me/91${enq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                              enq.name
                            )},%20this%20is%20Kasturi%20Enterprises%20regarding%20your%20enquiry%20(${enq.reference}).`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Reply on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          onClick={() => handleOpenDetail(enq)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Full Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setEnquiryToDelete(enq)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded">
                    {activeEnquiry.reference}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                      activeEnquiry.status
                    )}`}
                  >
                    {activeEnquiry.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Enquiry Details
                </h3>
              </div>

              <button
                onClick={handleCloseDetail}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Customer Info Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Client Name</span>
                  <span className="text-sm font-bold text-slate-900">{activeEnquiry.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Organization / Lab</span>
                  <span className="text-xs font-medium text-slate-800">{activeEnquiry.organization || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Contact Phone</span>
                  <a href={`tel:${activeEnquiry.phone}`} className="font-mono font-bold text-blue-600 hover:underline">
                    {activeEnquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Email</span>
                  <a href={`mailto:${activeEnquiry.email}`} className="text-blue-600 hover:underline">
                    {activeEnquiry.email || 'Not provided'}
                  </a>
                </div>
              </div>

              {/* Subject & Detailed Message */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Subject</span>
                <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900">
                  {activeEnquiry.subject}
                </div>

                <span className="text-[10px] text-slate-400 uppercase font-semibold block pt-2">Full Message / Requisition</span>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {activeEnquiry.message}
                </div>
              </div>

              {/* Status Selector */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-700">Update Lead Status:</span>
                <select
                  value={activeEnquiry.status}
                  onChange={async (e) => {
                    const nextStatus = e.target.value as EnquiryStatus;
                    await updateEnquiryStatus(activeEnquiry.id, nextStatus);
                    setActiveEnquiry({ ...activeEnquiry, status: nextStatus });
                  }}
                  className={`text-xs font-bold py-1.5 px-3 rounded-lg border focus:outline-none cursor-pointer ${getStatusBadge(
                    activeEnquiry.status
                  )}`}
                >
                  {allStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Internal Notes Trail */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <span className="font-bold text-slate-900 block">Internal Admin Notes</span>
                <div className="space-y-2">
                  {activeEnquiry.notes && activeEnquiry.notes.length > 0 ? (
                    activeEnquiry.notes.map((note) => (
                      <div key={note.id} className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-semibold text-blue-900">{note.author}</span>
                          <span className="font-mono">{new Date(note.date).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-700">{note.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No internal notes added yet.</p>
                  )}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Add an internal follow-up note..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!noteInput.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold disabled:opacity-40"
                  >
                    Add Note
                  </button>
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              {activeEnquiry.phone ? (
                <a
                  href={`https://wa.me/91${activeEnquiry.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                    activeEnquiry.name
                  )},%20this%20is%20Kasturi%20Enterprises%20Pune%20regarding%20your%20inquiry%20(${activeEnquiry.reference}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              ) : (
                <div />
              )}

              <button
                onClick={handleCloseDetail}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {enquiryToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Delete Enquiry Record?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete enquiry <strong className="font-mono text-slate-800">{enquiryToDelete.reference}</strong> from <strong>{enquiryToDelete.name}</strong>? This action will be logged in audit history.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEnquiryToDelete(null)}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
