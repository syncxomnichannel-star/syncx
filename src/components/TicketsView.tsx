import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Globe,
  Mail,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Ticket as TicketIcon,
  Trash2,
  User,
  X
} from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { useCustomization } from '../context/CustomizationContext';
import { ChannelType, Ticket, TicketPriority, TicketStatus } from '../types';
import { EditableText } from './EditableText';

interface TicketsViewProps {
  onNewTicketClick: () => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({ onNewTicketClick }) => {
  const {
    branding,
    themeClasses,
    tickets,
    isTicketsLoading,
    agents,
    updateTicketStatus,
    updateTicket,
    deleteTicket,
    setActiveConversationId,
    conversations,
    showToast
  } = useCustomization();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'priority' | 'status'>('newest');

  const getPriorityStyle = (priority: TicketPriority) => {
    switch (priority) {
      case 'Urgent':
        return {
          pill: 'bg-rose-50 text-rose-700 border-rose-200/90 shadow-2xs',
          dot: 'bg-rose-500 animate-ping'
        };
      case 'High':
        return {
          pill: 'bg-amber-50 text-amber-800 border-amber-200/90 shadow-2xs',
          dot: 'bg-amber-500'
        };
      case 'Medium':
        return {
          pill: 'bg-indigo-50 text-indigo-700 border-indigo-200/90 shadow-2xs',
          dot: 'bg-indigo-500'
        };
      case 'Low':
        return {
          pill: 'bg-slate-100 text-slate-700 border-slate-200/90 shadow-2xs',
          dot: 'bg-slate-400'
        };
    }
  };

  const getStatusStyle = (status: TicketStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'In Progress':
        return 'bg-sky-50 text-sky-700 border-sky-200/80';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Resolved':
        return 'bg-slate-100 text-slate-600 border-slate-200/80';
    }
  };

