const n=`# CoolQuick — Intelligent Clipboard Manager
**Make Every Copy Count**

CoolQuick is a cross-platform desktop application that automatically captures and intelligently classifies your clipboard content, creating a zero-friction knowledge management experience.

<div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
  <img src="https://img.shields.io/github/stars/easy12138s/cool-quick?style=flat-square" alt="GitHub stars">
  <img src="https://img.shields.io/github/license/easy12138s/cool-quick?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue?style=flat-square" alt="Platforms">
</div>

[Download Now](https://github.com/easy12138s/cool-quick/releases) · [GitHub Repository](https://github.com/easy12138s/cool-quick)

---

## ✨ Key Highlights
- **Smart Capture** — Automatically detects clipboard changes and prompts instantly without manual operation
- **Smart Classification** — Automatically identifies 10+ types including phone numbers, emails, URLs, code snippets, passwords, etc.
- **Floating Widget** — Draggable floating button that expands into a history drawer on hover
- **Quick Access** — Scroll through history and copy any item with one click
- **Secure & Reliable** — Local SQLite storage + optional AES-256 encryption
- **Data Visualization** — Dashboard panel showing usage trends and statistics

---

## 🛠️ Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite + TailwindCSS |
| Backend | Tauri (Rust) — High-performance native API |
| Database | SQLite — Lightweight reliable local storage |
| Rich Text | Tiptap — Markdown support |
| State | Zustand — Lightweight and efficient |
| Animation | Framer Motion — Smooth interactions |
| Charts | Recharts — Data visualization |

---

## 🪟 Multi-Window Architecture
- **Main Window (1200×800)** — Full note management interface
- **Floating Widget (56×56)** — Always-on-top quick entry point
- **Drawer Window (380×480)** — History panel expanded on hover
- **Popup Window (380×280)** — New content detection prompt

---

## 💻 Supported Platforms
- ✅ Windows (MSI / NSIS installer)
- ✅ macOS (x86_64 / Apple Silicon)
- ✅ Linux (x86_64)

---

## 🎯 Features
- 🗂️ Auto-archive old notes by date
- 📤 Export as JSON / TXT / PDF
- ⚙️ Custom regex recognition rules
- 🌓 Light / Dark / System theme support
- 📊 Dashboard statistics and trend analysis
- ⭐ Favorites for quick access to important content

---

## 🚀 Quick Install
### Windows (Recommended)
- [Download Latest Release](https://github.com/easy12138s/cool-quick/releases)
- Ready to use out of the box
- Default database location: \`InstallDir\\data.db\`, fallback to \`%APPDATA%\\CoolQuick\\data.db\` if not writable

### macOS / Linux
\`\`\`bash
# Prerequisites: Node.js >= 18, Rust >= 1.70
git clone https://github.com/easy12138s/cool-quick.git
cd cool-quick
npm install
npm run tauri-build
\`\`\`
Bundle generated in \`src-tauri/target/release/bundle/\`

---

## 📖 Get Started in 30s
1. **Copy Content**: Copy text anywhere to trigger detection popup
2. **One-Click Save**: Click save on popup, content is auto-classified
3. **Quick Access**: Hover over floating widget, scroll through history
4. **Reuse Content**: Click any item to copy back to clipboard

---

## ⚙️ Advanced Features
### Custom Rules
Define your own recognition rules using regex to adapt to specific formats like ticket numbers or keys.

### Data Encryption
Enable AES-256 encryption for end-to-end storage protection, ensuring sensitive content remains unreadable even if the database is leaked.

### Backup & Migration
Directly backup \`data.db\` or export as JSON/TXT/PDF for one-click migration between devices.

---

## 👨‍💻 Development
### Requirements
- Node.js >= 18
- Rust >= 1.70
- Windows extra: Visual Studio Build Tools (C++ build tools)

### Local Dev
\`\`\`bash
git clone https://github.com/easy12138s/cool-quick.git
cd cool-quick
npm install
npm run tauri-dev
\`\`\`

### Production Build
\`\`\`bash
# Build for current platform
npm run tauri-build

# Windows all formats (MSI + NSIS)
npm run build:win

# Build all
npm run build:all
\`\`\`

---

## ❓ FAQ
### Does it upload clipboard content?
No. All data is stored locally with no network upload behavior. Completely offline usable.

### Will reinstallation lose data?
No. Backup \`data.db\` beforehand and replace it after reinstallation to restore fully.

---

## 🤝 Community & Contribution
Feel free to submit [Issues](https://github.com/easy12138s/cool-quick/issues) or [Pull Requests](https://github.com/easy12138s/cool-quick/pulls). If you find it useful, please give the repo a ⭐ Star!

---

## 📄 License
This project is open sourced under the **MIT License**. Free for personal and commercial use. See [LICENSE](./LICENSE) for details.

Made with ❤️ by CoolQuick Team
`;export{n as default};
