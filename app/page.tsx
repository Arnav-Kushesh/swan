import { getHomeData, getPosts, getGalleryItems } from '@/lib/data';
import { Hero } from '@/components/Hero';
import { ProjectList } from '@/components/ProjectList';
import { BlogList } from '@/components/BlogList';
import { GalleryList } from '@/components/GalleryList';
import { css, cva } from '@/styled-system/css';
import { flex, container } from '@/styled-system/patterns';

export default function Home() {
    const homeData = getHomeData();
    const projects = getPosts('projects');
    const blogs = getPosts('blogs');
    const galleryItems = getGalleryItems();
    const showSidebar = homeData.info.sidebar_navigation === 'true';

    return (
        <main className={css({ pb: '100px' })}>
            {/* Contextual Hero: Only show if Sidebar is DISABLED */}
            {!showSidebar && <Hero hero={homeData.hero} />}

            {/* Gallery Section */}
            {homeData.gallery?.show_section === 'true' && (
                <div id="gallery" className={container({ py: '40px' })}>
                    <GalleryList items={galleryItems} title={homeData.gallery?.title || "Gallery"} />
                </div>
            )}

            {homeData.projects.show_section === 'true' && (
                <div id="projects" className={container({ py: '40px' })}>
                    <ProjectList
                        projects={projects}
                        title={homeData.projects.title || "Projects"}
                        viewType={homeData.projects.view_type as 'Grid' | 'List'}
                    />
                </div>
            )}

            {homeData.blogs.show_section !== 'false' && (
                <BlogList
                    blogs={blogs}
                    title={homeData.blogs.title}
                    viewType={homeData.blogs.view_type}
                    showImages={homeData.blogs.show_images === 'true'}
                />
            )}
        </main>
    );
}
