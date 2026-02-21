import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'notion_state/content');
const dataDirectory = path.join(process.cwd(), 'notion_state/data');

export interface InfoConfig {
    title: string;
    description: string;
    logo?: string;
    favicon?: string;
    keywords?: string;
    og_image?: string;
    sidebar_navigation?: string;
    tagline?: string;
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
    enable_newsletter?: string;
    mailchimp_form_link?: string;
    mention_this_tool_in_footer?: string;
    primary_font?: string;
    secondary_font?: string;
}

export interface InfoSectionData {
    type: 'info_section';
    id: string;
    title: string;
    description: string;
    link?: string;
    button_text?: string;
    image?: string;
    view_type?: 'col_centered_view' | 'col_left_view' | 'row_reverse_view' | 'row_view';
    media_aspect_ratio?: string;
    media_mobile_width?: string;
    media_desktop_width?: string;
    enabled?: boolean;
}

export interface DynamicSectionData {
    type: 'dynamic_section';
    id: string;
    title: string;
    description?: string;
    collection_name: string;
    view_type?: 'list_view' | 'card_view' | 'grid_view' | 'minimal_list_view' | 'tiny_card_view' | 'big_card_view';
    items_shown_at_once?: number;
    top_section_centered?: boolean;
    enabled?: boolean;
}

export interface HtmlSectionData {
    type: 'html_section';
    id: string;
    title: string;
    html_code: string;
    height?: number;
    full_width?: boolean;
    enabled?: boolean;
}

export interface IframeSectionData {
    type: 'iframe_section';
    id: string;
    title: string;
    url: string;
    height?: number;
    full_width?: boolean;
    enabled?: boolean;
}

export interface VideoEmbedSectionData {
    type: 'video_embed_section';
    id: string;
    title: string;
    url: string;
    enabled?: boolean;
}

export interface MediaSectionData {
    type: 'media_section';
    id: string;
    title: string;
    media?: string;
    height?: number;
    height_on_mobile?: number;
    height_on_desktop?: number;
    full_width?: boolean;
    enabled?: boolean;
}

export interface MailtoSectionData {
    type: 'mailto_section';
    id: string;
    title: string;
    subject: string;
    receiver: string;
    placeholder_text?: string;
    button_text?: string;
    enabled?: boolean;
}

export interface NewsletterSectionData {
    type: 'newsletter_section';
    id: string;
    title: string;
    enabled?: boolean;
}

export type SectionData = InfoSectionData | DynamicSectionData | HtmlSectionData | IframeSectionData | VideoEmbedSectionData | MediaSectionData | MailtoSectionData | NewsletterSectionData;

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
    button_text?: string;
    tools?: string;
    collection?: string;
    order_priority?: number;
    tags?: string[];
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
    show_mailto_comment_section: string;
}

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
                video_embed_link: data.video_embed_link || '',
                tags: data.tags || [],
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
        video_embed_link: data.video_embed_link || '',
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

export interface NavbarPageData extends Post {
    sections?: SectionData[];
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

// --- New: Extra Sections for Collection Pages ---

export function getExtraSections(collectionName: string): SectionData[] {
    const fullPath = path.join(dataDirectory, 'extra_sections.json');
    if (!fs.existsSync(fullPath)) return [];
    const data = safeJsonParse<Record<string, SectionData[]>>(fullPath, {});
    return data[collectionName.toLowerCase()] || [];
}

// --- New: Authors ---

export function getAuthors(): Author[] {
    const fullPath = path.join(dataDirectory, 'authors.json');
    if (!fs.existsSync(fullPath)) return [];
    return safeJsonParse(fullPath, []);
}

export function getAuthor(username: string): Author | null {
    const authors = getAuthors();
    return authors.find(a => a.username === username) || null;
}

// --- New: Collection Settings ---

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

// --- New: Code Injection ---

export function getCodeInjection(): string[] {
    const fullPath = path.join(dataDirectory, 'code_injection.json');
    if (!fs.existsSync(fullPath)) return [];
    return safeJsonParse(fullPath, []);
}

// --- New: CSS Injection ---

export function getCssInjection(): string[] {
    const fullPath = path.join(dataDirectory, 'css_injection.json');
    if (!fs.existsSync(fullPath)) return [];
    return safeJsonParse(fullPath, []);
}

// --- Advanced Config ---

export interface AdvancedConfig {
    limit_theme_selection?: string[];
}

export function getAdvancedConfig(): AdvancedConfig {
    const fullPath = path.join(dataDirectory, 'advanced_config.json');
    if (!fs.existsSync(fullPath)) return {};
    return safeJsonParse<AdvancedConfig>(fullPath, {});
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
