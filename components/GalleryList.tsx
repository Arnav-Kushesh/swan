import Link from 'next/link';
import { css } from '@/styled-system/css';
import { grid } from '@/styled-system/patterns';
import { GalleryItem } from '@/lib/data';

interface GalleryListProps {
    items: GalleryItem[];
    title?: string;
}

const sectionTitleStyle = css({
    fontSize: '1.5rem',
    fontWeight: 'bold',
    mb: '20px',
    color: 'primary',
});

const gridContainerStyle = grid({
    columns: { base: 1, md: 3 },
    gap: '20px',
});

const itemStyle = css({
    display: 'block',
    position: 'relative',
    aspectRatio: '1',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s',
    _hover: {
        transform: 'scale(1.02)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        '& .overlay': {
            opacity: 1
        }
    },
});

const imageStyle = css({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

const overlayStyle = css({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    p: '10px',
    bg: 'rgba(0,0,0,0.6)',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
    color: 'white',
    opacity: 0,
    transition: 'opacity 0.2s',
    display: 'flex',
    alignItems: 'flex-end'
});

const overlayTextStyle = css({ fontWeight: 'bold', fontSize: '1rem' });

export function GalleryList({ items, title = 'Gallery' }: GalleryListProps) {
    if (items.length === 0) return null;

    return (
        <section>
            <h2 className={sectionTitleStyle}>
                {title}
            </h2>
            <div className={gridContainerStyle}>
                {items.map((item) => (
                    <Link
                        key={item.slug}
                        href={`/gallery/${item.slug}`}
                        className={itemStyle}
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className={imageStyle}
                        />
                        <div className={`overlay ${overlayStyle}`}>
                            <span className={overlayTextStyle}>
                                {item.name}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
