import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onPaste?: (event: React.ClipboardEvent) => void;
}

export function RichTextEditor({ content, onChange, placeholder = "Start writing...", onPaste }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder })],
    content,
    onUpdate: ({ editor }) => { onChange(editor.getHTML()); },
    editorProps: { attributes: { class: "tiptap prose prose-sm max-w-none" } },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Content</label>
      <div
        className="rounded-lg p-3 min-h-[150px] focus-within:ring-2 focus-within:ring-purple-400"
        style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
        onPaste={onPaste}
      >
        <EditorContent editor={editor} />
      </div>
      {editor && (
        <div className="flex gap-1 mt-1">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>B</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>I</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>List</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}>Code</ToolbarButton>
        </div>
      )}
    </div>
  );
}

function ToolbarButton({ onClick, active, children }: { onClick: () => void; active: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2 py-1 text-xs rounded transition-colors"
      style={{
        backgroundColor: active ? "var(--accent-light)" : "var(--bg-tertiary)",
        color: active ? "white" : "var(--text-secondary)",
      }}
    >{children}</button>
  );
}
