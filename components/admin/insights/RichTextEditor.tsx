'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import TurndownService from 'turndown';
import { EditorToolbar } from './EditorToolbar';
import { EditorBubbleMenu } from './EditorBubbleMenu';

interface RichTextEditorProps {
    initialContent: string; // markdown string
    onChange: (markdown: string) => void;
    onImageUpload: (file: File) => Promise<{ url?: string; error?: string }>;
    placeholder?: string;
}

export function RichTextEditor({
    initialContent,
    onChange,
    onImageUpload,
    placeholder = 'Start writing your article...',
}: RichTextEditorProps) {
    const [isReady, setIsReady] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const changeTimerRef = useRef<NodeJS.Timeout | null>(null);
    const turndownService = useRef<TurndownService>(
        new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
        })
    );

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                codeBlock: {
                    HTMLAttributes: {
                        class: 'bg-gray-100 rounded-lg p-4 font-mono text-sm my-4',
                    },
                },
                blockquote: {
                    HTMLAttributes: {
                        class: 'border-l-4 border-blue-300 pl-4 italic text-gray-700 my-4',
                    },
                },
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc pl-6 my-3',
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal pl-6 my-3',
                    },
                },
                horizontalRule: {
                    HTMLAttributes: {
                        class: 'my-6 border-gray-300',
                    },
                },
                code: {
                    HTMLAttributes: {
                        class: 'bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono',
                    },
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline hover:text-blue-700 cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto my-4',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Markdown.configure({
                html: false, // don't allow HTML in markdown
                transformPastedText: true,
                transformCopiedText: true,
            }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[500px] px-4 py-3',
            },
            handleDrop: (_view, event, _slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
                    const file = event.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                        event.preventDefault();
                        handleImageUpload(file);
                        return true;
                    }
                }
                return false;
            },
            handlePaste: (_view, event) => {
                const items = event.clipboardData?.items;
                if (!items) return false;

                for (let i = 0; i < items.length; i++) {
                    if (items[i].type.startsWith('image/')) {
                        event.preventDefault();
                        const file = items[i].getAsFile();
                        if (file) {
                            handleImageUpload(file);
                        }
                        return true;
                    }
                }
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            // Debounce the markdown conversion and onChange callback
            if (changeTimerRef.current) {
                clearTimeout(changeTimerRef.current);
            }
            changeTimerRef.current = setTimeout(() => {
                // Convert HTML to markdown using turndown
                const html = editor.getHTML();
                const markdown = turndownService.current.turndown(html);
                onChange(markdown);
            }, 300);
        },
    });

    // Initialize editor once
    useEffect(() => {
        if (editor && !isReady) {
            setIsReady(true);
        }
    }, [editor, isReady]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (changeTimerRef.current) {
                clearTimeout(changeTimerRef.current);
            }
        };
    }, []);

    const handleImageUpload = useCallback(async (file: File) => {
        if (!editor) return;

        setIsUploading(true);
        toast.loading('Uploading image...', { id: 'editor-image-upload' });

        try {
            const result = await onImageUpload(file);
            if (result.error) {
                toast.error(result.error, { id: 'editor-image-upload' });
            } else if (result.url) {
                editor.chain().focus().setImage({
                    src: result.url,
                    alt: file.name || 'Image',
                }).run();
                toast.success('Image inserted!', { id: 'editor-image-upload' });
            }
        } catch (error) {
            toast.error('Upload failed', { id: 'editor-image-upload' });
        } finally {
            setIsUploading(false);
        }
    }, [editor, onImageUpload]);

    const triggerImagePicker = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                handleImageUpload(file);
            }
        };
        input.click();
    }, [handleImageUpload]);

    if (!editor) {
        return (
            <div className="min-h-[500px] bg-gray-50 rounded-lg border border-gray-200 animate-pulse flex items-center justify-center">
                <p className="text-sm text-gray-400">Loading editor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <EditorToolbar
                editor={editor}
                onImageClick={triggerImagePicker}
                isUploading={isUploading}
            />
            <EditorBubbleMenu editor={editor} />
            <div className="border border-gray-200 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <EditorContent editor={editor} />
            </div>
            <p className="text-xs text-gray-400 text-right">
                Tip: Paste or drag images directly into the editor
            </p>
        </div>
    );
}
