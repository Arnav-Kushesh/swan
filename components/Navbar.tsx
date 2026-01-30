import Link from 'next/link';
import { css } from '@/styled-system/css';
import { flex } from '@/styled-system/patterns';
import { ThemeToggle } from './ThemeToggle';
import { getHomeData, getPages } from '@/lib/data';

export async function Navbar() {
    const homeData = getHomeData();
    const pages = getPages();
    const siteTitle = homeData.info?.site_title || 'Home';

    return (
        <nav
            className={flex({
                justify: 'space-between',
                align: 'center',
                py: '20px',
                mb: '40px',
            })}
        >
            <div className={flex({ gap: '24px', align: 'center' })}>
                <Link
                    href="/"
                    className={css({
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: 'text.primary',
                        _hover: {
                            opacity: 0.8,
                        },
                    })}
                >
                    {siteTitle}
                </Link>
            </div>

            <div className={flex({ gap: '20px', align: 'center' })}>
                {pages.map((page) => (
                    <Link
                        key={page.slug}
                        href={`/${page.slug}`}
                        className={css({
                            fontSize: '1rem',
                            color: 'text.secondary',
                            fontWeight: '500',
                            _hover: {
                                color: 'text.primary', // Neutral hover
                            },
                        })}
                    >
                        {page.title}
                    </Link>
                ))}
                <ThemeToggle />
            </div>
        </nav>
    );
}
