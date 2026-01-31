import { getPost, getPosts } from '@/lib/data';
import { css } from '@/styled-system/css';
import { notFound } from 'next/navigation';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
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

const mainContainerStyle = container({ maxWidth: '4xl', py: '60px' });

const backLinkStyle = flex({
    align: 'center',
    gap: '8px',
    color: 'text.secondary',
    mb: '30px',
    _hover: { color: 'primary' },
});

const thumbnailContainerStyle = css({
    mb: '30px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    border: '1px solid token(colors.border.default)',
});

const thumbnailStyle = css({
    width: '100%',
    height: 'auto',
    display: 'block',
});

const headerContainerStyle = css({ mb: '40px' });

const titleStyle = css({
    fontSize: { base: '2.5rem', md: '3.5rem' },
    fontWeight: '800',
    lineHeight: '1.2',
    mb: '16px',
    color: 'text.primary',
});

const descriptionStyle = css({
    fontSize: '1.2rem',
    color: 'text.secondary',
    mb: '24px',
    maxWidth: '700px',
});

const toolsContainerStyle = flex({ gap: '10px', wrap: 'wrap', mb: '30px' });

const toolBadgeStyle = css({
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'text.primary',
    bg: 'bg.secondary',
    px: '12px',
    py: '6px',
    borderRadius: 'full',
    border: '1px solid token(colors.border.secondary)',
});

const linksContainerStyle = flex({ gap: '16px', wrap: 'wrap', mb: '40px' });

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



const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHtml)
    .process(project.content);
const contentHtml = processedContent.toString();

return (
    <main className={mainContainerStyle}>
        <Link
            href="/"
            className={backLinkStyle}
        >
            <ArrowLeft size={20} />
            Back to Home
        </Link>

        <article>
            {project.thumbnail && (
                <div className={thumbnailContainerStyle}>
                    <img
                        src={project.thumbnail}
                        alt={project.title}
                        className={thumbnailStyle}
                    />
                </div>
            )}

            <div className={headerContainerStyle}>
                <h1 className={titleStyle}>
                    {project.title}
                </h1>
                <p className={descriptionStyle}>
                    {project.description}
                </p>

            </div>

            {project.tools && (
                <div className={toolsContainerStyle}>
                    {project.tools.split(',').map((tool) => (
                        <span
                            key={tool}
                            className={toolBadgeStyle}
                        >
                            {tool.trim()}
                        </span>
                    ))}
                </div>
            )}
            <br />
            <div className={linksContainerStyle}>


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
                className={contentStyle}
                dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
        </article>
    </main>
);
}

const contentStyle = css({
    '& > *': { mb: '20px' },
    '& h1': {
        fontSize: '2rem', // Smaller than main title but distinct
        fontWeight: 'bold',
        mt: '40px',
        mb: '20px',
        color: 'text.primary',
    },
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
    '& h4, & h5, & h6': {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        mt: '24px',
        mb: '12px',
        color: 'text.primary',
    },
    '& p': {
        fontSize: '1.1rem',
        lineHeight: '1.8',
        color: 'text.primary',
    },
    '& ul': {
        pl: '20px',
        ml: '20px',
        mb: '20px',
        listStyleType: 'disc',
    },
    '& ol': {
        pl: '20px',
        ml: '20px',
        mb: '20px',
        listStyleType: 'decimal',
    },
    '& li': {
        mb: '8px',
        color: 'text.primary',
        fontSize: '1.1rem',
        lineHeight: '1.8',
    },
    '& strong, & b': {
        fontWeight: 'bold',
    },
    '& em, & i': {
        fontStyle: 'italic',
    },
    '& blockquote': {
        borderLeft: '4px solid token(colors.primary)',
        pl: '20px',
        fontStyle: 'italic',
        color: 'text.secondary',
        my: '30px',
        bg: 'bg.secondary',
        py: '12px',
        borderRadius: '0 8px 8px 0',
    },
    '& pre': {
        bg: 'bg.secondary',
        p: '20px',
        borderRadius: '8px',
        overflowX: 'auto',
        fontSize: '0.9rem',
        fontFamily: 'monospace',
    },
    '& code': {
        bg: 'bg.tertiary',
        px: '6px',
        py: '2px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '0.9em',
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
        my: '20px',
    },
    '& table': {
        width: '100%',
        borderCollapse: 'collapse',
        my: '24px',
        fontSize: '1rem',
    },
    '& th': {
        textAlign: 'left',
        py: '12px',
        px: '16px',
        bg: 'bg.secondary',
        fontWeight: 'bold',
        borderBottom: '2px solid token(colors.border.default)',
    },
    '& td': {
        py: '12px',
        px: '16px',
        borderBottom: '1px solid token(colors.border.default)',
    },
    '& hr': {
        border: 'none',
        borderTop: '1px solid token(colors.border.default)',
        my: '40px',
    }
});
