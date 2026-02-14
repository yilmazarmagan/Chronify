# 🍅 Chronify

**Track. Log. Export.**  
Chronify is a premium, lightweight desktop application designed for professionals who want to track their work time without the complexity of cloud-based tools. Everything is stored locally on your machine—no account, no backend, no compromises on privacy.

![Version](https://img.shields.io/badge/version-0.1.0-tomato)
![Tauri](https://img.shields.io/badge/built%20with-Tauri%20v2-blue)
![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61dafb)
![Mantine](https://img.shields.io/badge/ui-Mantine%20v7-339af0)

---

## ✨ Key Features

- **⏱️ Minimalist Timer:** A sleek, modern timer with animated gradient rings and glassmorphism aesthetics.
- **📂 Project Management:** Organize your work by projects with custom color coding and archiving capabilities.
- **🏷️ Smart Tagging:** Categorize your time entries with multiple tags on the fly.
- **📊 Detailed Reporting:** Visualize your productivity with Daily Activity charts and Project Distribution breakdowns.
- **📥 Professional Export:** Export your logs to **CSV**, **PDF**, or perform a full **JSON Backup**.
- **🔔 Native Experience:**
  - **System Tray:** Runs in the background (hides to tray when closed).
  - **Global Shortcut (`Alt + Shift + S`):** Toggle the timer from any application.
  - **Idle Reminders:** Native OS notifications if you forget to start your timer while working.
- **🌍 Internationalization:** Full support for **English** and **Turkish** out of the box.
- **🎨 Customization:** Choose your primary brand color and toggle between **Light** and **Dark** modes.

---

## 🛠️ Tech Stack

- **Core:** [Tauri v2](https://v2.tauri.app/) (Rust-based)
- **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling:** [Mantine v7](https://mantine.dev/), [Tabler Icons](https://tabler.io/icons)
- **i18n:** [LinguiJS](https://lingui.dev/)
- **Charts:** [Mantine Charts](https://mantine.dev/charts/getting-started/)
- **Storage:** Local JSON (`$APPDATA/Chronify/data.json`)

---

## 🚀 Installation & Setup

Before building, ensure you have **Node.js (18+)** installed.

### 1. General Requirements (Rust)

All platforms require the Rust toolchain. Install it via [rustup.rs](https://rustup.rs/):

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2. Platform Specific Dependencies

#### 🍎 macOS

1. Install **Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```
2. (Optional) For Apple Silicon (M1/M2/M3) cross-compilation:
   ```bash
   rustup target add aarch64-apple-darwin
   ```

#### 🪟 Windows

1. Download and install **[Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)**.
2. During installation, make sure to select the **"Desktop development with C++"** workload.
3. Ensure the **WebView2 Runtime** is installed (usually present on Windows 10/11).

#### 🐧 Linux (Ubuntu/Debian)

Install the required system libraries for Tauri/WebKit:

```bash
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf build-essential curl wget
```

---

### 3. Build & Run

Once the dependencies above are met, follow these steps to get Chronify running:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yilmazarmagan/Chronify.git
   cd Chronify
   ```

2. **Install frontend dependencies:**

   ```bash
   npm install
   ```

3. **Development Mode:**

   ```bash
   npm run tauri dev
   ```

4. **Build Production App:**
   ```bash
   npm run tauri build
   ```
   _The executable (DMG, MSI, or AppImage) will be found in `src-tauri/target/release/bundle/`._

---

## ⌨️ Shortcuts

| Action                     | Shortcut                   |
| -------------------------- | -------------------------- |
| **Start/Stop/Pause Timer** | `Alt + Shift + S` (Global) |
| **Toggle Timer (In App)**  | `Space`                    |
| **Quick Save Entry**       | `Cmd/Ctrl + S`             |
| **Hide Window**            | `Cmd/Ctrl + W`             |

---

## 📄 License

This project is private. (©) 2026 Chronify Team.
