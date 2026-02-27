import { getCurrentWindow } from "@tauri-apps/api/window";

interface TitleBarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function TitleBar({ isDark, onToggleTheme }: TitleBarProps) {
  const appWindow = getCurrentWindow();

  const handleMinimize = () => appWindow.minimize();
  const handleMaximize = () => appWindow.toggleMaximize();
  const handleClose = () => appWindow.close();

  return (
    <div
      data-tauri-drag-region
      className="flex items-center justify-between h-8 px-2 select-none"
      style={{ backgroundColor: isDark ? "#1e1e2e" : "#2e2e42" }}
    >
      <div data-tauri-drag-region className="flex items-center gap-2">
        <span className="text-xs font-medium" style={{ color: "#9ca3af" }}>
          OBSIDIANxPEBBLE
        </span>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          onClick={onToggleTheme}
          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors"
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
        <button
          type="button"
          onClick={handleMinimize}
          className="w-10 h-8 flex items-center justify-center hover:bg-white/10 transition-colors"
          title="Minimize"
        >
          <MinimizeIcon />
        </button>
        <button
          type="button"
          onClick={handleMaximize}
          className="w-10 h-8 flex items-center justify-center hover:bg-white/10 transition-colors"
          title="Maximize"
        >
          <MaximizeIcon />
        </button>
        <button
          type="button"
          onClick={handleClose}
          className="w-10 h-8 flex items-center justify-center hover:bg-red-500 transition-colors"
          title="Close"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

function MinimizeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect y="5" width="12" height="1" fill="#9ca3af" />
    </svg>
  );
}

function MaximizeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="1" y="1" width="10" height="10" stroke="#9ca3af" strokeWidth="1" fill="none" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1 1L11 11M11 1L1 11" stroke="#9ca3af" strokeWidth="1.5" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
