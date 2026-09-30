import React, { useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Globe,
  Mail,
  MessageSquare,
  Paperclip,
  Plus,
  RefreshCw,
  Search,
  Send,
  Smartphone,
  Sparkles,
  User,
  X
} from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { useCustomization } from '../context/CustomizationContext';
import { AISuggestion, ChannelType, Conversation } from '../types';

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
    showToast
  } = useCustomization();

  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // AI Copilot state
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const getChannelIcon = (type: ChannelType) => {
    switch (type) {
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
    }
  };

  const getChannelBadge = (type: ChannelType) => {
    switch (type) {
      case 'WhatsApp':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Telegram':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Email':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Web Chat':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Instagram':
        return 'bg-pink-50 text-pink-700 border-pink-200';
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

  const handleSelect = (conv: Conversation) => {
    setActiveConversationId(conv.id);
    markAsRead(conv.id);
    setAiSuggestion(null);
    setAiError(null);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv || !replyText.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(activeConv.id, replyText.trim());
      setReplyText('');
      setAiSuggestion(null);
    } finally {
      setIsSending(false);
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
      setAiError('Failed to draft AI response.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const cannedReplies = [
    'Thanks for reaching out! Looking into this now.',
    'Our engineering team has confirmed resolution.',
    'All systems are fully operational.'
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Channel Ribbon (Exact match to reference site) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {channels.map(chan => {
          const isFilterActive = channelFilter === chan.type.toLowerCase();

          return (
            <div
              key={chan.id}
              onClick={() =>
                setChannelFilter(isFilterActive ? 'all' : chan.type.toLowerCase())
              }
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                isFilterActive
                  ? 'bg-indigo-50/90 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-white border-slate-200/80 hover:border-indigo-200 shadow-2xs hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    {getChannelIcon(chan.type)}
                  </div>
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {chan.name}
                  </span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                <span>
                  State: <strong className="text-emerald-600 font-bold">Online</strong>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Ready</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Split-Screen Unified Inbox (Clean & functional) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs h-[640px]">
        {/* Left Pane: Filter & Conversation List (4 cols) */}
        <div className="lg:col-span-4 border-r border-slate-200/80 flex flex-col h-full bg-slate-50/50">
          <div className="p-4 border-b border-slate-200/80 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter Sync X messages..."
                className="w-full pl-9 pr-3 py-2 bg-slate-100/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-200/60">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h5 className="text-xs font-bold text-slate-800">Inbox Clear</h5>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-normal">
                  Incoming messages from WhatsApp, Telegram, Email, Web Chat, and Instagram will show here in real time.
                </p>
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isSelected = activeConv?.id === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelect(conv)}
                    className={`p-3.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/60 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={conv.customerAvatar}
                        alt={conv.customerName}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-black/5 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h5 className="text-xs font-bold text-slate-900 truncate">
                            {conv.customerName}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {conv.lastMessageTime}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mb-1">
                          {conv.lastMessage}
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${getChannelBadge(
                              conv.channel
                            )}`}
                          >
                            {getChannelIcon(conv.channel)}
                            <span>{conv.channel}</span>
                          </span>
                          {conv.unreadCount > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-600 text-white">
                              {conv.unreadCount}
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
        <div className="lg:col-span-8 flex flex-col h-full bg-white">
          {activeConv ? (
            <div className="flex-1 flex flex-col h-full">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={activeConv.customerAvatar}
                      alt={activeConv.customerName}
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-black/5"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{activeConv.customerName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({activeConv.company || 'Customer'})
                      </span>
                    </h4>
                    <span
                      className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-md border mt-0.5 ${getChannelBadge(
                        activeConv.channel
                      )}`}
                    >
                      {getChannelIcon(activeConv.channel)}
                      <span>Connected via {activeConv.channel}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={onOpenNewTicket}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  + Create Ticket
                </button>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-50/30">
                {activeConv.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${msg.isAgent ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-2xs ${
                        msg.isAgent
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 font-bold">
                        <span>{msg.sender}</span>
                        <span className="font-mono">{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Copilot Suggestion Box (Clean & simple) */}
              <div className="px-4 py-2.5 bg-indigo-50/50 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[11px] font-bold text-indigo-950">AI Copilot</span>
                  </div>

                  <button
                    onClick={handleGenerateAI}
                    disabled={isGeneratingAI}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingAI ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Drafting...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Generate AI Reply</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Loading State */}
                {isGeneratingAI && (
                  <div className="p-3 rounded-xl bg-white border border-indigo-100 text-xs text-slate-500 animate-pulse">
                    Analyzing conversation and generating draft...
                  </div>
                )}

                {/* AI Error State */}
                {aiError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
                    <span>{aiError}</span>
                    <button
                      onClick={handleGenerateAI}
                      className="text-xs font-bold text-rose-700 underline"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Suggested Response Card */}
                {aiSuggestion && !isGeneratingAI && (
                  <div className="p-3 rounded-xl bg-white border border-indigo-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {Math.round(aiSuggestion.confidence * 100)}% match
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setReplyText(aiSuggestion.text);
                            showToast('AI Draft Inserted', 'Inserted reply into composer.', 'success');
                          }}
                          className="px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Insert Reply</span>
                        </button>
                        <button
                          onClick={() => setAiSuggestion(null)}
                          className="text-slate-400 hover:text-slate-600 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {aiSuggestion.text}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Canned Replies */}
              <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center space-x-2 overflow-x-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
                  Quick:
                </span>
                {cannedReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => setReplyText(reply)}
                    className="text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 whitespace-nowrap cursor-pointer transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Message Composer */}
              <form
                onSubmit={handleSend}
                className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder={`Reply via ${activeConv.channel}...`}
                  className="flex-1 px-3.5 py-2 bg-slate-100/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || isSending}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-slate-50/30">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-xs">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Sync X Unified Inbox</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Connected channels: WhatsApp, Telegram, Email, Web Chat, and Instagram. Select a chat to begin messaging.
                </p>
              </div>
              <button
                onClick={onOpenNewTicket}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all cursor-pointer"
              >
                + Create Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
