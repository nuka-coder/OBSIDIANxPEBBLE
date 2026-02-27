import { useState, useCallback } from "react";

export function useClipboardPaste() {
  const [screenshots, setScreenshots] = useState<string[]>([]);

  const handlePaste = useCallback((event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64 = e.target?.result as string;
            setScreenshots((prev) => [...prev, base64]);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }, []);

  const removeScreenshot = useCallback((index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearScreenshots = useCallback(() => {
    setScreenshots([]);
  }, []);

  return {
    screenshots,
    handlePaste,
    removeScreenshot,
    clearScreenshots,
    setScreenshots,
  };
}
