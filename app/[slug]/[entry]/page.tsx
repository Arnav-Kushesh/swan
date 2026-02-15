import { getPosts, getPost, getAuthor } from '../../../lib/data';
import { processMarkdown } from '../../../lib/markdown';
import { postContentStyle } from '../../../components/shared/post-styles';
import { AuthorInfo } from '../../../components/AuthorInfo';
import { MessageAuthor } from '../../../components/MessageAuthor';
import { notFound } from 'next/navigation';
import { css } from '../../../styled-system/css';
import { format } from 'date-fns';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

export const dynamicParams = false;

export async function generateStaticParams() {
    const contentDir = path.join(process.cwd(), 'notion_state/content');
    if (!fs.existsSync(contentDir)) return [];

    const collections = fs.readdirSync(contentDir).filter(f => fs.statSync(path.join(contentDir, f)).isDirectory());

    const params = [];
    for (const collection of collections) {
        if (collection === 'navbarPages') continue;
        const posts = getPosts(collection);
        for (const post of posts) {
            params.push({ slug: collection, entry: post.slug });
        }
    }
    return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; entry: string }> }): Promise<Metadata> {
    const { slug, entry } = await params;
    const post = getPost(entry, slug);
    if (!post) return {};
    return {
        title: post.title,
        description: post.description,
        openGraph: {
            images: post.cover?.image ? [post.cover.image] : [],
        },
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string; entry: string }> }) {
    const { slug, entry } = await params;
    const post = getPost(entry, slug);

    if (!post) {
        notFound();
    }

    const content = await processMarkdown(post.content);
    const author = post.author_username ? getAuthor(post.author_username) : null;

    return (
        <article className={css({ maxWidth: '800px', margin: '0 auto', py: '40px', px: '20px' })}>
            <header className={css({ mb: '40px', textAlign: 'center' })}>
                <h1 className={css({
                    fontSize: { base: '2rem', md: '2.5rem' },
                    fontWeight: '800',
                    mb: '16px',
                    letterSpacing: '-0.03em',
                    lineHeight: '1.15',
                    color: 'text.primary',
                })}>
                    {post.title}
                </h1>

                {post.date && (
                    <div className={css({ color: 'text.tertiary', mb: '12px', fontSize: '0.875rem' })}>
                        {format(new Date(post.date), 'MMMM d, yyyy')}
                    </div>
                )}

            </header>

            {/* Video Embed or Cover Image */}
            {post.video_embed_link ? (
                <div className={css({
                    mb: '32px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    aspectRatio: '16/9',
                    border: '1px solid token(colors.border.default)',
                })}>
                    <iframe
                        src={post.video_embed_link}
                        title={post.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className={css({ width: '100%', height: '100%', border: 'none' })}
                    />
                </div>
            ) : post.cover?.image ? (
                <div className={css({ mb: '32px', borderRadius: '12px', overflow: 'hidden', border: '1px solid token(colors.border.default)' })}>
                    <img
                        src={post.cover.image}
                        alt={post.cover.alt || post.title}
                        className={css({ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' })}
                    />
                </div>
            ) : null}

            {content && content !== 'undefined' && (
                <div
                    className={postContentStyle}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            )}

            {/* Tags (Moved to bottom) */}
            {post.tags && post.tags.length > 0 && (
                <div className={css({ display: 'flex', gap: '6px', flexWrap: 'wrap', mt: '48px', mb: '24px' })}>
                    {Array.isArray(post.tags) ? post.tags.map(tag => {
                        const tagName = typeof tag === 'string' ? tag : (tag as { name: string }).name;
                        return (
                            <span key={tagName} className={css({
                                bg: 'bg.secondary',
                                color: 'text.secondary',
                                px: '10px',
                                py: '4px',
                                borderRadius: 'full',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                            })}>
                                {tagName}
                            </span>
                        );
                    }) : String(post.tags)}
                </div>
            )}

            {/* Author Info (Moved to bottom) */}
            {post.author_username && (
                <div className={css({ mb: '40px' })}>
                    <AuthorInfo authorUsername={post.author_username} />
                </div>
            )}

            {/* External Link */}
            {post.link && (
                <div className={css({ mt: '20px', textAlign: 'center', borderTop: '1px solid token(colors.border.default)', pt: '32px' })}>
                    <a href={post.link} target="_blank" rel="noopener noreferrer"
                        className={css({
                            display: 'inline-block',
                            bg: 'text.primary',
                            color: 'bg.primary !important',
                            px: '24px',
                            py: '10px',
                            borderRadius: 'full',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease',
                            _hover: { opacity: 0.9, transform: 'translateY(-1px)' },
                        })}>
                        Visit Project
                    </a>
                </div>
            )}

            {/* Message Author */}
            {author && author.email && (
                <MessageAuthor
                    authorEmail={author.email}
                    pageTitle={post.title}
                    authorName={author.name}
                />
            )}
        </article>
    );
}
