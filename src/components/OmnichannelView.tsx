import React, { useState, useRef, useEffect } from 'react';
import {
  AlertCircle,
  ArrowLeft,
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
  X,
  Zap
} from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { MagneticButton } from './MagneticButton';
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

  // Refs for auto-scroll & composer focus
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
      setAiError('Failed to generate suggestion. Please try again.');
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
    showToast('Copied', 'AI suggestion copied to clipboard.', 'success');
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const cannedReplies = [
    'Thanks for reaching out! Looking into this now.',
    'Our engineering team has confirmed resolution.',
    'All systems are fully operational.',
    'Could you share your account or invoice number?'
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto">
      {/* Restrained Channel Status Row */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setChannelFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            channelFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600'
          }`}
        >
          All Channels ({conversations.length})
        </button>

        {channels.map(chan => {
          const isFilterActive = channelFilter === chan.type.toLowerCase();
          const channelConvCount = conversations.filter(
            c => c.channel.toLowerCase() === chan.type.toLowerCase()
          ).length;

          return (
            <button
              key={chan.id}
              type="button"
              onClick={() =>
                setChannelFilter(isFilterActive ? 'all' : chan.type.toLowerCase())
              }
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isFilterActive
                  ? 'bg-slate-900 text-white'
                  : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700'
              }`}
            >
              {getChannelIcon(chan.type, 'w-3.5 h-3.5')}
              <span>{chan.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isFilterActive
                    ? 'bg-slate-800 text-slate-200'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {channelConvCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Split-Screen Inbox Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs h-[680px]">
        {/* Left Pane: Conversation Queue (4 cols) */}
        <div
          className={`lg:col-span-4 border-r border-slate-200/70 flex flex-col h-full bg-slate-50/30 ${
            mobileShowChat ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Search Header */}
          <div className="p-3 border-b border-slate-200/70 bg-white space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search conversations, customers..."
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
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
              <span className="font-medium text-slate-600">
                Queue ({filteredConversations.length})
              </span>
              {channelFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setChannelFilter('all')}
                  className="text-[10px] font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Filter: {channelFilter}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Conversation List Scroll Area */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-slate-700">No conversations</p>
                <p className="text-[11px] text-slate-400">
                  Try adjusting your search query or channel filter.
                </p>
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isSelected = activeConv?.id === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelect(conv)}
                    className={`relative p-3 rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-100 text-slate-900'
                        : 'hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    {/* Subtle Selected Accent Line */}
                    {isSelected && (
                      <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-slate-900 rounded-r-full" />
                    )}

                    <div className="flex items-start space-x-2.5">
                      <div className="relative flex-shrink-0">
                        <img
                          src={conv.customerAvatar}
                          alt={conv.customerName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span
                            className={`text-xs truncate ${
                              isSelected ? 'font-semibold text-slate-900' : 'font-medium text-slate-800'
                            }`}
                          >
                            {conv.customerName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {conv.lastMessageTime}
                          </span>
                        </div>

                        <div className="text-[10px] text-slate-400 font-normal truncate mb-1">
                          {conv.company || 'Customer'}
                        </div>

                        <p
                          className={`text-[11px] truncate mb-1.5 leading-snug ${
                            conv.unreadCount > 0
                              ? 'font-semibold text-slate-900'
                              : 'text-slate-500 font-normal'
                          }`}
                        >
                          {conv.lastMessage}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center space-x-1 text-[10px] text-slate-500 font-medium">
                            {getChannelIcon(conv.channel, 'w-3 h-3')}
                            <span>{conv.channel}</span>
                          </span>

                          {conv.unreadCount > 0 && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-900 text-white">
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

        {/* Right Pane: Active Chat Window (8 cols) */}
        <div
          className={`lg:col-span-8 flex flex-col h-full bg-white ${
            mobileShowChat ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {activeConv ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Customer Header */}
              <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setMobileShowChat(false)}
                    className="lg:hidden p-1 text-slate-600 hover:text-slate-900 rounded-md cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="relative">
                    <img
                      src={activeConv.customerAvatar}
                      alt={activeConv.customerName}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-900">
                        {activeConv.customerName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        • {activeConv.company || 'Customer'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center space-x-1 text-[10px] text-slate-500 font-medium">
                        {getChannelIcon(activeConv.channel, 'w-3 h-3')}
                        <span>{activeConv.channel}</span>
                      </span>
                      <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono">
                        {activeConv.customerEmail}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MagneticButton
                    strength={0.22}
                    onClick={onOpenNewTicket}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Ticket</span>
                  </MagneticButton>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
                <div className="flex items-center justify-center my-2">
                  <span className="text-[10px] font-medium text-slate-400 bg-white px-2.5 py-0.5 rounded-full border border-slate-200/60 shadow-2xs">
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
                    <img
                      src={
                        msg.isAgent
                          ? currentUser?.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                          : activeConv.customerAvatar
                      }
                      alt={msg.sender}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 flex-shrink-0 mb-1"
                    />

                    <div
                      className={`max-w-md sm:max-w-lg p-3 rounded-xl text-xs space-y-1 shadow-2xs ${
                        msg.isAgent
                          ? 'bg-slate-900 text-white rounded-tr-xs'
                          : 'bg-white border border-slate-200/70 text-slate-800 rounded-tl-xs'
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between gap-3 text-[10px] ${
                          msg.isAgent ? 'text-slate-300' : 'text-slate-400 font-medium'
                        }`}
                      >
                        <span className="font-semibold">{msg.sender}</span>
                        <div className="flex items-center space-x-1 font-mono">
                          <span>{msg.timestamp}</span>
                          {msg.isAgent && (
                            <CheckCheck className="w-3 h-3 text-slate-300" />
                          )}
                        </div>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Integrated AI Copilot Drawer (Quiet & Understated) */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-xs font-semibold text-slate-800">
                      AI Suggested Response
                    </span>
                    <span className="hidden sm:inline-block text-[10px] text-slate-400">
                      • Context-aware
                    </span>
                  </div>

                  <MagneticButton
                    strength={0.25}
                    onClick={handleGenerateAI}
                    disabled={isGeneratingAI}
                    className="flex items-center space-x-1.5 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300 text-slate-800 rounded-md text-xs font-medium transition-colors disabled:opacity-50 shadow-2xs"
                  >
                    {isGeneratingAI ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin text-slate-600" />
                        <span>Drafting...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        <span>Generate AI Reply</span>
                      </>
                    )}
                  </MagneticButton>
                </div>

                {/* AI Loading State */}
                {isGeneratingAI && (
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70 text-xs text-slate-500 animate-pulse flex items-center space-x-2">
                    <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />
                    <span>Analyzing conversation context and drafting response...</span>
                  </div>
                )}

                {/* AI Error State */}
                {aiError && (
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
                    <span>{aiError}</span>
                    <button
                      type="button"
                      onClick={handleGenerateAI}
                      className="text-xs font-medium underline"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* AI Suggestion Card */}
                {aiSuggestion && !isGeneratingAI && (
                  <div className="p-3 rounded-lg bg-white border border-slate-200/80 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200/60">
                          {Math.round(aiSuggestion.confidence * 100)}% match
                        </span>
                        {aiSuggestion.sentiment && (
                          <span className="text-slate-500 capitalize">
                            Tone: {aiSuggestion.sentiment}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={handleCopySuggestion}
                          className="px-2 py-0.5 text-slate-600 hover:text-slate-900 text-xs font-medium rounded hover:bg-slate-100 cursor-pointer"
                        >
                          {copiedDraft ? 'Copied' : 'Copy'}
                        </button>

                        <MagneticButton
                          strength={0.22}
                          type="button"
                          onClick={handleInsertReply}
                          className="px-2.5 py-0.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium flex items-center gap-1 shadow-2xs"
                        >
                          <CornerDownLeft className="w-3 h-3" />
                          <span>Insert Reply</span>
                        </MagneticButton>

                        <button
                          type="button"
                          onClick={() => setAiSuggestion(null)}
                          className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-2.5 rounded border border-slate-100 font-normal">
                      {aiSuggestion.text}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Canned Replies Bar */}
              <div className="px-4 py-1.5 bg-white border-t border-slate-100 flex items-center space-x-2 overflow-x-auto">
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider flex-shrink-0">
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
                    className="text-[11px] text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60 whitespace-nowrap cursor-pointer transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Polished Modern Message Composer */}
              <form
                onSubmit={handleSend}
                className="p-3 bg-white border-t border-slate-200/80 space-y-2"
              >
                <div>
                  <textarea
                    ref={textareaRef}
                    rows={2}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Reply to ${activeConv.customerName} via ${activeConv.channel}...`}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 font-normal resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => showToast('Attachment Simulation', 'File attachment dialog opened.', 'info')}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                      title="Attach file"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyText(prev => prev + ' 👍');
                        textareaRef.current?.focus();
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                      title="Insert emoji"
                    >
                      <Smile className="w-3.5 h-3.5" />
                    </button>
                    <span className="hidden sm:inline-block text-[10px] text-slate-400 font-normal">
                      Press <kbd className="px-1 py-0.2 bg-slate-100 border border-slate-200 rounded text-[9px]">Enter ↵</kbd> to send
                    </span>
                  </div>

                  <MagneticButton
                    strength={0.25}
                    type="submit"
                    disabled={!replyText.trim() || isSending}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs flex items-center space-x-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>{isSending ? 'Sending...' : 'Send'}</span>
                  </MagneticButton>
                </div>
              </form>
            </div>

          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 bg-slate-50/20">
              <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">No conversation selected</p>
                <p className="text-xs text-slate-400 max-w-sm mt-0.5">
                  Select a customer thread from the queue to view messages and reply.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
