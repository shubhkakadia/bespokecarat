import React, { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapUnderline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  ChevronDown,
} from "lucide-react";

const TextEditor = ({
  initialContent = "",
  onSave,
  placeholder = "Start typing...",
}) => {
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);

  const [buttonStates, setButtonStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    bulletList: false,
    orderedList: false,
    codeBlock: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    heading: false,
    canUndo: false,
    canRedo: false,
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        blockquote: false,
      }),
      TiptapUnderline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      updateButtonStates(editor);

      // Instant auto-save
      if (onSave) {
        const html = editor.getHTML();

        // Save immediately
        (async () => {
          try {
            // Call onSave and wait if it's async
            const result = onSave(html);
            if (result && typeof result.then === "function") {
              await result;
            }
          } catch (error) {
            console.error("Error saving:", error);
          }
        })();
      }
    },
    onSelectionUpdate: ({ editor }) => {
      updateButtonStates(editor);
    },
  });

  const updateButtonStates = (editor) => {
    setButtonStates({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strike: editor.isActive("strike"),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      codeBlock: editor.isActive("codeBlock"),
      alignLeft: editor.isActive({ textAlign: "left" }),
      alignCenter: editor.isActive({ textAlign: "center" }),
      alignRight: editor.isActive({ textAlign: "right" }),
      heading: editor.isActive("heading"),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    });
  };

  useEffect(() => {
    if (editor && initialContent !== undefined) {
      // Only update if content is actually different to prevent unnecessary resets
      const currentContent = editor.getHTML();
      if (currentContent !== initialContent) {
        editor.commands.setContent(initialContent || "", { emitUpdate: false });
      }
    }
  }, [initialContent, editor]);

  useEffect(() => {
    if (editor) {
      updateButtonStates(editor);
    }
  }, [editor]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (!target.closest(".dropdown-container")) {
        setShowHeadingDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    title,
    disabled = false,
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-2.5 rounded-md transition-all duration-200 ${
        isActive
          ? "bg-blue-500 text-white shadow-md"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      } ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );

  const getActiveHeading = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    return "Normal";
  };

  return (
    <div className="w-full">
      <style>{`
        .ProseMirror {
          outline: none;
        }
        
        .ProseMirror ::selection {
          background-color: #2563eb !important;
          color: #ffffff !important;
        }
        
        .ProseMirror ::-moz-selection {
          background-color: #2563eb !important;
          color: #ffffff !important;
        }
        
        .ProseMirror *::selection {
          background-color: #2563eb !important;
          color: #ffffff !important;
        }
        
        .ProseMirror *::-moz-selection {
          background-color: #2563eb !important;
          color: #ffffff !important;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.5em 0;
          line-height: 1.2;
        }
        
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
          line-height: 1.3;
        }
        
        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.5em 0;
          line-height: 1.4;
        }
        
        .ProseMirror p {
          margin: 0.5em 0;
        }
        
        .ProseMirror code {
          background: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-family: monospace;
          font-size: 0.9em;
        }
        
        .ProseMirror pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1em;
          border-radius: 0.5em;
          overflow-x: auto;
          margin: 1em 0;
        }
        
        .ProseMirror pre code {
          background: none;
          color: inherit;
          padding: 0;
        }
        
        .ProseMirror ul {
          padding-left: 1.5em;
          margin: 0.5em 0;
          list-style-type: disc;
          list-style-position: outside;
        }
        
        .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
          list-style-type: decimal;
          list-style-position: outside;
        }
        
        .ProseMirror li {
          margin: 0.25em 0;
          display: list-item;
        }
        
        .ProseMirror strong {
          font-weight: 700;
        }
        
        .ProseMirror em {
          font-style: italic;
        }
        
        .ProseMirror u {
          text-decoration: underline;
        }
        
        .ProseMirror s {
          text-decoration: line-through;
        }
      `}</style>

      <div className="border border-slate-300 rounded-lg bg-white overflow-hidden">
        {/* Toolbar */}
        <div className="border-b-2 border-gray-200 bg-gradient-to-b from-gray-50 to-white px-3 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Heading Dropdown */}
            <div className="relative dropdown-container">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHeadingDropdown(!showHeadingDropdown);
                }}
                className={`cursor-pointer px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 min-w-[130px] justify-between border ${
                  buttonStates.heading
                    ? "bg-blue-500 border-blue-500 text-white shadow-md"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                <span className="text-sm font-medium">
                  {getActiveHeading()}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    showHeadingDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showHeadingDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-20 min-w-[180px] overflow-hidden">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      editor.chain().focus().setParagraph().run();
                      setShowHeadingDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors text-sm border-b border-gray-100"
                  >
                    Normal
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      editor.chain().focus().toggleHeading({ level: 1 }).run();
                      setShowHeadingDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors text-xl font-bold border-b border-gray-100"
                  >
                    Heading 1
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      editor.chain().focus().toggleHeading({ level: 2 }).run();
                      setShowHeadingDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors text-lg font-bold border-b border-gray-100"
                  >
                    Heading 2
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      editor.chain().focus().toggleHeading({ level: 3 }).run();
                      setShowHeadingDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors text-base font-bold"
                  >
                    Heading 3
                  </button>
                </div>
              )}
            </div>

            <div className="w-px h-8 bg-gray-300"></div>

            {/* Text Formatting */}
            <div className="flex gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={buttonStates.bold}
                title="Bold (Ctrl+B)"
              >
                <Bold size={18} strokeWidth={2.5} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={buttonStates.italic}
                title="Italic (Ctrl+I)"
              >
                <Italic size={18} strokeWidth={2.5} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={buttonStates.underline}
                title="Underline (Ctrl+U)"
              >
                <Underline size={18} strokeWidth={2.5} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={buttonStates.strike}
                title="Strikethrough"
              >
                <Strikethrough size={18} strokeWidth={2.5} />
              </ToolbarButton>
            </div>

            <div className="w-px h-8 bg-gray-300"></div>

            {/* Lists */}
            <div className="flex gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={buttonStates.bulletList}
                title="Bullet List"
              >
                <List size={18} strokeWidth={2.5} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={buttonStates.orderedList}
                title="Numbered List"
              >
                <ListOrdered size={18} strokeWidth={2.5} />
              </ToolbarButton>
            </div>

            <div className="w-px h-8 bg-gray-300"></div>

            {/* Alignment */}
            <div className="flex gap-1">
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                isActive={buttonStates.alignLeft}
                title="Align Left"
              >
                <AlignLeft size={18} strokeWidth={2.5} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                isActive={buttonStates.alignCenter}
                title="Align Center"
              >
                <AlignCenter size={18} strokeWidth={2.5} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                isActive={buttonStates.alignRight}
                title="Align Right"
              >
                <AlignRight size={18} strokeWidth={2.5} />
              </ToolbarButton>
            </div>

            <div className="w-px h-8 bg-gray-300"></div>

            {/* Undo/Redo */}
            <div className="flex gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                title="Undo (Ctrl+Z)"
                disabled={!buttonStates.canUndo}
              >
                <Undo size={18} strokeWidth={2.5} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                title="Redo (Ctrl+Y)"
                disabled={!buttonStates.canRedo}
              >
                <Redo size={18} strokeWidth={2.5} />
              </ToolbarButton>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="bg-white">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
