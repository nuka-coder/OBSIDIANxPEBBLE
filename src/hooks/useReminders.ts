import { useEffect, useRef, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { sendNotification } from "@tauri-apps/plugin-notification";

interface ReminderData {
  note_title: string;
  reminder_time: string;
}

const POLL_INTERVAL = 30000; // Check every 30 seconds

export function useReminders() {
  const processedReminders = useRef<Set<string>>(new Set());

  const checkReminders = useCallback(async () => {
    try {
      const reminders = await invoke<ReminderData[]>("get_pending_reminders");
      const now = new Date();

      for (const reminder of reminders) {
        const reminderTime = new Date(reminder.reminder_time);
        const reminderKey = `${reminder.note_title}-${reminder.reminder_time}`;

        // Skip if already processed this session
        if (processedReminders.current.has(reminderKey)) {
          continue;
        }

        // Check if reminder is due (within the last hour or upcoming in the next 30 seconds)
        if (reminderTime <= new Date(now.getTime() + POLL_INTERVAL)) {
          processedReminders.current.add(reminderKey);

          const isOverdue = reminderTime < now;
          const title = isOverdue ? "Overdue Reminder" : "Reminder";
          const body = isOverdue
            ? `"${reminder.note_title}" was due at ${reminderTime.toLocaleTimeString()}`
            : `Time for: "${reminder.note_title}"`;

          await sendNotification({ title, body });

          // Clear the reminder after notifying
          await invoke("clear_reminder", { noteTitle: reminder.note_title });
        }
      }
    } catch (error) {
      console.error("Error checking reminders:", error);
    }
  }, []);

  useEffect(() => {
    // Check immediately on startup
    checkReminders();

    // Set up polling interval
    const intervalId = setInterval(checkReminders, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [checkReminders]);
}
