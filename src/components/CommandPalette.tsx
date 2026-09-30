import React, { useEffect, useState } from 'react';
import {
  Download,
  Edit3,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Ticket as TicketIcon,
  Zap
} from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';
import { NavTabId } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTabId) => void;
  onOpenNewTicket: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenNewTicket
}) => {
  const {
    branding,
    toggleEditMode,
    exportReport,
    simulateIncomingMessage
  } = useCustomization();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'dashboard',
      title: 'Go to Operations Dashboard',
      category: 'Navigation',
      icon: LayoutDashboard,
      run: () => {
        onSelectTab('dashboard');
        onClose();
      }
    },
    {
      id: 'omnichannel',
      title: 'Open Omnichannel Inbox',
      category: 'Navigation',
      icon: MessageSquare,
      run: () => {
        onSelectTab('omnichannel');
        onClose();
      }
    },
    {
      id: 'tickets',
      title: 'View Ticket Queue',
      category: 'Navigation',
      icon: TicketIcon,
      run: () => {
        onSelectTab('tickets');
        onClose();
      }
    },
    {
      id: 'new-ticket',
      title: 'Create New Support Ticket',
      category: 'Actions',
      icon: Plus,
      run: () => {
        onOpenNewTicket();
        onClose();
      }
    },
    {
      id: 'simulate-msg',
      title: 'Simulate Inbound Message (Demo)',
      category: 'Actions',
      icon: Zap,
      run: () => {
        simulateIncomingMessage();
        onClose();
      }
    },
    {
      id: 'settings',
      title: 'Open Platform Settings',
      category: 'Navigation',
      icon: Settings,
      run: () => {
        onSelectTab('settings');
        onClose();
      }
    },
    {
      id: 'export-report',
      title: 'Export Operational Report (JSON)',
      category: 'Data',
      icon: Download,
      run: () => {
        exportReport('json');
        onClose();
      }
    }
  ];

  const filtered = commands.filter(
    cmd =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/30 backdrop-blur-2xs animate-in fade-in">
      <div className="bg-white border border-slate-200/90 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center space-x-2.5 bg-white">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search commands, channels...`}
            className="flex-1 bg-transparent text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <span className="text-[10px] font-mono bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded border border-slate-200">
            ESC
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto p-1.5 space-y-0.5 bg-slate-50/40">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              No matching commands.
            </p>
          ) : (
            filtered.map(cmd => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.run}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100/80 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-md bg-slate-100 text-slate-600">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-900">
                        {cmd.title}
                      </p>
                      <p className="text-[10px] text-slate-400">{cmd.category}</p>
                    </div>
                  </div>
                  <span className="text-slate-300 text-xs">
                    ↵
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
