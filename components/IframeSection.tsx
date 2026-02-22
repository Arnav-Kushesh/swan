import { css } from '@/styled-system/css';
import type { IframeSectionData } from '@/lib/data';

function normalizeUnit(value: string): string {
    return /^\d+(\.\d+)?$/.test(value.trim()) ? `${value.trim()}px` : value.trim();
}

export function IframeSection({ data }: { data: IframeSectionData }) {
    const fullWidth = data.full_width ?? false;
    const desktopHeight = data.height ? normalizeUnit(data.height) : '';
    const mobileHeight = data.mobile_height ? normalizeUnit(data.mobile_height) : desktopHeight;
    const hasExplicitHeight = !!desktopHeight;

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
                style={hasExplicitHeight ? {
                    '--iframe-h-mobile': mobileHeight,
                    '--iframe-h-desktop': desktopHeight,
                } as React.CSSProperties : undefined}
            >
                {hasExplicitHeight && (
                    <style>{`
                        .iframe-section-frame { height: var(--iframe-h-mobile); }
                        @media (min-width: 768px) {
                            .iframe-section-frame { height: var(--iframe-h-desktop); }
                        }
                    `}</style>
                )}
                <iframe
                    src={data.url}
                    title={data.title || 'Embedded Page'}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    className={`iframe-section-frame ${css({
                        width: '100%',
                        border: 'none',
                        display: 'block',
                        ...(!hasExplicitHeight ? { aspectRatio: '16/9' } : {}),
                    })}`}
                />
            </div>
        </section>
    );
}
