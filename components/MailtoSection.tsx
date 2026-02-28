'use client';

import { useState } from 'react';
import { css } from '@/styled-system/css';
import { Send } from 'lucide-react';
import type { MailtoSectionData } from '@/lib/data';

export function MailtoSection({ data }: { data: MailtoSectionData }) {
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        const subject = encodeURIComponent(data.subject);
        const body = encodeURIComponent(message);
        window.location.href = `mailto:${data.receiver_email}?subject=${subject}&body=${body}`;
    };

    return (
        <section id={data.html_id || undefined} className={`${css({ mb: '40px' })}${data.html_class ? ` ${data.html_class}` : ''}`}>
            {data.title && (
                <h2 className={css({
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'text.primary',
                    letterSpacing: '-0.02em',
                    mb: '16px',
                })}>
                    {data.title}
                </h2>
            )}

            <form onSubmit={handleSubmit} className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
            })}>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={data.placeholder_text || 'Share your thoughts...'}
                    required
                    rows={4}
                    className={css({
                        w: '100%',
                        p: '14px 16px',
                        bg: 'transparent',
                        color: 'text.primary',
                        border: '1px solid',
                        borderColor: isFocused ? 'primary' : 'token(colors.border.default)',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        lineHeight: '1.6',
                        resize: 'vertical',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                        _placeholder: { color: 'text.tertiary' },
                    })}
                />

                <div className={css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                })}>
                    <button
                        type="submit"
                        className={css({
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            bg: 'text.primary',
                            color: 'bg.primary',
                            px: '20px',
                            py: '10px',
                            borderRadius: 'full',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            border: 'none',
                            transition: 'all 0.2s ease',
                            _hover: { opacity: 0.9, transform: 'translateY(-1px)' },
                            _disabled: { opacity: 0.5, cursor: 'not-allowed', transform: 'none' },
                        })}
                        disabled={!message.trim()}
                    >
                        <Send size={14} />
                        {data.button_text || 'Send'}
                    </button>
                </div>
            </form>
        </section>
    );
}
