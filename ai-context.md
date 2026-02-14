# Chronify — AI Context Document

> **This file is continuously kept up-to-date so the AI assistant has full context about the project.**
> **Last updated:** 2026-02-14

---

## 📋 Project Overview

**Chronify** — "Track. Log. Export."

Chronify is a **lightweight desktop application** that lets users track their work time, log entries, and export reports. It requires no backend or database server — all data is stored locally on the user's machine as a JSON file.

**Platform:** macOS (primary), Windows (supported)
**Architecture:** Tauri v2 Desktop App (no backend, no auth, local-first)

---

## 🏗️ Tech Stack

| Layer             | Technology            | Version | Description                     |
| ----------------- | --------------------- | ------- | ------------------------------- |
| Desktop Framework | **Tauri**             | v2      | Lightweight native app (~5MB)   |
| UI Library        | **React**             | 18+     | UI components                   |
| UI Components     | **Mantine**           | v7      | Rich component library          |
| Build Tool        | **Vite**              | 5+      | Fast HMR & build                |
| Language          | **TypeScript**        | 5+      | Type safety                     |
| State             | React State + Context | -       | Global state management         |
| i18n              | **Lingui**            | 5+      | Multi-language support (en, tr) |
| Data Storage      | **JSON file**         | -       | File system (Tauri FS API)      |
| Export            | json2csv, jsPDF       | -       | CSV / PDF export (optional)     |

### Technologies NOT Used (Intentional Decisions)

- ❌ Backend (NestJS, etc.) — not needed, all data is local
- ❌ Database (PostgreSQL, SQLite, etc.) — JSON file is sufficient
- ❌ Authentication — single user, local app
- ❌ Electron — too heavy (~150MB), Tauri is much lighter
- ❌ IndexedDB / localStorage — browser-dependent, risky

---

## 📁 Project Structure

```
Chronify/
├── ai-context.md                # This file — AI context document
├── README.md                    # Project description
├── package.json                 # Node dependencies
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite config (+ lingui plugin)
├── postcss.config.cjs           # PostCSS config (Mantine preset)
├── lingui.config.ts             # Lingui i18n configuration
├── index.html                   # HTML entry point
│
├── src/                         # React Frontend
│   ├── main.tsx                 # App entry point
│   ├── App.tsx                  # Root component (providers + theme)
│   ├── vite-env.d.ts            # Vite type declarations
│   ├── lingui.d.ts              # Lingui catalog type declaration
│   │
│   ├── components/              # Shared UI components
│   │   └── AppLayout/           # Main layout (AppShell + Sidebar)
│   │       ├── index.ts
│   │       ├── AppLayout.tsx
│   │       └── AppLayout.module.css
│   │
│   ├── features/                # Feature-based modules
│   │   ├── timer/
│   │   │   └── TimerPage/
│   │   │       ├── index.ts
│   │   │       └── TimerPage.tsx
│   │   ├── timesheet/
│   │   │   └── TimesheetPage/
│   │   │       ├── index.ts
│   │   │       └── TimesheetPage.tsx
│   │   ├── projects/
│   │   │   └── ProjectsPage/
│   │   │       ├── index.ts
│   │   │       └── ProjectsPage.tsx
│   │   ├── reports/
│   │   │   └── ReportsPage/
│   │   │       ├── index.ts
│   │   │       └── ReportsPage.tsx
│   │   └── settings/
│   │       └── SettingsPage/
│   │           ├── index.ts
│   │           └── SettingsPage.tsx
│   │
│   ├── lib/                     # Utility functions
│   │   ├── storage.ts           # Tauri FS JSON read/write
│   │   └── i18n.ts              # Lingui i18n setup
│   │
│   ├── locales/                 # Translation files
│   │   ├── en/messages.po       # English (source locale)
│   │   └── tr/messages.po       # Turkish
│   │
│   ├── providers/               # React Context providers
│   │   └── AppDataProvider.tsx  # Data management context
│   │
│   ├── routes/                  # Route definitions
│   │   └── index.tsx
│   │
│   ├── styles/                  # Global styles
│   │   ├── global.css           # Global CSS
│   │   └── theme.ts             # Mantine theme configuration
│   │
│   └── types/                   # TypeScript type definitions
│       └── app-data.types.ts
│
└── src-tauri/                   # Tauri Backend (Rust — no manual editing needed)
    ├── Cargo.toml               # Rust dependencies
    ├── tauri.conf.json          # Tauri configuration
    ├── capabilities/            # Tauri v2 permissions (FS included)
    ├── icons/                   # App icons
    └── src/
        └── lib.rs               # Tauri entry point
```

