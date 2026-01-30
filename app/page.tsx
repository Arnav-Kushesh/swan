import { getHomeData, getPosts, getGalleryItems } from '@/lib/data';
import { Hero } from '@/components/Hero';
import { ProjectList } from '@/components/ProjectList';
import { BlogList } from '@/components/BlogList';
import { GalleryList } from '@/components/GalleryList';

export default function Home() {
    const homeData = getHomeData();
    const projects = getPosts('projects');
    const blogs = getPosts('blogs');
    const galleryItems = getGalleryItems();
    const showSidebar = homeData.info?.sidebar_navigation === 'ENABLED';

    return (
        <main>
            {/* Contextual Hero: Only show if Sidebar is DISABLED */}
            {!showSidebar && <Hero hero={homeData.hero} />}

            {/* Gallery Section */}
            {homeData.gallery?.show_section === 'YES' && (
                <GalleryList items={galleryItems} title={homeData.gallery.title} />
            )}

            {homeData.projects.show_section === 'YES' && (
                <ProjectList
                    projects={projects}
                    title={homeData.projects.title}
                    viewType={homeData.projects.view_type}
                />
            )}

            {homeData.blogs.show_section !== 'NO' && (
                <BlogList
                    blogs={blogs}
                    title={homeData.blogs.title}
                    viewType={homeData.blogs.view_type}
                    showImages={homeData.blogs.show_images === 'YES' || homeData.blogs.show_images === true}
                />
            )}
        </main>
    );
}
