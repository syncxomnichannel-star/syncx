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
  Smartphone,
  Sparkles,
  Ticket as TicketIcon,
  Trash2,
  User,
  X
} from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { MagneticButton } from './MagneticButton';
import { useCustomization } from '../context/CustomizationContext';
import { ChannelType, Ticket, TicketPriority, TicketStatus } from '../types';


interface TicketsViewProps {
  onNewTicketClick: () => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({ onNewTicketClick }) => {
  const {
    branding,
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

  const getPriorityStyle = (priority: TicketPriority) => {
    switch (priority) {
      case 'Urgent':
        return {
          pill: 'bg-rose-50 text-rose-700 border-rose-200/60',
          dot: 'bg-rose-500'
        };
      case 'High':
        return {
          pill: 'bg-amber-50 text-amber-800 border-amber-200/60',
          dot: 'bg-amber-500'
        };
      case 'Medium':
        return {
          pill: 'bg-slate-100 text-slate-700 border-slate-200/60',
          dot: 'bg-slate-400'
        };
      case 'Low':
        return {
          pill: 'bg-slate-50 text-slate-500 border-slate-200/60',
          dot: 'bg-slate-300'
        };
    }
  };

  const getStatusStyle = (status: TicketStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'In Progress':
        return 'bg-sky-50 text-sky-700 border-sky-200/60';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'Resolved':
        return 'bg-slate-100 text-slate-600 border-slate-200/60';
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
        return <MessageSquare className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  let filteredTickets = tickets.filter(t => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

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
      ? `${selectedTicket.notes}\n• ${newNoteText.trim()}`
      : `• ${newNoteText.trim()}`;

    await updateTicket(selectedTicket.id, { notes: updatedNotes });
    setSelectedTicket({ ...selectedTicket, notes: updatedNotes });
    setNewNoteText('');
  };

  const handleDelete = async () => {
    if (!selectedTicket) return;
    if (confirm(`Are you sure you want to delete ticket ${selectedTicket.id}?`)) {
      await deleteTicket(selectedTicket.id);
      setSelectedTicket(null);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-slate-100 border border-slate-200/70 overflow-x-auto">
          {['All', 'Open', 'In Progress', 'Pending', 'Resolved'].map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center space-x-2.5">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by ID, customer..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 font-normal"
            />
          </div>

          <MagneticButton
            strength={0.25}
            onClick={onNewTicketClick}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium shadow-2xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Ticket</span>
          </MagneticButton>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-slate-200/70 rounded-xl overflow-hidden shadow-2xs">
        {filteredTickets.length === 0 ? (
          <div className="py-16 text-center space-y-2 bg-slate-50/20">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <TicketIcon className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-800">No support tickets found</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Your support queue is clear or no tickets match the current filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-5">Ticket ID</th>
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5">Subject</th>
                  <th className="py-3 px-5">Channel</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Priority</th>
                  <th className="py-3 px-5">Assigned To</th>
                  <th className="py-3 px-5 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTickets.map(ticket => {
                  const pStyle = getPriorityStyle(ticket.priority);

                  return (
                    <tr
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-5 font-mono text-slate-900 font-medium whitespace-nowrap">
                        {ticket.id}
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={ticket.customerAvatar}
                            alt={ticket.customerName}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <span className="font-medium text-slate-900 block leading-tight">
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
                      <td className="py-3.5 px-5 max-w-xs">
                        <p className="font-medium text-slate-900 truncate">{ticket.subject}</p>
                        {ticket.description && (
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {ticket.description}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className="inline-flex items-center space-x-1.5 text-slate-600 text-xs font-medium">
                          {getChannelIcon(ticket.channel)}
                          <span>{ticket.channel}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${getStatusStyle(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${pStyle.pill}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`} />
                          <span>{ticket.priority}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-600 font-normal whitespace-nowrap">
                        {ticket.assignedTo}
                      </td>
                      <td className="py-3.5 px-5 text-right text-slate-400 font-mono text-[11px] whitespace-nowrap">
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

      {/* Slide-over Ticket Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white border-l border-slate-200/90 h-full p-6 shadow-xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {selectedTicket.id}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getStatusStyle(
                        selectedTicket.status
                      )}`}
                    >
                      {selectedTicket.status}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mt-1.5">
                    {selectedTicket.customerName}
                  </h3>
                  {selectedTicket.customerEmail && (
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {selectedTicket.customerEmail}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Subject & Summary */}
              <div className="space-y-1">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Subject & Description
                </span>
                <div className="text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200/70 leading-relaxed">
                  <p className="font-semibold text-slate-900 mb-1">{selectedTicket.subject}</p>
                  <p className="text-slate-600 font-normal">{selectedTicket.description || 'No additional details provided.'}</p>
                </div>
              </div>

              {/* Priority & Assigned Agent */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block mb-1">
                    Priority
                  </span>
                  <select
                    value={selectedTicket.priority}
                    onChange={e => handleUpdatePriority(e.target.value as TicketPriority)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block mb-1">
                    Assigned Agent
                  </span>
                  <select
                    value={selectedTicket.assignedTo}
                    onChange={e => handleAssignAgent(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
                  >
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.name}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Workflow Status Buttons */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
                  Workflow Status
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(['Open', 'In Progress', 'Pending', 'Resolved'] as const).map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleUpdateStatus(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        selectedTicket.status === status
                          ? 'bg-slate-900 text-white border-transparent'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
                  Internal Notes
                </span>
                {selectedTicket.notes && (
                  <div className="text-xs text-slate-700 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed font-mono">
                    {selectedTicket.notes}
                  </div>
                )}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    placeholder="Add internal note..."
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newNoteText.trim()}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium disabled:opacity-40 cursor-pointer"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleDelete}
                className="text-rose-600 hover:text-rose-800 text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Ticket</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
