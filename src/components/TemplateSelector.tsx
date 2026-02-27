import { TemplateType } from "../types";

interface TemplateSelectorProps {
  selected: TemplateType;
  onChange: (template: TemplateType) => void;
}

const templates: { type: TemplateType; label: string }[] = [
  { type: "quick", label: "Quick Note" },
  { type: "meeting", label: "Meeting" },
  { type: "task", label: "Task" },
];

export function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
  return (
    <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
      {templates.map((t) => (
        <button
          key={t.type}
          type="button"
          onClick={() => onChange(t.type)}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
            selected === t.type
              ? "bg-white text-purple-700 shadow-sm"
              : "text-white/80 hover:text-white hover:bg-white/10"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
