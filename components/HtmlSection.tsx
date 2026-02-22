'use client';

import { css } from '@/styled-system/css';
import type { HtmlSectionData } from '@/lib/data';

function normalizeUnit(value: string): string {
    return /^\d+(\.\d+)?$/.test(value.trim()) ? `${value.trim()}px` : value.trim();
}

export function HtmlSection({ data }: { data: HtmlSectionData }) {
    const fullWidth = data.full_width ?? false;
    const desktopHeight = data.height ? normalizeUnit(data.height) : '';
    const mobileHeight = data.mobile_height ? normalizeUnit(data.mobile_height) : desktopHeight;

    return (
        <section className={css({ mb: '40px' })}>
            {data.title && (
                <h2 className={css({
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'text.primary',
                    letterSpacing: '-0.02em',
                    mb: '16px',
                })}>
                    {data.title}
                </h2>
            )}
            <div
                className={fullWidth
                    ? css({
                        width: '100vw',
                        marginLeft: 'calc(-50vw + 50%)',
                        overflow: 'hidden',
                    })
                    : css({
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid token(colors.border.default)',
                    })
                }
                style={desktopHeight ? {
                    '--html-h-mobile': mobileHeight,
                    '--html-h-desktop': desktopHeight,
                } as React.CSSProperties : undefined}
            >
                {!!desktopHeight && (
                    <style>{`
                        .html-section-frame { height: var(--html-h-mobile); }
                        @media (min-width: 768px) {
                            .html-section-frame { height: var(--html-h-desktop); }
                        }
                    `}</style>
                )}
                <iframe
                    srcDoc={data.html_code}
                    title={data.title || 'HTML Content'}
                    sandbox="allow-scripts allow-forms allow-popups"
                    className={`html-section-frame ${css({
                        width: '100%',
                        minHeight: '200px',
                        border: 'none',
                        display: 'block',
                    })}`}
                />
            </div>
        </section>
    );
}
