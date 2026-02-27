import { format } from "date-fns";

interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function DateField({ value, onChange, label = "Date" }: DateFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-color)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }}
      />
    </div>
  );
}

export function getTodayDate(): string {
  return format(new Date(), "yyyy-MM-dd");
}
