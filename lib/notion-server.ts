import fs from 'fs';
import path from 'path';
import { Client } from '@notionhq/client';

export const notion = new Client({
    auth: process.env.NOTION_API_KEY,
    notionVersion: '2025-09-03',
});

export const ROOT_PAGE_ID = process.env.ROOT_PAGE_ID;

// Helper to fetch all pages from a database
async function fetchAllDatabasePages(databaseId: string) {
    let results: any[] = [];
    let cursor: string | undefined = undefined;
    do {
        const response: any = await (notion.databases as any).query({
            database_id: databaseId,
            start_cursor: cursor,
        });
        results.push(...response.results);
        cursor = response.next_cursor ?? undefined;
    } while (cursor);
    return results;
}

// Extract Key-Value pairs from a config database
async function fetchConfigKV(dbId: string) {
    if (!dbId) return {};
    const pages = await fetchAllDatabasePages(dbId);
    const data: Record<string, any> = {};

    for (const page of pages) {
        if (!('properties' in page)) continue;
        const props = page.properties;

        // Assume "Name" (Title) and "Value" (RichText)
        // Adjust property access based on your specific Notion schema types if they differ
        const key = props.Name?.title?.[0]?.plain_text;
        if (!key) continue;

        const val = props.Value?.rich_text?.[0]?.plain_text || '';

        // Naivety: We don't handle file downloads here for "Refresh" to keep it fast.
        // If "Value" is empty and there's a file, we could potentially keep the existing local value 
        // or just fetch the raw URL. For now, let's treat text as source of truth.
        data[key] = val;
    }
    return data;
}

// Main function to pull config and update local files
export async function pullConfigFromNotion(onProgress?: (msg: string) => void) {
    const log = (msg: string) => onProgress?.(msg);

    if (!ROOT_PAGE_ID) {
        log('Error: ROOT_PAGE_ID not defined');
        return;
    }

    try {
        log('Finding Root Page...');
        const homePageId = await findPageByName(ROOT_PAGE_ID, 'Home Page');
        const configDbId = await findInlineDb(ROOT_PAGE_ID, 'Config');

        // 1. Site Info
        if (configDbId) {
            log('Fetching Site Info...');
            const siteInfo = await fetchConfigKV(configDbId);
            const siteData = { info: siteInfo };

            const dataDir = path.join(process.cwd(), 'data');
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

            fs.writeFileSync(path.join(dataDir, 'site.json'), JSON.stringify(siteData, null, 2));
        } else {
            log('Warning: Config DB not found');
        }

        // 2. Home Page Sections
        if (homePageId) {
            log('Fetching Home Page Sections...');
            const sections: any = {};

            const heroDbId = await findInlineDb(homePageId, 'Hero Settings');
            if (heroDbId) {
                log('Fetching Hero Settings...');
                sections.hero = await fetchConfigKV(heroDbId);
            }

            const blogsDbId = await findInlineDb(homePageId, 'Blogs Settings');
            if (blogsDbId) {
                log('Fetching Blogs Settings...');
                sections.blogs = await fetchConfigKV(blogsDbId);
            }

            // Preserve existing structure logic (e.g. mapping textual YES/NO if needed, though app handles strings often)
            // The sync script maps specific keys. Let's trust generic KV for now, relying on TS interfaces to match.
            // CAUTION: The sync script handles nested objects like 'gallery' differently. 
            // For DevTools, we primarily care about the keys we edit (Hero, Blogs config).

            fs.writeFileSync(path.join(process.cwd(), 'data', 'home.json'), JSON.stringify(sections, null, 2));
        } else {
            log('Warning: Home Page not found');
        }

        log('Config Refresh Complete.');

    } catch (error: any) {
        log(`Error: ${error.message}`);
        console.error(error);
        throw error;
    }
}


/**
 * Helper to iterate through all blocks of a page/block to find a child by type and condition.
 * Naive implementation: Lists children of parentId.
 */
interface NotionBlock {
    id: string;
    type: string;
    [key: string]: any;
}

export async function findChildBlock(parentId: string, predicate: (block: any) => boolean): Promise<NotionBlock | null> {
    if (!parentId) return null;
    let cursor = undefined;
    do {
        const response: any = await notion.blocks.children.list({
            block_id: parentId,
            start_cursor: cursor,
        });
        for (const block of response.results) {
            if (predicate(block)) return block as NotionBlock;
        }
        cursor = response.next_cursor;
    } while (cursor);
    return null;
}

export async function findPageByName(parentId: string, name: string) {
    const block = await findChildBlock(parentId, (b) => b.type === 'child_page' && b.child_page.title === name);
    return block ? block.id : null;
}

export async function findInlineDb(parentId: string, title: string) {
    const block = await findChildBlock(parentId, (b) => b.type === 'child_database' && b.child_database.title === title);
    return block ? block.id : null;
}

/**
 * Helper to get the first Data Source ID from a Database ID.
 * Required for Notion API 2025-09-03+.
 */
/**
 * Helper to get the first Data Source ID from a Database ID.
 * Required for Notion API 2025-09-03+.
 */
export async function getDataSourceId(dbId: string): Promise<string | null> {
    try {
        const response: any = await notion.request({
            path: `databases/${dbId}`,
            method: 'get',
        });
        if (response.data_sources && response.data_sources.length > 0) {
            return response.data_sources[0].id;
        }
        return null;
    } catch (e) {
        console.error("Error fetching data source ID", e);
        return null;
    }
}

/**
 * Updates a page in an inline config database using a known Data Source ID.
 */