---

## 💾 Data Storage Architecture

### File Location

```
# macOS
~/Library/Application Support/com.chronify.app/data.json

# Windows
C:\Users\<user>\AppData\Roaming\com.chronify.app\data.json
```

Accessed platform-independently using `appDataDir()` from `@tauri-apps/api/path`.

### Data Structure (data.json)

```json
{
  "version": 1,
  "settings": {
    "theme": "dark",
    "primaryColor": "#E03131",
    "locale": "en",
    "defaultView": "timer",
    "weekStartsOn": "monday"
  },
  "projects": [
    {
      "id": "uuid-1",
      "name": "Chronify Dev",
      "description": "Building the Chronify app",
      "color": "#4C6EF5",
      "isActive": true,
      "createdAt": "2026-02-14T09:00:00.000Z",
      "updatedAt": "2026-02-14T09:00:00.000Z"
    }
  ],
  "timeEntries": [
    {
      "id": "uuid-2",
      "projectId": "uuid-1",
      "description": "Timer widget development",
      "startTime": "2026-02-14T09:00:00.000Z",
      "endTime": "2026-02-14T11:30:00.000Z",
      "duration": 9000,
      "date": "2026-02-14",
      "tags": ["development"],
      "createdAt": "2026-02-14T09:00:00.000Z",
      "updatedAt": "2026-02-14T11:30:00.000Z"
    }
  ],
  "tags": [
    {
      "id": "uuid-3",
      "name": "development",
      "color": "#51CF66"
    }
  ]
}
```

### Read / Write Strategy

1. **On app launch:** JSON file is read and loaded into React state
2. **On every change:** State is updated → written to JSON file
3. **If file doesn't exist:** Default empty data structure is created
4. **Backup:** A `.backup` file is created before writes (data loss prevention)

### Tauri FS API Usage

```typescript
import {
  readTextFile,
  writeTextFile,
  exists,
  mkdir,
} from '@tauri-apps/plugin-fs';
import { appDataDir, join } from '@tauri-apps/api/path';

const DATA_FILE = 'data.json';

export async function loadAppData(): Promise<AppData> {
  const dir = await appDataDir();
  const filePath = await join(dir, DATA_FILE);

  if (await exists(filePath)) {
    const content = await readTextFile(filePath);
    return JSON.parse(content);
  }

  // First launch: create default data
  const defaultData = createDefaultAppData();
  await saveAppData(defaultData);
  return defaultData;
}

export async function saveAppData(data: AppData): Promise<void> {
  const dir = await appDataDir();
  await mkdir(dir, { recursive: true });
  const filePath = await join(dir, DATA_FILE);
  await writeTextFile(filePath, JSON.stringify(data, null, 2));
}
```

---

## 🎨 Frontend Conventions

### Mantine v7 Usage

- Custom theme via `MantineProvider` with `createTheme()`
- CSS Modules preferred (`.module.css`)
- Mantine components: `AppShell`, `Button`, `TextInput`, `Modal`, `Card`, `Table`, `ActionIcon`, etc.
- `@mantine/hooks`: `useDisclosure`, `useLocalStorage`, `useDebouncedValue`
- `@mantine/form`: Form management
- `@mantine/dates`: Date picker components
- `@mantine/notifications`: Toast notifications

### Mantine Packages

```json
{
  "@mantine/core": "^7.x",
  "@mantine/hooks": "^7.x",
  "@mantine/form": "^7.x",
  "@mantine/dates": "^7.x",
  "@mantine/notifications": "^7.x",
  "@mantine/charts": "^7.x",
  "@mantine/colors-generator": "^7.x"
}
```

### Component Structure — Rules

> ⚠️ **Maximum 150 lines** — Each component file must be at most 150 lines.
> Large components must be split into sub-components.

Each component lives in its own folder named after the component:

```
ComponentName/
  index.ts              # export * from './ComponentName'
  ComponentName.tsx     # Component file (max 150 lines)
  ComponentName.module.css  # CSS Module (if needed)
```

Example: Multiple components within a feature:

