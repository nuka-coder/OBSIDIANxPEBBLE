export type TemplateType = "quick" | "meeting" | "task";

export interface NoteData {
  template_type: TemplateType;
  title: string;
  date: string;
  tags: string[];
  subject?: string;
  body: string;
  priority?: string;
  due_date?: string;
  attendees?: string[];
  action_items?: string[];
  checklist?: string[];
  screenshots?: string[];
}

export interface ReminderData {
  note_title: string;
  reminder_time: string;
}

export interface SaveResult {
  success: boolean;
  file_path?: string;
  error?: string;
}

export interface AppSettings {
  vaultPath: string;
  defaultTemplate: TemplateType;
  alwaysOnTop: boolean;
}
