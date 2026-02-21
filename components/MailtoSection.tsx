'use client';

import { useState } from 'react';
import { css } from '@/styled-system/css';
import { MessageCircle, Send, Mail } from 'lucide-react';
import type { MailtoSectionData } from '@/lib/data';

export function MailtoSection({ data }: { data: MailtoSectionData }) {
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        const subject = encodeURIComponent(data.subject);
        const body = encodeURIComponent(message);
        window.location.href = `mailto:${data.receiver}?subject=${subject}&body=${body}`;
    };

    return (
        <section className={css({ mb: '40px' })}>
            {data.title && (
                <div className={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    mb: '20px',
                })}>
                    <div className={css({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        w: '32px',
                        h: '32px',
                        borderRadius: '8px',
                        bg: 'bg.secondary',
                        color: 'text.secondary',
                        flexShrink: 0,
                    })}>
                        <MessageCircle size={16} />
                    </div>
                    <div>
                        <h2 className={css({
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: 'text.primary',
                            letterSpacing: '-0.02em',
                            lineHeight: '1.2',
                        })}>
                            {data.title}
                        </h2>
                        <p className={css({
                            fontSize: '0.8rem',
                            color: 'text.tertiary',
                            mt: '2px',
                        })}>
                            Your message will be sent via email
                        </p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                p: '24px',
                bg: 'bg.secondary',
                borderRadius: '16px',
                border: '1px solid',
                borderColor: isFocused ? 'primary' : 'token(colors.border.default)',
                transition: 'border-color 0.2s ease',
            })}>
                {/* Subject badge */}
                <div className={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                })}>
                    <Mail size={13} className={css({ color: 'text.tertiary', flexShrink: 0 })} />
                    <span className={css({
                        fontSize: '0.8rem',
                        color: 'text.secondary',
                        fontWeight: '500',
                    })}>
                        {data.subject}
                    </span>
                </div>

                {/* Textarea */}
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
                        bg: 'bg.primary',
                        color: 'text.primary',
                        border: '1px solid token(colors.border.default)',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        lineHeight: '1.6',
                        resize: 'vertical',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                        _focus: { borderColor: 'primary' },
                        _placeholder: { color: 'text.tertiary' },
                    })}
                />

                {/* Footer row */}
                <div className={css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                })}>
                    <p className={css({
                        fontSize: '0.7rem',
                        color: 'text.tertiary',
                        display: { base: 'none', sm: 'block' },
                    })}>
                        Opens your email client with the message pre-filled
                    </p>
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
