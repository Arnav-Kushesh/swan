'use client';

import { css } from '@/styled-system/css';

export default function Error({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <main className={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            px: '20px',
        })}>
            <h1 className={css({
                fontSize: { base: '2rem', md: '2.5rem' },
                fontWeight: '800',
                color: 'text.primary',
                letterSpacing: '-0.03em',
                mb: '16px',
            })}>
                Something went wrong
            </h1>
            <p className={css({
                fontSize: '1.1rem',
                color: 'text.secondary',
                mb: '32px',
                maxWidth: '400px',
            })}>
                An unexpected error occurred. Please try again.
            </p>
            <button
                onClick={reset}
                className={css({
                    display: 'inline-flex',
                    alignItems: 'center',
                    bg: 'text.primary',
                    color: 'bg.primary',
                    px: '24px',
                    py: '12px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all 0.2s ease',
                    _hover: { opacity: 0.9, transform: 'translateY(-1px)' },
                })}
            >
                Try Again
            </button>
        </main>
    );
}
