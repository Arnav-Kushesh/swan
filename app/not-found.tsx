import { css } from '@/styled-system/css';
import Link from 'next/link';

export default function NotFound() {
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
                fontSize: { base: '4rem', md: '6rem' },
                fontWeight: '800',
                color: 'text.primary',
                letterSpacing: '-0.05em',
                lineHeight: '1',
                mb: '16px',
            })}>
                404
            </h1>
            <p className={css({
                fontSize: '1.1rem',
                color: 'text.secondary',
                mb: '32px',
                maxWidth: '400px',
            })}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                href="/"
                className={css({
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    bg: 'text.primary',
                    color: 'bg.primary',
                    px: '24px',
                    py: '12px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    _hover: { opacity: 0.9, transform: 'translateY(-1px)' },
                })}
            >
                Go Home
            </Link>
        </main>
    );
}
