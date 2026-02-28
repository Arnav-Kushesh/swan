import { getAuthors, getAuthor, getAllPosts } from '@/lib/data';
import { css } from '@/styled-system/css';
import { container } from '@/styled-system/patterns';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { AuthorPostList } from './AuthorPostList';
import { FaGithub, FaEnvelope } from 'react-icons/fa';
import { RiInstagramFill } from 'react-icons/ri';
import { FaXTwitter } from 'react-icons/fa6';

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
                <div className={css({ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' })}>
                    {author.github_handle_link && (
                        <a href={author.github_handle_link} target="_blank" rel="noopener noreferrer"
                            className={css({ color: 'text.primary', display: 'flex', alignItems: 'center', justifyContent: 'center', p: '5px', borderRadius: '6px', transition: 'all 0.15s ease', _hover: { opacity: 0.7 } })}>
                            <FaGithub size={18} />
                        </a>
                    )}
                    {author.x_handle_link && (
                        <a href={author.x_handle_link} target="_blank" rel="noopener noreferrer"
                            className={css({ color: 'text.primary', display: 'flex', alignItems: 'center', justifyContent: 'center', p: '5px', borderRadius: '6px', transition: 'all 0.15s ease', _hover: { opacity: 0.7 } })}>
                            <FaXTwitter size={18} />
                        </a>
                    )}
                    {author.instagram_handle_link && (
                        <a href={author.instagram_handle_link} target="_blank" rel="noopener noreferrer"
                            className={css({ color: 'text.primary', display: 'flex', alignItems: 'center', justifyContent: 'center', p: '5px', borderRadius: '6px', transition: 'all 0.15s ease', _hover: { opacity: 0.7 } })}>
                            <RiInstagramFill size={18} />
                        </a>
                    )}
                    {author.email && (
                        <a href={`mailto:${author.email}`}
                            className={css({ color: 'text.primary', display: 'flex', alignItems: 'center', justifyContent: 'center', p: '5px', borderRadius: '6px', transition: 'all 0.15s ease', _hover: { opacity: 0.7 } })}>
                            <FaEnvelope size={18} />
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
