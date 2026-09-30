import React, { useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  Layers,
  Mail,
  MessageSquare,
  Plus,
  Send,
  Smartphone,
  Sparkles,
  Download
} from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { MagneticButton } from './MagneticButton';
import { useCustomization } from '../context/CustomizationContext';
import { ChannelType, MetricCardData, NavTabId } from '../types';

interface DashboardViewProps {
  onOpenNewTicket: () => void;
  onNavigateTab?: (tab: NavTabId) => void;
}

interface InteractiveKpiCardProps {
  metric: MetricCardData;
  isActive?: boolean;
  onClick?: () => void;
}

/**
 * Polished Glassmorphism KPI Card
 * Features:
 * - Semi-transparent background with backdrop blur & saturation
 * - 1px border & layered soft shadow with inset top highlight
 * - 20px border radius
 * - Faint gradient sheen across top
 * - Dynamic cursor spotlight
 * - Translucent tinted trend badge pills
 * - Hover elevation (-4px) with smooth 250ms cubic-bezier transition
 * - Active / selected blue-tinted glow
 */
const InteractiveKpiCard: React.FC<InteractiveKpiCardProps> = ({
  metric,
  isActive = false,
  onClick
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  const isDownward = metric.change.startsWith('-');
  const TrendIcon = isDownward ? ArrowDownRight : ArrowUpRight;

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass-kpi-card p-5 sm:p-6 cursor-pointer overflow-hidden group select-none ${
        isActive ? 'is-active ring-1 ring-indigo-500/30' : ''
      }`}
    >
      {/* Faint gradient sheen across the top of each card (linear-gradient 135deg, white 40% to transparent) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-[20px] transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 100%)'
        }}
        aria-hidden="true"
      />

      {/* Dynamic Cursor Spotlight Effect */}
      {mousePos && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-[20px]"
          style={{
            background: `radial-gradient(220px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.08), transparent 70%)`
          }}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-black dark:text-white group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
            {metric.title}
          </span>
          {/* Trend Badge: small pill with a translucent tinted background */}
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-xs transition-transform duration-200 group-hover:scale-105 ${
              metric.isPositive
                ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
            }`}
          >
            <TrendIcon
              className={`w-3 h-3 ${
                metric.isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            />
            <span>{metric.change}</span>
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-950 dark:group-hover:text-indigo-200 transition-colors">
            {metric.value}
          </p>
        </div>

        <p className="text-[11px] font-medium text-black dark:text-white mt-2">
          {metric.period}
        </p>
      </div>
    </div>
  );
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewTicket,
  onNavigateTab
}) => {
  const [selectedMetricId, setSelectedMetricId] = useState<string>('metric-tickets');
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
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Operations Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">
              Operations Overview
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>All Channels Healthy</span>
            </span>
          </div>
          <p className="text-xs text-black dark:text-white font-medium mt-0.5">
            Cross-channel customer support telemetry and real-time SLA metrics.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Time Range Selector */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200/70 text-xs">
            {(['today', '7d', '30d'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setTimeRange(tab)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase transition-colors cursor-pointer ${
                  timeRange === tab
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Magnetic CTA Export Report Action */}
          <MagneticButton
            strength={0.25}
            onClick={() => exportReport('json')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 text-slate-700 rounded-lg text-xs font-medium shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Report</span>
          </MagneticButton>
        </div>
      </div>

      {/* 4 Restyled Glassmorphism KPI Cards with Soft Blurred Gradient Blobs behind */}
      <div className="relative">
        {/* Soft Blurred Gradient Blobs (indigo/blue and a hint of violet, ~15% opacity, blur 80px) */}
        <div
          className="pointer-events-none absolute -inset-x-4 -top-8 -bottom-8 overflow-hidden -z-10"
          aria-hidden="true"
        >
          <div className="absolute top-2 left-[5%] w-72 h-72 rounded-full bg-indigo-500/15 blur-[80px]" />
          <div className="absolute -top-6 left-[35%] w-80 h-80 rounded-full bg-blue-500/15 blur-[80px]" />
          <div className="absolute top-4 right-[25%] w-72 h-72 rounded-full bg-violet-500/15 blur-[80px]" />
          <div className="absolute -bottom-6 right-[5%] w-64 h-64 rounded-full bg-indigo-400/15 blur-[80px]" />
        </div>

        {/* 4 Interactive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map(metric => (
            <InteractiveKpiCard
              key={metric.id}
              metric={metric}
              isActive={selectedMetricId === metric.id}
              onClick={() => setSelectedMetricId(metric.id)}
            />
          ))}
        </div>
      </div>

      {/* Two Column Layout: Channel Breakdown & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Channel Volume Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/70 rounded-xl p-5 shadow-[inset_0_1px_2px_rgba(15,23,42,0.02),0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-[inset_0_2px_4px_rgba(15,23,42,0.04),0_10px_24px_-6px_rgba(15,23,42,0.06)] hover:border-slate-300 transition-all duration-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Channel Volume & Distribution
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Inbound conversation share across supported connectors
              </p>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              5 Active Connectors
            </span>
          </div>

          <div className="space-y-3.5">
            {channelVolume.map(chan => {
              const Icon = getChannelIcon(chan.type || (chan.name as ChannelType));

              return (
                <div key={chan.id || chan.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-medium text-slate-800">{chan.name}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-500">
                      <span>{chan.count}</span>
                      <span className="font-semibold text-slate-900">{chan.percent}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${chan.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Operational Activity Timeline (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/70 rounded-xl p-5 shadow-[inset_0_1px_2px_rgba(15,23,42,0.02),0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-[inset_0_2px_4px_rgba(15,23,42,0.04),0_10px_24px_-6px_rgba(15,23,42,0.06)] hover:border-slate-300 transition-all duration-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Live Audit Activity
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Audit trail of system events, customer messages, and ticket updates
              </p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
              Live Feed
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[310px] pr-1">
            {activities.slice(0, 6).map(act => (
              <div
                key={act.id}
                className="flex items-start space-x-3 p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200/60 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 leading-snug truncate">
                    {act.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
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
