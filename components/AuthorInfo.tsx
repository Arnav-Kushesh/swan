import { css } from '@/styled-system/css';
import Link from 'next/link';
import { Author } from '@/lib/data';

interface AuthorInfoProps {
    author: Author;
}

export function AuthorInfo({ author }: AuthorInfoProps) {
    if (!author) return null;

    return (
        <Link
            href={`/author/${author.username}`}
            className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: 'fit-content',
                mt: '12px',
                p: '8px 12px',
                borderRadius: '10px',
                transition: 'all 0.15s ease',
                textDecoration: 'none',
                _hover: { bg: 'bg.secondary' },
            })}
        >
            {author.picture && (
                <img
                    src={author.picture}
                    alt={author.name}
                    className={css({
                        width: '32px',
                        height: '32px',
                        borderRadius: 'full',
                        objectFit: 'cover',
                        flexShrink: 0,
                    })}
                />
            )}
            <div>
                <p className={css({ fontWeight: '600', fontSize: '0.85rem', color: 'text.primary' })}>{author.name}</p>
                <p className={css({ color: 'text.tertiary', fontSize: '0.75rem' })}>@{author.username}</p>
            </div>
        </Link>
    );
}
