import { getAuthors, getAuthor, getAllPosts } from '@/lib/data';
import { css } from '@/styled-system/css';
import { container } from '@/styled-system/patterns';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { AuthorPostList } from './AuthorPostList';

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
                mb: '48px',
            })}>
                {author.picture && (
                    <img
                        src={author.picture}
                        alt={author.name}
                        className={css({
                            width: '100px',
                            height: '100px',
                            borderRadius: 'full',
                            objectFit: 'cover',
                            mb: '16px',
                            border: '2px solid token(colors.border.default)',
                        })}
                    />
                )}
                <h1 className={css({ fontSize: '1.8rem', fontWeight: '800', mb: '4px', letterSpacing: '-0.02em' })}>
                    {author.name}
                </h1>
                <p className={css({ color: 'text.tertiary', fontSize: '0.85rem', mb: '12px' })}>
                    @{author.username}
                </p>
                {author.description && (
                    <p className={css({ color: 'text.secondary', fontSize: '0.95rem', maxWidth: '480px', lineHeight: '1.6', mb: '20px' })}>
                        {author.description}
                    </p>
                )}

                {/* Social Links */}
                <div className={css({ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' })}>
                    {author.github_handle && (
                        <a href={`https://github.com/${author.github_handle}`} target="_blank" rel="noopener noreferrer"
                            className={css({ color: 'text.tertiary', fontSize: '0.85rem', fontWeight: '500', _hover: { color: 'text.primary' }, transition: 'color 0.2s' })}>
                            GitHub
                        </a>
                    )}
                    {author.x_handle && (
                        <a href={`https://x.com/${author.x_handle}`} target="_blank" rel="noopener noreferrer"
                            className={css({ color: 'text.tertiary', fontSize: '0.85rem', fontWeight: '500', _hover: { color: 'text.primary' }, transition: 'color 0.2s' })}>
                            X
                        </a>
                    )}
                    {author.instagram_handle && (
                        <a href={`https://instagram.com/${author.instagram_handle}`} target="_blank" rel="noopener noreferrer"
                            className={css({ color: 'text.tertiary', fontSize: '0.85rem', fontWeight: '500', _hover: { color: 'text.primary' }, transition: 'color 0.2s' })}>
                            Instagram
                        </a>
                    )}
                    {author.email && (
                        <a href={`mailto:${author.email}`}
                            className={css({ color: 'text.tertiary', fontSize: '0.85rem', fontWeight: '500', _hover: { color: 'text.primary' }, transition: 'color 0.2s' })}>
                            Email
                        </a>
                    )}
                </div>
            </section>

            {/* Author's Posts */}
            {authorPosts.length > 0 ? (
                <AuthorPostList posts={authorPosts} />
            ) : (
                <p className={css({ textAlign: 'center', color: 'text.tertiary', fontSize: '0.95rem' })}>
                    No published work yet.
                </p>
            )}
        </main>
    );
}
