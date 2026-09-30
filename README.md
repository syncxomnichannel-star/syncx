# Enterprise Portal | Omnichannel Support Platform (Sync X Clone)

A pixel-perfect, high-performance, and **100% fully customizable** clone of [https://omnichannel-frontend-nine.vercel.app/](https://omnichannel-frontend-nine.vercel.app/), built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS v4**.

---

## 🚀 Quick Start

To launch the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

To build for production:

```bash
npm run build
```

---

## ✨ Features & Architecture

### 1. 📊 Dashboard Overview
- **Hero Banner**: Real-time status badge (`Sync X Production Engine Live`), gradient presentation, Report Export (`.json`), and quick ticket creation.
- **Key Performance Metrics**: 4 dynamic metric cards (`Total Open Tickets`, `Avg. First Response Time`, `Omnichannel Messages`, `Customer Satisfaction`) with filters (`today`, `7d`, `30d`).
- **Channel Volume**: Live progress bars and message volume distribution across WhatsApp, Telegram, Email, Web Chat, and Instagram.
- **Live Activity Feed**: Real-time audit stream of team actions, status updates, and message logs.

### 2. 💬 Omnichannel Control Center (Unified Inbox)
- **Channel Filter Ribbon**: Filter incoming conversations by WhatsApp, Telegram, Email, Web Chat, or Instagram.
- **Split-Screen Unified Inbox**:
  - **Left Pane**: Search and filter messages, customer avatars, channel badges, and unread counts.
  - **Right Pane**: Interactive chat conversation stream with incoming/outgoing message bubbles, quick canned reply chips, attachment tools, and real-time message composer.

### 3. 🎫 Support Ticket Management
- **Status Filters**: `All`, `Open`, `In Progress`, `Pending`, `Resolved`.
- **Search**: Search across ticket IDs, customer names, or subjects.
- **Data Table**: Customer avatars, channel badges, priority chips, assigned agents, and timestamps.
- **Slide-Over Ticket Drawer**: Inspect ticket details, switch status with 1 click, view internal notes, or delete tickets.

### 4. ⚙️ Platform Settings
- **Profile & Team**: Change user avatar, full name, work email, role, and timezone.
- **Channel Integrations**: Manage WhatsApp, Telegram, Email, Web Chat, and Instagram status and webhook URLs.
- **Notifications & Alerts**: Email digest, Slack alerts, and smart auto-assignment toggles.
- **API Keys & Security**: Production Stitch MCP API keys and webhook signing secret generation with clipboard copy.
- **Visual Customizer**: Built-in brand and theme color editor.

### 5. ⚡ Command Palette (`Cmd + K` / `Ctrl + K`)
- Instant fuzzy search across all portal tabs and actions (`Create Ticket`, `Toggle Edit Mode`, `Export Config`, `Reset Defaults`).

---

## 🎨 Full Customization Capabilities

You can customize **everything** in this web app in three ways:

### Method 1: Live Visual Edit Mode (WYSIWYG)
1. Click the **"Customize"** button in the top navigation bar (or press `Cmd + K` -> *Toggle Live Visual Edit Mode*).
2. Hover over any text (titles, subtitles, metric numbers, hero text, logo name) — a dashed highlight and pencil icon appear.
3. **Click directly on the text** to edit it in place! Press `Enter` or click outside to save.
4. When finished, click **"Finish Editing"**.

### Method 2: Visual Brand & Theme Customizer
- Click the **Palette icon** (🎨) in the top header or navigate to **Settings > Visual Customizer**:
  - Change the **Company Name** (default: `Sync`).
  - Change the **Badge Symbol** (default: `X`).
  - Change the **Tagline** (default: `Omnichannel Support`).
  - Change the **Hero Banner Title & Description**.
  - Choose from 6 pre-built accent themes: **Indigo**, **Enterprise Blue**, **Cyber Violet**, **Emerald SaaS**, **Rose Sunset**, or **Amber Gold**.

### Method 3: JSON Import & Export
- **Export Config**: Click the **Download (📥)** button in the header or in Settings to export your entire platform configuration (texts, metrics, tickets, channels, and profile) as a portable `.json` file.
- **Import Config**: Click the **Upload (📤)** button to load any custom configuration JSON.
- **Reset to Defaults**: Click the **Reset (↺)** button at any time to restore the original Sync X factory configuration.

---

## 📁 Project Structure

```
sample AG/
├── index.html                    # HTML entry point with Plus Jakarta Sans font
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite config with React & Tailwind v4
└── src/
    ├── main.tsx                  # React DOM entrypoint
    ├── App.tsx                   # Main layout & tab router
    ├── index.css                 # Tailwind v4 styles & custom scrollbars
    ├── types/
    │   └── index.ts              # TypeScript definitions for tickets, channels, etc.
    ├── config/
    │   └── initialData.ts        # Default data replicating the original portal
    ├── context/
    │   └── CustomizationContext.tsx  # State manager, persistence, import/export & live editor
    └── components/
        ├── EditableText.tsx      # In-place live text editing component
        ├── Header.tsx            # Top header with customization toolbar
        ├── Sidebar.tsx           # Collapsible sidebar navigation
        ├── DashboardView.tsx     # Metrics, channel volume, activity feed
        ├── OmnichannelView.tsx   # Two-pane unified inbox & chat
        ├── TicketsView.tsx       # Tickets table & slide-over drawer
        ├── SettingsView.tsx      # Profile, channels, security, & theme customizer
        ├── CreateTicketModal.tsx # Modal to create support tickets
        ├── CommandPalette.tsx    # Cmd+K search & action palette
        ├── ToastContainer.tsx    # Floating notification toasts
        └── icons/
            └── InstagramIcon.tsx # Custom Instagram SVG icon
```