export async function updateConfigValueWithSourceId(dataSourceId: string, key: string, value: string) {
    if (!dataSourceId) return;

    // Query Data Source
    const response: any = await notion.request({
        path: `data_sources/${dataSourceId}/query`,
        method: 'post',
        body: {
            filter: {
                property: 'Name',
                title: {
                    equals: key,
                },
            },
        },
    });

    const page = response.results[0];

    if (page) {
        // Update existing page (standard Page API)
        await notion.pages.update({
            page_id: page.id,
            properties: {
                Value: {
                    rich_text: [{ text: { content: value } }],
                },
            },
        });
    } else {
        // Create new page in Data Source
        await notion.request({
            path: 'pages',
            method: 'post',
            body: {
                parent: {
                    type: 'data_source_id',
                    data_source_id: dataSourceId
                },
                properties: {
                    Name: { title: [{ text: { content: key } }] },
                    Value: { rich_text: [{ text: { content: value } }] },
                },
            }
        });
    }
}

/**
 * Legacy wrapper for single updates (fetches ID every time).
 */
export async function updateConfigValue(dbId: string, key: string, value: string) {
    if (!dbId) return;
    const dataSourceId = await getDataSourceId(dbId);
    if (!dataSourceId) {
        console.error(`No data source found for database ${dbId}`);
        return;
    }
    await updateConfigValueWithSourceId(dataSourceId, key, value);
}

import { HomeData } from './data';

type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type PartialConfig = DeepPartial<HomeData>;

export async function updateNotionConfig(config: PartialConfig) {
    if (!ROOT_PAGE_ID) {
        console.error('ROOT_PAGE_ID is not defined');
        return;
    }

    try {
        const homePageId = await findPageByName(ROOT_PAGE_ID, 'Home Page');
        const configDbId = await findInlineDb(ROOT_PAGE_ID, 'Config');

        const promises: Promise<void>[] = [];

        // 1. Site Info
        if (config.info && configDbId) {
            const configDataSourceId = await getDataSourceId(configDbId);
            if (configDataSourceId) {
                if (config.info.site_title) promises.push(updateConfigValueWithSourceId(configDataSourceId, 'site_title', config.info.site_title));
                if (config.info.default_theme) promises.push(updateConfigValueWithSourceId(configDataSourceId, 'default_theme', config.info.default_theme));
                if (config.info.sidebar_navigation !== undefined) promises.push(updateConfigValueWithSourceId(configDataSourceId, 'sidebar_navigation', String(config.info.sidebar_navigation)));
            }
        }

        // 2. Home Page Configs
        if (homePageId) {
            // Hero Settings
            if (config.hero) {
                const heroDbId = await findInlineDb(homePageId, 'Hero Settings');
                if (heroDbId) {
                    const heroDataSourceId = await getDataSourceId(heroDbId);
                    if (heroDataSourceId) {
                        const h = config.hero;
                        if (h.alignment) promises.push(updateConfigValueWithSourceId(heroDataSourceId, 'alignment', h.alignment));
                        if (h.tagline) promises.push(updateConfigValueWithSourceId(heroDataSourceId, 'tagline', h.tagline));

                        // Socials
                        const socialKeys = ['twitter', 'github', 'linkedin', 'email', 'instagram', 'youtube', 'facebook', 'twitch'] as const;
                        socialKeys.forEach(key => {
                            if (h[key] !== undefined) promises.push(updateConfigValueWithSourceId(heroDataSourceId, key, h[key]!));
                        });
                    }
                }
            }

            // Projects Settings
            if (config.projects) {
                const projDbId = await findInlineDb(homePageId, 'Projects Settings');
                if (projDbId) {
                    const projDataSourceId = await getDataSourceId(projDbId);
                    if (projDataSourceId) {
                        const p = config.projects;
                        if (p.title) promises.push(updateConfigValueWithSourceId(projDataSourceId, 'title', p.title));
                        if (p.show_section !== undefined) promises.push(updateConfigValueWithSourceId(projDataSourceId, 'show_section', String(p.show_section)));
                        if (p.view_type) promises.push(updateConfigValueWithSourceId(projDataSourceId, 'view_type', p.view_type));
                    }
                }
            }

            // Blogs Settings
            if (config.blogs) {
                const blogsDbId = await findInlineDb(homePageId, 'Blogs Settings');
                if (blogsDbId) {
                    const blogsDataSourceId = await getDataSourceId(blogsDbId);
                    if (blogsDataSourceId) {
                        const b = config.blogs;
                        if (b.title) promises.push(updateConfigValueWithSourceId(blogsDataSourceId, 'title', b.title));
                        if (b.show_section !== undefined) promises.push(updateConfigValueWithSourceId(blogsDataSourceId, 'show_section', String(b.show_section)));
                        if (b.view_type) promises.push(updateConfigValueWithSourceId(blogsDataSourceId, 'view_type', b.view_type));
                        if (b.show_images !== undefined) promises.push(updateConfigValueWithSourceId(blogsDataSourceId, 'show_images', String(b.show_images)));
                    }
                }
            }

            // Gallery Settings
            if (config.gallery) {
                const galleryDbId = await findInlineDb(homePageId, 'Gallery Settings');
                if (galleryDbId) {
                    const galleryDataSourceId = await getDataSourceId(galleryDbId);
                    if (galleryDataSourceId) {
                        const g = config.gallery;
                        if (g.title) promises.push(updateConfigValueWithSourceId(galleryDataSourceId, 'title', g.title));
                        if (g.show_section !== undefined) promises.push(updateConfigValueWithSourceId(galleryDataSourceId, 'show_section', String(g.show_section)));
                    }
                }
            }
        }

        await Promise.all(promises);

    } catch (error) {
        console.error('Failed to update Notion:', error);
        throw error; // Rethrow to let API know
    }
}
