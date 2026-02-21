import { getNavbarPages, getNavbarPage, getHomeData } from '@/lib/data';
import { processMarkdown } from '@/lib/markdown';
import { postContentStyle } from '@/components/shared/post-styles';
import { SectionRenderer } from '@/components/SectionRenderer';
import { notFound } from 'next/navigation';
import { css } from '@/styled-system/css';
import { Metadata } from 'next';

export const dynamicParams = false;

export async function generateStaticParams() {
    const pages = getNavbarPages();
    return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = getNavbarPage(slug);
    if (!post) return {};
    return {
        title: post.title,
        description: post.description,
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getNavbarPage(slug);

    if (!post) {
        notFound();
    }

    const content = await processMarkdown(post.content);
    const sections = (post.sections || []).filter(s => s.enabled !== false);
    const homeData = getHomeData();

    return (
        <article className={css({ maxWidth: '800px', margin: '0 auto', py: '40px', px: '20px', minHeight: '60vh' })}>
            <header className={css({ mb: '40px', textAlign: 'center' })}>
                <h1 className={css({
                    fontSize: { base: '2rem', md: '2.5rem' },
                    fontWeight: '800',
                    letterSpacing: '-0.03em',
                    lineHeight: '1.15',
                    color: 'text.primary',
                })}>
                    {post.title}
                </h1>
            </header>

            <div
                className={postContentStyle}
                dangerouslySetInnerHTML={{ __html: content }}
            />

            {sections.length > 0 && (
                <div className={css({ mt: '40px', display: 'flex', flexDirection: 'column', gap: '0' })}>
                    {sections.map((section) => (
                        <SectionRenderer key={section.id} section={section} mailchimpFormLink={homeData.info?.mailchimp_form_link} />
                    ))}
                </div>
            )}
        </article>
    );
}
