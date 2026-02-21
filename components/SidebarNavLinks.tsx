'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { css } from '@/styled-system/css';
import { stack } from '@/styled-system/patterns';

interface SidebarNavLinksProps {
    pages: { slug: string; title: string }[];
}

export function SidebarNavLinks({ pages }: SidebarNavLinksProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const navLinkStyle = (active: boolean) => css({
        fontSize: '0.875rem',
        color: active ? 'text.primary' : 'text.secondary',
        fontWeight: active ? '600' : '500',
        py: '8px',
        px: '12px',
        borderRadius: '8px',
        bg: active ? 'bg.secondary' : 'transparent',
        transition: 'all 0.15s ease',
        _hover: {
            color: 'text.primary',
            bg: 'bg.secondary',
        },
    });

    return (
        <nav className={stack({ gap: '4px' })}>
            <Link href="/" className={navLinkStyle(isActive('/'))}>
                Home
            </Link>
            {pages.map((page) => (
                <Link
                    key={page.slug}
                    href={`/${page.slug}`}
                    className={navLinkStyle(isActive(`/${page.slug}`))}
                >
                    {page.title}
                </Link>
            ))}
        </nav>
    );
}
