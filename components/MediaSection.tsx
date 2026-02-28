import { css } from '@/styled-system/css';
import type { MediaSectionData } from '@/lib/data';

function isVideo(url: string): boolean {
    return /\.(mp4|webm|mov|ogg)$/i.test(url);
}

function normalizeUnit(value: string): string {
    return /^\d+(\.\d+)?$/.test(value.trim()) ? `${value.trim()}px` : value.trim();
}

export function MediaSection({ data }: { data: MediaSectionData }) {
    if (!data.media) return null;

    const fullWidth = data.full_width ?? false;
    const hasTopPart = !!(data.title || data.description);

    const desktopWidth = data.width ? normalizeUnit(data.width) : '100%';
    const mobileWidth = data.width_mobile ? normalizeUnit(data.width_mobile) : desktopWidth;
    const mediaId = `media-section-${data.id.replace(/[^a-zA-Z0-9]/g, '')}`;

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
            <style>{`
                #${mediaId} { width: ${mobileWidth}; }
                @media (min-width: 768px) {
                    #${mediaId} { width: ${desktopWidth}; }
                }
            `}</style>
            <div
                id={mediaId}
                className={fullWidth
                    ? css({
                        overflow: 'hidden',
                        aspectRatio: data.aspect_ratio || '16/9',
                    })
                    : css({
                        borderRadius: '12px',
                        overflow: 'hidden',
                        aspectRatio: data.aspect_ratio || '16/9',
                        margin: '0 auto',
                    })
                }
            >
                {isVideo(data.media) ? (
                    <video
                        src={data.media}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className={css({
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                        })}
                    />
                ) : (
                    <img
                        src={data.media}
                        alt={data.title || ''}
                        className={css({
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                        })}
                    />
                )}
            </div>
        </section>
    );
}
