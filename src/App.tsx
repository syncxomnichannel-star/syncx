import React, { useState } from 'react';
import { CommandPalette } from './components/CommandPalette';
import { CreateTicketModal } from './components/CreateTicketModal';
import { DashboardView } from './components/DashboardView';
import { Header } from './components/Header';
import { OmnichannelView } from './components/OmnichannelView';
import { SettingsView } from './components/SettingsView';
import { Sidebar } from './components/Sidebar';
import { TicketsView } from './components/TicketsView';
import { ToastContainer } from './components/ToastContainer';
import { MagneticButton } from './components/MagneticButton';
import { CustomizationProvider, useCustomization } from './context/CustomizationContext';
import { NavTabId } from './types';
import { Check } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const { editMode, toggleEditMode } = useCustomization();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        <Header
          activeTab={activeTab}
          onNewTicketClick={() => setIsTicketModalOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenNewTicket={() => setIsTicketModalOpen(true)}
              onNavigateTab={setActiveTab}
            />
          )}
          {activeTab === 'omnichannel' && (
            <OmnichannelView onOpenNewTicket={() => setIsTicketModalOpen(true)} />
          )}
          {activeTab === 'tickets' && (
            <TicketsView onNewTicketClick={() => setIsTicketModalOpen(true)} />
          )}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Floating Edit Mode Bar when active */}
      {editMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 text-white backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-4 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-bold text-amber-300">Live Customization Mode</span>
          </div>
          <span className="text-xs text-slate-300 hidden sm:inline">
            Click on any title or text to edit in-place.
          </span>
          <MagneticButton
            strength={0.22}
            onClick={toggleEditMode}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Finish Editing</span>
          </MagneticButton>
        </div>
      )}

      {/* Modals & Overlays */}
      <ToastContainer />
      <CreateTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
      />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setActiveTab}
        onOpenNewTicket={() => setIsTicketModalOpen(true)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CustomizationProvider>
      <MainLayout />
    </CustomizationProvider>
  );
};

export default App;
