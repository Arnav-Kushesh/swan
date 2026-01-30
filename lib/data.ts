import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');
const dataDirectory = path.join(process.cwd(), 'data');

// Re-export specific interfaces if needed for cleaner imports
export interface HeroConfig {
    tagline: string;
    long_bio: string;
    profile_image: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    email?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
    twitch?: string;
    alignment?: 'left' | 'center';
}

export interface BlogsConfig {
    title: string;
    show_section: string;
    view_type: string;
    show_images?: boolean | string;
}

export interface InfoConfig {
    site_title: string;
    site_description: string;
    favicon: string;
    keywords: string;
    og_image: string;
    sidebar_navigation?: string;
    default_theme?: 'light' | 'dark' | 'system';
}

export interface HomeData {
    hero: HeroConfig;
    projects: {
        title: string;
        show_section: string;
        view_type: string;
    };
    blogs: BlogsConfig;
    gallery: {
        title: string;
        show_section: string;
    };
    info: InfoConfig;
}

export interface Post {
    slug: string;
    title: string;
    date: string;
    summary: string;
    content: string;
    cover?: {
        image?: string;
        alt?: string;
    };
    thumbnail?: string; // For projects
    link?: string; // For external project links
    description?: string; // For projects
    tools?: string; // For projects
}

export interface GalleryItem {
    slug: string;
    name: string;
    image: string;
    link?: string;
}

export function getHomeData(): HomeData {
    const fullPath = path.join(dataDirectory, 'home.json');
    if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const homeData = JSON.parse(fileContents);

        // Load side-wide info as well which might be in a separate file or merged
        const sitePath = path.join(dataDirectory, 'site.json');
        if (fs.existsSync(sitePath)) {
            const siteFile = fs.readFileSync(sitePath, 'utf8');
            const siteData = JSON.parse(siteFile);
            return { ...homeData, ...siteData };
        }
        return homeData;
    }
    return {} as HomeData;
}

export function getGalleryItems(): GalleryItem[] {
    const dirPath = path.join(contentDirectory, 'gallery');
    if (!fs.existsSync(dirPath)) return [];

    const fileNames = fs.readdirSync(dirPath);
    return fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(dirPath, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);

            return {
                slug,
                name: data.name,
                image: data.image,
                link: data.link,
            };
        });
}

export function getPosts(section: 'projects' | 'blogs'): Post[] {
    const dirPath = path.join(contentDirectory, section);
    if (!fs.existsSync(dirPath)) return [];

    const fileNames = fs.readdirSync(dirPath);
    const allPosts = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(dirPath, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                content,
                title: data.title,
                date: data.date ? new Date(data.date).toISOString() : '',
                summary: data.summary || '',
                description: data.description || '',
                tools: data.tools || '',
                cover: data.cover,
                thumbnail: data.thumbnail,
                link: data.link,
                ...data,
            } as Post;
        });

    // Sort posts by date
    return allPosts.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getPost(slug: string, section: 'projects' | 'blogs'): Post | null {
    const dirPath = path.join(contentDirectory, section);
    const fullPath = path.join(dirPath, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug,
        content,
        title: data.title,
        date: data.date ? new Date(data.date).toISOString() : '',
        summary: data.summary || '',
        description: data.description || '',
        tools: data.tools || '',
        cover: data.cover,
        thumbnail: data.thumbnail,
        link: data.link,
        ...data,
    } as Post;
}

export function getGalleryItem(slug: string): GalleryItem | null {
    const dirPath = path.join(contentDirectory, 'gallery');
    const fullPath = path.join(dirPath, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
        slug,
        name: data.name,
        image: data.image,
        link: data.link,
    };
}

export function getPages(): { slug: string; title: string }[] {
    // Pages are at root of content directory
    if (!fs.existsSync(contentDirectory)) return [];

    const fileNames = fs.readdirSync(contentDirectory);
    return fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(contentDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);

            return {
                slug,
                title: data.title,
            };
        });
}
