import { getPosts, getPost, getAuthor, getExtraSections, getCollectionNames, getHomeData } from '../../../lib/data';
import { processMarkdown } from '../../../lib/markdown';
import { postContentStyle } from '../../../components/shared/post-styles';
import { AuthorInfo } from '../../../components/AuthorInfo';
import { MessageAuthor } from '../../../components/MessageAuthor';
import { SectionRenderer } from '../../../components/SectionRenderer';
import { notFound } from 'next/navigation';
import { css } from '../../../styled-system/css';
import { format } from 'date-fns';
import { Metadata } from 'next';
import Link from 'next/link';

export const dynamicParams = false;

export async function generateStaticParams() {
    const collections = getCollectionNames();
    const params = [];
    for (const collection of collections) {
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
    const extraSections = getExtraSections(slug).filter(s => s.enabled !== false);
    const homeData = getHomeData();

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
            {post.video_embed_url ? (
                <div className={css({
                    mb: '32px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    aspectRatio: '16/9',
                    border: '1px solid token(colors.border.default)',
                })}>
                    <iframe
                        src={post.video_embed_url}
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

            {content && (
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
                            <Link key={tagName} href={`/tag/${encodeURIComponent(tagName)}`} className={css({
                                bg: 'bg.secondary',
                                color: 'text.secondary',
                                px: '10px',
                                py: '4px',
                                borderRadius: 'full',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                transition: 'all 0.15s ease',
                                _hover: { bg: 'bg.tertiary', color: 'text.primary' },
                            })}>
                                {tagName}
                            </Link>
                        );
                    }) : String(post.tags)}
                </div>
            )}

            {/* Author Info (Moved to bottom) */}
            {author && (
                <div className={css({ mb: '40px' })}>
                    <AuthorInfo author={author} />
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
                        {post.button_text || 'Visit Project'}
                    </a>
                </div>
            )}

            {/* Extra Sections */}
            {extraSections.length > 0 && (
                <div className={css({ mt: '40px', display: 'flex', flexDirection: 'column', gap: '0' })}>
                    {extraSections.map((section) => (
                        <SectionRenderer key={section.id} section={section} newsletterFormUrl={homeData.info?.newsletter_form_url} />
                    ))}
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
