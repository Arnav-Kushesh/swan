import { css } from '@/styled-system/css';
import Link from 'next/link';
import { getAuthor } from '@/lib/data';

interface AuthorInfoProps {
    authorUsername: string;
}

export function AuthorInfo({ authorUsername }: AuthorInfoProps) {
    if (!authorUsername) return null;

    const author = getAuthor(authorUsername);
    if (!author) return null;

    return (
        <Link
            href={`/author/${author.username}`}
            className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '3',
                marginTop: '4',
                padding: '3',
                borderRadius: 'lg',
                transition: 'all 0.2s',
                textDecoration: 'none',
                _hover: { bg: 'bg.subtle' },
            })}
        >
            {author.picture && (
                <img
                    src={author.picture}
                    alt={author.name}
                    className={css({
                        width: '36px',
                        height: '36px',
                        borderRadius: 'full',
                        objectFit: 'cover',
                    })}
                />
            )}
            <div>
                <p className={css({ fontWeight: 'semibold', fontSize: 'sm' })}>{author.name}</p>
                <p className={css({ color: 'text.muted', fontSize: 'xs' })}>@{author.username}</p>
            </div>
        </Link>
    );
}
