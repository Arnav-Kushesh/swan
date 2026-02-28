import { css } from '@/styled-system/css';
import type { VideoEmbedSectionData } from '@/lib/data';

export function VideoEmbedSection({ data }: { data: VideoEmbedSectionData }) {
    const hasTopPart = !!(data.title || data.description);

    return (
        <section id={data.html_id || undefined} className={`${css({ mb: '40px' })}${data.html_class ? ` ${data.html_class}` : ''}`}>
            {hasTopPart && (
                <div className={css({
                    mb: '16px',
                    ...(data.top_part_centered ? { textAlign: 'center' } : {}),
                })}>
                    {data.title && (
                        <h2 className={css({
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: 'text.primary',
                            letterSpacing: '-0.02em',
                        })}>
                            {data.title}
                        </h2>
                    )}
                    {data.description && (
                        <p className={css({
                            fontSize: '0.95rem',
                            color: 'text.secondary',
                            mt: '4px',
                            whiteSpace: 'pre-wrap',
                        })}>
                            {data.description}
                        </p>
                    )}
                </div>
            )}
            <div className={css({
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid token(colors.border.default)',
                aspectRatio: '16/9',
            })}>
                <iframe
                    src={data.url}
                    title={data.title || 'Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={css({
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        display: 'block',
                    })}
                />
            </div>
        </section>
    );
}
