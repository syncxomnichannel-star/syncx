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
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'omnichannel',
      label: 'Omnichannel Inbox',
      icon: MessageSquare,
      badge: totalUnreadMessages > 0 ? `${totalUnreadMessages}` : null
    },
    {
      id: 'tickets',
      label: 'Tickets',
      icon: TicketIcon,
      badge: openTicketsCount > 0 ? `${openTicketsCount}` : null
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200/70 flex flex-col h-screen sticky top-0 z-20 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-2xs">
            <Zap className="w-4 h-4 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900 text-sm tracking-tight">
                {branding.companyName || 'Sync'}
              </span>
              <span className="text-[10px] font-semibold text-indigo-700 px-1.5 py-0.2 rounded bg-indigo-50 border border-indigo-100">
                {branding.companyBadge || 'PRO'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Support Workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1.5 pt-1 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </span>
          <button
            onClick={onOpenCommandPalette}
            className="text-[10px] font-mono text-slate-400 hover:text-slate-700 flex items-center gap-0.5 bg-slate-50 hover:bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80 transition-colors cursor-pointer"
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
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200/70'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Understated AI Assistant Status */}
      <div className="px-3 py-2">
        <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-200/70 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[11px] font-medium text-slate-700">AI Copilot</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-medium text-slate-500">Ready</span>
          </div>
        </div>
      </div>

      {/* Operator Profile in Footer */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.fullName}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                {currentUser.fullName}
              </p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">
                {currentUser.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
