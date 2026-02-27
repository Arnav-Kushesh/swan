'use client';

import { css } from '@/styled-system/css';
import { flex } from '@/styled-system/patterns';
import { InfoSectionData } from '@/lib/data';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useGlobalConfig } from './providers/GlobalConfigProvider';

function isVideoUrl(url: string): boolean {
    return /\.(mp4|webm|mov|ogg)$/i.test(url);
}

function normalizeUnit(value: string): string {
    return /^\d+(\.\d+)?$/.test(value.trim()) ? `${value.trim()}px` : value.trim();
}

export function InfoSection({ data }: { data: InfoSectionData }) {
    const { sectionViewOverrides } = useGlobalConfig();
    const viewType = sectionViewOverrides[data.id] || data.view_type || 'col_centered_view';
    const isRow = viewType === 'row_view' || viewType === 'row_reverse_view';
    const isReverse = viewType === 'row_reverse_view';
    const isCentered = viewType === 'col_centered_view';

    const aspectRatio = data.media_aspect_ratio || '16/9';
    const desktopWidth = data.media_width ? normalizeUnit(data.media_width) : '100%';
    const mobileWidth = data.media_width_mobile ? normalizeUnit(data.media_width_mobile) : desktopWidth;
    const mediaId = `info-media-${data.id.replace(/[^a-zA-Z0-9]/g, '')}`;

    return (
        <section className={css({ mb: '40px' })}>
            <div className={flex({
                direction: {
                    base: 'column',
                    md: isRow ? (isReverse ? 'row-reverse' : 'row') : 'column',
                },
                gap: isRow ? '48px' : '32px',
                align: 'center',
                textAlign: isCentered ? 'center' : 'left',
                justify: 'center',
                flexWrap: isRow ? 'nowrap' : 'wrap',
            })}>
                {/* Media Side */}
                {data.media && (
                    <div
                        className={css({
                            flex: isRow ? '0 0 auto' : 'initial',
                            maxWidth: '100%',
                            mx: isCentered ? 'auto' : '0',
                        })}
                    >
                        <style>{`
                            #${mediaId} { width: ${mobileWidth}; }
                            @media (min-width: 768px) {
                                #${mediaId} { width: ${desktopWidth}; }
                            }
                        `}</style>
                        <div
                            id={mediaId}
                            className={css({
                                position: 'relative',
                                borderRadius: '12px',
                                overflow: 'hidden',
                            })}
                            style={{ aspectRatio }}
                        >
                            {isVideoUrl(data.media) ? (
                                <video
                                    src={data.media}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className={css({ width: '100%', height: '100%', objectFit: 'cover' })}
                                />
                            ) : (
                                <Image
                                    src={data.media}
                                    alt={data.title}
                                    width={800}
                                    height={600}
                                    className={css({ width: '100%', height: '100%', objectFit: 'cover' })}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Content Side */}
                <div className={css({
                    flex: isRow ? '1' : 'initial',
                    maxWidth: isRow ? 'none' : '800px',
                    mx: isCentered ? 'auto' : '0',
                    animationName: 'fadeInUp',
                    animationDuration: '0.6s',
                    animationTimingFunction: 'ease-out',
                    animationFillMode: 'forwards',
                    opacity: 0,
                })}>
                    <h2 className={css({
                        fontSize: { base: '1.8rem', md: '2.2rem', lg: '2.6rem' },
                        fontWeight: '800',
                        lineHeight: '1.1',
                        mb: '16px',
                        color: 'text.primary',
                        letterSpacing: '-0.03em',
                    })}>
                        {data.title}
                    </h2>
                    <p className={css({
                        fontSize: '1.1rem',
                        lineHeight: '1.7',
                        color: 'text.secondary',
                        mb: '28px',
                        whiteSpace: 'pre-wrap',
                    })}>
                        {data.description}
                    </p>

                    {data.button_link && (
                        <a
                            href={data.button_link}
                            target={data.button_link.startsWith('/') ? '_self' : '_blank'}
                            rel={data.button_link.startsWith('/') ? '' : 'noreferrer'}
                            className={css({
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                bg: 'text.primary',
                                color: 'bg.primary',
                                px: '24px',
                                py: '12px',
                                borderRadius: '12px',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s ease',
                                _hover: {
                                    transform: 'translateY(-1px)',
                                    opacity: 0.9,
                                },
                            })}
                        >
                            {data.button_text || 'Explore'}
                            <ArrowRight size={16} />
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
