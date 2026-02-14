import Link from 'next/link';
import Image from 'next/image';
import { css } from '@/styled-system/css';
import { flex, container } from '@/styled-system/patterns';
import { SettingsMenu } from './SettingsMenu';
import { getHomeData, getNavbarPages } from '@/lib/data';
import { SocialIcons } from './SocialIcons';
import { SearchButton } from './SearchButton';

const navbarStyle = css({
    pos: 'fixed',
    top: 0,
    left: 0,
    w: '100%',
    zIndex: 100,
    bg: 'bg.primary',
    // _dark: { bg: 'rgba(18, 18, 18, 0.8)' }, // Remove transparency
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
    const pages = getNavbarPages();
    const title = homeData.info?.title || 'Home';
    const logo = homeData.info?.logo;
    const showLogo = homeData.info?.disable_logo_in_topbar !== 'true';

    return (
        <nav className={navbarStyle}>
            <div className={navbarContainerStyle}>
                {showLogo ? (
                    <Link
                        href="/"
                        className={css({ display: 'flex', alignItems: 'center', gap: '2', textDecoration: 'none' })}
                    >
                        {logo ? (
                            <div className={css({
                                width: '32px',
                                height: '32px',
                                position: 'relative',
                                borderRadius: 'full',
                                overflow: 'hidden',
                                border: '1px solid token(colors.border.subtle)'
                            })}>
                                <Image
                                    src={logo}
                                    alt={title}
                                    fill
                                    className={css({ objectFit: 'cover' })}
                                />
                            </div>
                        ) : null}
                        <span className={logoStyle}>{title}</span>
                    </Link>
                ) : (
                    <div></div> /* Spacer */
                )}

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

                    <div className={css({ display: { base: 'none', md: 'block' } })}>
                        <SocialIcons config={homeData.info} />
                    </div>

                    <SearchButton />

                    <div className={css({ display: 'block' })}>
                        <SettingsMenu variant="vertical" />
                    </div>
                </div>
            </div>
        </nav>
    );
}
