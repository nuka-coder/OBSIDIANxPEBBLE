import { useState, KeyboardEvent } from "react";

interface ListFieldProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export function ListField({ label, items, onChange, placeholder = "Add item..." }: ListFieldProps) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      onChange([...items, input.trim()]);
      setInput("");
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{label}</label>
      <div className="rounded-lg p-2 space-y-1" style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}>
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm px-2 py-1 rounded" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <span className="flex-1" style={{ color: "var(--text-primary)" }}>{item}</span>
            <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-500">x</button>
          </div>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-2 py-1 text-sm outline-none bg-transparent"
          style={{ color: "var(--text-primary)" }}
        />
      </div>
    </div>
  );
}
