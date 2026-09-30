import React, { useState, useRef, useEffect } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  Check,
  CheckCheck,
  Clock,
  Copy,
  CornerDownLeft,
  Globe,
  Mail,
  MessageSquare,
  Paperclip,
  Plus,
  RefreshCw,
  Search,
  Send,
  Smartphone,
  Smile,
  Sparkles,
  User,
  Wand2,
  X,
  Zap,
  Info,
  SlidersHorizontal
} from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { useCustomization } from '../context/CustomizationContext';
import { AISuggestion, ChannelType, Conversation, ChatMessage } from '../types';

interface OmnichannelViewProps {
  onOpenNewTicket: () => void;
}

export const OmnichannelView: React.FC<OmnichannelViewProps> = ({ onOpenNewTicket }) => {
  const {
    channels,
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    markAsRead,
    generateAIReply,
    showToast,
    currentUser
  } = useCustomization();

  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  // AI Copilot state
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Refs for scroll and composer focus
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getChannelIcon = (type: ChannelType, className: string = 'w-3.5 h-3.5') => {
    switch (type) {
      case 'WhatsApp':
        return <Smartphone className={`${className} text-emerald-600`} />;
      case 'Telegram':
        return <Send className={`${className} text-sky-600`} />;
      case 'Email':
        return <Mail className={`${className} text-blue-600`} />;
      case 'Web Chat':
        return <Globe className={`${className} text-amber-600`} />;
      case 'Instagram':
        return <InstagramIcon className={`${className} text-pink-600`} />;
    }
  };

  const getChannelBadge = (type: ChannelType) => {
    switch (type) {
      case 'WhatsApp':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Telegram':
        return 'bg-sky-50 text-sky-700 border-sky-200/80';
      case 'Email':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'Web Chat':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Instagram':
        return 'bg-pink-50 text-pink-700 border-pink-200/80';
    }
  };

  const getChannelAccent = (type: ChannelType) => {
    switch (type) {
      case 'WhatsApp':
        return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-700', ping: 'bg-emerald-500' };
      case 'Telegram':
        return { bg: 'bg-sky-500/10', border: 'border-sky-500/30', text: 'text-sky-700', ping: 'bg-sky-500' };
      case 'Email':
        return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-700', ping: 'bg-blue-500' };
      case 'Web Chat':
        return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-700', ping: 'bg-amber-500' };
      case 'Instagram':
        return { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-700', ping: 'bg-pink-500' };
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesChannel =
      channelFilter === 'all' || conv.channel.toLowerCase() === channelFilter.toLowerCase();
    const matchesSearch =
      conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.company && conv.company.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesChannel && matchesSearch;
  });

  const activeConv =
    conversations.find(c => c.id === activeConversationId) ||
    (conversations.length > 0 ? conversations[0] : null);

  // Auto scroll chat to bottom when active conversation or messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, activeConv?.id]);

  const handleSelect = (conv: Conversation) => {
    setActiveConversationId(conv.id);
    markAsRead(conv.id);
    setAiSuggestion(null);
    setAiError(null);
    setMobileShowChat(true);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeConv || !replyText.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(activeConv.id, replyText.trim());
      setReplyText('');
      setAiSuggestion(null);
      // Keep textarea focused
      setTimeout(() => textareaRef.current?.focus(), 50);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleGenerateAI = async () => {
    if (!activeConv) return;
    setIsGeneratingAI(true);
    setAiError(null);

    try {
      const lastCustMsg =
        [...activeConv.messages].reverse().find(m => !m.isAgent)?.text ||
        activeConv.lastMessage ||
        'How can we help?';

      const res = await generateAIReply(activeConv.id, lastCustMsg, activeConv.customerName);
      setAiSuggestion(res);
    } catch (err) {
      setAiError('Failed to draft AI response. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleInsertReply = () => {
    if (!aiSuggestion) return;
    setReplyText(aiSuggestion.text);
    showToast('AI Draft Inserted', 'Response placed into the composer.', 'success');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleCopySuggestion = () => {
    if (!aiSuggestion) return;
    navigator.clipboard?.writeText(aiSuggestion.text);
    setCopiedDraft(true);
    showToast('Copied to Clipboard', 'AI suggestion copied.', 'success');
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const cannedReplies = [
    'Thanks for reaching out! Looking into this now.',
    'Our engineering team has confirmed resolution.',
    'All systems are fully operational.',
    'Could you share your account or invoice number?'
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Channel Ribbon (Tactile, clean enterprise status cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {channels.map(chan => {
          const isFilterActive = channelFilter === chan.type.toLowerCase();
          const channelConvCount = conversations.filter(
            c => c.channel.toLowerCase() === chan.type.toLowerCase()
          ).length;
          const accent = getChannelAccent(chan.type);

          return (
            <button
              key={chan.id}
              type="button"
              onClick={() =>
                setChannelFilter(isFilterActive ? 'all' : chan.type.toLowerCase())
              }
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0 ${
                isFilterActive
                  ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-xl ${accent.bg} border ${accent.border}`}>
                    {getChannelIcon(chan.type, 'w-4 h-4')}
                  </div>
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {chan.name}
                  </span>
                </div>
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${accent.ping} opacity-75`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${accent.ping}`} />
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span className="font-medium text-slate-600">
                  {channelConvCount} {channelConvCount === 1 ? 'chat' : 'chats'}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    isFilterActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {isFilterActive ? 'Filtered' : 'Online'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Split-Screen Unified Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs h-[680px]">
        {/* Left Pane: Conversation List (4 cols) */}
        <div
          className={`lg:col-span-4 border-r border-slate-200/80 flex flex-col h-full bg-slate-50/40 ${
            mobileShowChat ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Search & Filter Header */}
          <div className="p-3.5 border-b border-slate-200/80 bg-white space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search conversations, customers..."
                className="w-full pl-8 pr-7 py-2 bg-slate-100/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
              <span className="font-semibold text-slate-700">
                Inbox ({filteredConversations.length})
              </span>
              {channelFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setChannelFilter('all')}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Filter: {channelFilter}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Conversation List Scroll Area */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 divide-y divide-transparent">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100 shadow-2xs">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h5 className="text-xs font-bold text-slate-800">No conversations found</h5>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Try adjusting your search query or channel filter to view active customer messages.
                </p>
                {channelFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setChannelFilter('all')}
                    className="px-3 py-1.5 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    Reset Channel Filter
                  </button>
                )}
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isSelected = activeConv?.id === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelect(conv)}
                    className={`relative p-3 rounded-xl transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/90 border border-indigo-200/90 shadow-2xs'
                        : 'bg-white/80 hover:bg-white border border-transparent hover:border-slate-200/70 hover:shadow-2xs'
                    }`}
                  >
                    {/* Active Conversation Left Indicator Accent */}
                    {isSelected && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-600 rounded-r-full" />
                    )}

                    <div className="flex items-start space-x-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={conv.customerAvatar}
                          alt={conv.customerName}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-black/5"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full bg-white shadow-2xs">
                          {getChannelIcon(conv.channel, 'w-3 h-3')}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h5
                            className={`text-xs truncate ${
                              isSelected
                                ? 'font-bold text-indigo-950'
                                : 'font-semibold text-slate-900'
                            }`}
                          >
                            {conv.customerName}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {conv.lastMessageTime}
                          </span>
                        </div>

                        <div className="text-[10px] text-slate-400 font-medium truncate mb-1">
                          {conv.company || 'Enterprise Customer'}
                        </div>

                        <p
                          className={`text-[11px] truncate mb-2 leading-snug ${
                            conv.unreadCount > 0
                              ? 'font-bold text-slate-900'
                              : 'text-slate-500 font-normal'
                          }`}
                        >
                          {conv.lastMessage}
                        </p>

                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${getChannelBadge(
                              conv.channel
                            )}`}
                          >
                            {getChannelIcon(conv.channel, 'w-3 h-3')}
                            <span>{conv.channel}</span>
                          </span>

                          {conv.unreadCount > 0 && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-indigo-600 text-white shadow-2xs">
                              {conv.unreadCount} new
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Conversation Window (8 cols) */}
        <div
          className={`lg:col-span-8 flex flex-col h-full bg-white ${
            mobileShowChat ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {activeConv ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Customer Header */}
              <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-white shadow-2xs z-10">
                <div className="flex items-center space-x-3">
                  {/* Mobile Back to List Button */}
                  <button
                    type="button"
                    onClick={() => setMobileShowChat(false)}
                    className="lg:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="relative">
                    <img
                      src={activeConv.customerAvatar}
                      alt={activeConv.customerName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-black/5"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {activeConv.customerName}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">
                        • {activeConv.company || 'Customer'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${getChannelBadge(
                          activeConv.channel
                        )}`}
                      >
                        {getChannelIcon(activeConv.channel, 'w-3 h-3')}
                        <span>Connected via {activeConv.channel}</span>
                      </span>

                      <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono">
                        {activeConv.customerEmail}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={onOpenNewTicket}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Ticket</span>
                  </button>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                {/* Conversation Start Timestamp Divider */}
                <div className="flex items-center justify-center my-2">
                  <span className="text-[10px] font-semibold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                    Thread initiated today • Encrypted 2-way session
                  </span>
                </div>

                {activeConv.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2.5 ${
                      msg.isAgent ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* User / Agent Avatar */}
                    <img
                      src={
                        msg.isAgent
                          ? currentUser?.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                          : activeConv.customerAvatar
                      }
                      alt={msg.sender}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-black/5 flex-shrink-0 mb-1"
                    />

                    {/* Chat Bubble */}
                    <div
                      className={`max-w-md sm:max-w-lg p-3.5 rounded-2xl text-xs space-y-1.5 shadow-2xs ${
                        msg.isAgent
                          ? 'bg-indigo-600 text-white rounded-tr-xs'
                          : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs font-medium'
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between gap-4 text-[10px] font-bold ${
                          msg.isAgent ? 'text-indigo-100' : 'text-slate-500'
                        }`}
                      >
                        <span>{msg.sender}</span>
                        <div className="flex items-center space-x-1 font-mono">
                          <span>{msg.timestamp}</span>
                          {msg.isAgent && (
                            <CheckCheck className="w-3.5 h-3.5 text-indigo-200" />
                          )}
                        </div>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* AI Copilot Suggestion Box (Enterprise Grade) */}
              <div className="px-4 py-3 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-slate-50/60 border-t border-indigo-100/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded-lg bg-indigo-600 text-white shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900">
                        AI Copilot
                      </span>
                      <span className="hidden sm:inline-block text-[10px] text-slate-400 font-medium ml-1.5">
                        • Real-time Context Aware
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={isGeneratingAI}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingAI ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Drafting response...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>Generate AI Reply</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Loading State */}
                {isGeneratingAI && (
                  <div className="p-3.5 rounded-xl bg-white border border-indigo-100 shadow-2xs space-y-2 animate-pulse">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-700">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing customer sentiment and drafting enterprise reply...</span>
                    </div>
                    <div className="h-2 bg-indigo-100/60 rounded-full w-3/4" />
                    <div className="h-2 bg-indigo-100/40 rounded-full w-1/2" />
                  </div>
                )}

                {/* AI Error State */}
                {aiError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>{aiError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateAI}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Suggested Response Card */}
                {aiSuggestion && !isGeneratingAI && (
                  <div className="p-3.5 rounded-xl bg-white border border-indigo-200/90 shadow-2xs space-y-2.5 transition-all">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>{Math.round(aiSuggestion.confidence * 100)}% Confidence</span>
                        </span>
                        {aiSuggestion.sentiment && (
                          <span
                            className={`capitalize text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              aiSuggestion.sentiment === 'urgent'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            Tone: {aiSuggestion.sentiment}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={handleCopySuggestion}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold cursor-pointer flex items-center gap-1 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedDraft ? 'Copied!' : 'Copy'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleInsertReply}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all hover:shadow-xs"
                        >
                          <CornerDownLeft className="w-3 h-3" />
                          <span>Insert into Composer</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAiSuggestion(null)}
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {aiSuggestion.suggestedAction && (
                      <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        <span>Recommended Next Step: {aiSuggestion.suggestedAction}</span>
                      </div>
                    )}

                    <div className="p-3 rounded-lg bg-indigo-50/40 border border-indigo-100 text-xs text-slate-800 leading-relaxed font-medium">
                      {aiSuggestion.text}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Canned Replies Bar */}
              <div className="px-4 py-2 bg-slate-50/60 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
                  Quick:
                </span>
                {cannedReplies.map((reply, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setReplyText(reply);
                      textareaRef.current?.focus();
                    }}
                    className="text-[11px] text-slate-600 hover:text-indigo-700 bg-white hover:bg-indigo-50/50 px-2.5 py-1 rounded-lg border border-slate-200/80 hover:border-indigo-200 whitespace-nowrap cursor-pointer transition-all shadow-2xs"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Professional Message Composer */}
              <form
                onSubmit={handleSend}
                className="p-3 bg-white border-t border-slate-200/80 space-y-2"
              >
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    rows={2}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Reply to ${activeConv.customerName} via ${activeConv.channel}...`}
                    className="w-full px-3.5 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium resize-none leading-relaxed transition-all"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => showToast('Attachment Simulation', 'File attachment dialog opened.', 'info')}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                      title="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyText(prev => prev + ' 👍');
                        textareaRef.current?.focus();
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                      title="Insert emoji"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                    <span className="hidden sm:inline-block text-[10px] text-slate-400 font-medium">
                      Press <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px]">Enter ↵</kbd> to send, <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px]">Shift+Enter</kbd> for newline
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={!replyText.trim() || isSending}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Sending...' : 'Send Reply'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-slate-50/30">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-2xs">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Sync X Unified Inbox</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                  Connected channels: WhatsApp, Telegram, Email, Web Chat, and Instagram. Select a conversation from the left to begin messaging.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenNewTicket}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Ticket</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
