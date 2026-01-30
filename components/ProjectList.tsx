import { css } from '@/styled-system/css';
import Link from 'next/link';
import { grid, flex } from '@/styled-system/patterns';
import { Post } from '@/lib/data';

interface ProjectListProps {
    projects: Post[];
    title?: string;
    viewType?: string;
}

export function ProjectList({ projects, title = 'Projects', viewType = 'Grid' }: ProjectListProps) {
    return (
        <section className={css({ py: '40px' })}>
            <h2
                className={css({
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    mb: '20px',
                    color: 'primary',
                })}
            >
                {title}
            </h2>
            <div
                className={
                    viewType === 'List'
                        ? flex({ direction: 'column', gap: '20px' })
                        : css({
                            display: 'grid',
                            gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
                            gap: '20px',
                        })
                }
            >
                {projects.map((project) => (
                    <Link
                        key={project.slug}
                        href={`/project/${project.slug}`}
                        className={css({
                            borderRadius: '8px',
                            bg: { base: 'white', _dark: '#121212' },
                            border: '1px solid token(colors.border.default)',
                            transition: 'all 0.2s',
                            display: 'block',
                            overflow: 'hidden',
                            _hover: {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            },
                        })}
                    >
                        {/* Image */}
                        {project.thumbnail && (
                            <div className={css({
                                height: viewType === 'List' ? '200px' : '180px',
                                overflow: 'hidden'
                            })}>
                                <img
                                    src={project.thumbnail}
                                    alt={project.title}
                                    className={css({ width: '100%', height: '100%', objectFit: 'cover' })}
                                />
                            </div>
                        )}
                        <div className={css({ p: '24px' })}>
                            <h3 className={css({ fontSize: '1.2rem', fontWeight: 'bold', mb: '8px', color: 'text.primary' })}>
                                {project.title}
                            </h3>
                            <p className={css({ fontSize: '0.95rem', color: 'text.secondary', mb: '12px', lineHeight: '1.5' })}>
                                {project.description}
                            </p>
                            <p className={css({ fontSize: '0.85rem', color: 'text.tertiary', mb: '16px', fontFamily: 'mono' })}>
                                {project.tools}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section >
    );
}
