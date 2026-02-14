import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'notion_state/content');
const dataDirectory = path.join(process.cwd(), 'notion_state/data');

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
    title: string;
    description: string;
    logo?: string;
    favicon: string;
    keywords: string;
    og_image: string;
    sidebar_navigation?: string;
    tagline?: string;
    default_theme?: 'light' | 'dark' | 'system';
    default_color_mode?: string;
    disable_logo_in_sidebar?: string;
    disable_logo_in_topbar?: string;
    social_github?: string;
    social_twitter?: string;
    social_linkedin?: string;
    social_email?: string;
    social_instagram?: string;
    social_youtube?: string;
    social_facebook?: string;
    social_twitch?: string;
    // New global config fields
    enable_newsletter?: string;
    mailchimp_form_link?: string;
    mention_this_tool_in_footer?: string;
    show_newsletter_section_on_home?: string;
}

export interface InfoSectionData {
    type: 'info_section';
    id: string;
    title: string;
    description: string;
    link?: string;
    image?: string;
    view_type?: 'col_centered_view' | 'col_left_view' | 'row_reverse_view' | 'row_view';
    visibility?: boolean;
}

export interface DynamicSectionData {
    type: 'dynamic_section';
    id: string;
    title: string;
    collection_name: string;
    view_type?: 'list_view' | 'card_view' | 'grid_view' | 'minimal_list_view';
    visibility?: boolean;
}

export type SectionData = InfoSectionData | DynamicSectionData;

export interface HomeData {
    info?: InfoConfig;
    sections: SectionData[];
}

export interface Post {
    slug: string;
    title: string;
    date: string;
    description: string;
    content: string;
    cover?: {
        image?: string;
        alt?: string;
    };
    thumbnail?: string;
    image?: string;
    link?: string;
    tools?: string;
    collection?: string;
    order_priority?: number;
    tags?: string[] | any[];
    author_username?: string;
    video_embed_link?: string;
}

export interface GalleryItem {
    slug: string;
    name: string;
    image: string;
    link?: string;
    content?: string;
}

export interface Author {
    name: string;
    username: string;
    email: string;
    description: string;
    picture: string;
    instagram_handle: string;
    x_handle: string;
    github_handle: string;
}

export interface CollectionSettings {
    collection_name: string;
    enable_rss: string;
    show_newsletter_section: string;
}

export function getHomeData(): HomeData {
    const fullPath = path.join(dataDirectory, 'home.json');
    if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const homeData = JSON.parse(fileContents);

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
                order_priority: data.order_priority || data.order || 0,
            };
        })
        .sort((a, b) => {
            // Higher order_priority = higher position (descending)
            if (a.order_priority !== b.order_priority) {
                return b.order_priority - a.order_priority;
            }
            return a.name.localeCompare(b.name);
        });
}

// Generic getPosts (can be used for any collection)
export function getPosts(section: string): Post[] {
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
                description: data.description || data.summary || '',
                tools: data.tools || '',
                cover: data.cover,
                thumbnail: data.thumbnail,
                image: data.image,
                link: data.link,
                collection: section,
                order_priority: data.order_priority ?? data.order ?? 0,
                author_username: data.author_username || '',
                video_embed_link: data.video_embed_link || '',
                ...data,
            } as Post;
        });

    // Sort posts: higher order_priority first, then by date descending
    return allPosts.sort((a, b) => {
        if (a.order_priority !== undefined && b.order_priority !== undefined && a.order_priority !== b.order_priority) {
            return (b.order_priority ?? 0) - (a.order_priority ?? 0);
        }
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getPost(slug: string, section: string): Post | null {
    const dirPath = path.join(contentDirectory, section);
    const fullPath = path.join(dirPath, `${slug}.md`);

    console.log(`[getPost] Checking path: ${fullPath}`);

    if (!fs.existsSync(fullPath)) {
        console.log(`[getPost] File does not exist: ${fullPath}`);
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug,
        content,
        title: data.title,
        date: data.date ? new Date(data.date).toISOString() : '',
        description: data.description || data.summary || '',
        tools: data.tools || '',
        cover: data.cover,
        thumbnail: data.thumbnail,
        link: data.link,
        order_priority: data.order_priority ?? data.order ?? 0,
        author_username: data.author_username || '',
        video_embed_link: data.video_embed_link || '',
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
    const { data, content } = matter(fileContents);

    return {
        slug,
        name: data.name,
        image: data.image,
        link: data.link,
        content, // Include content
    };
}

export function getNavbarPages(): { slug: string; title: string }[] {
    const pagesDir = path.join(contentDirectory, 'navbarPages');
    if (!fs.existsSync(pagesDir)) return [];

    const fileNames = fs.readdirSync(pagesDir);
    return fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(pagesDir, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);

            return {
                slug,
                title: data.title,
            };
        });
}

export function getNavbarPage(slug: string): Post | null {
    const dirPath = path.join(contentDirectory, 'navbarPages');
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
        description: data.description || '',
        ...data,
    } as Post;
}

// --- New: Authors ---

export function getAuthors(): Author[] {
    const fullPath = path.join(dataDirectory, 'authors.json');
    if (!fs.existsSync(fullPath)) return [];

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents);
}

export function getAuthor(username: string): Author | null {
    const authors = getAuthors();
    return authors.find(a => a.username === username) || null;
}

// --- New: Collection Settings ---

export function getCollectionSettings(collectionName: string): CollectionSettings | null {
    const fullPath = path.join(dataDirectory, 'collection_settings.json');
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const settings = JSON.parse(fileContents);
    return settings[collectionName.toLowerCase()] || null;
}

export function getAllCollectionSettings(): Record<string, CollectionSettings> {
    const fullPath = path.join(dataDirectory, 'collection_settings.json');
    if (!fs.existsSync(fullPath)) return {};

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents);
}

// --- New: Code Injection ---

export function getCodeInjection(): string[] {
    const fullPath = path.join(dataDirectory, 'code_injection.json');
    if (!fs.existsSync(fullPath)) return [];

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents);
}

// --- New: All Posts (for search) ---

export function getAllPosts(): Post[] {
    const contentDir = path.join(process.cwd(), 'notion_state/content');
    if (!fs.existsSync(contentDir)) return [];

    const collections = fs.readdirSync(contentDir)
        .filter(f => fs.statSync(path.join(contentDir, f)).isDirectory())
        .filter(f => f !== 'navbarPages');

    const allPosts: Post[] = [];
    for (const collection of collections) {
        const posts = getPosts(collection);
        allPosts.push(...posts);
    }
    return allPosts;
}

// --- New: Get all collection names ---

export function getCollectionNames(): string[] {
    const contentDir = path.join(process.cwd(), 'notion_state/content');
    if (!fs.existsSync(contentDir)) return [];

    return fs.readdirSync(contentDir)
        .filter(f => fs.statSync(path.join(contentDir, f)).isDirectory())
        .filter(f => f !== 'navbarPages');
}
