
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

// Generate params for ALL collections and their items
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
        <article className={css({ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' })}>
            <header className={css({ marginBottom: '40px', textAlign: 'center' })}>
                <h1 className={css({ fontSize: '4xl', fontWeight: 'bold', marginBottom: '4' })}>
                    {post.title}
                </h1>

                {post.date && (
                    <div className={css({ color: 'text.muted', marginBottom: '4' })}>
                        {format(new Date(post.date), 'MMMM d, yyyy')}
                    </div>
                )}

                {post.tags && post.tags.length > 0 && (
                    <div className={css({ display: 'flex', gap: '2', justifyContent: 'center', flexWrap: 'wrap', mb: '4' })}>
                        {Array.isArray(post.tags) ? post.tags.map(tag => (
                            <span key={typeof tag === 'string' ? tag : (tag as any).name} className={css({
                                bg: 'bg.subtle',
                                px: '2',
                                py: '1',
                                borderRadius: 'md',
                                fontSize: 'sm'
                            })}>
                                {typeof tag === 'object' ? (tag as any).name : tag}
                            </span>
                        )) : (
                            String(post.tags)
                        )}
                    </div>
                )}

                {/* Author Info */}
                {post.author_username && (
                    <div className={css({ display: 'flex', justifyContent: 'center' })}>
                        <AuthorInfo authorUsername={post.author_username} />
                    </div>
                )}
            </header>

            {/* Video Embed or Cover Image */}
            {post.video_embed_link ? (
                <div className={css({
                    marginBottom: '8',
                    borderRadius: 'xl',
                    overflow: 'hidden',
                    aspectRatio: '16/9',
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
                <div className={css({ marginBottom: '8', borderRadius: 'xl', overflow: 'hidden' })}>
                    <img
                        src={post.cover.image}
                        alt={post.cover.alt || post.title}
                        className={css({ width: '100%', height: 'auto', objectFit: 'cover' })}
                    />
                </div>
            ) : null}

            <div
                className={postContentStyle}
                dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* External Link */}
            {post.link && (
                <div className={css({ marginTop: '40px', textAlign: 'center', borderTop: '1px solid token(colors.border.subtle)', paddingTop: '40px' })}>
                    <a href={post.link} target="_blank" rel="noopener noreferrer"
                        className={css({
                            display: 'inline-block',
                            bg: 'text.primary',
                            color: 'bg.primary',
                            px: '8',
                            py: '3',
                            borderRadius: 'full',
                            fontWeight: 'bold',
                            transition: 'transform 0.2s',
                            _hover: { transform: 'scale(1.05)' }
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
