import React from 'react';
import {
  Activity,
  ArrowUpRight,
  ChevronRight,
  Layers,
  Mail,
  MessageSquare,
  Plus,
  Send,
  Smartphone,
  Sparkles,
  Zap
} from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { useCustomization } from '../context/CustomizationContext';
import { ChannelType, NavTabId } from '../types';

interface DashboardViewProps {
  onOpenNewTicket: () => void;
  onNavigateTab?: (tab: NavTabId) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewTicket,
  onNavigateTab
}) => {
  const {
    metrics,
    channelVolume,
    activities,
    timeRange,
    setTimeRange,
    exportReport,
    showToast
  } = useCustomization();

  const getChannelIcon = (type?: ChannelType) => {
    switch (type) {
      case 'WhatsApp':
        return Smartphone;
      case 'Telegram':
        return Send;
      case 'Email':
        return Mail;
      case 'Instagram':
        return InstagramIcon;
      default:
        return MessageSquare;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-slate-900 p-7 shadow-lg shadow-indigo-600/10 text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Sync X Production Engine Live</span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-white">Production Overview</h3>
            <p className="text-indigo-100 text-sm max-w-xl font-normal leading-relaxed">
              Your omnichannel workspace is connected across WhatsApp, Telegram, Email, Web Chat, and Instagram.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportReport('json')}
              className="px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer whitespace-nowrap"
            >
              Export Report
            </button>
            <button
              onClick={onOpenNewTicket}
              className="px-4 py-2.5 bg-indigo-500/30 hover:bg-indigo-500/40 text-white rounded-xl text-xs font-bold border border-indigo-400/30 hover:-translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
            >
              + Create Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Key Performance Metrics with Working Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-base">Key Performance Metrics</h4>
          <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            {(['today', '7d', '30d'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setTimeRange(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                  timeRange === tab
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map(metric => (
            <div
              key={metric.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">{metric.title}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  {metric.change}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {metric.value}
                </p>
                <span className="text-[11px] text-slate-400 font-medium">{metric.period}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Volume & Live Activity Feed Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Channel Volume (1 col) */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Channel Volume</h4>
                <p className="text-xs text-slate-500">5 active channel streams</p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                Live Data
              </span>
            </div>

            <div className="space-y-4">
              {channelVolume.map(chan => {
                const Icon = getChannelIcon(chan.type);
                return (
                  <div key={chan.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 text-slate-700 font-semibold">
                        <Icon className="w-4 h-4 text-indigo-600" />
                        <span>{chan.name}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {chan.count} ({chan.percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${chan.color} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(chan.percent, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Capacity: <strong className="text-slate-800">100% Operational</strong>
            </span>
            <button
              onClick={() => onNavigateTab?.('omnichannel')}
              className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Manager</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Live Activity Feed (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Live Activity Feed</h4>
                <p className="text-xs text-slate-500">Real-time team support actions in Sync X</p>
              </div>
              <button
                onClick={() => showToast('Audit Log', 'Audit log loaded.', 'info')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition-all cursor-pointer"
              >
                View Log
              </button>
            </div>

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {activities.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-800">No Recent Activity Logged</h5>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Incoming ticket activities and messages will update here in real time.
                  </p>
                </div>
              ) : (
                activities.slice(0, 6).map(act => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:bg-slate-50 transition-colors flex items-start space-x-3.5"
                  >
                    <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs mt-0.5 flex-shrink-0">
                      {act.type === 'message' ? (
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      ) : act.type === 'ticket' ? (
                        <Layers className="w-3.5 h-3.5 text-amber-600" />
                      ) : act.type === 'ai' ? (
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      ) : (
                        <Activity className="w-3.5 h-3.5 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 truncate">{act.title}</p>
                        <span className="text-[10px] font-mono text-slate-400 flex-shrink-0 ml-2">
                          {act.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-normal">
                        {act.description}
                      </p>
                      {act.actor && (
                        <span className="inline-block text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 mt-1 shadow-2xs">
                          {act.actor}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Real-time synchronization: <strong className="text-slate-800">Active</strong>
            </span>
            <button
              onClick={() => onNavigateTab?.('tickets')}
              className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Ticket Queue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
