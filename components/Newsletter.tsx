'use client';

import React from 'react';
import { css } from '@/styled-system/css';
import { Mail } from 'lucide-react';

interface NewsletterProps {
    newsletterFormUrl?: string;
}

export function Newsletter({ newsletterFormUrl }: NewsletterProps) {
    return (
        <section className={css({
            py: '60px',
            px: '20px',
            maxWidth: '560px',
            margin: '0 auto',
            textAlign: 'center',
        })}>
            <div className={css({
                bg: 'bg.secondary',
                border: '1px solid token(colors.border.default)',
                borderRadius: '16px',
                p: '40px 32px',
            })}>
                <div className={css({
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    w: '40px',
                    h: '40px',
                    borderRadius: '10px',
                    bg: 'bg.tertiary',
                    mb: '16px',
                })}>
                    <Mail size={20} className={css({ color: 'text.secondary' })} />
                </div>
                <h2 className={css({
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    mb: '8px',
                    letterSpacing: '-0.02em',
                })}>
                    Stay in the loop
                </h2>
                <p className={css({
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    mb: '24px',
                    lineHeight: '1.6',
                })}>
                    Subscribe to get notified about new posts and updates. No spam, unsubscribe anytime.
                </p>
                {newsletterFormUrl ? (
                    <a
                        href={newsletterFormUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={css({
                            display: 'inline-block',
                            bg: 'text.primary',
                            color: 'bg.primary',
                            px: '24px',
                            py: '10px',
                            borderRadius: 'full',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s ease',
                            textDecoration: 'none',
                            _hover: { opacity: 0.9, transform: 'translateY(-1px)' },
                        })}
                    >
                        Subscribe
                    </a>
                ) : (
                    <p className={css({ color: 'text.tertiary', fontSize: '0.8rem', fontStyle: 'italic' })}>
                        Newsletter signup link not configured yet.
                    </p>
                )}
            </div>
        </section>
    );
}
