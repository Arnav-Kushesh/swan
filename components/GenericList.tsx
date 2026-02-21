'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { css } from '../styled-system/css';
import { Post, GalleryItem } from '../lib/data';
import { format } from 'date-fns';

const DEFAULT_ITEMS_PER_PAGE = 6;

function getItemTitle(item: Post | GalleryItem): string {
    if ('name' in item && item.name) return item.name;
    if ('title' in item && item.title) return item.title;
    return '';
}

function getItemHref(item: Post | GalleryItem): string {
    if ('collection' in item && item.collection) return `/${item.collection}/${item.slug}`;
    return `/${item.slug}`;
}

function getItemImage(item: Post | GalleryItem): string | undefined {
    if (item.image) return item.image;
    if ('thumbnail' in item && item.thumbnail) return item.thumbnail;
    if ('cover' in item && item.cover?.image) return item.cover.image;
    return undefined;
}

function getTagName(tag: string | { name: string }): string {
    return typeof tag === 'string' ? tag : tag.name;
}

interface GenericListProps {
    items: (Post | GalleryItem)[];
    viewType: string;
    itemsPerPage?: number;
}

export function GenericList({ items, viewType, itemsPerPage }: GenericListProps) {
    const router = useRouter();
    const perPage = itemsPerPage || DEFAULT_ITEMS_PER_PAGE;
    const [visibleCount, setVisibleCount] = useState(perPage);
    const visibleItems = items.slice(0, visibleCount);
    const hasMore = visibleCount < items.length;

    const loadMore = () => setVisibleCount(prev => prev + perPage);

    const paginationButton = hasMore ? (
        <div className={css({ display: 'flex', justifyContent: 'center', mt: '32px' })}>
            <button
                onClick={loadMore}
                className={css({
                    px: '24px',
                    py: '10px',
                    borderRadius: 'full',
                    border: '1px solid token(colors.border.default)',
                    bg: 'transparent',
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    _hover: { bg: 'bg.secondary', color: 'text.primary', borderColor: 'text.tertiary' },
                })}
            >
                Show More ({items.length - visibleCount} remaining)
            </button>
        </div>
    ) : null;

    if (viewType === 'grid_view') {
        return (
            <>
                <div className={css({
                    display: 'grid',
                    gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                    gap: '16px',
                    width: '100%',
                })}>
                    {visibleItems.map((item) => {
                        const post = item as Post;
                        const hasVideo = post.video_embed_link;
                        const title = getItemTitle(item);

                        return (
                            <Link
                                key={item.slug}
                                href={getItemHref(item)}
                                className={css({
                                    display: 'block',
                                    position: 'relative',
                                    aspectRatio: 'square',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '1px solid token(colors.border.default)',
                                    transition: 'all 0.2s ease',
                                    _hover: { transform: 'translateY(-2px)', borderColor: 'color-mix(in srgb, token(colors.primary) 45%, transparent)' },
                                })}
                            >
                                {getItemImage(item) ? (
                                    <>
                                        <img
                                            src={getItemImage(item)}
                                            alt={title}
                                            className={css({ width: '100%', height: '100%', objectFit: 'cover' })}
                                        />
                                        {hasVideo && (
                                            <div className={css({
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '44px',
                                                height: '44px',
                                                borderRadius: 'full',
                                                bg: 'rgba(0,0,0,0.55)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '1.1rem',
                                                backdropFilter: 'blur(4px)',
                                            })}>
                                                ▶
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className={css({ width: '100%', height: '100%', bg: 'bg.secondary', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.tertiary', fontSize: '0.875rem' })}>
                                        No image
                                    </div>
                                )}
                                <div className={css({
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    p: '16px',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                                    color: 'white',
                                })}>
                                    <h3 className={css({ fontWeight: '600', fontSize: '0.95rem', lineHeight: '1.3' })}>
                                        {title}
                                    </h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                {paginationButton}
            </>
        );
    }

    if (viewType === 'card_view') {
        return (
            <>
                <div className={css({
                    display: 'grid',
                    gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                    gap: '20px',
                    width: '100%',
                })}>
                    {visibleItems.map((item) => {
                        const post = item as Post;
                        const hasVideo = post.video_embed_link;
                        const title = getItemTitle(item);
                        const image = getItemImage(item);

                        return (
                            <div
                                key={item.slug}
                                role="link"
                                tabIndex={0}
                                onClick={() => router.push(getItemHref(item))}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(getItemHref(item)); } }}
                                className={css({
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '12px',
                                    bg: 'bg.secondary',
                                    border: '1px solid token(colors.border.default)',
                                    overflow: 'hidden',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                    _hover: { borderColor: 'color-mix(in srgb, token(colors.primary) 45%, transparent)', transform: 'translateY(-2px)' },
                                    _focus: { outline: '2px solid token(colors.primary)', outlineOffset: '2px' },
                                })}
                            >
                                {image ? (
                                    <div className={css({ aspectRatio: '16/9', overflow: 'hidden', position: 'relative' })}>
                                        <img
                                            src={image}
                                            alt={title}
                                            className={css({
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.3s ease',
                                            })}
                                        />
                                        {hasVideo && (
                                            <div className={css({
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: 'full',
                                                bg: 'rgba(0,0,0,0.55)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '1.2rem',
                                                backdropFilter: 'blur(4px)',
                                            })}>
                                                ▶
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                                <div className={css({ p: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' })}>
                                    <h3 className={css({ fontWeight: '600', fontSize: '1.05rem', lineHeight: '1.3', color: 'text.primary' })}>
                                        {title}
                                    </h3>
                                    {post.description && (
                                        <p className={css({ color: 'text.secondary', fontSize: '0.85rem', lineHeight: '1.5', lineClamp: 2 })}>
                                            {post.description}
                                        </p>
                                    )}
                                    {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                                        <div className={css({ display: 'flex', gap: '6px', flexWrap: 'wrap', mt: 'auto', pt: '8px' })}>
                                            {post.tags.slice(0, 3).map(tag => {
                                                const name = getTagName(tag);
                                                return (
                                                    <Link
                                                        key={name}
                                                        href={`/tag/${encodeURIComponent(name)}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className={css({
                                                            fontSize: '0.7rem',
                                                            bg: 'bg.tertiary',
                                                            color: 'text.secondary',
                                                            px: '8px',
                                                            py: '3px',
                                                            borderRadius: 'full',
                                                            transition: 'all 0.15s ease',
                                                            position: 'relative',
                                                            zIndex: 1,
                                                            _hover: { bg: 'primary', color: 'white' },
                                                        })}
                                                    >
                                                        {name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {paginationButton}
            </>
        );
    }

    if (viewType === 'tiny_card_view') {
        return (
            <>
                <div className={css({
                    display: 'grid',
                    gridTemplateColumns: { base: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
                    gap: '8px',
                    width: '100%',
                })}>
                    {visibleItems.map((item) => {
                        const image = getItemImage(item);
                        return (
                            <Link
                                key={item.slug}
                                href={getItemHref(item)}
                                className={css({
                                    display: 'block',
                                    position: 'relative',
                                    aspectRatio: 'square',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    border: '1px solid token(colors.border.default)',
                                    transition: 'all 0.2s ease',
                                    _hover: { transform: 'scale(1.03)', borderColor: 'color-mix(in srgb, token(colors.primary) 45%, transparent)' },
                                })}
                            >
                                {image ? (
                                    <>
                                        <img
                                            src={image}
                                            alt={getItemTitle(item)}
                                            className={css({ width: '100%', height: '100%', objectFit: 'cover' })}
                                        />
                                        {(item as Post).video_embed_link && (
                                            <div className={css({
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: 'full',
                                                bg: 'rgba(0,0,0,0.55)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '0.8rem',
                                                backdropFilter: 'blur(4px)',
                                            })}>
                                                ▶
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className={css({ width: '100%', height: '100%', bg: 'bg.secondary' })} />
                                )}
                            </Link>
                        );
                    })}
                </div>
                {paginationButton}
            </>
        );
    }

    if (viewType === 'big_card_view') {
        return (
            <>
                <div className={css({
                    display: 'grid',
                    gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' },
                    gap: '24px',
                    width: '100%',
                })}>
                    {visibleItems.map((item) => {
                        const post = item as Post;
                        const title = getItemTitle(item);
                        const image = getItemImage(item);

                        return (
                            <Link
                                key={item.slug}
                                href={getItemHref(item)}
                                className={css({
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    bg: 'bg.secondary',
                                    border: '1px solid token(colors.border.default)',
                                    transition: 'all 0.2s ease',
                                    _hover: { transform: 'translateY(-3px)', borderColor: 'color-mix(in srgb, token(colors.primary) 45%, transparent)' },
                                })}
                            >
                                {image && (
                                    <div className={css({ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' })}>
                                        <img
                                            src={image}
                                            alt={title}
                                            className={css({
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            })}
                                        />
                                        {post.video_embed_link && (
                                            <div className={css({
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: 'full',
                                                bg: 'rgba(0,0,0,0.55)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '1.2rem',
                                                backdropFilter: 'blur(4px)',
                                            })}>
                                                ▶
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className={css({ p: '20px', display: 'flex', flexDirection: 'column', gap: '8px' })}>
                                    <h3 className={css({
                                        fontWeight: '700',
                                        fontSize: '1.2rem',
                                        lineHeight: '1.3',
                                        color: 'text.primary',
                                    })}>
                                        {title}
                                    </h3>
                                    {post.description && (
                                        <p className={css({ color: 'text.secondary', fontSize: '0.9rem', lineHeight: '1.5', lineClamp: 3 })}>
                                            {post.description}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
                {paginationButton}
            </>
        );
    }

    // Default: List View (minimal_list_view or list_view)
    const isMinimal = viewType === 'minimal_list_view';

    return (
        <>
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '12px' })}>
                {visibleItems.map((item) => {
                    const post = item as Post;
                    const title = getItemTitle(item);
                    const image = getItemImage(item);

                    return (
                        <Link
                            key={item.slug}
                            href={getItemHref(item)}
                            className={css({
                                display: 'flex',
                                flexDirection: { base: 'column', sm: 'row' },
                                gap: '24px',
                                p: '20px',
                                borderRadius: '12px',
                                border: '1px solid token(colors.border.default)',
                                bg: 'transparent',
                                transition: 'all 0.2s ease',
                                _hover: { bg: 'bg.secondary', borderColor: 'text.tertiary', transform: 'translateY(-1px)' },
                            })}
                        >
                            {!isMinimal && image && (
                                <div className={css({
                                    position: 'relative',
                                    aspectRatio: 1,
                                    height: { base: '180px', sm: '110px' },
                                    flexShrink: 0,
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                })}>
                                    <img
                                        src={image}
                                        alt={title}
                                        className={css({ width: '100%', height: '100%', objectFit: 'cover' })}
                                    />
                                    {post.video_embed_link && (
                                        <div className={css({
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: 'full',
                                            bg: 'rgba(0,0,0,0.55)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '0.9rem',
                                            backdropFilter: 'blur(4px)',
                                        })}>
                                            ▶
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className={css({ flex: 1, minWidth: 0 })}>
                                <h3 className={css({ fontWeight: '600', fontSize: '1.15rem', color: 'text.primary', truncate: true, mb: '4px' })}>
                                    {title}
                                </h3>
                                {post.description && (
                                    <p className={css({ color: 'text.secondary', fontSize: '0.95rem', lineClamp: 2, lineHeight: '1.5' })}>
                                        {post.description}
                                    </p>
                                )}
                            </div>
                            <div className={css({
                                fontSize: '0.85rem',
                                color: 'text.tertiary',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                alignSelf: { base: 'flex-start', sm: 'flex-start' },
                            })}>
                                {post.date && format(new Date(post.date), 'MMM d, yyyy')}
                            </div>
                        </Link>
                    );
                })}
            </div>
            {paginationButton}
        </>
    );
}
