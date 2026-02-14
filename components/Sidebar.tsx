
import Link from 'next/link';
import Image from 'next/image';
import { css } from '@/styled-system/css';
import { flex, stack } from '@/styled-system/patterns';
import { SettingsMenu } from './SettingsMenu';
import { getHomeData, getNavbarPages } from '@/lib/data';
import { SocialIcons } from './SocialIcons';
import { SearchButton } from './SearchButton';

// ... styles remain mostly same, but remove iconStyle/containerStyle if unused (socialContainerStyle is used in SocialIcons now)
// But wait, Sidebar defines local socialContainerStyle. I should use the one from SocialIcons or just wrap it?
// SocialIcons has its own container style `flex({ gap: '12px', ... })`.
// I can just render SocialIcons.

const sidebarStyle = stack({
    pos: 'fixed',
    top: '20px',
    left: '20px',
    h: 'calc(100vh - 40px)',
    w: '260px',
    bg: 'bg.primary',
    // ...
    borderRight: '1px solid token(colors.border.subtle)',
    justify: 'space-between',
    overflowY: 'auto',
    zIndex: 50,
});

const contentStackStyle = stack({ gap: '32px' });

const profileSectionStyle = stack({ gap: '16px', align: 'center' });

const profileImageContainerStyle = css({
    width: '100px',
    height: '100px',
    borderRadius: 'full',
    overflow: 'hidden',
    border: '2px solid token(colors.border.primary)',
    position: 'relative',
});

const profileImageStyle = css({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

const textStackStyle = stack({ gap: '4px', align: 'center', textAlign: 'center' });

const titleStyle = css({ fontSize: '1.1rem', fontWeight: 'bold', color: 'text.primary', mb: '4px' });

const taglineStyle = css({ fontSize: '0.85rem', color: 'text.secondary', lineHeight: '1.4' });

const dividerStyle = css({ h: '1px', bg: 'border.primary', w: '100%' });

const navStackStyle = stack({ gap: '12px' });

const navHomeLinkStyle = css({
    fontSize: '0.95rem',
    fontWeight: '500',
    color: 'text.primary',
    p: '8px',
    borderRadius: '6px',
    _hover: { bg: 'bg.tertiary' }
});

const navLinkStyle = css({
    fontSize: '0.95rem',
    color: 'text.secondary',
    fontWeight: '500',
    p: '8px',
    pl: "15px",
    borderRadius: '6px',
    transition: 'all 0.2s',
    _hover: {
        color: 'text.primary',
        bg: 'bg.tertiary'
    },
});

const footerStyle = flex({
    gap: '20px',
    align: 'center',
    mt: 'auto',
    pt: '20px',
    borderTop: '1px solid',
    borderColor: { base: 'rgba(0,0,0,0.06)', _dark: 'rgba(255,255,255,0.12)' },
    flexShrink: 0,
    justifyContent: 'center'
});

export async function Sidebar() {
    const homeData = getHomeData();
    const pages = getNavbarPages();
    const title = homeData.info?.title || 'Home';
    const logo = homeData.info?.logo;
    const tagline = homeData.info?.tagline;

    const showLogo = homeData.info?.disable_logo_in_sidebar !== 'true';

    return (
        <aside className={sidebarStyle}>
            <div className={contentStackStyle}>
                {/* Hero / Profile Section */}
                <div className={profileSectionStyle}>
                    {showLogo && logo && (
                        <div className={profileImageContainerStyle}>
                            <Image
                                src={logo}
                                alt="Profile"
                                fill
                                className={profileImageStyle}
                            />
                        </div>
                    )}

                    <div className={textStackStyle}>
                        <h2 className={titleStyle}>
                            {title}
                        </h2>
                        {tagline && (
                            <p className={taglineStyle}>
                                {tagline}
                            </p>
                        )}
                    </div>


                    {/* Social Icons (Compact) */}
                    <div className={css({ mt: '20px' })}>
                        <SocialIcons config={homeData.info} />
                    </div>
                </div>

                <div className={dividerStyle} />

                <nav className={navStackStyle}>
                    <div className={css({ mb: '4' })}>
                        <SearchButton />
                    </div>
                    <Link
                        href="/"
                        className={navLinkStyle}
                    >
                        Home
                    </Link>
                    {pages.map((page) => (
                        <Link
                            key={page.slug}
                            href={`/${page.slug}`}
                            className={navLinkStyle}
                        >
                            {page.title}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className={footerStyle}>
                <SettingsMenu variant="horizontal" />
            </div>
        </aside>
    );
}
