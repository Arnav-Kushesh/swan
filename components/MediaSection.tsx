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

    const desktopHeight = data.height ? normalizeUnit(data.height) : '400px';
    const mobileHeight = data.mobile_height ? normalizeUnit(data.mobile_height) : desktopHeight;
    const fullWidth = data.full_width ?? false;

    const containerStyles = fullWidth
        ? css({
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            overflow: 'hidden',
        })
        : css({
            borderRadius: '12px',
            overflow: 'hidden',
        });

    return (
        <div
            className={containerStyles}
            style={{
                '--media-h-mobile': mobileHeight,
                '--media-h-desktop': desktopHeight,
            } as React.CSSProperties}
        >
            <style>{`
                .media-section-inner { height: var(--media-h-mobile); }
                @media (min-width: 768px) {
                    .media-section-inner { height: var(--media-h-desktop); }
                }
            `}</style>
            <div className="media-section-inner">
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
        </div>
    );
}
