'use client';

import { Check } from 'lucide-react';
import { css } from '@/styled-system/css';
import { THEMES } from '@/components/providers/GlobalConfigProvider';

const themeColors: Record<string, string> = {
    light: '#f5f5f7',
    dark: '#1a1a1a',
    blue: '#1E293B',
    purple: '#4c1d95',
    pink: '#FFE0ED',
    red: '#450a0a',
    green: '#064e3b',
    cream: '#FFF8EC',
};

interface ThemePickerProps {
    colorMode: string;
    onThemeChange: (theme: string) => void;
    allowedThemes?: string[];
    swatchSize?: number;
    checkSize?: number;
    fontSize?: string;
    gap?: string;
}

export function ThemePicker({
    colorMode,
    onThemeChange,
    allowedThemes,
    swatchSize = 32,
    checkSize = 10,
    fontSize = '0.55rem',
    gap = '8px',
}: ThemePickerProps) {
    const themes = allowedThemes ? THEMES.filter(t => allowedThemes.includes(t)) : THEMES;
    const half = Math.ceil(themes.length / 2);
    const rows = [themes.slice(0, half), themes.slice(half)];

    return (
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '8px' })}>
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className={css({
                    display: 'flex',
                    gap,
                    flexWrap: 'wrap',
                })}>
                    {row.map((theme) => (
                        <button
                            key={theme}
                            onClick={() => onThemeChange(theme)}
                            className={css({
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer',
                                bg: 'transparent',
                                border: 'none',
                                p: '0',
                                transition: 'all 0.15s ease',
                                _hover: { transform: 'scale(1.08)' },
                            })}
                            title={theme.charAt(0).toUpperCase() + theme.slice(1)}
                        >
                            <div
                                className={css({
                                    borderRadius: '8px',
                                    border: '2px solid',
                                    borderColor: colorMode === theme ? 'primary' : 'transparent',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                                })}
                                style={{ width: `${swatchSize}px`, height: `${swatchSize}px` }}
                            >
                                <div
                                    className={css({ position: 'absolute', inset: 0, borderRadius: '6px' })}
                                    style={{ backgroundColor: themeColors[theme] || '#888' }}
                                />
                                {colorMode === theme && (
                                    <div className={css({
                                        position: 'relative',
                                        zIndex: 1,
                                        bg: 'rgba(0,0,0,0.25)',
                                        borderRadius: 'full',
                                        p: '1px',
                                    })}>
                                        <Check size={checkSize} color="white" />
                                    </div>
                                )}
                            </div>
                            <span className={css({
                                color: colorMode === theme ? 'text.primary' : 'text.tertiary',
                                fontWeight: colorMode === theme ? '600' : '400',
                                textTransform: 'capitalize',
                            })}
                                style={{ fontSize }}
                            >
                                {theme}
                            </span>
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}
