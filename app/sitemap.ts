import { MetadataRoute } from 'next';
import { getNavbarPages, getAllPosts, getAuthors, getCollectionNames } from '@/lib/data';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // 1. Root
    const root = {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    };

    // 2. Static Pages
    const pages = getNavbarPages().map((page) => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // 3. All collection posts
    const allPosts = getAllPosts().map((post) => ({
        url: `${baseUrl}/${post.collection}/${post.slug}`,
        lastModified: new Date(post.date || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // 4. Author pages
    const authors = getAuthors().map((author) => ({
        url: `${baseUrl}/author/${author.username}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // 5. RSS feeds
    const rssFeeds = getCollectionNames().map((name) => ({
        url: `${baseUrl}/rss/${name}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.3,
    }));

    return [root, ...pages, ...allPosts, ...authors, ...rssFeeds];
}