```
features/
  timer/
    TimerPage/
      index.ts             # export * from './TimerPage'
      TimerPage.tsx
    TimerWidget/
      index.ts             # export * from './TimerWidget'
      TimerWidget.tsx
      TimerWidget.module.css
    hooks/
      useTimer.ts
```

Imports always point to the component folder:

```typescript
import { TimerPage } from '../features/timer/TimerPage';
import { TimerWidget } from '../features/timer/TimerWidget';
```

### Naming Convention

- **Components:** PascalCase (`TimerWidget.tsx`)
- **Folders:** Same PascalCase as component (`TimerWidget/`)
- **Index files:** `export * from './ComponentName'`
- **Hooks:** camelCase, `use` prefix (`useTimer.ts`)
- **Utilities:** camelCase (`storage.ts`, `helpers.ts`)
- **Types:** PascalCase, `.types.ts` suffix (`time-entry.types.ts`)
- **CSS Modules:** `ComponentName.module.css`
- **Constants:** UPPER_SNAKE_CASE (`MAX_TIMER_DURATION`)

### i18n (Internationalization)

- **Library:** `@lingui/react` + `@lingui/macro`
- **Supported languages:** `en` (default), `tr`
- **Usage:** All user-facing text is wrapped with the `useLingui` hook
- **Catalogs:** `src/locales/en/messages.po`, `src/locales/tr/messages.po`
- **Language switch:** From Settings page, via `AppSettings.locale`

```typescript
import { useLingui } from "@lingui/react/macro";

function MyComponent() {
  const { t } = useLingui();
  return <Title>{t`Timer`}</Title>;
}
```

### State Management

- **App data (projects, time entries):** React Context (`AppDataProvider`)
- **UI state:** React `useState` / `useReducer`
- **Form state:** `@mantine/form` (`useForm`)
- **Timer state:** Custom hook (`useTimer`)
- **Theme:** Mantine `MantineProvider`

---

## 🎨 Design Decisions

### Color Palette — User Selectable

`@mantine/colors-generator` generates a 10-shade palette from the user's chosen color.

- **Default Primary:** Tomato 🍅 (`#E03131`)
- **User selection:** Changeable from the Settings page
- **Surface:** Dark theme by default
- **Timer running:** Green tone (`teal` or `green`)
- **Timer stopped:** Neutral / gray

#### Preset Color Options

Quick selection palettes offered to the user:

| Color     | Hex       | Usage       |
| --------- | --------- | ----------- |
| 🍅 Tomato | `#E03131` | **Default** |
| 🔵 Blue   | `#228BE6` | -           |
| 🟣 Violet | `#7950F2` | -           |
| 🟢 Teal   | `#12B886` | -           |
| 🟠 Orange | `#FD7E14` | -           |
| 🩷 Pink   | `#E64980` | -           |
| 🔷 Indigo | `#4C6EF5` | -           |
| 🌊 Cyan   | `#15AABF` | -           |

Users can also enter a **custom hex color**.

#### Theme Implementation

```typescript
// styles/theme.ts
import { createTheme, MantineColorsTuple } from '@mantine/core';
import { generateColors } from '@mantine/colors-generator';

export function buildTheme(primaryColor: string) {
  const colors: MantineColorsTuple = generateColors(primaryColor);

  return createTheme({
    primaryColor: 'primary',
    colors: {
      primary: colors,
    },
    fontFamily: 'Inter, sans-serif',
    defaultRadius: 'md',
  });
}
```

### Typography

- **Font Family:** Inter (Google Fonts)
- **Heading:** Semi-bold / Bold
- **Body:** Regular (14px)

### Layout

- `AppShell` (Mantine) → Sidebar + Content
- Sidebar: Collapsible
- Desktop-first (but responsive)
- Minimum window size: 900×600

### Page Structure

| Page          | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| **Timer**     | Main page — timer widget, active project selection, recent logs |
| **Timesheet** | Time entries list — daily/weekly view                           |
| **Projects**  | Project list — CRUD, color assignment                           |
| **Reports**   | Charts & statistics — by project/date                           |
| **Settings**  | Theme, color palette picker, language, data management          |

---

## 🚀 Features (Roadmap)

### ✅ Phase 1 — Foundation

- [x] Tauri v2 + React + Vite project setup
- [x] Mantine v7 theme configuration (dark theme)
- [x] AppShell layout (sidebar + content)
- [x] JSON file read/write infrastructure (Tauri FS)
- [x] AppDataProvider (Context)
- [x] Route structure (React Router)
- [x] Lingui i18n setup (en/tr)

