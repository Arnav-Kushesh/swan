'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@/styled-system/css';
import { useGlobalConfig } from '@/components/providers/GlobalConfigProvider';
import { FlaskConical, X, Layout, List, Grid2x2, LayoutGrid, AlignJustify, Columns2, Rows2, AlignCenter, AlignLeft } from 'lucide-react';
import { ThemePicker } from './ThemePicker';

export function ExperimentPanel() {
    const { colorMode, setColorModeTemporary, showSidebar, setSidebarTemporary, config, sectionViewOverrides, setSectionViewOverride } = useGlobalConfig();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const DYNAMIC_VIEW_OPTIONS = [
        { value: 'list_view', label: 'List', icon: List },
        { value: 'card_view', label: 'Card', icon: LayoutGrid },
        { value: 'grid_view', label: 'Grid', icon: Grid2x2 },
        { value: 'minimal_list_view', label: 'Minimal', icon: AlignJustify },
        { value: 'tiny_card_view', label: 'Tiny', icon: Grid2x2 },
        { value: 'big_card_view', label: 'Big', icon: Rows2 },
    ];

    const INFO_VIEW_OPTIONS = [
        { value: 'col_centered_view', label: 'Center', icon: AlignCenter },
        { value: 'col_left_view', label: 'Left', icon: AlignLeft },
        { value: 'row_view', label: 'Row', icon: Columns2 },
        { value: 'row_reverse_view', label: 'Row Rev', icon: Rows2 },
    ];

    const sectionEntries = (config.sections || [])
        .filter(s => (s.type === 'dynamic_section' || s.type === 'info_section') && s.enabled !== false)
        .map(s => ({
            id: s.id,
            title: s.title,
            currentView: s.type === 'dynamic_section'
                ? (s as import('@/lib/data').DynamicSectionData).view_type || 'list_view'
                : (s as import('@/lib/data').InfoSectionData).view_type || 'col_centered_view',
            options: s.type === 'dynamic_section' ? DYNAMIC_VIEW_OPTIONS : INFO_VIEW_OPTIONS,
        }));

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

    const panelContent = (
        <div
            onClick={() => setIsOpen(false)}
            className={css({
                position: 'fixed',
                inset: 0,
                zIndex: 9998,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                bg: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(2px)',
                animation: 'fadeIn 0.15s ease-out',
                p: '20px',
            })}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={css({
                    bg: 'bg.primary',
                    width: '320px',
                    maxWidth: '90vw',
                    borderRadius: '16px',
                    boxShadow: '2xl',
                    border: '1px solid token(colors.border.default)',
                    overflow: 'hidden',
                    animation: 'scaleUp 0.15s ease-out',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    mb: '60px',
                })}
            >
                {/* Header */}
                <div className={css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: '14px 16px',
                    borderBottom: '1px solid token(colors.border.default)',
                })}>
                    <div className={css({ display: 'flex', alignItems: 'center', gap: '8px' })}>
                        <FlaskConical size={14} className={css({ color: 'text.secondary' })} />
                        <h2 className={css({ fontSize: '0.85rem', fontWeight: '600' })}>Experiment</h2>
                    </div>
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
                        <X size={14} />
                    </button>
                </div>

                {/* Disclaimer */}
                <div className={css({
                    mx: '16px',
                    mt: '12px',
                    p: '10px 12px',
                    bg: 'bg.secondary',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    color: 'text.secondary',
                    lineHeight: '1.4',
                })}>
                    For experimentation only. Changes won&apos;t persist after a refresh.
                </div>

                <div className={css({ p: '14px 16px', display: 'flex', flexDirection: 'column', gap: '18px' })}>
                    {/* Sidebar Toggle */}
                    <div>
                        <h3 className={css({ fontSize: '0.6rem', fontWeight: '600', textTransform: 'uppercase', color: 'text.tertiary', mb: '8px', letterSpacing: '0.05em' })}>
                            Layout
                        </h3>
                        <div
                            onClick={() => setSidebarTemporary(!showSidebar)}
                            className={css({
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: '10px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                bg: 'bg.secondary',
                                border: '1px solid transparent',
                                transition: 'all 0.15s ease',
                                _hover: { borderColor: 'border.default' },
                            })}
                        >
                            <div className={css({ display: 'flex', alignItems: 'center', gap: '8px' })}>
                                <Layout size={14} className={css({ color: 'text.secondary' })} />
                                <span className={css({ fontWeight: '500', fontSize: '0.8rem' })}>Sidebar</span>
                            </div>
                            <div className={css({
                                w: '34px',
                                h: '18px',
                                bg: showSidebar ? 'primary' : 'bg.tertiary',
                                borderRadius: 'full',
                                position: 'relative',
                                transition: 'background 0.2s',
                            })}>
                                <div className={css({
                                    w: '14px',
                                    h: '14px',
                                    bg: 'white',
                                    borderRadius: 'full',
                                    position: 'absolute',
                                    top: '2px',
                                    left: showSidebar ? '18px' : '2px',
                                    transition: 'left 0.2s',
                                    shadow: 'sm',
                                })} />
                            </div>
                        </div>
                    </div>

                    {/* Section View Types */}
                    {sectionEntries.length > 0 && (
                        <div>
                            <h3 className={css({ fontSize: '0.6rem', fontWeight: '600', textTransform: 'uppercase', color: 'text.tertiary', mb: '8px', letterSpacing: '0.05em' })}>
                                Section Views
                            </h3>
                            <div className={css({ display: 'flex', flexDirection: 'column', gap: '10px' })}>
                                {sectionEntries.map((entry) => {
                                    const activeView = sectionViewOverrides[entry.id] || entry.currentView;
                                    return (
                                        <div key={entry.id} className={css({ bg: 'bg.secondary', borderRadius: '8px', p: '10px' })}>
                                            <span className={css({ fontSize: '0.75rem', fontWeight: '500', color: 'text.primary', display: 'block', mb: '8px' })}>
                                                {entry.title}
                                            </span>
                                            <div className={css({ display: 'flex', gap: '4px', flexWrap: 'wrap' })}>
                                                {entry.options.map(({ value, label, icon: Icon }) => {
                                                    const isActive = activeView === value;
                                                    return (
                                                        <button
                                                            key={value}
                                                            onClick={() => setSectionViewOverride(entry.id, value)}
                                                            className={css({
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                px: '8px',
                                                                py: '4px',
                                                                borderRadius: '6px',
                                                                fontSize: '0.65rem',
                                                                fontWeight: isActive ? '600' : '400',
                                                                cursor: 'pointer',
                                                                border: '1px solid',
                                                                borderColor: isActive ? 'primary' : 'transparent',
                                                                bg: isActive ? 'bg.tertiary' : 'transparent',
                                                                color: isActive ? 'text.primary' : 'text.tertiary',
                                                                transition: 'all 0.15s ease',
                                                                _hover: { bg: 'bg.tertiary', color: 'text.primary' },
                                                            })}
                                                        >
                                                            <Icon size={11} />
                                                            {label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Color Mode */}
                    <ThemePicker
                        colorMode={colorMode}
                        onThemeChange={setColorModeTemporary}
                        swatchSize={28}
                        checkSize={8}
                        fontSize="0.5rem"
                        gap="6px"
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
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 9990,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    bg: 'bg.secondary',
                    color: 'text.secondary',
                    border: '1px solid token(colors.border.default)',
                    borderRadius: 'full',
                    px: '14px',
                    py: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: 'lg',
                    _hover: {
                        bg: 'bg.tertiary',
                        color: 'text.primary',
                        transform: 'translateY(-2px)',
                        boxShadow: 'xl',
                    },
                })}
                aria-label="Experiment"
            >
                <FlaskConical size={14} />
                Experiment
            </button>
            {mounted && isOpen && createPortal(panelContent, document.body)}
        </>
    );
}
