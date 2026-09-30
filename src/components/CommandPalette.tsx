import React, { useEffect, useState } from 'react';
import {
  Download,
  Edit3,
  LayoutDashboard,
  MessageSquare,
  Plus,
  RotateCcw,
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
      title: 'Go to Dashboard Overview',
      category: 'Navigation',
      icon: LayoutDashboard,
      run: () => {
        onSelectTab('dashboard');
        onClose();
      }
    },
    {
      id: 'omnichannel',
      title: 'Open Omnichannel Control Center',
      category: 'Navigation',
      icon: MessageSquare,
      run: () => {
        onSelectTab('omnichannel');
        onClose();
      }
    },
    {
      id: 'tickets',
      title: 'View All Customer Support Tickets',
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
      title: 'Simulate Incoming Inbound Message (Live Demo)',
      category: 'Actions',
      icon: Zap,
      run: () => {
        simulateIncomingMessage();
        onClose();
      }
    },
    {
      id: 'settings',
      title: 'Manage Platform & Channel Settings',
      category: 'Navigation',
      icon: Settings,
      run: () => {
        onSelectTab('settings');
        onClose();
      }
    },
    {
      id: 'toggle-edit',
      title: 'Toggle Live Visual Edit Mode',
      category: 'Customization',
      icon: Edit3,
      run: () => {
        toggleEditMode();
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200/90 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-4 border-b border-slate-100 flex items-center space-x-3 bg-white">
          <Search className="w-5 h-5 text-indigo-600" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${branding.companyName || 'Sync'} commands, channels, or navigation...`}
            className="flex-1 bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded-md border border-slate-200 font-bold">
            ESC
          </span>
        </div>

        <div className="max-h-84 overflow-y-auto p-2 space-y-1 bg-slate-50/50">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">
              No matching commands found.
            </p>
          ) : (
            filtered.map(cmd => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.run}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white hover:shadow-xs text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-600 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-950">
                        {cmd.title}
                      </p>
                      <p className="text-[10px] text-slate-400">{cmd.category}</p>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-indigo-600 transition-colors text-xs font-bold">
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
