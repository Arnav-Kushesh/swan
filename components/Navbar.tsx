import Link from 'next/link';
import { css } from '@/styled-system/css';
import { flex, container } from '@/styled-system/patterns';
import { ThemeToggle } from './ThemeToggle';
import { getHomeData, getPages } from '@/lib/data';

const navbarStyle = css({
    pos: 'fixed',
    top: 0,
    left: 0,
    w: '100%',
    zIndex: 100,
    bg: 'rgba(255, 255, 255, 0.8)',
    _dark: { bg: 'rgba(18, 18, 18, 0.8)' },
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid token(colors.border.default)',
});

const navbarContainerStyle = container({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '60px',
});

const logoStyle = css({
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'text.primary',
    truncate: true,
    maxWidth: '200px',
});

const navLinksContainerStyle = flex({ gap: '20px', alignItems: 'center' });

const linkStyle = css({
    color: 'text.secondary',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
    _hover: {
        color: 'primary',
    },
});

export async function Navbar() {
    const homeData = getHomeData();
    const pages = getPages();
    const siteTitle = homeData.info?.site_title || 'Home';

    return (
        <nav className={navbarStyle}>
            <div className={navbarContainerStyle}>
                <Link
                    href="/"
                    className={logoStyle}
                >
                    {siteTitle}
                </Link>

                <div className={navLinksContainerStyle}>
                    <Link href="/" className={linkStyle}>
                        Home
                    </Link>
                    {pages.map((page) => (
                        <Link
                            key={page.slug}
                            href={`/${page.slug}`}
                            className={linkStyle}
                        >
                            {page.title}
                        </Link>
                    ))}
                    <div className={css({ ml: '10px' })}>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
}
