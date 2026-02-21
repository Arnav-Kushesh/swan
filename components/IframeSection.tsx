import { css } from '@/styled-system/css';
import type { IframeSectionData } from '@/lib/data';

export function IframeSection({ data }: { data: IframeSectionData }) {
    const fullWidth = data.full_width ?? false;
    const hasExplicitHeight = !!data.height;

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
                style={hasExplicitHeight ? { height: `${data.height}px` } : undefined}
            >
                <iframe
                    src={data.url}
                    title={data.title || 'Embedded Page'}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    className={css({
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        display: 'block',
                        ...(!hasExplicitHeight ? { aspectRatio: '16/9' } : {}),
                    })}
                />
            </div>
        </section>
    );
}