  const getChannelIcon = (channel: ChannelType) => {
    switch (channel) {
      case 'WhatsApp':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Telegram':
        return <Send className="w-3.5 h-3.5 text-sky-600" />;
      case 'Email':
        return <Mail className="w-3.5 h-3.5 text-blue-600" />;
      case 'Web Chat':
        return <Globe className="w-3.5 h-3.5 text-amber-600" />;
      case 'Instagram':
        return <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  // Filter & Search Logic
  let filteredTickets = tickets.filter(t => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Sorting
  if (sortBy === 'priority') {
    const priorityWeight: Record<TicketPriority, number> = {
      Urgent: 4,
      High: 3,
      Medium: 2,
      Low: 1
    };
    filteredTickets = [...filteredTickets].sort(
      (a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
    );
  } else if (sortBy === 'status') {
    filteredTickets = [...filteredTickets].sort((a, b) => a.status.localeCompare(b.status));
  }

  const handleUpdateStatus = async (status: TicketStatus) => {
    if (!selectedTicket) return;
    await updateTicketStatus(selectedTicket.id, status);
    setSelectedTicket({ ...selectedTicket, status });
  };

  const handleUpdatePriority = async (priority: TicketPriority) => {
    if (!selectedTicket) return;
    await updateTicket(selectedTicket.id, { priority });
    setSelectedTicket({ ...selectedTicket, priority });
  };

  const handleAssignAgent = async (agentName: string) => {
    if (!selectedTicket) return;
    await updateTicket(selectedTicket.id, { assignedTo: agentName });
    setSelectedTicket({ ...selectedTicket, assignedTo: agentName });
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newNoteText.trim()) return;

    const updatedNotes = selectedTicket.notes
      ? `${selectedTicket.notes} | ${newNoteText.trim()}`
      : newNoteText.trim();

    await updateTicket(selectedTicket.id, { notes: updatedNotes });
    setSelectedTicket({ ...selectedTicket, notes: updatedNotes });
    setNewNoteText('');
    showToast('Note Added', 'Internal note saved to ticket.', 'success');
  };

  const handleDelete = async () => {
    if (!selectedTicket) return;
    if (window.confirm(`Are you sure you want to permanently delete ticket ${selectedTicket.id}?`)) {
      await deleteTicket(selectedTicket.id);
      setSelectedTicket(null);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white border border-slate-200/80 p-4 rounded-3xl shadow-2xs">
        {/* Status Filter Ribbon with Counts */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0">
          {(['All', 'Open', 'In Progress', 'Pending', 'Resolved'] as const).map(status => {
            const count =
              status === 'All'
                ? tickets.length
                : tickets.filter(t => t.status === status).length;
            const isSelected = statusFilter === status;

            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap shadow-2xs ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-2 ring-indigo-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200/90'
                }`}
              >
                <span>{status}</span>
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Priority & Search Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Priority Select */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent Only</option>
              <option value="High">High Only</option>
              <option value="Medium">Medium Only</option>
              <option value="Low">Low Only</option>
            </select>
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="priority">Sort: Priority</option>
              <option value="status">Sort: Status</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by ID, customer, tags..."
              className="w-full pl-9 pr-3 py-2 bg-slate-100/80 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium shadow-2xs"
            />
          </div>

          {/* Create Ticket Trigger */}
          <button
            onClick={onNewTicketClick}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* Tickets Data Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xs">
        {filteredTickets.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-slate-50/40">
            <div className="w-14 h-14 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100 shadow-xs">
              <TicketIcon className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 tracking-tight">
                No Support Tickets Found
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                {tickets.length === 0
                  ? 'Your production queue is clear. Click Create Ticket to log a new customer case.'
                  : 'No tickets match your filter criteria. Try resetting filters.'}
              </p>
            </div>
            <button
              onClick={onNewTicketClick}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              + Create Ticket
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Ticket ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Subject & Description</th>
                  <th className="py-4 px-6">Channel</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Priority</th>
                  <th className="py-4 px-6">Assigned To</th>
                  <th className="py-4 px-6 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTickets.map(ticket => {
                  const pStyle = getPriorityStyle(ticket.priority);

                  return (
                    <tr
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="hover:bg-indigo-50/40 transition-colors group cursor-pointer"
                    >
                      <td className="py-4.5 px-6 font-mono font-bold text-indigo-600 group-hover:text-indigo-700 whitespace-nowrap">
                        {ticket.id}
                      </td>
                      <td className="py-4.5 px-6 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={ticket.customerAvatar}
                            alt={ticket.customerName}
                            className="w-8 h-8 rounded-xl object-cover ring-1 ring-black/5 shadow-2xs"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">
                              {ticket.customerName}
                            </span>
                            {ticket.customerEmail && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                {ticket.customerEmail}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 max-w-sm">
                        <p className="font-bold text-slate-900 truncate">{ticket.subject}</p>
                        {ticket.description && (
                          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            {ticket.description}
                          </p>
                        )}
                      </td>
                      <td className="py-4.5 px-6 whitespace-nowrap">
                        <span className="inline-flex items-center space-x-1.5 text-slate-700 font-bold bg-slate-100/80 px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
                          {getChannelIcon(ticket.channel)}
                          <span>{ticket.channel}</span>
                        </span>
                      </td>
                      <td className="py-4.5 px-6 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-xl text-[11px] font-extrabold border shadow-2xs ${getStatusStyle(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-4.5 px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-extrabold border ${pStyle.pill}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`} />
                          <span>{ticket.priority}</span>
                        </span>
                      </td>
                      <td className="py-4.5 px-6 text-slate-700 font-semibold whitespace-nowrap">
                        {ticket.assignedTo}
                      </td>
                      <td className="py-4.5 px-6 text-right text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {ticket.createdAt}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over Ticket Details Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl border-l border-slate-200/90 h-full p-7 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                      {selectedTicket.id}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${getStatusStyle(
                        selectedTicket.status
                      )}`}
                    >
                      {selectedTicket.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {selectedTicket.customerName}
                  </h3>
                  {selectedTicket.customerEmail && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{selectedTicket.customerEmail}</span>
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* AI Triage & Suggestion Pill */}
                {selectedTicket.aiSuggestedAction && (
                  <div className="p-4 bg-gradient-to-br from-indigo-50/90 to-purple-50/50 rounded-2xl border border-indigo-100 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        Sync X AI Triage Insight
                      </span>
                      {selectedTicket.aiConfidence && (
                        <span className="text-[10px] font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                          {Math.round(selectedTicket.aiConfidence * 100)}% match
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-indigo-900 font-medium">
                      {selectedTicket.aiSuggestedAction}
                    </p>
                  </div>
                )}

                {/* Subject & Summary */}
                <div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                    Subject & Summary
                  </span>
                  <p className="text-xs font-bold text-slate-800 bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 leading-relaxed">
                    {selectedTicket.subject}
                  </p>
                </div>

                {/* Channel & Priority row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                      Source Channel
                    </span>
                    <span className="inline-flex items-center space-x-2 px-3 py-2 bg-slate-100/80 text-slate-800 rounded-2xl text-xs font-bold border border-slate-200/80 w-full">
                      {getChannelIcon(selectedTicket.channel)}
                      <span>{selectedTicket.channel}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                      Change Priority
                    </span>
                    <select
                      value={selectedTicket.priority}
                      onChange={e => handleUpdatePriority(e.target.value as TicketPriority)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="Urgent">Urgent</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Assigned Agent Selector */}
                <div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                    Assigned Specialist
                  </span>
                  <select
                    value={selectedTicket.assignedTo}
                    onChange={e => handleAssignAgent(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.name}>
                        {agent.name} ({agent.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Internal Notes Section */}
                <div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                    Internal Team Notes
                  </span>
                  {selectedTicket.notes ? (
                    <div className="text-xs text-slate-700 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/80 leading-relaxed mb-2.5">
                      {selectedTicket.notes}
                    </div>
                  ) : null}

                  {/* Add Note Form */}
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={e => setNewNoteText(e.target.value)}
                      placeholder="Add an internal note..."
                      className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      type="submit"
                      disabled={!newNoteText.trim()}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
                    >
                      Add Note
                    </button>
                  </form>
                </div>

                {/* Update Status Buttons */}
                <div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                    Update Workflow Status
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Open', 'In Progress', 'Pending', 'Resolved'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(status)}
                        className={`px-3 py-2.5 rounded-2xl text-xs font-black border transition-all cursor-pointer ${
                          selectedTicket.status === status
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20 border-transparent'
                            : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50'
                        }`}
                      >
                        Mark {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleDelete}
                className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 text-xs font-black rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Delete Ticket
              </button>
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
