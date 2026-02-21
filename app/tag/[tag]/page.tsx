import { getAllTags, getPostsByTag } from '@/lib/data';
import { notFound } from 'next/navigation';
import { css } from '@/styled-system/css';
import { container } from '@/styled-system/patterns';
import { Metadata } from 'next';
import Link from 'next/link';
import { Tag } from 'lucide-react';

export const dynamicParams = false;

export async function generateStaticParams() {
    const tags = getAllTags();
    return tags.map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
    const { tag } = await params;
    const decoded = decodeURIComponent(tag);
    return {
        title: `Tagged: ${decoded}`,
        description: `All posts tagged with "${decoded}"`,
    };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = await params;
    const decoded = decodeURIComponent(tag);
    const posts = getPostsByTag(decoded);

    if (posts.length === 0) {
        notFound();
    }

    return (
        <div className={container({ py: '60px', maxWidth: '720px' })}>
            <header className={css({ mb: '32px', display: 'flex', alignItems: 'center', gap: '12px' })}>
                <div className={css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    bg: 'bg.secondary',
                    color: 'text.secondary',
                    flexShrink: 0,
                })}>
                    <Tag size={16} />
                </div>
                <div>
                    <h1 className={css({
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        letterSpacing: '-0.02em',
                        lineHeight: '1.2',
                        color: 'text.primary',
                    })}>
                        {decoded}
                    </h1>
                    <p className={css({ color: 'text.tertiary', fontSize: '0.8rem', mt: '2px' })}>
                        {posts.length} {posts.length === 1 ? 'item' : 'items'}
                    </p>
                </div>
            </header>

            <div className={css({ display: 'flex', flexDirection: 'column', gap: '6px' })}>
                {posts.map((post) => (
                    <Link
                        key={`${post.collection}-${post.slug}`}
                        href={`/${post.collection}/${post.slug}`}
                        className={css({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            px: '14px',
                            py: '10px',
                            borderRadius: '10px',
                            transition: 'all 0.15s ease',
                            _hover: { bg: 'bg.secondary' },
                        })}
                    >
                        {post.image && (
                            <div className={css({
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                flexShrink: 0,
                                border: '1px solid token(colors.border.default)',
                            })}>
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className={css({ width: '100%', height: '100%', objectFit: 'cover', display: 'block' })}
                                />
                            </div>
                        )}
                        <div className={css({ flex: 1, minWidth: 0 })}>
                            <h3 className={css({
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                color: 'text.primary',
                                truncate: true,
                                lineHeight: '1.3',
                            })}>
                                {post.title}
                            </h3>
                            {post.description && (
                                <p className={css({
                                    fontSize: '0.78rem',
                                    color: 'text.tertiary',
                                    truncate: true,
                                    lineHeight: '1.4',
                                    mt: '1px',
                                })}>
                                    {post.description}
                                </p>
                            )}
                        </div>
                        <span className={css({
                            fontSize: '0.7rem',
                            color: 'text.tertiary',
                            textTransform: 'capitalize',
                            flexShrink: 0,
                        })}>
                            {post.collection}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
