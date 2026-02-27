use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
pub struct NoteData {
    pub template_type: String,
    pub title: String,
    pub date: String,
    pub tags: Vec<String>,
    pub subject: Option<String>,
    pub body: String,
    pub priority: Option<String>,
    pub due_date: Option<String>,
    pub attendees: Option<Vec<String>>,
    pub action_items: Option<Vec<String>>,
    pub checklist: Option<Vec<String>>,
    pub screenshots: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ReminderData {
    pub note_title: String,
    pub reminder_time: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SaveResult {
    pub success: bool,
    pub file_path: Option<String>,
    pub error: Option<String>,
}

#[tauri::command]
fn save_note_to_vault(note: NoteData, vault_path: String) -> SaveResult {
    let markdown = generate_markdown(&note);
    let safe_title = sanitize_title(&note.title);
    let filename = format!("{}-{}.md", note.date, safe_title);
    let file_path = PathBuf::from(&vault_path).join(&filename);

    if let Err(e) = fs::create_dir_all(&vault_path) {
        return SaveResult {
            success: false,
            file_path: None,
            error: Some(format!("Failed to create directory: {}", e)),
        };
    }

    save_screenshots(&note, &vault_path, &safe_title);

    match fs::write(&file_path, markdown) {
        Ok(_) => SaveResult {
            success: true,
            file_path: Some(file_path.to_string_lossy().to_string()),
            error: None,
        },
        Err(e) => SaveResult {
            success: false,
            file_path: None,
            error: Some(format!("Failed to write file: {}", e)),
        },
    }
}

fn sanitize_title(title: &str) -> String {
    title
        .chars()
        .filter(|c| c.is_alphanumeric() || *c == ' ' || *c == '-')
        .collect::<String>()
        .replace(' ', "-")
        .to_lowercase()
}

fn save_screenshots(note: &NoteData, vault_path: &str, safe_title: &str) {
    if let Some(screenshots) = &note.screenshots {
        let attachments_path = PathBuf::from(vault_path).join("attachments");
        let _ = fs::create_dir_all(&attachments_path);

        for (i, screenshot) in screenshots.iter().enumerate() {
            if let Some(base64_data) = screenshot.strip_prefix("data:image/png;base64,") {
                use base64::Engine;
                if let Ok(decoded) = base64::engine::general_purpose::STANDARD.decode(base64_data) {
                    let img_filename = format!("{}-{}-screenshot-{}.png", note.date, safe_title, i + 1);
                    let img_path = attachments_path.join(&img_filename);
                    let _ = fs::write(img_path, decoded);
                }
            }
        }
    }
}

fn generate_markdown(note: &NoteData) -> String {
    let mut md = String::new();
    md.push_str("---\n");
    md.push_str(&format!("date: {}\n", note.date));
    md.push_str(&format!("tags: [{}]\n", note.tags.join(", ")));
    md.push_str(&format!("type: {}\n", note.template_type));
    if let Some(subject) = &note.subject {
        md.push_str(&format!("subject: {}\n", subject));
    }
    if let Some(priority) = &note.priority {
        md.push_str(&format!("priority: {}\n", priority));
    }
    if let Some(due_date) = &note.due_date {
        md.push_str(&format!("due: {}\n", due_date));
    }
    md.push_str("---\n\n");
    md.push_str(&format!("# {}\n\n", note.title));

    match note.template_type.as_str() {
        "meeting" => generate_meeting_content(&mut md, note),
        "task" => generate_task_content(&mut md, note),
        _ => {
            md.push_str(&note.body);
            md.push_str("\n");
        }
    }

    generate_screenshot_refs(&mut md, note);
    md
}

fn generate_meeting_content(md: &mut String, note: &NoteData) {
    if let Some(attendees) = &note.attendees {
        md.push_str("## Attendees\n");
        for attendee in attendees {
            md.push_str(&format!("- {}\n", attendee));
        }
        md.push_str("\n");
    }
    md.push_str("## Discussion\n");
    md.push_str(&note.body);
    md.push_str("\n\n");
    if let Some(action_items) = &note.action_items {
        md.push_str("## Action Items\n");
        for item in action_items {
            md.push_str(&format!("- [ ] {}\n", item));
        }
        md.push_str("\n");
    }
}

fn generate_task_content(md: &mut String, note: &NoteData) {
    md.push_str("## Description\n");
    md.push_str(&note.body);
    md.push_str("\n\n");
    if let Some(checklist) = &note.checklist {
        md.push_str("## Checklist\n");
        for item in checklist {
            md.push_str(&format!("- [ ] {}\n", item));
        }
        md.push_str("\n");
    }
}

fn generate_screenshot_refs(md: &mut String, note: &NoteData) {
    if let Some(screenshots) = &note.screenshots {
        if !screenshots.is_empty() {
            md.push_str("\n## Screenshots\n");
            let safe_title = sanitize_title(&note.title);
            for i in 0..screenshots.len() {
                md.push_str(&format!(
                    "![Screenshot {}](attachments/{}-{}-screenshot-{}.png)\n",
                    i + 1, note.date, safe_title, i + 1
                ));
            }
        }
    }
}

#[tauri::command]
fn schedule_reminder(reminder: ReminderData) -> Result<String, String> {
    let reminders_path = get_reminders_path();
    if let Some(parent) = reminders_path.parent() {
        let _ = fs::create_dir_all(parent);
    }
    let mut reminders: Vec<ReminderData> = load_reminders(&reminders_path);
    reminders.push(reminder);
    save_reminders(&reminders_path, &reminders)
}

#[tauri::command]
fn get_pending_reminders() -> Vec<ReminderData> {
    load_reminders(&get_reminders_path())
}

#[tauri::command]
fn clear_reminder(note_title: String) -> Result<(), String> {
    let reminders_path = get_reminders_path();
    if !reminders_path.exists() {
        return Ok(());
    }
    let mut reminders = load_reminders(&reminders_path);
    reminders.retain(|r| r.note_title != note_title);
    save_reminders(&reminders_path, &reminders).map(|_| ())
}

fn get_reminders_path() -> PathBuf {
    std::env::var("LOCALAPPDATA")
        .map(PathBuf::from)
        .unwrap_or_else(|_| PathBuf::from("."))
        .join("obsidian-quick-note")
        .join("reminders.json")
}

fn load_reminders(path: &PathBuf) -> Vec<ReminderData> {
    if path.exists() {
        fs::read_to_string(path)
            .ok()
            .and_then(|c| serde_json::from_str(&c).ok())
            .unwrap_or_default()
    } else {
        Vec::new()
    }
}

fn save_reminders(path: &PathBuf, reminders: &[ReminderData]) -> Result<String, String> {
    serde_json::to_string_pretty(reminders)
        .map_err(|e| e.to_string())
        .and_then(|json| fs::write(path, json).map_err(|e| e.to_string()))
        .map(|_| "Reminder saved".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![
            save_note_to_vault,
            schedule_reminder,
            get_pending_reminders,
            clear_reminder
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
