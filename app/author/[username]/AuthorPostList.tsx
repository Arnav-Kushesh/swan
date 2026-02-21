'use client';

import { useState } from 'react';
import Link from 'next/link';
import { css } from '@/styled-system/css';

const POSTS_PER_PAGE = 6;

interface AuthorPost {
    slug: string;
    title: string;
    description?: string;
    collection?: string;
    thumbnail?: string;
    image?: string;
}

export function AuthorPostList({ posts }: { posts: AuthorPost[] }) {
    const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
    const visiblePosts = posts.slice(0, visibleCount);
    const hasMore = visibleCount < posts.length;

    return (
        <section>
            <h2 className={css({ fontSize: '1.3rem', fontWeight: '700', mb: '20px', letterSpacing: '-0.02em' })}>
                Published Work
            </h2>
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '8px' })}>
                {visiblePosts.map((post) => (
                    <Link
                        key={`${post.collection}-${post.slug}`}
                        href={`/${post.collection}/${post.slug}`}
                        className={css({
                            display: 'flex',
                            flexDirection: { base: 'column', sm: 'row' },
                            gap: '16px',
                            p: '16px',
                            borderRadius: '12px',
                            border: '1px solid token(colors.border.default)',
                            transition: 'all 0.2s ease',
                            textDecoration: 'none',
                            _hover: { bg: 'bg.secondary', borderColor: 'text.tertiary', transform: 'translateY(-1px)' },
                        })}
                    >
                        {(post.thumbnail || post.image) && (
                            <div className={css({
                                width: { base: '100%', sm: '120px' },
                                height: { base: '160px', sm: '80px' },
                                flexShrink: 0,
                                borderRadius: '8px',
                                overflow: 'hidden',
                            })}>
                                <img
                                    src={post.thumbnail || post.image}
                                    alt={post.title}
                                    className={css({ width: '100%', height: '100%', objectFit: 'cover' })}
                                />
                            </div>
                        )}
                        <div className={css({ flex: 1, minWidth: 0 })}>
                            <div className={css({ display: 'flex', alignItems: 'center', gap: '8px', mb: '4px' })}>
                                <span className={css({
                                    fontSize: '0.7rem',
                                    bg: 'bg.tertiary',
                                    color: 'text.secondary',
                                    px: '6px',
                                    py: '2px',
                                    borderRadius: 'full',
                                    textTransform: 'capitalize',
                                    flexShrink: 0,
                                })}>
                                    {post.collection}
                                </span>
                                <h3 className={css({ fontWeight: '600', fontSize: '1rem', truncate: true, color: 'text.primary' })}>
                                    {post.title}
                                </h3>
                            </div>
                            {post.description && (
                                <p className={css({ color: 'text.secondary', fontSize: '0.85rem', lineClamp: 2, lineHeight: '1.5' })}>
                                    {post.description}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
            {hasMore && (
                <div className={css({ display: 'flex', justifyContent: 'center', mt: '24px' })}>
                    <button
                        onClick={() => setVisibleCount(prev => prev + POSTS_PER_PAGE)}
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
                        Show More ({posts.length - visibleCount} remaining)
                    </button>
                </div>
            )}
        </section>
    );
}