### ✅ Phase 2 — Time Tracking (Core)

- [x] Timer widget (start / stop / resume)
- [x] Active project selection (from timer)
- [x] Manual time entry creation
- [x] Time entries list (daily view)
- [x] Time entry delete
- [x] Time entry edit

### ✅ Phase 3 — Project Management

- [x] Create project (name + color)
- [x] Edit / delete / archive project
- [x] Per-project time statistics (total duration)

### ✅ Phase 4 — Reporting & Export

- [x] Daily / weekly / monthly summary view
- [x] Per-project pie / bar charts
- [x] CSV export
- [x] PDF export
- [x] Data backup (JSON export/import)

### ✅ Phase 5 — Polish & Extras

- [x] Tagging system (MultiSelect)
- [x] Dark / Light theme toggle (Settings)
- [x] Keyboard shortcuts (⌘+S save, Space timer toggle)
- [x] Idle reminder (notification)
- [ ] App icon & splash screen
- [ ] macOS + Windows build & distribution

---

## 🗂️ TypeScript Type Definitions

```typescript
interface AppData {
  version: number;
  settings: AppSettings;
  projects: Project[];
  timeEntries: TimeEntry[];
  tags: Tag[];
}

interface AppSettings {
  theme: 'dark' | 'light' | 'auto';
  primaryColor: string; // Hex color code (default: '#E03131')
  locale: 'en' | 'tr'; // UI language (default: 'en')
  defaultView: 'timer' | 'timesheet';
  weekStartsOn: 'monday' | 'sunday';
}

interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

interface TimeEntry {
  id: string;
  projectId?: string;
  description?: string;
  startTime: string; // ISO 8601
  endTime?: string; // null = timer is running
  duration: number; // in seconds
  date: string; // YYYY-MM-DD
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}
```

---

## 📦 Commands

```bash
# Development
npm run tauri dev         # Start Tauri + Vite dev server

# Build
npm run tauri build       # Create macOS .dmg or Windows .exe

# Frontend only (in browser)
npm run dev               # Vite dev server (without Tauri)

# i18n
npx lingui extract        # Extract translatable strings
npx lingui compile        # Compile translation catalogs
```

---

## 📝 Development Notes

### Active Development

- [x] Tauri v2 + React + Vite project setup
- [x] Mantine v7 + PostCSS configuration
- [x] Lingui i18n setup (en/tr)
- [x] AppDataProvider (Context + JSON storage)
- [x] AppShell layout (sidebar + routing)
- [x] TypeScript compiles without errors
- [x] Timer widget development (Phase 2)

### Prerequisites (Dev Environment)

- Node.js 18+
- Rust (for Tauri v2) — `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- macOS: Xcode Command Line Tools
- Linux: `libwebkit2gtk-4.1-dev libgtk-3-dev librsvg2-dev`
- Windows: Microsoft C++ Build Tools

### Known Issues

- (none yet)

### Key Decisions

| Decision             | Reason                                                         |
| -------------------- | -------------------------------------------------------------- |
| Tauri v2             | Much lighter than Electron (~5MB vs ~150MB)                    |
| JSON file storage    | Even SQLite is overkill; simple JSON is enough                 |
| No backend           | Single-user local app, no server needed                        |
| No auth              | Local app, file system access is sufficient security           |
| Mantine v7           | Rich component set, good dark mode support, CSS Modules compat |
| CSS Modules          | Compatible with Mantine, scoped styles                         |
| React Context        | Simple state management, no extra library needed               |
| Lingui               | Lightweight i18n, macro-based, compile-time translations       |
| 150 line limit       | Readability and maintainability — component size constraint    |
| Component-per-folder | Each component in its own folder, exported via index.ts        |

---

## 🔄 Changelog

| Date       | Change                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| 2026-02-14 | Initial version created. Project plan and tech stack defined.                                        |
| 2026-02-14 | Removed backend/DB. Switched to Tauri v2 + JSON file storage architecture.                           |
| 2026-02-14 | Color palette: Added user-selectable primary color via @mantine/colors-generator. Default: tomato 🍅 |
| 2026-02-14 | Project setup complete. Lingui i18n (en/tr), component-per-folder structure, 150 line limit added.   |
| 2026-02-14 | Converted ai-context.md to English (global project language).                                        |
