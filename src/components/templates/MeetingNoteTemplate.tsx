import {
  DateField,
  TitleField,
  SubjectField,
  TagInput,
  RichTextEditor,
  ScreenshotArea,
  ReminderPicker,
  ListField,
} from "../fields";

interface MeetingNoteTemplateProps {
  date: string;
  setDate: (v: string) => void;
  title: string;
  setTitle: (v: string) => void;
  subject: string;
  setSubject: (v: string) => void;
  tags: string[];
  setTags: (v: string[]) => void;
  attendees: string[];
  setAttendees: (v: string[]) => void;
  body: string;
  setBody: (v: string) => void;
  actionItems: string[];
  setActionItems: (v: string[]) => void;
  screenshots: string[];
  onRemoveScreenshot: (i: number) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  reminder: string;
  setReminder: (v: string) => void;
}

export function MeetingNoteTemplate({
  date,
  setDate,
  title,
  setTitle,
  subject,
  setSubject,
  tags,
  setTags,
  attendees,
  setAttendees,
  body,
  setBody,
  actionItems,
  setActionItems,
  screenshots,
  onRemoveScreenshot,
  onPaste,
  reminder,
  setReminder,
}: MeetingNoteTemplateProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <DateField value={date} onChange={setDate} />
        <SubjectField value={subject} onChange={setSubject} />
      </div>
      <TitleField value={title} onChange={setTitle} placeholder="Meeting title..." />
      <TagInput tags={tags} onChange={setTags} />
      <ListField
        label="Attendees"
        items={attendees}
        onChange={setAttendees}
        placeholder="Add attendee..."
      />
      <RichTextEditor
        content={body}
        onChange={setBody}
        placeholder="Meeting notes..."
        onPaste={onPaste}
      />
      <ListField
        label="Action Items"
        items={actionItems}
        onChange={setActionItems}
        placeholder="Add action item..."
      />
      <ScreenshotArea screenshots={screenshots} onRemove={onRemoveScreenshot} onPaste={onPaste} />
      <ReminderPicker value={reminder} onChange={setReminder} />
    </div>
  );
}
