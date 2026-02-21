'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { css } from '@/styled-system/css';
import { Menu, X } from 'lucide-react';

interface NavLinksProps {
    pages: { slug: string; title: string }[];
    mobileExtra?: React.ReactNode;
}

const linkStyle = (isActive: boolean) => css({
    color: 'text.primary',
    fontSize: '0.875rem',
    fontWeight: isActive ? '600' : '500',
    transition: 'all 0.2s',
    px: '10px',
    py: '6px',
    borderRadius: '6px',
    bg: isActive ? 'bg.secondary' : 'transparent',
    _hover: {
        bg: 'bg.secondary',
    },
});

export function NavLinks({ pages, mobileExtra }: NavLinksProps) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);


    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Desktop links */}
            <div className={css({ display: { base: 'none', md: 'flex' }, alignItems: 'center', gap: '2px' })}>
                <Link href="/" className={linkStyle(isActive('/'))}>
                    Home
                </Link>
                {pages.map((page) => (
                    <Link
                        key={page.slug}
                        href={`/${page.slug}`}
                        className={linkStyle(isActive(`/${page.slug}`))}
                    >
                        {page.title}
                    </Link>
                ))}
            </div>

            {/* Mobile hamburger button */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={css({
                    display: { base: 'flex', md: 'none' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: '6px',
                    borderRadius: '8px',
                    color: 'text.primary',
                    bg: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    _hover: { bg: 'bg.secondary' },
                })}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile menu backdrop + dropdown */}
            {mobileOpen && (
                <>
                    <div
                        onClick={() => setMobileOpen(false)}
                        className={css({
                            position: 'fixed',
                            inset: 0,
                            zIndex: 98,
                        })}
                    />
                    <div
                        className={css({
                            position: 'fixed',
                            top: '52px',
                            right: '12px',
                            zIndex: 99,
                            bg: 'bg.primary',
                            border: '1px solid token(colors.border.default)',
                            borderRadius: '12px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                            minWidth: '200px',
                            animation: 'fadeIn 0.12s ease-out',
                            overflow: 'hidden',
                        })}
                    >
                        <nav
                            className={css({
                                display: 'flex',
                                flexDirection: 'column',
                                p: '6px',
                            })}
                        >
                            <Link
                                href="/"
                                className={css({
                                    fontSize: '0.9rem',
                                    fontWeight: isActive('/') ? '600' : '500',
                                    color: isActive('/') ? 'text.primary' : 'text.secondary',
                                    py: '10px',
                                    px: '12px',
                                    borderRadius: '8px',
                                    bg: isActive('/') ? 'bg.secondary' : 'transparent',
                                    _hover: { bg: 'bg.secondary' },
                                })}
                            >
                                Home
                            </Link>
                            {pages.map((page) => (
                                <Link
                                    key={page.slug}
                                    href={`/${page.slug}`}
                                    className={css({
                                        fontSize: '0.9rem',
                                        fontWeight: isActive(`/${page.slug}`) ? '600' : '500',
                                        color: isActive(`/${page.slug}`) ? 'text.primary' : 'text.secondary',
                                        py: '10px',
                                        px: '12px',
                                        borderRadius: '8px',
                                        bg: isActive(`/${page.slug}`) ? 'bg.secondary' : 'transparent',
                                        _hover: { bg: 'bg.secondary' },
                                    })}
                                >
                                    {page.title}
                                </Link>
                            ))}
                        </nav>
                        {mobileExtra && (
                            <div className={css({
                                px: '16px',
                                py: '12px',
                                borderTop: '1px solid token(colors.border.default)',
                            })}>
                                {mobileExtra}
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
}
