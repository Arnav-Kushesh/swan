import Link from 'next/link';
import { css } from '@/styled-system/css';
import { flex, stack } from '@/styled-system/patterns';
import { ThemeToggle } from './ThemeToggle';
import { getHomeData, getPages } from '@/lib/data';
import { FaGithub, FaLinkedin, FaTwitter, FaYoutube, FaFacebook, FaTwitch, FaEnvelope } from 'react-icons/fa';
import { RiInstagramFill } from 'react-icons/ri';

const sidebarStyle = stack({
    pos: 'fixed',
    top: '20px',
    left: '20px',
    h: 'calc(100vh - 40px)',
    w: '260px',
    bg: { base: 'white', _dark: '#121212' },
    p: '24px',
    borderRadius: '12px',
    border: '1px solid',
    borderColor: { base: 'rgba(0,0,0,0.12)', _dark: 'rgba(255,255,255,0.12)' },
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
});

const profileImageStyle = css({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

const textStackStyle = stack({ gap: '4px', align: 'center', textAlign: 'center' });

const titleStyle = css({ fontSize: '1.1rem', fontWeight: 'bold', color: 'text.primary', mb: '4px' });

const taglineStyle = css({ fontSize: '0.85rem', color: 'text.secondary', lineHeight: '1.4' });

const socialContainerStyle = flex({ gap: '12px', justify: 'center', wrap: 'wrap', mt: '20px' });

const iconStyle = css({
    color: 'text.secondary',
    transition: 'color 0.2s',
    cursor: 'pointer',
    _hover: {
        color: 'primary',
    },
});

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
    flexShrink: 0
});

export async function Sidebar() {
    const homeData = getHomeData();
    const pages = getPages();
    const siteTitle = homeData.info?.site_title || 'Home';
    const hero = homeData.hero;

    return (
        <aside className={sidebarStyle}>
            <div className={contentStackStyle}>
                {/* Hero / Profile Section */}
                <div className={profileSectionStyle}>
                    {hero.profile_image && (
                        <div className={profileImageContainerStyle}>
                            <img
                                src={hero.profile_image}
                                alt="Profile"
                                className={profileImageStyle}
                            />
                        </div>
                    )}

                    <div className={textStackStyle}>
                        <h2 className={titleStyle}>
                            {siteTitle}
                        </h2>
                        {hero.tagline && (
                            <p className={taglineStyle}>
                                {hero.tagline}
                            </p>
                        )}
                    </div>


                    {/* Social Icons (Compact) */}
                    <div className={socialContainerStyle}>
                        {hero.twitter && (
                            <a href={hero.twitter} target="_blank" rel="noreferrer" className={iconStyle}>
                                <FaTwitter size={18} />
                            </a>
                        )}
                        {hero.github && (
                            <a href={hero.github} target="_blank" rel="noreferrer" className={iconStyle}>
                                <FaGithub size={18} />
                            </a>
                        )}
                        {hero.linkedin && (
                            <a href={hero.linkedin} target="_blank" rel="noreferrer" className={iconStyle}>
                                <FaLinkedin size={18} />
                            </a>
                        )}
                        {hero.email && (
                            <a href={`mailto:${hero.email}`} className={iconStyle}>
                                <FaEnvelope size={18} />
                            </a>
                        )}
                        {hero.instagram && (
                            <a href={hero.instagram} target="_blank" rel="noreferrer" className={iconStyle}>
                                <RiInstagramFill size={18} />
                            </a>
                        )}
                        {hero.youtube && (
                            <a href={hero.youtube} target="_blank" rel="noreferrer" className={iconStyle}>
                                <FaYoutube size={18} />
                            </a>
                        )}
                        {hero.facebook && (
                            <a href={hero.facebook} target="_blank" rel="noreferrer" className={iconStyle}>
                                <FaFacebook size={18} />
                            </a>
                        )}
                        {hero.twitch && (
                            <a href={hero.twitch} target="_blank" rel="noreferrer" className={iconStyle}>
                                <FaTwitch size={18} />
                            </a>
                        )}
                    </div>
                </div>

                <div className={dividerStyle} />

                <nav className={navStackStyle}>
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
                <ThemeToggle />
            </div>
        </aside>
    );
}
