import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Mail,
  Plus,
  RefreshCw,
  Send,
  Smartphone,
  Sparkles,
  Ticket as TicketIcon,
  User,
  X
} from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';
import { ChannelType, TicketPriority } from '../types';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ isOpen, onClose }) => {
  const { createTicket, agents, currentUser } = useCustomization();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [channel, setChannel] = useState<ChannelType>('WhatsApp');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [assignedTo, setAssignedTo] = useState(currentUser.fullName || 'Sarah Jenkins');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !subject.trim()) {
      setFormError('Please enter both the customer name and ticket subject.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await createTicket({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        customerAvatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
        subject: subject.trim(),
        description: description.trim() || undefined,
        channel,
        status: 'Open',
        priority,
        assignedTo,
        notes: notes.trim() || undefined,
        tags: [channel.toLowerCase(), priority.toLowerCase()]
      });

      // Reset and close
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setSubject('');
      setDescription('');
      setNotes('');
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200/90 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
              <TicketIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Create Support Ticket
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Log a priority support case into the omnichannel queue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {formError && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="e.g. Acme Cloud or Alex Mercer"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Work Email
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="customer@enterprise.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Subject / Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Subject / Issue Summary <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Webhook delivery latency validation"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Channel & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Origin Channel
              </label>
              <select
                value={channel}
                onChange={e => setChannel(e.target.value as ChannelType)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Telegram">Telegram</option>
                <option value="Email">Email</option>
                <option value="Web Chat">Web Chat</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TicketPriority)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Assigned Agent */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Assigned Specialist
            </label>
            <select
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {agents.map(agent => (
                <option key={agent.id} value={agent.name}>
                  {agent.name} — {agent.role}
                </option>
              ))}
            </select>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Initial Notes / Diagnostics (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any diagnostic notes, ticket context, or customer background..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Create Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
