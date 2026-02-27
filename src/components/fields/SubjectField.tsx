interface SubjectFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function SubjectField({ value, onChange }: SubjectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Subject</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Meeting subject or topic..."
        className="px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
      />
    </div>
  );
}
