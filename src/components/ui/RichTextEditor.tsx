"use client";

import React from "react";

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Image as ImageIcon, Italic, List, ListOrdered, Strikethrough } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full rounded-md mt-4 mb-4 border border-zinc-200",
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[150px] p-4 bg-white rounded-b-md border-x border-b border-zinc-200",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("URL of the image:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="w-full flex flex-col rounded-md shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border border-zinc-200 bg-zinc-50 rounded-t-md p-1 border-b-0">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive("bold") ? "bg-zinc-200 text-zinc-900" : "text-zinc-600 hover:bg-zinc-200"
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive("italic") ? "bg-zinc-200 text-zinc-900" : "text-zinc-600 hover:bg-zinc-200"
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive("strike") ? "bg-zinc-200 text-zinc-900" : "text-zinc-600 hover:bg-zinc-200"
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-zinc-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "bg-zinc-200 text-zinc-900" : "text-zinc-600 hover:bg-zinc-200"
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive("bulletList") ? "bg-zinc-200 text-zinc-900" : "text-zinc-600 hover:bg-zinc-200"
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-md transition-colors ${
            editor.isActive("orderedList") ? "bg-zinc-200 text-zinc-900" : "text-zinc-600 hover:bg-zinc-200"
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-zinc-300 mx-1" />
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded-md transition-colors text-zinc-600 hover:bg-zinc-200"
          title="Add Image URL"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} className="bg-white min-h-[150px] cursor-text" />
    </div>
  );
}
