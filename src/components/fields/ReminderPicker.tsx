interface ReminderPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function ReminderPicker({ value, onChange }: ReminderPickerProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Reminder (optional)</label>
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
      />
    </div>
  );
}
