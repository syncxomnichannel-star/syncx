import React, { useState, useRef, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Mail,
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
import { MagneticButton } from './MagneticButton';

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

  // SMTP 6-Digit OTP Verification State
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [showOtpPanel, setShowOtpPanel] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for OTP resend cooldown
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  if (!isOpen) return null;

  // Handle email changes: resets verification if changed
  const handleEmailChange = (newVal: string) => {
    setCustomerEmail(newVal);
    setFormError(null);
    if (isEmailVerified && newVal.trim().toLowerCase() !== verifiedEmail) {
      setIsEmailVerified(false);
      setVerifiedEmail('');
      setShowOtpPanel(false);
      setOtpSuccessMsg(null);
    }
  };

  // Dispatch 6-digit OTP via SMTP endpoint
  const handleSendOtp = async (): Promise<boolean> => {
    const cleanEmail = customerEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setFormError('Please enter a valid work email address to receive your 6-digit verification code.');
      return false;
    }

    setIsSendingOtp(true);
    setFormError(null);
    setOtpError(null);
    setOtpSuccessMsg(null);

    try {
      const resp = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await resp.json().catch(() => ({}));
      if (resp.ok && data.success) {
        setShowOtpPanel(true);
        setResendCountdown(60);
        setOtpDigits(['', '', '', '', '', '']);
        setOtpSuccessMsg(`6-digit verification code dispatched to ${cleanEmail}`);
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 120);
        return true;
      } else {
        setOtpError(data.error || 'Failed to dispatch verification code via SMTP.');
        return false;
      }
    } catch (err: any) {
      setOtpError(err?.message || 'Network error sending verification code.');
      return false;
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify 6-digit OTP code
  const handleVerifyOtp = async (): Promise<boolean> => {
    const code = otpDigits.join('').trim();
    if (code.length !== 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return false;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      const resp = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerEmail.trim().toLowerCase(),
          token: code
        })
      });

      const data = await resp.json().catch(() => ({}));
      if (resp.ok && data.success) {
        setIsEmailVerified(true);
        setVerifiedEmail(customerEmail.trim().toLowerCase());
        setShowOtpPanel(false);
        setOtpError(null);
        setOtpSuccessMsg('Email verified successfully via SMTP.');
        return true;
      } else {
        setOtpError(data.error || 'Invalid or expired verification code. Please check your inbox.');
        return false;
      }
    } catch (err: any) {
      setOtpError(err?.message || 'Verification request failed.');
      return false;
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Digit input change handler with auto-advance
  const handleDigitChange = (val: string, index: number) => {
    const cleaned = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    setOtpDigits(newDigits);
    setOtpError(null);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Backspace key navigation
  const handleDigitKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Paste 6-digit string
  const handleDigitPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setOtpDigits(newDigits);
    setOtpError(null);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1. Mandatory Customer Name
    if (!customerName.trim()) {
      setFormError('Customer Name is mandatory.');
      return;
    }

    // 2. Mandatory Customer Email
    const cleanEmail = customerEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setFormError('Customer Email is mandatory. Please enter a valid email address.');
      return;
    }

    // 3. Mandatory Subject
    if (!subject.trim()) {
      setFormError('Ticket Subject is mandatory.');
      return;
    }

    // 4. Mandatory SMTP 6-digit OTP Verification
    if (!isEmailVerified || verifiedEmail !== cleanEmail) {
      if (!showOtpPanel) {
        await handleSendOtp();
      }
      setFormError('Email verification is mandatory. Please enter the 6-digit code sent to your email.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await createTicket({
        customerName: customerName.trim(),
        customerEmail: cleanEmail,
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
        tags: [channel.toLowerCase(), priority.toLowerCase(), 'email-verified']
      });

      // Reset state & close
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setSubject('');
      setDescription('');
      setNotes('');
      setIsEmailVerified(false);
      setVerifiedEmail('');
      setShowOtpPanel(false);
      setOtpDigits(['', '', '', '', '', '']);
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs animate-in fade-in">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 relative max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <TicketIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Create Support Ticket
              </h3>
              <p className="text-[11px] text-slate-500">
                Log a customer case into the queue with verified email identity
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Form Alerts */}
        {formError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{formError}</span>
          </div>
        )}

        {otpSuccessMsg && !formError && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{otpSuccessMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="e.g. Alex Mercer"
              className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-normal text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Email (Mandatory) & Phone Number (Optional) */}
          <div className="space-y-3">
            {/* Work Email (Mandatory) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Customer Email <span className="text-rose-500 font-bold">* (Mandatory)</span>
                </label>
                {isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified via SMTP</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={isSendingOtp || !customerEmail.includes('@')}
                    onClick={handleSendOtp}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    {isSendingOtp ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-3 h-3" />
                        <span>{showOtpPanel ? 'Resend 6-Digit OTP' : 'Verify Email (SMTP OTP)'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={e => handleEmailChange(e.target.value)}
                  placeholder="customer@enterprise.com"
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50/80 border rounded-xl text-xs font-normal text-slate-900 focus:bg-white focus:outline-none transition-all ${
                    isEmailVerified
                      ? 'border-emerald-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100'
                  }`}
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* SMTP 6-Digit OTP Verification Box */}
            {showOtpPanel && !isEmailVerified && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-indigo-200/90 shadow-2xs space-y-3 animate-in fade-in">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <KeyRound className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">
                        Enter 6-Digit Verification Code
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Passcode sent via SMTP to <span className="font-semibold text-slate-800">{customerEmail}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100/70 px-1.5 py-0.5 rounded">
                    SMTP
                  </span>
                </div>

                {/* 6 Digit Input Boxes */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-1">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => { inputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleDigitChange(e.target.value, idx)}
                      onKeyDown={e => handleDigitKeyDown(e, idx)}
                      onPaste={handleDigitPaste}
                      className="w-9 h-11 sm:w-11 sm:h-12 text-center text-lg font-bold text-slate-900 bg-white border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 rounded-lg shadow-2xs outline-none transition-all"
                    />
                  ))}
                </div>

                {otpError && (
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <button
                    type="button"
                    disabled={resendCountdown > 0 || isSendingOtp}
                    onClick={handleSendOtp}
                    className="text-[11px] font-medium text-slate-500 hover:text-slate-900 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend Code'}
                  </button>

                  <button
                    type="button"
                    disabled={isVerifyingOtp || otpDigits.join('').length < 6}
                    onClick={handleVerifyOtp}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Phone Number (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="+1 (555) 349-8201"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-normal text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition-all"
                />
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          {/* Subject / Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Webhook delivery latency issue"
              className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-normal text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Channel & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Origin Channel
              </label>
              <select
                value={channel}
                onChange={e => setChannel(e.target.value as ChannelType)}
                className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Telegram">Telegram</option>
                <option value="Email">Email</option>
                <option value="Web Chat">Web Chat</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TicketPriority)}
                className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Assigned Agent */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assign To
            </label>
            <select
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
            >
              {agents.map(agent => (
                <option key={agent.id} value={agent.name}>
                  {agent.name} ({agent.role})
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Case Details
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Customer context, error logs, or request notes..."
              className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-normal text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 resize-none leading-relaxed transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <MagneticButton
              strength={0.25}
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs flex items-center space-x-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting Ticket...</span>
                </>
              ) : (
                <span>Create Ticket</span>
              )}
            </MagneticButton>
          </div>
        </form>
      </div>
    </div>
  );
};
