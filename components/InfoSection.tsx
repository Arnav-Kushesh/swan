'use client';

import { css } from '@/styled-system/css';
import { container, flex } from '@/styled-system/patterns';
import { InfoSectionData } from '@/lib/data';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useGlobalConfig } from './providers/GlobalConfigProvider';

function isVideoUrl(url: string): boolean {
    return /\.(mp4|webm|mov|ogg)$/i.test(url);
}

export function InfoSection({ data }: { data: InfoSectionData }) {
    const { sectionViewOverrides } = useGlobalConfig();
    const viewType = sectionViewOverrides[data.id] || data.view_type || 'col_centered_view';
    const isRow = viewType === 'row_view' || viewType === 'row_reverse_view';
    const isReverse = viewType === 'row_reverse_view';
    const isCentered = viewType === 'col_centered_view';

    const aspectRatio = data.media_aspect_ratio || '16/9';
    const mobileWidth = data.media_mobile_width || '100%';
    const desktopWidth = data.media_desktop_width || (isRow ? '50%' : '600px');

    return (
        <section className={container({ py: '60px', maxWidth: '1200px' })}>
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
                {/* Image Side */}
                {data.image && (
                    <div
                        className={css({
                            flex: isRow ? '0 0 auto' : 'initial',
                            width: 'var(--info-media-w)',
                            maxWidth: isRow ? 'none' : (isCentered ? 'var(--info-media-w)' : 'none'),
                            mx: isCentered ? 'auto' : '0',
                        })}
                        style={{
                            '--info-media-w': mobileWidth,
                        } as React.CSSProperties}
                    >
                        <style>{`
                            @media (min-width: 768px) {
                                [style*="--info-media-w"] {
                                    --info-media-w: ${desktopWidth} !important;
                                }
                            }
                        `}</style>
                        <div className={css({
                            position: 'relative',
                            width: '100%',
                            height: 'auto',
                            borderRadius: '12px',
                            overflow: 'hidden',
                        })} style={{ aspectRatio }}>
                            {isVideoUrl(data.image) ? (
                                <video
                                    src={data.image}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className={css({ width: '100%', height: '100%', objectFit: 'cover' })}
                                />
                            ) : (
                                <Image
                                    src={data.image}
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
                        fontSize: { base: '2.2rem', md: '2.8rem', lg: '3.2rem' },
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

                    {data.link && (
                        <a
                            href={data.link}
                            target={data.link.startsWith('/') ? '_self' : '_blank'}
                            rel={data.link.startsWith('/') ? '' : 'noreferrer'}
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
