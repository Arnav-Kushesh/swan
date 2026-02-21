'use client';

import { MoreHorizontal, MoreVertical, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@/styled-system/css';
import { useGlobalConfig } from '@/components/providers/GlobalConfigProvider';
import { ThemePicker } from './ThemePicker';

export function SettingsMenu({ variant = 'horizontal' }: { variant?: 'horizontal' | 'vertical' }) {
    const { colorMode, setColorMode, availableThemes } = useGlobalConfig();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const modalContent = (
        <div
            onClick={() => setIsOpen(false)}
            className={css({
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bg: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(4px)',
                animation: 'fadeIn 0.15s ease-out',
            })}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={css({
                    bg: 'bg.primary',
                    width: '90%',
                    maxWidth: '340px',
                    borderRadius: '16px',
                    boxShadow: '2xl',
                    border: '1px solid token(colors.border.default)',
                    overflow: 'hidden',
                    animation: 'scaleUp 0.15s ease-out',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                })}
            >
                {/* Header */}
                <div className={css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: '16px 20px',
                    borderBottom: '1px solid token(colors.border.default)',
                })}>
                    <h2 className={css({ fontSize: '0.9rem', fontWeight: '600' })}>Settings</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className={css({
                            p: '4px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: 'text.tertiary',
                            bg: 'transparent',
                            border: 'none',
                            _hover: { bg: 'bg.secondary', color: 'text.primary' },
                        })}
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className={css({ p: '16px 20px' })}>
                    <ThemePicker
                        colorMode={colorMode}
                        onThemeChange={setColorMode}
                        allowedThemes={availableThemes}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={css({
                    p: '6px',
                    borderRadius: '8px',
                    color: 'text.primary',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                    bg: 'transparent',
                    border: 'none',
                    _hover: { bg: 'bg.secondary' },
                })}
                aria-label="Settings"
            >
                {variant === 'vertical' ? <MoreVertical size={18} /> : <MoreHorizontal size={18} />}
            </button>
            {mounted && isOpen && createPortal(modalContent, document.body)}
        </>
    );
}
