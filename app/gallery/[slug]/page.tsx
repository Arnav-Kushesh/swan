import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { css } from '@/styled-system/css';
import { flex, container } from '@/styled-system/patterns';
import { getGalleryItem, getGalleryItems } from '@/lib/data';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const items = getGalleryItems();
    return items.map((item) => ({
        slug: item.slug,
    }));
}

export default async function GalleryItemPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const item = getGalleryItem(slug);

    if (!item) {
        notFound();
    }

    return (
        <main className={container({ maxWidth: '4xl', py: '60px' })}>
            <Link
                href="/"
                className={flex({
                    align: 'center',
                    gap: '8px',
                    color: 'text.secondary',
                    mb: '30px',
                    _hover: { color: 'primary' },
                })}
            >
                <ArrowLeft size={20} />
                Back to Home
            </Link>

            <div className={css({ mb: '40px' })}>
                <div
                    className={css({
                        width: '100%',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                        mb: '30px',
                    })}
                >
                    <img
                        src={item.image}
                        alt={item.name}
                        className={css({
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                        })}
                    />
                </div>

                <div className={flex({ direction: 'column', gap: '20px' })}>
                    <h1
                        className={css({
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            color: 'text.primary',
                        })}
                    >
                        {item.name}
                    </h1>

                    {item.link && (
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className={css({
                                display: 'inline-flex',
                                fontSize: '1.1rem',
                                color: 'primary',
                                fontWeight: '500',
                                textDecoration: 'underline',
                                textUnderlineOffset: '4px',
                                _hover: {
                                    textDecorationColor: 'transparent',
                                },
                            })}
                        >
                            Visit Link →
                        </a>
                    )}
                </div>
            </div>
        </main>
    );
}
