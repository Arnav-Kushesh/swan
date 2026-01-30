import { getPost, getPosts } from '@/lib/data';
import { css } from '@/styled-system/css';
import { notFound } from 'next/navigation';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import { flex, container } from '@/styled-system/patterns';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';

import { Metadata } from 'next';

export async function generateStaticParams() {
    const projects = getPosts('projects');
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = getPost(slug, 'projects');

    if (!project) {
        return {
            title: 'Project Not Found',
        };
    }

    return {
        title: project.title,
        description: project.description || project.summary,
        openGraph: {
            title: project.title,
            description: project.description || project.summary,
            images: project.thumbnail ? [{ url: project.thumbnail }] : [],
        },
    };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = getPost(slug, 'projects');

    if (!project) {
        notFound();
    }

    const processedContent = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(project.content);
    const contentHtml = processedContent.toString();

    return (
        <main className={container({ maxWidth: '4xl', py: '60px' })}>
            <Link
                href="/"
                className={flex({
                    align: 'center',
                    gap: '8px',
                    color: 'text.secondary',
                    mb: '30px',
                    _hover: { color: 'primary' },
                })}
            >
                <ArrowLeft size={20} />
                Back to Home
            </Link>

            <article>
                <div className={css({ mb: '40px' })}>
                    <h1
                        className={css({
                            fontSize: { base: '2.5rem', md: '3.5rem' },
                            fontWeight: '800',
                            lineHeight: '1.2',
                            mb: '16px',
                            color: 'text.primary',
                        })}
                    >
                        {project.title}
                    </h1>
                    <p
                        className={css({
                            fontSize: '1.2rem',
                            color: 'text.secondary',
                            mb: '24px',
                            maxWidth: '700px',
                        })}
                    >
                        {project.description}
                    </p>

                </div>

                {project.thumbnail && (
                    <div
                        className={css({
                            mb: '50px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                            border: '1px solid token(colors.border.default)',
                        })}
                    >
                        <img
                            src={project.thumbnail}
                            alt={project.title}
                            className={css({
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                            })}
                        />
                    </div>
                )}

                <div className={flex({ gap: '16px', wrap: 'wrap', mb: '40px' })}>
                    {project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className={buttonStyle}
                        >
                            <ExternalLink size={18} />
                            Visit Project
                        </a>
                    )}
                    {/* Assuming we might have a repo link in the future or reusing link if it's github */}
                    {project.link?.includes('github.com') && (
                        <a
                            href={project.link} // Duplicate for demo, but typically would be separate field
                            target="_blank"
                            rel="noreferrer"
                            className={secondaryButtonStyle}
                        >
                            <Github size={18} />
                            View Code
                        </a>
                    )}
                </div>

                <div
                    className={css({
                        '& > *': { mb: '20px' },
                        '& h2': {
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            mt: '40px',
                            mb: '20px',
                            color: 'text.primary',
                        },
                        '& h3': {
                            fontSize: '1.4rem',
                            fontWeight: 'bold',
                            mt: '30px',
                            mb: '16px',
                            color: 'text.primary',
                        },
                        '& p': {
                            fontSize: '1.1rem',
                            lineHeight: '1.8',
                            color: 'text.primary',
                        },
                        '& ul, & ol': {
                            pl: '20px',
                            ml: '20px',
                            mb: '20px',
                        },
                        '& li': {
                            mb: '8px',
                            color: 'text.primary',
                        },
                        '& a': {
                            color: 'primary',
                            textDecoration: 'underline',
                            _hover: { opacity: 0.8 },
                        },
                        '& img': {
                            borderRadius: '8px',
                            maxWidth: '100%',
                            height: 'auto',
                        }
                    })}
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
            </article>
        </main>
    );
}

const buttonStyle = css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    bg: 'text.primary', // Inverted for max contrast
    color: 'bg.primary',
    px: '20px',
    py: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    transition: 'opacity 0.2s',
    _hover: {
        opacity: 0.9,
    },
});

const secondaryButtonStyle = css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    bg: 'bg.secondary',
    color: 'text.primary',
    px: '20px',
    py: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    border: '1px solid token(colors.border.default)',
    transition: 'bg 0.2s',
    _hover: {
        bg: 'bg.tertiary',
    },
});
