
import { css } from '@/styled-system/css';
import { container, stack, flex } from '@/styled-system/patterns';
import { InfoSectionData } from '@/lib/data';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function InfoSection({ data }: { data: InfoSectionData }) {
    // view_type: 'col_centered_view' | 'col_left_view' | 'row_reverse_view' | 'row_view'
    // Default to col_centered_view
    const viewType = data.view_type || 'col_centered_view';

    const isRow = viewType === 'row_view' || viewType === 'row_reverse_view';
    const isReverse = viewType === 'row_reverse_view';
    const isCentered = viewType === 'col_centered_view';

    return (
        <section className={container({ py: '60px', maxWidth: '1200px' })}>
            <div className={flex({
                direction: {
                    base: 'column',
                    md: isRow ? (isReverse ? 'row-reverse' : 'row') : 'column'
                },
                gap: isRow ? '60px' : '40px',
                align: 'center',
                textAlign: isCentered ? 'center' : 'left', // This applies to all breakpoints unless overridden
                justify: 'center',
                flexWrap: isRow ? 'nowrap' : 'wrap',
            })}>
                {/* Image Side */}
                {data.image && (
                    <div className={css({
                        flex: isRow ? '0 0 50%' : 'initial',
                        width: isRow ? '50%' : '100%',
                        maxWidth: isRow ? 'none' : '600px',
                        mx: isCentered ? 'auto' : '0',
                    })}>
                        <div className={css({
                            position: 'relative',
                            width: '100%',
                            height: 'auto',
                            aspectRatio: '16/9', // Or auto?
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: 'lg',
                        })}>
                            <Image
                                src={data.image}
                                alt={data.title}
                                width={800}
                                height={600}
                                className={css({ width: '100%', height: '100%', objectFit: 'cover' })}
                            />
                        </div>
                    </div>
                )}

                {/* Content Side */}
                <div className={css({
                    flex: isRow ? '1' : 'initial',
                    maxWidth: isRow ? 'none' : '800px',
                    mx: isCentered ? 'auto' : '0',
                    animation: 'fadeInUp 0.8s ease-out forwards',
                    opacity: 0, // Start hidden for animation
                })}>
                    <h2 className={css({
                        fontSize: { base: '2.5rem', md: '3rem', lg: '3.5rem' },
                        fontWeight: '800',
                        lineHeight: '1.1',
                        mb: '20px',
                        color: 'text.primary',
                        letterSpacing: '-0.02em',
                        // Gradient text option? The user likes premium design.
                    })}>
                        {data.title}
                    </h2>
                    <p className={css({
                        fontSize: '1.2rem',
                        lineHeight: '1.6',
                        color: 'text.secondary',
                        mb: '30px',
                        whiteSpace: 'pre-wrap', // Handle newlines
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
                                py: '14px',
                                borderRadius: 'full',
                                fontWeight: '600',
                                transition: 'transform 0.2s, opacity 0.2s',
                                _hover: {
                                    transform: 'translateY(-2px)',
                                    opacity: 0.9,
                                }
                            })}
                        >
                            Explore
                            <ArrowRight size={18} />
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
