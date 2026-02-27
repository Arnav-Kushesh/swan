'use client';

import { Footer } from './Footer';
import { useGlobalConfig } from '@/components/providers/GlobalConfigProvider';
import { css } from '@/styled-system/css';
import { ReactNode } from 'react';

export function AppLayout({ sidebar, navbar, children }: { sidebar: ReactNode, navbar: ReactNode, children: ReactNode }) {
    const { showSidebar } = useGlobalConfig();

    return (
        <>
            {/* Sidebar Wrapper — desktop only */}
            <div className={css({
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 40,
                // Always hidden on mobile, shown on desktop when sidebar mode is active
                display: { base: 'none', lg: 'block' },
                transform: showSidebar ? 'translate(0)' : 'translate(-100%)',
                opacity: showSidebar ? 1 : 0,
                pointerEvents: showSidebar ? 'auto' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                width: 'auto',
            })}>
                {sidebar}
            </div>

            {/* Navbar Wrapper — always visible on mobile, hidden on desktop when sidebar is active */}
            <div className={css({
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 30,
                // Always visible on mobile, toggled on desktop
                display: { base: 'block', lg: showSidebar ? 'none' : 'block' },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            })}>
                {navbar}
            </div>

            {/* Main Content Wrapper */}
            <div className={css({
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                // On mobile, always use navbar layout (no left margin)
                // On desktop, shift content when sidebar is visible
                marginLeft: { base: '0', lg: showSidebar ? '292px' : '0' },
                paddingTop: { base: '96px', lg: showSidebar ? '48px' : '96px' },
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
            })}>
                <div className={css({
                    width: '100%',
                    maxWidth: '1200px',
                    px: '24px',
                    transition: 'max-width 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 'calc(100vh - 72px)',
                })}>
                    <div className={css({ flex: 1 })}>
                        {children}
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
}

