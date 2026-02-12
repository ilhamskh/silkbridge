'use client';

import { Editor } from '@tiptap/react';
import { useCallback } from 'react';

interface EditorToolbarProps {
    editor: Editor;
    onImageClick: () => void;
    isUploading?: boolean;
}

interface ToolbarButton {
    icon: string;
    label: string;
    action: () => void;
    isActive?: boolean;
    disabled?: boolean;
}

export function EditorToolbar({ editor, onImageClick, isUploading }: EditorToolbarProps) {
    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', previousUrl);

        if (url === null) return; // cancelled

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const buttons: (ToolbarButton | 'divider')[] = [
        {
            icon: 'H1',
            label: 'Heading 1',
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: editor.isActive('heading', { level: 1 }),
        },
        {
            icon: 'H2',
            label: 'Heading 2',
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editor.isActive('heading', { level: 2 }),
        },
        {
            icon: 'H3',
            label: 'Heading 3',
            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: editor.isActive('heading', { level: 3 }),
        },
        'divider',
        {
            icon: 'B',
            label: 'Bold',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive('bold'),
        },
        {
            icon: 'I',
            label: 'Italic',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive('italic'),
        },
        {
            icon: 'U',
            label: 'Underline',
            action: () => editor.chain().focus().toggleUnderline().run(),
            isActive: editor.isActive('underline'),
        },
        {
            icon: 'S',
            label: 'Strikethrough',
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: editor.isActive('strike'),
        },
        'divider',
        {
            icon: '•',
            label: 'Bullet List',
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive('bulletList'),
        },
        {
            icon: '1.',
            label: 'Numbered List',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive('orderedList'),
        },
        'divider',
        {
            icon: '"',
            label: 'Quote',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: editor.isActive('blockquote'),
        },
        {
            icon: '</> ',
            label: 'Code Block',
            action: () => editor.chain().focus().toggleCodeBlock().run(),
            isActive: editor.isActive('codeBlock'),
        },
        {
            icon: '`',
            label: 'Inline Code',
            action: () => editor.chain().focus().toggleCode().run(),
            isActive: editor.isActive('code'),
        },
        'divider',
        {
            icon: '🔗',
            label: 'Link',
            action: setLink,
            isActive: editor.isActive('link'),
        },
        {
            icon: '📷',
            label: 'Image',
            action: onImageClick,
            disabled: isUploading,
        },
        {
            icon: '—',
            label: 'Divider',
            action: () => editor.chain().focus().setHorizontalRule().run(),
        },
        'divider',
        {
            icon: '↶',
            label: 'Undo',
            action: () => editor.chain().focus().undo().run(),
            disabled: !editor.can().undo(),
        },
        {
            icon: '↷',
            label: 'Redo',
            action: () => editor.chain().focus().redo().run(),
            disabled: !editor.can().redo(),
        },
    ];

    return (
        <div className="sticky top-0 z-10 bg-white border border-gray-200 rounded-lg p-1.5 flex flex-wrap gap-0.5 shadow-sm">
            {buttons.map((item, index) => {
                if (item === 'divider') {
                    return (
                        <div
                            key={`divider-${index}`}
                            className="w-px bg-gray-200 mx-1 self-stretch"
                        />
                    );
                }

                const button = item as ToolbarButton;
                return (
                    <button
                        key={button.label}
                        type="button"
                        onClick={button.action}
                        disabled={button.disabled}
                        title={button.label}
                        className={`
                            px-2.5 py-1.5 text-sm font-medium rounded transition-all
                            ${button.isActive
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }
                            ${button.disabled
                                ? 'opacity-40 cursor-not-allowed'
                                : 'cursor-pointer'
                            }
                        `}
                    >
                        {button.icon}
                    </button>
                );
            })}
        </div>
    );
}
