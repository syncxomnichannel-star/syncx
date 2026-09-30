import React, { useState } from 'react';
import {
  Bell,
  Command,
  Plus,
  Search,
  Sparkles,
  Zap
} from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';
import { NavTabId } from '../types';

interface HeaderProps {
  activeTab: NavTabId;
  onNewTicketClick: () => void;
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNewTicketClick,
  onOpenCommandPalette
}) => {
  const {
    branding,
    activities,
    simulateIncomingMessage
  } = useCustomization();

  const [showNotifications, setShowNotifications] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const tabMeta: Record<NavTabId, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard Overview',
      subtitle: 'Real-time performance metrics and omnichannel support analytics.'
    },
    omnichannel: {
      title: 'Omnichannel Control Center',
      subtitle: 'Manage conversations across WhatsApp, Telegram, Email, Web Chat, and Instagram.'
    },
    tickets: {
      title: 'Ticket Management',
      subtitle: 'Track, assign, prioritize, and resolve customer support requests.'
    },
    settings: {
      title: 'Platform Settings',
      subtitle: 'Configure channel integrations, team roles, and system preferences.'
    }
  };

  const currentTab = tabMeta[activeTab];

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await simulateIncomingMessage();
    } finally {
      setTimeout(() => setIsSimulating(false), 500);
    }
  };

  return (
    <header className="bg-white/90 border-b border-slate-200/80 px-8 py-4 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between shadow-2xs">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          {currentTab.title}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          {currentTab.subtitle}
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-3">
        {/* Search Command Palette trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="relative hidden sm:flex items-center space-x-3 w-64 px-3.5 py-2 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/90 hover:border-indigo-300 rounded-xl text-xs text-slate-500 transition-all text-left group cursor-pointer"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          <span className="flex-1 truncate font-medium">Search {branding.companyName || 'Sync X'}...</span>
          <span className="flex items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 group-hover:border-indigo-200">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </button>

        {/* Real-time Demo Simulation Button */}
        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          title="Simulate Inbound Customer Message (Demo)"
          className={`flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer ${
            isSimulating ? 'opacity-80 scale-95' : ''
          }`}
        >
          <Zap className={`w-3.5 h-3.5 text-amber-300 ${isSimulating ? 'animate-bounce' : 'animate-pulse'}`} />
          <span className="hidden md:inline">Simulate Incoming Message</span>
          <span className="md:hidden">Simulate</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(prev => !prev)}
            title="Notifications"
            className="relative p-2.5 rounded-xl bg-slate-100/80 border border-slate-200/90 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <h4 className="text-xs font-bold text-slate-900">Live Activity Feed</h4>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  Real-time
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {activities.slice(0, 6).map(act => (
                  <div key={act.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <p className="font-bold text-slate-800">{act.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{act.description}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Context Action Button */}
        {activeTab === 'tickets' ? (
          <button
            onClick={onNewTicketClick}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </button>
        ) : (
          <button
            onClick={onNewTicketClick}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </button>
        )}
      </div>
    </header>
  );
};
