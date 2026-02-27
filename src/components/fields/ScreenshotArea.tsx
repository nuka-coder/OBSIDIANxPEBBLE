interface ScreenshotAreaProps {
  screenshots: string[];
  onRemove: (index: number) => void;
  onPaste?: (e: React.ClipboardEvent) => void;
}

export function ScreenshotArea({ screenshots, onRemove, onPaste }: ScreenshotAreaProps) {
  if (screenshots.length === 0) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Screenshots</label>
        <div
          className="border-2 border-dashed rounded-lg p-4 text-center text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400"
          style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}
          tabIndex={0}
          onPaste={onPaste}
        >
          Click here and paste screenshot (Ctrl+V)
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
        Screenshots ({screenshots.length})
      </label>
      <div
        className="flex flex-wrap gap-2 p-2 border-2 border-dashed rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        style={{ borderColor: "var(--border-color)" }}
        tabIndex={0}
        onPaste={onPaste}
      >
        {screenshots.map((src, i) => (
          <div key={i} className="relative group">
            <img src={src} alt="Screenshot" className="w-20 h-20 object-cover rounded-lg" style={{ border: "1px solid var(--border-color)" }} />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >x</button>
          </div>
        ))}
      </div>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Click area above and paste more (Ctrl+V)</p>
    </div>
  );
}
