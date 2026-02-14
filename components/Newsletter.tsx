'use client';

import React from 'react';
import { css } from '@/styled-system/css';

interface NewsletterProps {
    mailchimpFormLink?: string;
}

export function Newsletter({ mailchimpFormLink }: NewsletterProps) {
    return (
        <section className={css({
            py: '60px',
            px: '20px',
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
        })}>
            <div className={css({
                bg: 'bg.subtle',
                border: '1px solid token(colors.border)',
                borderRadius: '2xl',
                padding: '40px 32px',
                boxShadow: 'md',
            })}>
                <h2 className={css({
                    fontSize: '2xl',
                    fontWeight: 'bold',
                    marginBottom: '3',
                })}>
                    📬 Stay in the loop
                </h2>
                <p className={css({
                    color: 'text.muted',
                    fontSize: 'sm',
                    marginBottom: '6',
                    lineHeight: '1.6',
                })}>
                    Subscribe to get notified about new posts and updates. No spam, unsubscribe anytime.
                </p>
                {mailchimpFormLink ? (
                    <a
                        href={mailchimpFormLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={css({
                            display: 'inline-block',
                            bg: 'text.primary',
                            color: 'bg.primary',
                            px: '8',
                            py: '3',
                            borderRadius: 'full',
                            fontWeight: 'bold',
                            fontSize: 'sm',
                            transition: 'all 0.2s',
                            textDecoration: 'none',
                            _hover: { transform: 'scale(1.05)', opacity: 0.9 },
                        })}
                    >
                        Subscribe to Newsletter
                    </a>
                ) : (
                    <p className={css({ color: 'text.muted', fontSize: 'xs', fontStyle: 'italic' })}>
                        Newsletter signup link not configured yet.
                    </p>
                )}
            </div>
        </section>
    );
}
