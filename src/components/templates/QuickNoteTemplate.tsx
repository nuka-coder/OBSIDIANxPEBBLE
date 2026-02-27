import {
  TitleField,
  TagInput,
  RichTextEditor,
  ScreenshotArea,
  ReminderPicker,
} from "../fields";

interface QuickNoteTemplateProps {
  title: string;
  setTitle: (v: string) => void;
  tags: string[];
  setTags: (v: string[]) => void;
  body: string;
  setBody: (v: string) => void;
  screenshots: string[];
  onRemoveScreenshot: (i: number) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  reminder: string;
  setReminder: (v: string) => void;
}

export function QuickNoteTemplate({
  title,
  setTitle,
  tags,
  setTags,
  body,
  setBody,
  screenshots,
  onRemoveScreenshot,
  onPaste,
  reminder,
  setReminder,
}: QuickNoteTemplateProps) {
  return (
    <div className="space-y-4">
      <TitleField value={title} onChange={setTitle} placeholder="Quick note title..." />
      <TagInput tags={tags} onChange={setTags} />
      <RichTextEditor
        content={body}
        onChange={setBody}
        placeholder="Jot down your thoughts..."
        onPaste={onPaste}
      />
      <ScreenshotArea screenshots={screenshots} onRemove={onRemoveScreenshot} onPaste={onPaste} />
      <ReminderPicker value={reminder} onChange={setReminder} />
    </div>
  );
}
