'use client';

import { css } from '@/styled-system/css';
import type { HtmlSectionData } from '@/lib/data';

export function HtmlSection({ data }: { data: HtmlSectionData }) {
    const fullWidth = data.full_width ?? false;

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
            <div className={fullWidth
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
            }>
                <iframe
                    srcDoc={data.html_code}
                    title={data.title || 'HTML Content'}
                    sandbox="allow-scripts allow-forms allow-popups"
                    style={data.height ? { height: `${data.height}px` } : undefined}
                    className={css({
                        width: '100%',
                        minHeight: '200px',
                        border: 'none',
                        display: 'block',
                    })}
                />
            </div>
        </section>
    );
}
