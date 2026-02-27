import {
  DateField,
  TitleField,
  TagInput,
  RichTextEditor,
  ScreenshotArea,
  ReminderPicker,
  PriorityField,
  ListField,
} from "../fields";

interface TaskTemplateProps {
  date: string;
  setDate: (v: string) => void;
  title: string;
  setTitle: (v: string) => void;
  tags: string[];
  setTags: (v: string[]) => void;
  priority: string;
  setPriority: (v: string) => void;
  dueDate: string;
  setDueDate: (v: string) => void;
  body: string;
  setBody: (v: string) => void;
  checklist: string[];
  setChecklist: (v: string[]) => void;
  screenshots: string[];
  onRemoveScreenshot: (i: number) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  reminder: string;
  setReminder: (v: string) => void;
}

export function TaskTemplate({
  date,
  setDate,
  title,
  setTitle,
  tags,
  setTags,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  body,
  setBody,
  checklist,
  setChecklist,
  screenshots,
  onRemoveScreenshot,
  onPaste,
  reminder,
  setReminder,
}: TaskTemplateProps) {
  return (
    <div className="space-y-4">
      <TitleField value={title} onChange={setTitle} placeholder="Task title..." />
      <TagInput tags={tags} onChange={setTags} />
      <div className="grid grid-cols-3 gap-3">
        <DateField value={date} onChange={setDate} label="Created" />
        <DateField value={dueDate} onChange={setDueDate} label="Due Date" />
        <PriorityField value={priority} onChange={setPriority} />
      </div>
      <RichTextEditor
        content={body}
        onChange={setBody}
        placeholder="Task description..."
        onPaste={onPaste}
      />
      <ListField
        label="Checklist"
        items={checklist}
        onChange={setChecklist}
        placeholder="Add checklist item..."
      />
      <ScreenshotArea screenshots={screenshots} onRemove={onRemoveScreenshot} onPaste={onPaste} />
      <ReminderPicker value={reminder} onChange={setReminder} />
    </div>
  );
}
