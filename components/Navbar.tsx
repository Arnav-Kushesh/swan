import Link from 'next/link';
import Image from 'next/image';
import { css } from '@/styled-system/css';
import { flex, container } from '@/styled-system/patterns';
import { SettingsMenu } from './SettingsMenu';
import { getHomeData, getNavbarPages } from '@/lib/data';
import { SocialIcons } from './SocialIcons';
import { SearchButton } from './SearchButton';
import { NavLinks } from './NavLinks';

const navbarStyle = css({
    pos: 'fixed',
    top: 0,
    left: 0,
    w: '100%',
    zIndex: 100,
    bg: 'bg.primary',
    borderBottom: '1px solid token(colors.border.default)',
    transition: 'all 0.2s ease',
});

const navbarContainerStyle = container({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '56px',
    px: '20px',
});

const logoStyle = css({
    fontSize: '1rem',
    fontWeight: '600',
    fontFamily: 'heading',
    color: 'text.primary',
    truncate: true,
    maxWidth: '200px',
    letterSpacing: '-0.01em',
});

const navLinksContainerStyle = flex({ gap: '6px', alignItems: 'center' });

export async function Navbar() {
    const homeData = getHomeData();
    const pages = getNavbarPages();
    const title = homeData.info?.title || 'Home';
    const logo = homeData.info?.logo;
    const hideLogo = homeData.info?.disable_logo_in_topbar === 'true';

    return (
        <nav className={navbarStyle}>
            <div className={navbarContainerStyle}>
                <Link
                    href="/"
                    className={css({ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' })}
                >
                    {!hideLogo && logo ? (
                        <div className={css({
                            width: '28px',
                            height: '28px',
                            position: 'relative',
                            borderRadius: 'full',
                            overflow: 'hidden',
                            flexShrink: 0,
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

                <div className={navLinksContainerStyle}>
                    <NavLinks pages={pages} mobileExtra={<SocialIcons config={homeData.info} />} />

                    <div className={css({
                        display: { base: 'none', lg: 'flex' },
                        alignItems: 'center',
                        ml: '8px',
                        pl: '12px',
                        borderLeft: '1px solid token(colors.border.default)',
                    })}>
                        <SocialIcons config={homeData.info} />
                    </div>

                    <div className={css({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        ml: '4px',
                    })}>
                        <SearchButton />
                        <SettingsMenu variant="vertical" />
                    </div>
                </div>
            </div>
        </nav>
    );
}
