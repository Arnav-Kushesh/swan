import { css } from '@/styled-system/css';
import Link from 'next/link';
import { flex } from '@/styled-system/patterns';
import { Post } from '@/lib/data';
import { format } from 'date-fns';

interface BlogListProps {
    blogs: Post[];
    title?: string;
    viewType?: string;
    showImages?: boolean;
}

const sectionTitleStyle = css({
    fontSize: '1.5rem',
    fontWeight: 'bold',
    mb: '20px',
    color: 'primary',
});

const gridContainerStyle = css({
    display: 'grid',
    gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
    gap: '20px',
});

const listContainerStyle = flex({
    direction: 'column',
    gap: '20px',
});

const getCardStyle = (viewType: string) => css({
    display: 'flex',
    flexDirection: viewType === 'Card' ? 'column' : { base: 'column-reverse', md: 'row' },
    alignItems: viewType === 'Card' ? 'stretch' : 'stretch', // changed to stretch for list view
    justifyContent: 'space-between',
    gap: viewType === 'Card' ? '0' : '0', // Removed gap to let content handle padding
    padding: '0', // Removed padding from main container
    width: '100%',
    bg: { base: 'white', _dark: '#121212' },
    border: '1px solid token(colors.border.default)',
    borderRadius: '8px',
    overflow: 'hidden', // Added overflow hidden to clip image corners
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    _hover: {
        // textDecoration: "underline",
        transform: 'scale(0.99)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
});

const getContentStyle = (viewType: string) => css({
    flex: 1,
    textAlign: 'left',
    order: viewType === 'Card' ? 2 : 1,
    padding: '24px', // Added padding here
});

const titleStyle = css({
    fontSize: '23px',
    fontWeight: '800',
    mb: '10px',
    color: 'text.primary',
});

const summaryStyle = css({
    fontFamily: 'Helvetica, sans-serif',
    color: 'text.secondary',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '1.6',
    mb: '12px',
});

const dateStyle = css({
    fontSize: '0.85rem',
    color: 'text.secondary',
    opacity: 0.8,
});

const getImageContainerStyle = (viewType: string) => css({
    width: viewType === 'Card' ? '100%' : { base: '100%', md: '280px' }, // Increased width slightly
    height: viewType === 'Card' ? '200px' : { base: '200px', md: 'auto' }, // auto height for list view
    flexShrink: 0,
    order: viewType === 'Card' ? 1 : { base: 2, md: 2 }, // Image on top for mobile list view
    mb: viewType === 'Card' ? '0' : 0,
    position: 'relative',
});

const imageStyle = css({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '0', // Removed border radius
});

export function BlogList({ blogs, title = 'Latest Writings', viewType = 'List', showImages = true }: BlogListProps) {
    return (
        <section>
            <h2 className={sectionTitleStyle}>
                {title}
            </h2>
            <div
                className={
                    viewType === 'Card'
                        ? gridContainerStyle
                        : listContainerStyle
                }
            >
                {blogs.map((blog) => (
                    <Link
                        key={blog.slug}
                        href={`/blog/${blog.slug}`}
                        className={getCardStyle(viewType)}
                    >
                        {/* Content */}
                        <div className={getContentStyle(viewType)}>
                            <h3 className={titleStyle}>
                                {blog.title}
                            </h3>
                            <p className={summaryStyle}>
                                {blog.summary}
                            </p>
                            <p className={dateStyle}>
                                {blog.date ? format(new Date(blog.date), 'MMM d, yyyy') : ''}
                            </p>
                        </div>

                        {/* Image */}
                        {showImages && blog.cover?.image && (
                            <div className={getImageContainerStyle(viewType)}>
                                <img
                                    src={blog.cover.image}
                                    alt={blog.cover.alt || blog.title}
                                    className={imageStyle}
                                />
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </section >
    );
}
