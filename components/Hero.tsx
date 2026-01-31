import { css } from '@/styled-system/css';
import { flex } from '@/styled-system/patterns';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaYoutube, FaFacebook, FaTwitch } from 'react-icons/fa';
import { RiInstagramFill } from 'react-icons/ri';
import { HomeData } from '@/lib/data';

const getSectionStyle = (isLeftAligned: boolean) => flex({
    direction: 'column-reverse',
    align: 'center',
    justify: 'center',
    py: '60px',
    gap: '40px',
    textAlign: isLeftAligned ? 'left' : 'center',
    maxWidth: '800px',
    mx: 'auto',
    alignItems: isLeftAligned ? 'flex-start' : 'center',
});

const getContentContainerStyle = (isLeftAligned: boolean) => flex({
    direction: 'column',
    align: isLeftAligned ? 'flex-start' : 'center',
    flex: 1,
    width: '100%'
});

const headingStyle = css({
    fontSize: { base: '2.5rem', md: '3.5rem' },
    fontWeight: '800',
    lineHeight: '1.2',
    mb: '16px',
    color: 'text.primary',
});

const bioStyle = css({
    fontSize: '1.2rem',
    color: 'text.secondary',
    lineHeight: '1.6',
    maxWidth: '600px',
    mb: '30px',
});

const getSocialContainerStyle = (isLeftAligned: boolean) => flex({
    gap: '16px',
    justify: isLeftAligned ? 'flex-start' : 'center'
});

const iconStyle = css({
    color: 'text.secondary',
    transition: 'color 0.2s',
    cursor: 'pointer',
    _hover: {
        color: 'primary',
    },
});

const imageContainerStyle = css({
    width: { base: '140px', md: '180px' },
    height: { base: '140px', md: '180px' },
    borderRadius: 'full',
    overflow: 'hidden',
    border: '4px solid token(colors.bg.secondary)',
    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
});

const imageStyle = css({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

export function Hero({ hero }: { hero: HomeData['hero'] }) {
    const alignment = hero.alignment || 'center';
    const isLeftAligned = alignment === 'left';

    return (
        <section className={getSectionStyle(isLeftAligned)}>
            <div className={getContentContainerStyle(isLeftAligned)}>
                <h1 className={headingStyle}>
                    {hero.tagline}
                </h1>
                <p className={bioStyle}>
                    {hero.long_bio}
                </p>

                <div className={getSocialContainerStyle(isLeftAligned)}>
                    {hero.twitter && (
                        <a href={hero.twitter} target="_blank" rel="noreferrer" className={iconStyle}>
                            <FaTwitter size={24} />
                        </a>
                    )}
                    {hero.github && (
                        <a href={hero.github} target="_blank" rel="noreferrer" className={iconStyle}>
                            <FaGithub size={24} />
                        </a>
                    )}
                    {hero.linkedin && (
                        <a href={hero.linkedin} target="_blank" rel="noreferrer" className={iconStyle}>
                            <FaLinkedin size={24} />
                        </a>
                    )}
                    {hero.email && (
                        <a href={`mailto:${hero.email}`} className={iconStyle}>
                            <FaEnvelope size={24} />
                        </a>
                    )}
                    {hero.instagram && (
                        <a href={hero.instagram} target="_blank" rel="noreferrer" className={iconStyle}>
                            <RiInstagramFill size={24} />
                        </a>
                    )}
                    {hero.youtube && (
                        <a href={hero.youtube} target="_blank" rel="noreferrer" className={iconStyle}>
                            <FaYoutube size={24} />
                        </a>
                    )}
                    {hero.facebook && (
                        <a href={hero.facebook} target="_blank" rel="noreferrer" className={iconStyle}>
                            <FaFacebook size={24} />
                        </a>
                    )}
                    {hero.twitch && (
                        <a href={hero.twitch} target="_blank" rel="noreferrer" className={iconStyle}>
                            <FaTwitch size={24} />
                        </a>
                    )}
                </div>
            </div>

            {hero.profile_image && (
                <div className={imageContainerStyle}>
                    <img
                        src={hero.profile_image}
                        alt="Profile"
                        className={imageStyle}
                    />
                </div>
            )}
        </section>
    );
}
