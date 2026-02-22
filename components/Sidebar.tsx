import Image from 'next/image';
import { css } from '@/styled-system/css';
import { flex, stack } from '@/styled-system/patterns';
import { SettingsMenu } from './SettingsMenu';
import { getHomeData, getNavbarPages } from '@/lib/data';
import { SocialIcons } from './SocialIcons';
import { SearchButton } from './SearchButton';
import { SidebarNavLinks } from './SidebarNavLinks';

const sidebarStyle = stack({
    pos: 'fixed',
    top: '16px',
    left: '16px',
    h: 'calc(100vh - 32px)',
    w: '260px',
    bg: 'bg.primary',
    border: '1px solid token(colors.border.default)',
    borderRadius: '16px',
    justify: 'space-between',
    overflowY: 'auto',
    zIndex: 50,
    py: '24px',
    px: '20px',
});

const contentStackStyle = stack({ gap: '24px' });

const profileSectionStyle = stack({ gap: '12px', align: 'center' });

const profileImageContainerStyle = css({
    width: '80px',
    height: '80px',
    borderRadius: 'full',
    overflow: 'hidden',
    border: '2px solid token(colors.border.default)',
    position: 'relative',
    flexShrink: 0,
});

const profileImageStyle = css({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

const textStackStyle = stack({ gap: '4px', align: 'center', textAlign: 'center', mb: 3 });

const titleStyle = css({ fontSize: '1rem', fontWeight: '600', fontFamily: 'heading', color: 'text.primary', letterSpacing: '-0.01em' });

const taglineStyle = css({ fontSize: '0.8rem', color: 'text.secondary', lineHeight: '1.5' });

const dividerStyle = css({ h: '1px', bg: 'border.default', w: '100%', mt: 2, display: 'block' });

const footerStyle = flex({
    gap: '12px',
    align: 'center',
    mt: 'auto',
    pt: '16px',
    borderTop: '1px solid token(colors.border.default)',
    flexShrink: 0,
    justifyContent: 'center',
});

export async function Sidebar() {
    const homeData = getHomeData();
    const pages = getNavbarPages();
    const title = homeData.info?.title || 'Home';
    const logo = homeData.info?.logo;
    const tagline = homeData.info?.tagline;
    const hideLogo = homeData.info?.disable_logo_in_sidebar === 'true';

    return (
        <aside className={sidebarStyle}>
            <div className={contentStackStyle}>
                <div className={profileSectionStyle}>
                    {!hideLogo && logo && (
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
                        <h2 className={titleStyle}>{title}</h2>
                        {tagline && (
                            <p className={taglineStyle}>{tagline}</p>
                        )}
                    </div>

                    <SocialIcons config={homeData.info} />
                </div>

                <div className={dividerStyle} />

                <SidebarNavLinks pages={pages} />
            </div>

            <div className={footerStyle}>
                <SettingsMenu variant="vertical" />
                <SearchButton />
            </div>
        </aside>
    );
}
