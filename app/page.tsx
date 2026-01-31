import { getHomeData, getPosts, getGalleryItems } from '@/lib/data';
import { Hero } from '@/components/Hero';
import { ProjectList } from '@/components/ProjectList';
import { BlogList } from '@/components/BlogList';
import { GalleryList } from '@/components/GalleryList';
import { css } from '@/styled-system/css';
import { container } from '@/styled-system/patterns';

const mainStyle = css({ pb: '100px' });
const sectionContainerStyle = container({ py: '60px' });

export default function Home() {
    const homeData = getHomeData();
    const projects = getPosts('projects');
    const blogs = getPosts('blogs');
    const galleryItems = getGalleryItems();
    const showSidebar = homeData.info.sidebar_navigation === 'true';

    return (
        <main className={mainStyle}>
            {/* Contextual Hero: Only show if Sidebar is DISABLED */}
            {!showSidebar && <Hero hero={homeData.hero} />}

            {/* Dynamic Section Ordering */}
            {(homeData.section_order || ['gallery', 'projects', 'blogs']).map((section) => {
                switch (section) {
                    case 'gallery':
                        return homeData.gallery?.show_section === 'true' ? (
                            <div key="gallery" id="gallery" className={sectionContainerStyle}>
                                <GalleryList items={galleryItems} title={homeData.gallery?.title || "Gallery"} />
                            </div>
                        ) : null;
                    case 'projects':
                        return homeData.projects.show_section === 'true' ? (
                            <div key="projects" id="projects" className={sectionContainerStyle}>
                                <ProjectList
                                    projects={projects}
                                    title={homeData.projects.title || "Projects"}
                                    viewType={homeData.projects.view_type as 'Grid' | 'List'}
                                />
                            </div>
                        ) : null;
                    case 'blogs':
                        return homeData.blogs.show_section !== 'false' ? (
                            <div key="blogs" id="blogs" className={sectionContainerStyle}>
                                <BlogList
                                    blogs={blogs}
                                    title={homeData.blogs.title}
                                    viewType={homeData.blogs.view_type}
                                    showImages={homeData.blogs.show_images === 'true'}
                                />
                            </div>
                        ) : null;
                    default:
                        return null;
                }
            })}
        </main>
    );
}
