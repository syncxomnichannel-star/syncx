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
import { useCustomization } from '../context/CustomizationContext';
import { ChannelType } from '../types';

export const SettingsView: React.FC = () => {
  const {
    branding,
    updateBranding,
    themeClasses,
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
    { id: 'channels', label: 'Channel Integrations', icon: Layers },
    { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
    { id: 'security', label: 'API Keys & Security', icon: Key },
    { id: 'customizer', label: 'Visual Customizer', icon: Palette }
  ] as const;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile(profileForm);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`${label} Copied`, `${label} copied to clipboard.`, 'success');
  };

  const handleGenerateKey = () => {
    const newKey = 'syncx_live_pk_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 8);
    setCustomApiKey(newKey);
    updateSecurity({ stitchApiKey: newKey });
    showToast('Key Generated', 'A new secret key has been generated.', 'success');
  };

  const colorOptions: Array<{ id: typeof branding.primaryColor; name: string; class: string }> = [
    { id: 'indigo', name: 'Indigo (Sync X)', class: 'bg-indigo-600' },
    { id: 'blue', name: 'Enterprise Blue', class: 'bg-blue-600' },
    { id: 'purple', name: 'Cyber Violet', class: 'bg-purple-600' },
    { id: 'emerald', name: 'Emerald SaaS', class: 'bg-emerald-600' },
    { id: 'rose', name: 'Rose Sunset', class: 'bg-rose-600' },
    { id: 'amber', name: 'Amber Gold', class: 'bg-amber-600' }
  ];

  const getChannelIcon = (type: ChannelType) => {
    switch (type) {
      case 'WhatsApp':
        return <Smartphone className="w-5 h-5 text-emerald-600" />;
      case 'Telegram':
        return <Send className="w-5 h-5 text-sky-600" />;
      case 'Email':
        return <Mail className="w-5 h-5 text-blue-600" />;
      case 'Web Chat':
        return <Globe className="w-5 h-5 text-amber-600" />;
      case 'Instagram':
        return <InstagramIcon className="w-5 h-5 text-pink-600" />;
    }
  };

  const handleOpenChannelEdit = (channel: any) => {
    setEditingChannelId(channel.id);
    setChannelWebhookInput(channel.webhookUrl || `https://api.syncx.io/v1/webhooks/${channel.type.toLowerCase()}`);
  };

  const handleSaveChannel = async (id: string) => {
    await updateChannel(id, { webhookUrl: channelWebhookInput });
    setEditingChannelId(null);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-4 overflow-x-auto">
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap shadow-2xs ${
                isActive
                  ? `${themeClasses.bg} text-white shadow-md shadow-indigo-600/20`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub Tab: Profile & Team */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-6 shadow-2xs">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Operator Account
              </h4>

              <div className="flex items-center space-x-6">
                <img
                  src={profileForm.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-xs"
                />
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newUrl = prompt('Enter image URL for avatar:', profileForm.avatar);
                      if (newUrl) setProfileForm({ ...profileForm, avatar: newUrl });
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-all hover:shadow-xs hover:-translate-y-0.5 cursor-pointer"
                  >
                    Change Photo
                  </button>
                  <p className="text-[11px] text-slate-400 font-medium">Avatar URL or profile image asset.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Work Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Role Title</label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={e => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Default Timezone</label>
                  <select
                    value={profileForm.timezone}
                    onChange={e => setProfileForm({ ...profileForm, timezone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
              <button
                type="submit"
                className={`px-5 py-2.5 ${themeClasses.bg} ${themeClasses.hoverBg} text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer`}
              >
                {isSaving ? <Check className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? 'Saved Changes!' : 'Save Profile'}</span>
              </button>
            </div>
          </form>

          {/* Team Members Roster */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Support Operations Specialists ({agents.length})
                </h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                All Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agents.map(agent => (
                <div
                  key={agent.id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-black/5"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{agent.name}</h5>
                      <p className="text-[10px] text-slate-500 font-medium">{agent.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                    {agent.assignedTicketsCount || 2} Cases
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: Channel Integrations */}
      {activeSubTab === 'channels' && (
        <div className="space-y-4">
          {channels.map(channel => (
            <div
              key={channel.id}
              className="p-5 bg-white border border-slate-200/80 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-slate-100 rounded-2xl">{getChannelIcon(channel.type)}</div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{channel.name}</h5>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {channel.category || channel.type} • Avg Response: {channel.avgResponseTime}
                  </p>
                  {channel.webhookUrl && (
                    <p className="text-[10px] text-slate-400 font-mono truncate max-w-sm mt-0.5">
                      {channel.webhookUrl}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    const next = channel.status === 'Connected' ? 'Disconnected' : 'Connected';
                    updateChannel(channel.id, { status: next });
                  }}
                  className={`text-[11px] font-bold px-3 py-1 rounded-xl border cursor-pointer transition-colors ${
                    channel.status === 'Connected'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {channel.status}
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenChannelEdit(channel)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 hover:border-slate-300 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  Configure
                </button>
              </div>
            </div>
          ))}

          {/* Channel Configure Modal */}
          {editingChannelId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in">
              <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Configure Channel Webhook</h4>
                <p className="text-xs text-slate-500">
                  Update the inbound webhook endpoint for this gateway.
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Webhook URL</label>
                  <input
                    type="text"
                    value={channelWebhookInput}
                    onChange={e => setChannelWebhookInput(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingChannelId(null)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveChannel(editingChannelId)}
                    className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                  >
                    Save URL
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub Tab: Notifications & Alerts */}
      {activeSubTab === 'notifications' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-6 shadow-2xs">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Alert Preferences
          </h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div>
                <p className="text-xs font-bold text-slate-900">Email Digest Notifications</p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Receive daily performance reports and SLA breach alerts in your inbox.
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateNotifications({ emailDigest: !notifications.emailDigest })}
                className="text-indigo-600 transition-transform active:scale-90 cursor-pointer"
              >
                {notifications.emailDigest ? (
                  <ToggleRight className="w-8 h-8 text-indigo-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-300" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div>
                <p className="text-xs font-bold text-slate-900">Slack Ticket Alerts</p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Ping #support-ops when high-priority or urgent tickets are created.
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateNotifications({ slackAlerts: !notifications.slackAlerts })}
                className="text-indigo-600 transition-transform active:scale-90 cursor-pointer"
              >
                {notifications.slackAlerts ? (
                  <ToggleRight className="w-8 h-8 text-indigo-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-300" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div>
                <p className="text-xs font-bold text-slate-900">Auto-Assign Tickets</p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Smart round-robin assignment based on agent load and channel specialization.
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateNotifications({ autoAssign: !notifications.autoAssign })}
                className="text-indigo-600 transition-transform active:scale-90 cursor-pointer"
              >
                {notifications.autoAssign ? (
                  <ToggleRight className="w-8 h-8 text-indigo-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: API Keys & Security */}
      {activeSubTab === 'security' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Production Gateway Keys
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Use these credentials to connect inbound webhooks and automation tools.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateKey}
              className={`px-3.5 py-2 ${themeClasses.bg} ${themeClasses.hoverBg} text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer`}
            >
              Generate New Key
            </button>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500 font-bold flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-600" /> Live Omnichannel Gateway Key
              </span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={customApiKey}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-indigo-700 font-bold focus:outline-none"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(customApiKey, 'Gateway API Key')}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all hover:shadow-xs cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-indigo-600" />
                <span>Copy Key</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500 font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-600" /> Webhook Signing Secret
              </span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Secured
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={customSecret}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 font-bold focus:outline-none"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(customSecret, 'Webhook Secret')}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all hover:shadow-xs cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-indigo-600" />
                <span>Copy Secret</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: Visual Customizer */}
      {activeSubTab === 'customizer' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-6 shadow-2xs">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Visual Brand Customizer</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Change logo text, company name, hero headers, color themes, or export your operational reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={branding.companyName}
                onChange={e => updateBranding({ companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Badge Symbol</label>
              <input
                type="text"
                value={branding.companyBadge}
                onChange={e => updateBranding({ companyBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={branding.tagline}
                onChange={e => updateBranding({ tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Accent Color Theme</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {colorOptions.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateBranding({ primaryColor: opt.id })}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    branding.primaryColor === opt.id
                      ? 'border-slate-800 bg-slate-50 ring-2 ring-indigo-500/20 font-bold'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full ${opt.class}`} />
                  <span className="text-[11px] text-slate-700">{opt.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => exportReport('json')}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Export Operational Report (JSON)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
