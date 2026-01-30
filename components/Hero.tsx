import { css } from '@/styled-system/css';
import { flex } from '@/styled-system/patterns';
import { Github, Linkedin, Mail, Twitter, Instagram, Youtube, Facebook, Twitch } from 'lucide-react';
import { HomeData } from '@/lib/data';

export function Hero({ hero }: { hero: HomeData['hero'] }) {
    const alignment = hero.alignment || 'center';
    const isLeftAligned = alignment === 'left';

    return (
        <section
            className={flex({
                direction: 'column-reverse', // Always stack: Image on top (DOM order is text, image -> reverse puts image top)
                align: 'center', // Default align
                justify: 'center',
                py: '60px',
                gap: '40px',
                textAlign: isLeftAligned ? 'left' : 'center',
                // For left alignment, we want the container to be aligned, but individual items need to be handled
                maxWidth: '800px', // Limit width for better reading
                mx: 'auto', // Centered container
                alignItems: isLeftAligned ? 'flex-start' : 'center',
            })}
        >
            <div className={flex({
                direction: 'column',
                align: isLeftAligned ? 'flex-start' : 'center',
                flex: 1,
                width: '100%' // Ensure full width for left alignment to work visually in container
            })}>
                <h1
                    className={css({
                        fontSize: { base: '2.5rem', md: '3.5rem' },
                        fontWeight: '800',
                        lineHeight: '1.2',
                        mb: '16px',
                        color: 'text.primary',
                    })}
                >
                    {hero.tagline}
                </h1>
                <p
                    className={css({
                        fontSize: '1.2rem',
                        color: 'text.secondary',
                        lineHeight: '1.6',
                        maxWidth: '600px',
                        mb: '30px',
                    })}
                >
                    {hero.long_bio}
                </p>

                <div className={flex({ gap: '16px', justify: isLeftAligned ? 'flex-start' : 'center' })}>
                    {hero.twitter && (
                        <a
                            href={hero.twitter}
                            target="_blank"
                            rel="noreferrer"
                            className={css({ color: 'text.secondary', _hover: { color: 'text.primary' } })}
                        >
                            <Twitter size={24} />
                        </a>
                    )}
                    {hero.github && (
                        <a
                            href={hero.github}
                            target="_blank"
                            rel="noreferrer"
                            className={css({ color: 'text.secondary', _hover: { color: 'text.primary' } })}
                        >
                            <Github size={24} />
                        </a>
                    )}
                    {hero.linkedin && (
                        <a
                            href={hero.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className={css({ color: 'text.secondary', _hover: { color: 'text.primary' } })}
                        >
                            <Linkedin size={24} />
                        </a>
                    )}
                    {hero.email && (
                        <a
                            href={`mailto:${hero.email}`}
                            className={css({ color: 'text.secondary', _hover: { color: 'text.primary' } })}
                        >
                            <Mail size={24} />
                        </a>
                    )}
                    {hero.instagram && (
                        <a
                            href={hero.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className={css({ color: 'text.secondary', _hover: { color: 'text.primary' } })}
                        >
                            <Instagram size={24} />
                        </a>
                    )}
                    {hero.youtube && (
                        <a
                            href={hero.youtube}
                            target="_blank"
                            rel="noreferrer"
                            className={css({ color: 'text.secondary', _hover: { color: 'text.primary' } })}
                        >
                            <Youtube size={24} />
                        </a>
                    )}
                    {hero.facebook && (
                        <a
                            href={hero.facebook}
                            target="_blank"
                            rel="noreferrer"
                            className={css({ color: 'text.secondary', _hover: { color: 'text.primary' } })}
                        >
                            <Facebook size={24} />
                        </a>
                    )}
                    {hero.twitch && (
                        <a
                            href={hero.twitch}
                            target="_blank"
                            rel="noreferrer"
                            className={css({ color: 'text.secondary', _hover: { color: 'text.primary' } })}
                        >
                            <Twitch size={24} />
                        </a>
                    )}
                </div>
            </div>

            {hero.profile_image && (
                <div
                    className={css({
                        width: { base: '140px', md: '180px' }, // Further reduced size
                        height: { base: '140px', md: '180px' },
                        borderRadius: 'full',
                        overflow: 'hidden',
                        border: '4px solid token(colors.bg.secondary)',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                    })}
                >
                    <img
                        src={hero.profile_image}
                        alt="Profile"
                        className={css({
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        })}
                    />
                </div>
            )}
        </section>
    );
}

const iconStyle = css({
    color: 'text.secondary',
    transition: 'color 0.2s',
    cursor: 'pointer',
    _hover: {
        color: 'primary',
    },
});
