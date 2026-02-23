import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Re-export all types so existing imports from '@/lib/data' continue to work
export type {
    InfoConfig,
    InfoSectionData,
    DynamicSectionData,
    HtmlSectionData,
    IframeSectionData,
    VideoEmbedSectionData,
    MediaSectionData,
    MailtoSectionData,
    NewsletterSectionData,
    SectionData,
    HomeData,
    Post,
    GalleryItem,
    Author,
    CollectionSettings,
    NavbarPageData,
    AdvancedConfig,
} from './types';

import type {
    HomeData,
    Post,
    Author,
    CollectionSettings,
    SectionData,
    NavbarPageData,
    AdvancedConfig,
} from './types';

const contentDirectory = path.join(process.cwd(), 'notion_state/content');
const dataDirectory = path.join(process.cwd(), 'notion_state/data');

function safeJsonParse<T>(filePath: string, fallback: T): T {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch {
        return fallback;
    }
}

export function getHomeData(): HomeData {
    const fullPath = path.join(dataDirectory, 'home.json');
    if (fs.existsSync(fullPath)) {
        const homeData = safeJsonParse(fullPath, {} as HomeData);

        const sitePath = path.join(dataDirectory, 'site.json');
        if (fs.existsSync(sitePath)) {
            const siteData = safeJsonParse(sitePath, {});
            return { ...homeData, ...siteData };
        }
        return homeData;
    }
    return {} as HomeData;
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
                video_embed_url: data.video_embed_url || '',
                status: data.status || 'published',
                tags: data.tags || [],
                ...data,
            } as Post;
        })
        .filter((post) => post.status === 'published');

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
        description: data.description || data.summary || '',
        tools: data.tools || '',
        cover: data.cover,
        thumbnail: data.thumbnail,
        image: data.image,
        link: data.link,
        collection: section,
        order_priority: data.order_priority ?? data.order ?? 0,
        author_username: data.author_username || '',
        video_embed_url: data.video_embed_url || '',
        status: data.status || 'published',
        tags: data.tags || [],
        ...data,
    } as Post;
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

export function getNavbarPage(slug: string): NavbarPageData | null {
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
        sections: data.sections || [],
        ...data,
    } as NavbarPageData;
}

// --- Extra Sections for Collection Pages ---

export function getExtraSections(collectionName: string): SectionData[] {
    const fullPath = path.join(dataDirectory, 'extra_sections.json');
    if (!fs.existsSync(fullPath)) return [];
    const data = safeJsonParse<Record<string, SectionData[]>>(fullPath, {});
    return data[collectionName.toLowerCase()] || [];
}

// --- Authors ---

export function getAuthors(): Author[] {
    const fullPath = path.join(dataDirectory, 'authors.json');
    if (!fs.existsSync(fullPath)) return [];
    return safeJsonParse(fullPath, []);
}

export function getAuthor(username: string): Author | null {
    const authors = getAuthors();
    return authors.find(a => a.username === username) || null;
}

// --- Collection Settings ---

export function getCollectionSettings(collectionName: string): CollectionSettings | null {
    const fullPath = path.join(dataDirectory, 'collection_settings.json');
    if (!fs.existsSync(fullPath)) return null;
    const settings = safeJsonParse<Record<string, CollectionSettings>>(fullPath, {});
    return settings[collectionName.toLowerCase()] || null;
}

export function getAllCollectionSettings(): Record<string, CollectionSettings> {
    const fullPath = path.join(dataDirectory, 'collection_settings.json');
    if (!fs.existsSync(fullPath)) return {};
    return safeJsonParse(fullPath, {});
}

// --- Code Injection ---

export function getCodeInjection(): string[] {
    const fullPath = path.join(dataDirectory, 'code_injection.json');
    if (!fs.existsSync(fullPath)) return [];
    return safeJsonParse(fullPath, []);
}

// --- CSS Injection ---

export function getCssInjection(): string[] {
    const fullPath = path.join(dataDirectory, 'css_injection.json');
    if (!fs.existsSync(fullPath)) return [];
    return safeJsonParse(fullPath, []);
}

// --- Advanced Config ---

export function getAdvancedConfig(): AdvancedConfig {
    const fullPath = path.join(dataDirectory, 'advanced_config.json');
    if (!fs.existsSync(fullPath)) return {};
    return safeJsonParse<AdvancedConfig>(fullPath, {});
}

// --- All Posts (for search) ---

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

// --- Get all collection names ---

export function getCollectionNames(): string[] {
    const contentDir = path.join(process.cwd(), 'notion_state/content');
    if (!fs.existsSync(contentDir)) return [];

    return fs.readdirSync(contentDir)
        .filter(f => fs.statSync(path.join(contentDir, f)).isDirectory())
        .filter(f => f !== 'navbarPages');
}

export function getAllTags(): string[] {
    const allPosts = getAllPosts();
    const tagSet = new Set<string>();
    for (const post of allPosts) {
        if (post.tags) {
            for (const tag of post.tags) {
                const name = typeof tag === 'string' ? tag : (tag as { name: string }).name;
                if (name) tagSet.add(name);
            }
        }
    }
    return Array.from(tagSet).sort();
}

export function getPostsByTag(tag: string): Post[] {
    const allPosts = getAllPosts();
    return allPosts.filter(post =>
        post.tags?.some(t => {
            const name = typeof t === 'string' ? t : (t as { name: string }).name;
            return name.toLowerCase() === tag.toLowerCase();
        })
    );
}
