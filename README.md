# OBSIDIANxPEBBLE

A lightweight, always-on-top desktop app for quickly capturing notes directly into your Obsidian vault. Built with Tauri, React, and TypeScript.

## Features

- **Quick Note Capture**: Rapidly create notes without switching to Obsidian
- **Multiple Templates**: Quick notes, meeting notes, and task templates
- **Always On Top**: Stays visible while you work in other applications
- **Custom Titlebar**: Draggable window with minimize, maximize, and close controls
- **Dark/Light Theme**: Toggle between themes with one click
- **Rich Text Editor**: TipTap-powered editor for formatted content
- **Screenshot Support**: Paste screenshots directly from clipboard (Ctrl+V)
- **Tags**: Add multiple tags to organize your notes
- **Reminders**: Set reminders that trigger notifications when due
- **Banner Images**: Add custom banner images to your notes
- **Keyboard Shortcuts**:
  - `Ctrl+Enter`: Save note
  - `Esc`: Clear form
  - `Ctrl+V`: Paste screenshot

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 7** - Build tool and dev server
- **TailwindCSS 4** - Utility-first CSS
- **TipTap** - Rich text editor

### Backend (Tauri/Rust)
- **Tauri 2** - Desktop app framework
- **Rust** - Backend logic
- **Serde** - Serialization/deserialization
- **Chrono** - Date/time handling

### Tauri Plugins
- `tauri-plugin-fs` - File system access for saving notes
- `tauri-plugin-notification` - Desktop notifications for reminders
- `tauri-plugin-opener` - Opening files/URLs

## Project Structure

```
obsidian-quick-note/
├── src/                          # Frontend source
│   ├── components/
│   │   ├── fields/               # Form field components
│   │   │   ├── DateField.tsx
│   │   │   ├── ListField.tsx
│   │   │   ├── PriorityField.tsx
│   │   │   ├── ReminderPicker.tsx
│   │   │   ├── RichTextEditor.tsx
│   │   │   ├── ScreenshotArea.tsx
│   │   │   ├── SubjectField.tsx
│   │   │   ├── TagInput.tsx
│   │   │   └── TitleField.tsx
│   │   ├── templates/            # Note templates
│   │   │   ├── MeetingNoteTemplate.tsx
│   │   │   ├── QuickNoteTemplate.tsx
│   │   │   └── TaskTemplate.tsx
│   │   ├── NoteModal.tsx         # Main app component
│   │   ├── TemplateSelector.tsx
│   │   └── TitleBar.tsx          # Custom window titlebar
│   ├── hooks/
│   │   ├── useClipboardPaste.ts  # Screenshot paste handling
│   │   ├── useReminders.ts       # Reminder polling/notifications
│   │   └── useTheme.ts           # Dark/light theme toggle
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── src-tauri/                    # Backend source (Rust)
│   ├── src/
│   │   ├── lib.rs                # Tauri commands and logic
│   │   └── main.rs               # Entry point
│   ├── capabilities/
│   │   └── default.json          # App permissions
│   ├── icons/                    # App icons
│   ├── Cargo.toml                # Rust dependencies
│   └── tauri.conf.json           # Tauri configuration
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Configuration

### Tauri Configuration (`src-tauri/tauri.conf.json`)

```json
{
  "app": {
    "windows": [{
      "title": "OBSIDIANxPEBBLE",
      "width": 450,
      "height": 650,
      "resizable": true,
      "alwaysOnTop": true,
      "decorations": false,    // Custom titlebar
      "center": true,
      "minWidth": 380,
      "minHeight": 500
    }]
  }
}
```

### Capabilities/Permissions (`src-tauri/capabilities/default.json`)

The app requires these permissions:
- `core:window:allow-start-dragging` - Drag window by titlebar
- `core:window:allow-minimize/maximize/close` - Window controls
- `fs:allow-read/write/exists/mkdir` - Save notes to vault
- `fs:scope-desktop/document/home-recursive` - File system access scopes
- `notification:allow-notify` - Desktop notifications for reminders

### Vault Path

The default vault path is configured in `src/components/NoteModal.tsx`:

```typescript
const DEFAULT_VAULT_PATH = "C:\\Users\\bjones\\Desktop\\Obsidian\\Notes and Documentation\\Manager Files\\Daily Log and Todos";
```

## Note Templates

### Quick Note
- Title, tags, body content
- Optional reminder
- Screenshot support

### Meeting Note
- Title, date, subject
- Attendees list
- Discussion body
- Action items
- Tags and reminder

### Task
- Title, date, priority (low/medium/high)
- Due date
- Description
- Checklist items
- Tags and reminder

## Generated Markdown Format

Notes are saved as markdown files with YAML frontmatter:

```markdown
---
date: 2024-01-15
tags: [work, project]
type: quick
---

# Note Title

Note content here...

## Screenshots
![Screenshot 1](attachments/2024-01-15-note-title-screenshot-1.png)
```

## Reminders

- Reminders are stored in `%LOCALAPPDATA%\obsidian-quick-note\reminders.json`
- The app checks for due reminders on startup and every 30 seconds while running
- Notifications show "Reminder" for on-time alerts or "Overdue Reminder" if missed
- Reminders are automatically cleared after triggering

## Development

### Prerequisites
- Node.js 18+
- Rust (via rustup)
- Tauri CLI

### Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

### Build Output

Production builds are created in:
- `src-tauri/target/release/obsidian-quick-note.exe` - Standalone executable
- `src-tauri/target/release/bundle/nsis/OBSIDIANxPEBBLE_0.1.0_x64-setup.exe` - Installer
- `src-tauri/target/release/bundle/msi/OBSIDIANxPEBBLE_0.1.0_x64_en-US.msi` - MSI package

## IDE Setup

Recommended extensions for VS Code:
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## License

MIT
