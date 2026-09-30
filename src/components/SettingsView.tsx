import React, { useState } from 'react';
import {
  Bell,
  Check,
  Copy,
  Download,
  Globe,
  Key,
  Layers,
  Mail,
  Palette,
  RotateCcw,
  Save,
  Send,
  Shield,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  User,
  Users
} from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { MagneticButton } from './MagneticButton';
import { useCustomization } from '../context/CustomizationContext';
import { ChannelType } from '../types';

export const SettingsView: React.FC = () => {
  const {
    branding,
    updateBranding,
    currentUser,
    updateProfile,
    agents,
    notifications,
    updateNotifications,
    security,
    updateSecurity,
    channels,
    updateChannel,
    showToast,
    exportReport
  } = useCustomization();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'channels' | 'notifications' | 'security' | 'customizer'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState(currentUser);
  const [customApiKey, setCustomApiKey] = useState(security.stitchApiKey);
  const [customSecret, setCustomSecret] = useState(security.webhookSigningSecret);

  // Channel edit state
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
  const [channelWebhookInput, setChannelWebhookInput] = useState('');

  const subTabs = [
    { id: 'profile', label: 'Profile & Team', icon: User },
    { id: 'channels', label: 'Channel Connectors', icon: Layers },
    { id: 'notifications', label: 'Alerts & Automation', icon: Bell },
    { id: 'security', label: 'API Keys & Secrets', icon: Key },
    { id: 'customizer', label: 'Visual Customizer', icon: Palette }
  ] as const;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile(profileForm);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Profile Saved', 'Your user profile details have been updated.', 'success');
    }, 400);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`${label} Copied`, `${label} copied to clipboard.`, 'success');
  };

  const handleGenerateKey = () => {
    const newKey = 'syncx_live_pk_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 8);
    setCustomApiKey(newKey);
    updateSecurity({ stitchApiKey: newKey });
    showToast('Key Generated', 'A new production gateway key was generated.', 'success');
  };

  const colorOptions: Array<{ id: typeof branding.primaryColor; name: string; class: string }> = [
    { id: 'indigo', name: 'Indigo (Default)', class: 'bg-indigo-600' },
    { id: 'blue', name: 'Blue', class: 'bg-blue-600' },
    { id: 'purple', name: 'Violet', class: 'bg-purple-600' },
    { id: 'emerald', name: 'Emerald', class: 'bg-emerald-600' },
    { id: 'rose', name: 'Rose', class: 'bg-rose-600' },
    { id: 'amber', name: 'Amber', class: 'bg-amber-600' }
  ];

  const getChannelIcon = (type: ChannelType) => {
    switch (type) {
      case 'WhatsApp':
        return <Smartphone className="w-4 h-4 text-emerald-600" />;
      case 'Telegram':
        return <Send className="w-4 h-4 text-sky-600" />;
      case 'Email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'Web Chat':
        return <Globe className="w-4 h-4 text-amber-600" />;
      case 'Instagram':
        return <InstagramIcon className="w-4 h-4 text-pink-600" />;
    }
  };

  const handleOpenChannelEdit = (channel: any) => {
    setEditingChannelId(channel.id);
    setChannelWebhookInput(channel.webhookUrl || `https://api.syncx.io/v1/webhooks/${channel.type.toLowerCase()}`);
  };

  const handleSaveChannel = async (id: string) => {
    await updateChannel(id, { webhookUrl: channelWebhookInput });
    setEditingChannelId(null);
    showToast('Webhook Updated', 'Channel gateway endpoint updated successfully.', 'success');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Sub Tabs Navigation */}
      <div className="flex items-center space-x-1.5 p-1 bg-slate-100/90 rounded-lg border border-slate-200/70 overflow-x-auto w-fit">
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub Tab: Profile & Team */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6">
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 space-y-5 shadow-2xs">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Operator Account
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your display name, email, and timezone settings
                </p>
              </div>

              <div className="flex items-center space-x-4 pt-1">
                <img
                  src={profileForm.avatar}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      const newUrl = prompt('Enter image URL for avatar:', profileForm.avatar);
                      if (newUrl) setProfileForm({ ...profileForm, avatar: newUrl });
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  >
                    Change Photo
                  </button>
                  <p className="text-[11px] text-slate-400">PNG, JPG, or HTTPS avatar URL</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-normal text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-normal text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Role Title</label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={e => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-normal text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Default Timezone</label>
                  <select
                    value={profileForm.timezone}
                    onChange={e => setProfileForm({ ...profileForm, timezone: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-normal text-slate-800 focus:outline-none focus:border-slate-400"
                  >
                    <option value="UTC+05:30 (Asia/Kolkata)">UTC+05:30 (Asia/Kolkata)</option>
                    <option value="UTC-05:00 (US Eastern Time)">UTC-05:00 (US Eastern Time)</option>
                    <option value="UTC+00:00 (Greenwich Mean Time)">UTC+00:00 (Greenwich Mean Time)</option>
                    <option value="UTC+01:00 (Central European Time)">UTC+01:00 (Central European Time)</option>
                    <option value="UTC+08:00 (Singapore / China)">UTC+08:00 (Singapore / China)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <MagneticButton
                strength={0.22}
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                {isSaving ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSaving ? 'Saved Changes' : 'Save Profile'}</span>
              </MagneticButton>
            </div>
          </form>

          {/* Team Members Roster */}
          <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Support Operations Specialists ({agents.length})
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Available team members for automatic ticket assignment
                </p>
              </div>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                All Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agents.map(agent => (
                <div
                  key={agent.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-slate-900">{agent.name}</h5>
                      <p className="text-[10px] text-slate-400 font-normal">{agent.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {agent.assignedTicketsCount || 0} active cases
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: Channel Connectors */}
      {activeSubTab === 'channels' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/70 rounded-xl p-5 shadow-2xs">
            <h4 className="text-sm font-semibold text-slate-900">Channel Gateways</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Live status, response latency, and webhook endpoints for customer communications
            </p>
          </div>

          <div className="space-y-3">
            {channels.map(channel => (
              <div
                key={channel.id}
                className="bg-white border border-slate-200/70 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                    {getChannelIcon(channel.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-semibold text-slate-900">{channel.name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Latency: {channel.avgResponseTime}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-md">
                      {channel.webhookUrl || `https://api.syncx.io/v1/webhooks/${channel.type.toLowerCase()}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                    {channel.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenChannelEdit(channel)}
                    className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  >
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Channel Configure Modal */}
          {editingChannelId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/30 backdrop-blur-2xs animate-in fade-in">
              <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-5 shadow-xl space-y-3.5">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Configure Webhook</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update the incoming webhook URL for this channel gateway.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Webhook URL</label>
                  <input
                    type="text"
                    value={channelWebhookInput}
                    onChange={e => setChannelWebhookInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingChannelId(null)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveChannel(editingChannelId)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Save URL
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub Tab: Alerts & Automation */}
      {activeSubTab === 'notifications' && (
        <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 space-y-4 shadow-2xs">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Alert Preferences</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure automated notifications and routing rules
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200/60">
              <div>
                <p className="text-xs font-semibold text-slate-900">Daily Digest Email</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Receive summarized metrics and SLA reports in your inbox.
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateNotifications({ emailDigest: !notifications.emailDigest })}
                className="cursor-pointer"
              >
                {notifications.emailDigest ? (
                  <ToggleRight className="w-7 h-7 text-slate-900" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-300" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200/60">
              <div>
                <p className="text-xs font-semibold text-slate-900">Urgent Ticket Slack Ping</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Send high-priority customer alerts to the support Slack channel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateNotifications({ slackAlerts: !notifications.slackAlerts })}
                className="cursor-pointer"
              >
                {notifications.slackAlerts ? (
                  <ToggleRight className="w-7 h-7 text-slate-900" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-300" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200/60">
              <div>
                <p className="text-xs font-semibold text-slate-900">Smart Round-Robin Auto-Assign</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Automatically distribute newly arrived tickets based on specialist availability.
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateNotifications({ autoAssign: !notifications.autoAssign })}
                className="cursor-pointer"
              >
                {notifications.autoAssign ? (
                  <ToggleRight className="w-7 h-7 text-slate-900" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: API Keys & Secrets */}
      {activeSubTab === 'security' && (
        <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">API Credentials</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Integration keys for webhook gateways and backend services
              </p>
            </div>
            <MagneticButton
              strength={0.22}
              type="button"
              onClick={handleGenerateKey}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              Generate Key
            </MagneticButton>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  Live Gateway Key
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 font-medium">
                  Active
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={customApiKey}
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-mono text-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(customApiKey, 'Gateway Key')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-medium cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  Webhook Signing Secret
                </span>
                <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/60 font-medium">
                  Secured
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={customSecret}
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-mono text-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(customSecret, 'Webhook Secret')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-medium cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: Visual Customizer */}
      {activeSubTab === 'customizer' && (
        <div className="bg-white border border-slate-200/70 rounded-xl p-5 sm:p-6 space-y-5 shadow-2xs">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Workspace Customization</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize company naming, badge text, and workspace theme accents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={branding.companyName}
                onChange={e => updateBranding({ companyName: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Badge</label>
              <input
                type="text"
                value={branding.companyBadge}
                onChange={e => updateBranding({ companyBadge: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={branding.tagline}
                onChange={e => updateBranding({ tagline: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-normal text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Primary Accent</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {colorOptions.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateBranding({ primaryColor: opt.id })}
                  className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                    branding.primaryColor === opt.id
                      ? 'border-slate-800 bg-slate-50 font-medium'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${opt.class}`} />
                  <span className="text-[11px] text-slate-700">{opt.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <MagneticButton
              strength={0.22}
              type="button"
              onClick={() => exportReport('json')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report (JSON)</span>
            </MagneticButton>
          </div>
        </div>
      )}
    </div>
  );
};
