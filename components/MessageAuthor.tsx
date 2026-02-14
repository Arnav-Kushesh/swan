'use client';

import React, { useState } from 'react';
import { css } from '@/styled-system/css';
import { Send } from 'lucide-react';

interface MessageAuthorProps {
    authorEmail: string;
    pageTitle: string;
    authorName: string;
}

export function MessageAuthor({ authorEmail, pageTitle, authorName }: MessageAuthorProps) {
    const [message, setMessage] = useState('');

    if (!authorEmail) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Comment: ${pageTitle}`);
        const body = encodeURIComponent(message);
        window.location.href = `mailto:${authorEmail}?subject=${subject}&body=${body}`;
    };

    return (
        <section className={css({
            marginTop: '60px',
            borderTop: '1px solid token(colors.border.subtle)',
            paddingTop: '40px',
        })}>
            <h3 className={css({
                fontSize: 'lg',
                fontWeight: 'bold',
                marginBottom: '4',
            })}>
                💬 Message {authorName || 'the Author'}
            </h3>
            <form onSubmit={handleSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '3' })}>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message..."
                    required
                    rows={4}
                    className={css({
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 'lg',
                        border: '1px solid token(colors.border)',
                        bg: 'bg.subtle',
                        color: 'text.primary',
                        fontSize: 'sm',
                        resize: 'vertical',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        _focus: { borderColor: 'primary' },
                        _placeholder: { color: 'text.muted' },
                    })}
                />
                <button
                    type="submit"
                    className={css({
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2',
                        alignSelf: 'flex-end',
                        bg: 'text.primary',
                        color: 'bg.primary',
                        px: '6',
                        py: '2.5',
                        borderRadius: 'full',
                        fontWeight: 'bold',
                        fontSize: 'sm',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: 'none',
                        _hover: { transform: 'scale(1.05)', opacity: 0.9 },
                    })}
                >
                    <Send size={14} />
                    Send
                </button>
            </form>
        </section>
    );
}
