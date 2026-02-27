import { useState, useEffect, useCallback, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { sendNotification, isPermissionGranted, requestPermission } from "@tauri-apps/plugin-notification";
import { TemplateType, NoteData } from "../types";
import { TemplateSelector } from "./TemplateSelector";
import { QuickNoteTemplate, MeetingNoteTemplate, TaskTemplate } from "./templates";
import { getTodayDate } from "./fields";
import { useClipboardPaste } from "../hooks/useClipboardPaste";
import { useTheme } from "../hooks/useTheme";
import { useReminders } from "../hooks/useReminders";
import { TitleBar } from "./TitleBar";

const DEFAULT_VAULT_PATH = "C:\\Users\\bjones\\Desktop\\Obsidian\\Notes and Documentation\\Manager Files\\Daily Log and Todos";

export function NoteModal() {
  const { isDark, toggle: toggleTheme } = useTheme();
  useReminders(); // Check reminders on startup and poll while app is open
  const [template, setTemplate] = useState<TemplateType>("quick");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(getTodayDate());
  const [tags, setTags] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [attendees, setAttendees] = useState<string[]>([]);
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [reminder, setReminder] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [bannerImage, setBannerImage] = useState<string | null>(() => {
    return localStorage.getItem("obsidianxpebble-banner");
  });
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const { screenshots, handlePaste, removeScreenshot, clearScreenshots } = useClipboardPaste();

  useEffect(() => {
    async function setupNotifications() {
      const granted = await isPermissionGranted();
      if (!granted) await requestPermission();
    }
    setupNotifications();
  }, []);

  const resetForm = useCallback(() => {
    setTitle(""); setDate(getTodayDate()); setTags([]); setSubject(""); setBody("");
    setPriority("medium"); setDueDate(""); setAttendees([]); setActionItems([]);
    setChecklist([]); setReminder(""); clearScreenshots();
  }, [clearScreenshots]);

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setBannerImage(imageData);
        localStorage.setItem("obsidianxpebble-banner", imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearBanner = () => {
    setBannerImage(null);
    localStorage.removeItem("obsidianxpebble-banner");
  };

  const handleSave = async () => {
    if (!title.trim()) { setMessage("Please enter a title"); return; }
    setSaving(true); setMessage("");
    const noteData: NoteData = {
      template_type: template, title: title.trim(), date, tags,
      subject: subject || undefined, body,
      priority: template === "task" ? priority : undefined,
      due_date: template === "task" && dueDate ? dueDate : undefined,
      attendees: template === "meeting" && attendees.length > 0 ? attendees : undefined,
      action_items: template === "meeting" && actionItems.length > 0 ? actionItems : undefined,
      checklist: template === "task" && checklist.length > 0 ? checklist : undefined,
      screenshots: screenshots.length > 0 ? screenshots : undefined,
    };
    try {
      const result = await invoke<{ success: boolean; file_path?: string; error?: string }>("save_note_to_vault", { note: noteData, vaultPath: DEFAULT_VAULT_PATH });
      if (result.success) {
        setMessage("Note saved!");
        if (reminder) {
          await invoke("schedule_reminder", { reminder: { note_title: title, reminder_time: reminder } });
          await sendNotification({ title: "Reminder Set", body: "Reminder scheduled" });
        }
        setTimeout(() => { resetForm(); setMessage(""); }, 1500);
      } else { setMessage(result.error || "Failed to save note"); }
    } catch (err) { setMessage(String(err)); }
    finally { setSaving(false); }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); handleSave(); }
      else if (e.key === "Escape") { resetForm(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, resetForm]);

  const commonProps = { title, setTitle, tags, setTags, body, setBody, screenshots, onRemoveScreenshot: removeScreenshot, onPaste: handlePaste, reminder, setReminder };
  const msgClass = message.includes("saved") ? "text-green-500" : "text-red-500";

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <TitleBar isDark={isDark} onToggleTheme={toggleTheme} />

      {/* Header with banner */}
      <div className="relative">
        {bannerImage ? (
          <div className="relative h-24 overflow-hidden">
            <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={clearBanner}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 text-xs"
            >
              ×
            </button>
          </div>
        ) : (
          <div
            className="h-16 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: "linear-gradient(to right, var(--header-gradient-start), var(--header-gradient-end))" }}
            onClick={() => bannerInputRef.current?.click()}
          >
            <span className="text-white/70 text-sm">Click to add banner image</span>
          </div>
        )}
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          onChange={handleBannerUpload}
          className="hidden"
        />
      </div>

      {/* App title and template selector */}
      <div className="p-4 shadow-md" style={{ background: "linear-gradient(to right, var(--header-gradient-start), var(--header-gradient-end))" }}>
        <h1 className="text-lg font-bold text-white mb-3">OBSIDIANxPEBBLE</h1>
        <TemplateSelector selected={template} onChange={setTemplate} />
      </div>

      <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: "var(--bg-secondary)" }}>
        {template === "quick" && <QuickNoteTemplate {...commonProps} />}
        {template === "meeting" && <MeetingNoteTemplate {...commonProps} date={date} setDate={setDate} subject={subject} setSubject={setSubject} attendees={attendees} setAttendees={setAttendees} actionItems={actionItems} setActionItems={setActionItems} />}
        {template === "task" && <TaskTemplate {...commonProps} date={date} setDate={setDate} priority={priority} setPriority={setPriority} dueDate={dueDate} setDueDate={setDueDate} checklist={checklist} setChecklist={setChecklist} />}
      </div>
      <div className="p-4" style={{ backgroundColor: "var(--bg-primary)", borderTop: "1px solid var(--border-color)" }}>
        {message && <p className={`text-sm mb-2 text-center ${msgClass}`}>{message}</p>}
        <div className="flex gap-2">
          <button type="button" onClick={resetForm} className="px-4 py-2 text-sm rounded-lg transition-colors" style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-tertiary)" }}>Clear</button>
          <button type="button" onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors" style={{ backgroundColor: "var(--accent)" }}>{saving ? "Saving..." : "Save to Obsidian (Ctrl+Enter)"}</button>
        </div>
        <p className="text-xs mt-2 text-center" style={{ color: "var(--text-muted)" }}>Press Esc to clear</p>
      </div>
    </div>
  );
}
