import { css } from '@/styled-system/css';
import Link from 'next/link';
import { flex } from '@/styled-system/patterns';
import { Post } from '@/lib/data';
import { format } from 'date-fns';

interface BlogListProps {
    blogs: Post[];
    title?: string;
    viewType?: string;
}

export function BlogList({ blogs, title = 'Latest Writings', viewType = 'List', showImages = true }: BlogListProps & { showImages?: boolean }) {
    return (
        <section className={css({ py: '40px' })}>
            <h2
                className={css({
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    mb: '20px',
                    color: 'primary',
                })}
            >
                {title}
            </h2>
            <div
                className={
                    viewType === 'Card'
                        ? css({
                            display: 'grid',
                            gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
                            gap: '20px',
                        })
                        : flex({
                            direction: 'column',
                            gap: '20px',
                        })
                }
            >
                {blogs.map((blog) => (
                    <Link
                        key={blog.slug}
                        href={`/blog/${blog.slug}`}
                        className={css({
                            display: 'flex',
                            flexDirection: viewType === 'Card' ? 'column' : { base: 'column-reverse', md: 'row' },
                            alignItems: viewType === 'Card' ? 'stretch' : 'flex-start',
                            justifyContent: 'space-between',
                            gap: '30px',
                            padding: '24px',
                            width: '100%',
                            bg: { base: 'white', _dark: '#121212' },
                            border: '1px solid token(colors.border.default)',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            transition: 'transform 0.2s',
                            cursor: 'pointer',
                            _hover: {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            },
                        })}
                    >
                        {/* Content */}
                        <div
                            className={css({
                                flex: 1,
                                textAlign: 'left',
                                order: viewType === 'Card' ? 2 : 1,
                            })}
                        >
                            <h3
                                className={css({
                                    fontSize: '1.4rem',
                                    fontWeight: '700',
                                    mb: '10px',
                                    color: 'text.primary',
                                })}
                            >
                                {blog.title}
                            </h3>
                            <p
                                className={css({
                                    fontFamily: 'Helvetica, sans-serif',
                                    color: 'text.secondary',
                                    fontSize: '1rem',
                                    lineHeight: '1.6',
                                    mb: '12px',
                                })}
                            >
                                {blog.summary}
                            </p>
                            <p
                                className={css({
                                    fontSize: '0.85rem',
                                    color: 'text.secondary',
                                    opacity: 0.8,
                                })}
                            >
                                {blog.date ? format(new Date(blog.date), 'MMM d, yyyy') : ''}
                            </p>
                        </div>

                        {/* Image */}
                        {showImages && blog.cover?.image && (
                            <div
                                className={css({
                                    width: viewType === 'Card' ? '100%' : { base: '100%', md: '200px' },
                                    height: viewType === 'Card' ? '200px' : { base: 'auto', md: '130px' },
                                    flexShrink: 0,
                                    order: viewType === 'Card' ? 1 : { base: 0, md: 2 },
                                    mb: viewType === 'Card' ? '20px' : 0,
                                })}
                            >
                                <img
                                    src={blog.cover.image}
                                    alt={blog.cover.alt || blog.title}
                                    className={css({
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                    })}
                                />
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </section >
    );
}
