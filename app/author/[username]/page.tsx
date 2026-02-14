import { getAuthors, getAuthor, getAllPosts, Post } from '@/lib/data';
import { css } from '@/styled-system/css';
import { container } from '@/styled-system/patterns';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamicParams = false;

export async function generateStaticParams() {
    const authors = getAuthors();
    return authors.map((author) => ({ username: author.username }));
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
    const { username } = await params;
    const author = getAuthor(username);
    if (!author) return {};
    return {
        title: `${author.name} — Author`,
        description: author.description,
    };
}

export default async function AuthorPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const author = getAuthor(username);

    if (!author) {
        notFound();
    }

    // Get all posts by this author
    const allPosts = getAllPosts();
    const authorPosts = allPosts.filter(p => p.author_username === username);

    return (
        <main className={container({ py: '60px', maxWidth: '800px' })}>
            {/* Author Profile */}
            <section className={css({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginBottom: '60px',
            })}>
                {author.picture && (
                    <img
                        src={author.picture}
                        alt={author.name}
                        className={css({
                            width: '120px',
                            height: '120px',
                            borderRadius: 'full',
                            objectFit: 'cover',
                            marginBottom: '4',
                            border: '3px solid token(colors.border)',
                        })}
                    />
                )}
                <h1 className={css({ fontSize: '3xl', fontWeight: 'bold', marginBottom: '1' })}>
                    {author.name}
                </h1>
                <p className={css({ color: 'text.muted', fontSize: 'sm', marginBottom: '4' })}>
                    @{author.username}
                </p>
                <p className={css({ color: 'text.muted', fontSize: 'md', maxWidth: '500px', lineHeight: '1.6', marginBottom: '6' })}>
                    {author.description}
                </p>

                {/* Social Links */}
                <div className={css({ display: 'flex', gap: '4', flexWrap: 'wrap', justifyContent: 'center' })}>
                    {author.github_handle && (
                        <a href={`https://github.com/${author.github_handle}`} target="_blank" rel="noopener noreferrer"
                            className={css({ color: 'text.muted', fontSize: 'sm', _hover: { color: 'text.primary' }, transition: 'color 0.2s' })}>
                            GitHub
                        </a>
                    )}
                    {author.x_handle && (
                        <a href={`https://x.com/${author.x_handle}`} target="_blank" rel="noopener noreferrer"
                            className={css({ color: 'text.muted', fontSize: 'sm', _hover: { color: 'text.primary' }, transition: 'color 0.2s' })}>
                            X / Twitter
                        </a>
                    )}
                    {author.instagram_handle && (
                        <a href={`https://instagram.com/${author.instagram_handle}`} target="_blank" rel="noopener noreferrer"
                            className={css({ color: 'text.muted', fontSize: 'sm', _hover: { color: 'text.primary' }, transition: 'color 0.2s' })}>
                            Instagram
                        </a>
                    )}
                    {author.email && (
                        <a href={`mailto:${author.email}`}
                            className={css({ color: 'text.muted', fontSize: 'sm', _hover: { color: 'text.primary' }, transition: 'color 0.2s' })}>
                            Email
                        </a>
                    )}
                </div>
            </section>

            {/* Author's Posts */}
            {authorPosts.length > 0 && (
                <section>
                    <h2 className={css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: '6' })}>
                        Published Work
                    </h2>
                    <div className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
                        {authorPosts.map((post) => (
                            <Link
                                key={`${post.collection}-${post.slug}`}
                                href={`/${post.collection}/${post.slug}`}
                                className={css({
                                    display: 'flex',
                                    flexDirection: { base: 'column', sm: 'row' },
                                    gap: '4',
                                    padding: '4',
                                    borderRadius: 'lg',
                                    border: '1px solid token(colors.border.subtle)',
                                    bg: 'bg.subtle',
                                    transition: 'all 0.2s',
                                    textDecoration: 'none',
                                    _hover: { bg: 'bg.muted', borderColor: 'border.default', transform: 'translateY(-2px)', shadow: 'md' },
                                })}
                            >
                                {post.thumbnail && (
                                    <div className={css({
                                        width: { base: '100%', sm: '120px' },
                                        height: { base: '200px', sm: '80px' },
                                        flexShrink: 0,
                                        borderRadius: 'md',
                                        overflow: 'hidden',
                                    })}>
                                        <img
                                            src={post.thumbnail}
                                            alt={post.title}
                                            className={css({ width: '100%', height: '100%', objectFit: 'cover' })}
                                        />
                                    </div>
                                )}
                                <div className={css({ flex: 1, minWidth: 0 })}>
                                    <div className={css({ display: 'flex', alignItems: 'center', gap: '2', marginBottom: '1' })}>
                                        <span className={css({
                                            fontSize: 'xs',
                                            bg: 'bg.canvas',
                                            px: '2',
                                            py: '0.5',
                                            borderRadius: 'md',
                                            border: '1px solid token(colors.border)',
                                            textTransform: 'capitalize',
                                        })}>
                                            {post.collection}
                                        </span>
                                        <h3 className={css({ fontWeight: 'bold', fontSize: 'lg', truncate: true })}>{post.title}</h3>
                                    </div>
                                    <p className={css({ color: 'text.muted', fontSize: 'sm', lineClamp: 2 })}>{post.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {authorPosts.length === 0 && (
                <p className={css({ textAlign: 'center', color: 'text.muted', fontSize: 'md' })}>
                    No published work yet.
                </p>
            )}
        </main>
    );
}
