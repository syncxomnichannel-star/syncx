import React from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Download,
  Mail,
  MessageSquare,
  Plus,
  Send,
  Smartphone,
  Ticket as TicketIcon
} from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { MagneticButton } from './MagneticButton';
import { useCustomization } from '../context/CustomizationContext';
import { ChannelType, MetricCardData, NavTabId } from '../types';

interface DashboardViewProps {
  onOpenNewTicket: () => void;
  onNavigateTab?: (tab: NavTabId) => void;
}

const getMetricIcon = (id: string) => {
  switch (id) {
    case 'metric-tickets':
      return TicketIcon;
    case 'metric-frt':
      return Clock;
    case 'metric-messages':
      return MessageSquare;
    case 'metric-csat':
      return CheckCircle2;
    default:
      return Activity;
  }
};

/**
 * Clean & Bold KPI Card with a basic, crisp hover effect.
 */
const KpiCard: React.FC<{ metric: MetricCardData }> = ({ metric }) => {
  const isDownward = metric.change.startsWith('-');
  const TrendIcon = isDownward ? ArrowDownRight : ArrowUpRight;
  const MetricIcon = getMetricIcon(metric.id);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xs group cursor-default">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-200/80 transition-colors">
            <MetricIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {metric.title}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${
            metric.isPositive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
              : 'bg-amber-50 text-amber-700 border-amber-200/80'
          }`}
        >
          <TrendIcon className="w-3 h-3" />
          <span>{metric.change}</span>
        </span>
      </div>

      <div className="my-1">
        <p className="text-3xl font-extrabold tracking-tight text-slate-900">
          {metric.value}
        </p>
      </div>

      <p className="text-xs font-medium text-slate-400 mt-2">
        {metric.period}
      </p>
    </div>
  );
};

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
    exportReport
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
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Operations Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold tracking-tight text-slate-900">
              Operations Overview
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>All Channels Healthy</span>
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Cross-channel customer support telemetry and real-time SLA metrics.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Time Range Selector */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
            {(['today', '7d', '30d'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setTimeRange(tab)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase transition-colors cursor-pointer ${
                  timeRange === tab
                    ? 'bg-white text-slate-900 font-semibold border border-slate-200/60 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Export Report Action (Magnetic Button) */}
          <MagneticButton
            strength={0.2}
            type="button"
            onClick={() => exportReport('json')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Report</span>
          </MagneticButton>

          {/* Create Ticket Primary CTA (Magnetic Button) */}
          <MagneticButton
            strength={0.25}
            type="button"
            onClick={onOpenNewTicket}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Ticket</span>
          </MagneticButton>
        </div>
      </div>

      {/* 4 Operations KPI Cards: Clean, Bold & Basic Hover Effect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(metric => (
          <KpiCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Two Column Layout: Channel Breakdown & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Channel Volume Breakdown (7 cols): Clean, Bold Card with Hover */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 space-y-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold tracking-tight text-slate-900">
                Channel Volume & Distribution
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                Inbound conversation share across supported connectors
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              5 Active Connectors
            </span>
          </div>

          <div className="space-y-3.5">
            {channelVolume.map(chan => {
              const Icon = getChannelIcon(chan.type || (chan.name as ChannelType));

              return (
                <div key={chan.id || chan.name} className="space-y-1.5 group/item">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-3.5 h-3.5 text-slate-600" />
                      <span className="font-bold text-slate-800">{chan.name}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-500">
                      <span className="font-medium">{chan.count}</span>
                      <span className="font-extrabold text-slate-900 min-w-8 text-right">{chan.percent}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${chan.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Operational Activity Timeline (5 cols): Clean, Bold Card with Hover */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 space-y-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold tracking-tight text-slate-900">
                Live Audit Activity
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                Audit trail of system events, customer messages, and ticket updates
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wide">
              Live Feed
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[310px] pr-1">
            {activities.slice(0, 6).map(act => (
              <div
                key={act.id}
                className="flex items-start space-x-3 p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-200 transition-all duration-150"
              >
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/80 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 leading-snug truncate">
                    {act.title}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                    {act.description}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    {act.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

