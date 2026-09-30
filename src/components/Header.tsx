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

import { MagneticButton } from './MagneticButton';

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
      title: 'Operations Dashboard',
      subtitle: 'Real-time metrics and omnichannel support performance'
    },
    omnichannel: {
      title: 'Omnichannel Inbox',
      subtitle: 'Customer messaging across WhatsApp, Telegram, Email, Web Chat, and Instagram'
    },
    tickets: {
      title: 'Ticket Queue',
      subtitle: 'Track, prioritize, and resolve enterprise support requests'
    },
    settings: {
      title: 'Settings',
      subtitle: 'Channel configurations, team roster, and platform preferences'
    }
  };

  const currentTab = tabMeta[activeTab];

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await simulateIncomingMessage();
    } finally {
      setTimeout(() => setIsSimulating(false), 400);
    }
  };

  return (
    <header className="h-16 bg-white/95 border-b border-slate-200/70 px-6 sm:px-8 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight">
          {currentTab.title}
        </h2>
        <p className="text-[11px] text-slate-500 font-normal">
          {currentTab.subtitle}
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-2.5">
        {/* Search Command Palette trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="relative hidden sm:flex items-center space-x-2.5 w-56 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/70 rounded-lg text-xs text-slate-400 transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="flex-1 truncate text-left text-slate-500 font-normal">Search {branding.companyName || 'Sync'}...</span>
          <span className="flex items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.2 rounded border border-slate-200/70">
            ⌘K
          </span>
        </button>

        {/* Real-time Demo Simulation Button (Magnetic) */}
        <MagneticButton
          strength={0.24}
          onClick={handleSimulate}
          disabled={isSimulating}
          title="Simulate Inbound Customer Message (Demo)"
          className={`flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors shadow-2xs ${
            isSimulating ? 'opacity-60' : ''
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden md:inline">Simulate Inbound Message</span>
          <span className="md:hidden">Simulate</span>
        </MagneticButton>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(prev => !prev)}
            title="Notifications"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200/80 rounded-xl shadow-lg p-3 z-50 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-900">Live Activity Feed</span>
                <span className="text-[10px] text-slate-400 font-medium">Real-time</span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1.5">
                {activities.slice(0, 6).map(act => (
                  <div key={act.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100/80 text-xs">
                    <p className="font-semibold text-slate-800 leading-tight">{act.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{act.description}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button (Magnetic) */}
        <MagneticButton
          strength={0.25}
          onClick={onNewTicketClick}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Ticket</span>
        </MagneticButton>
      </div>
    </header>
  );
};

