import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Ticket as TicketIcon,
  Sparkles,
  Zap
} from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';
import { NavTabId } from '../types';

interface SidebarProps {
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
  onOpenCommandPalette: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCommandPalette
}) => {
  const {
    branding,
    tickets,
    conversations,
    currentUser
  } = useCustomization();

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const openTicketsCount = tickets.filter(t => t.status !== 'Resolved').length;

  const navItems: Array<{
    id: NavTabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: string | null;
    badgeColor: string;
    description: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      badgeColor: '',
      description: 'Overview & Analytics'
    },
    {
      id: 'omnichannel',
      label: 'Omnichannel',
      icon: MessageSquare,
      badge: totalUnreadMessages > 0 ? `${totalUnreadMessages} new` : null,
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      description: 'Unified Inbox & Channels'
    },
    {
      id: 'tickets',
      label: 'Tickets',
      icon: TicketIcon,
      badge: openTicketsCount > 0 ? `${openTicketsCount} open` : null,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      description: 'Customer Support Cases'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
      badgeColor: '',
      description: 'Preferences & Integrations'
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen sticky top-0 backdrop-blur-xl z-20 shadow-2xs select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/25 ring-1 ring-black/5 transform hover:scale-105 transition-transform cursor-pointer">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-base tracking-tight flex items-center gap-1.5">
              <span>{branding.companyName || 'Sync'}</span>
              <span className="text-indigo-600 font-black text-sm px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100/80 shadow-2xs">
                {branding.companyBadge || 'X'}
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              {branding.tagline || 'Omnichannel Support'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 flex items-center justify-between">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Navigation
          </p>
          <button
            onClick={onOpenCommandPalette}
            className="text-[10px] font-mono text-slate-400 hover:text-indigo-600 flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer"
            title="Press ⌘K to open command palette"
          >
            ⌘K
          </button>
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out cursor-pointer ${
                isActive
                  ? 'bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 shadow-xs translate-x-0.5 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:translate-x-0.5 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'bg-slate-100 text-slate-500 group-hover:text-slate-800 group-hover:bg-slate-200/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold leading-tight">{item.label}</span>
                  <span className="block text-[11px] text-slate-500 font-normal leading-tight group-hover:text-slate-600">
                    {item.description}
                  </span>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Copilot Status Card */}
      <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-gradient-to-r from-indigo-50/70 to-slate-50 border border-indigo-100/80 shadow-2xs">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-bold text-slate-800">Sync X AI Active</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            Live
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug">
          Auto-tagging & response assistant
        </p>
      </div>

      {/* Operator Profile in Footer */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.fullName}
                className="w-9 h-9 rounded-lg object-cover ring-1 ring-black/5"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.fullName}</p>
              <p className="text-[11px] text-slate-400 leading-tight font-medium">{currentUser.role}</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
      </div>
    </aside>
  );
};
