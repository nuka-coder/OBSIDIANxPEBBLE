interface TitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TitleField({ value, onChange, placeholder = "Note title..." }: TitleFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Title</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
        style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
      />
    </div>
  );
}
