
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load .env
dotenv.config({ path: '.env' });

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });
const ROOT_PAGE_ID = process.env.ROOT_PAGE_ID;

if (!process.env.NOTION_API_KEY || !ROOT_PAGE_ID) {
    console.error("Missing NOTION_API_KEY or ROOT_PAGE_ID");
    console.log("Please ensure .env exists and is populated.");
    process.exit(1);
}

console.log("DEBUG: Checking Notion Client...");
console.log("DEBUG: notion.databases keys:", Object.keys(notion.databases || {}));
console.log("DEBUG: notion.databases.query type:", typeof notion.databases?.query);


// Helpers
const slugify = (text) => text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}

async function downloadImage(url, filename) {
    if (!url) return '';
    try {
        await ensureDir('public/images');
        const filepath = path.join('public/images', filename);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText} `);

        const buffer = Buffer.from(await response.arrayBuffer());
        await fs.writeFile(filepath, buffer);

        console.log(`     -> Downloaded: ${filename} `);
        return `/images/${filename}`;
    } catch (error) {
        console.error(`     ! Failed to download ${filename}: `, error.message);
        return url; // Fallback to original URL
    }
}

// Custom Transformer for Content Images
n2m.setCustomTransformer('image', async (block) => {
    const { image } = block;
    const url = image.file?.url || image.external?.url;
    const caption = image.caption ? image.caption.map(c => c.plain_text).join("") : "";

    if (!url) {
        return "";
    }

    try {
        const urlBase = url.split('?')[0];
        const ext = path.extname(urlBase) || '.jpg';
        const filename = `content-${block.id}${ext}`;

        const localUrl = await downloadImage(url, filename);

        return `![${caption}](${localUrl})`;
    } catch (e) {
        console.warn(`    ! Failed to transform/download content image ${block.id}: ${e.message}`);
        return `![${caption}](${url})`; // Fallback to remote URL
    }
});

// Data Extractors
// Pagination Helpers
async function fetchAllChildren(blockId) {
    let results = [];
    let cursor = undefined;
    do {
        const response = await notion.blocks.children.list({
            block_id: blockId,
            start_cursor: cursor
        });
        results.push(...response.results);
        cursor = response.next_cursor;
    } while (cursor);
    return results;
}

async function fetchAllDatabasePages(databaseId, filter, sorts) {
    if (!databaseId) {
        console.warn("   ! fetchAllDatabasePages called with missing ID");
        return [];
    }
    let results = [];
    let cursor = undefined;

    if (typeof fetch === 'undefined') {
        throw new Error("Global fetch not found. Please use Node.js 18+");
    }

    do {
        const body = {
            start_cursor: cursor,
        };
        if (filter) body.filter = filter;
        if (sorts) body.sorts = sorts;

        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Notion API Query Failed: ${response.status} ${response.statusText} - ${err}`);
        }

        const data = await response.json();
        results.push(...data.results);
        cursor = data.next_cursor;
    } while (cursor);
    return results;
}

// Data Extractors
async function getPageByName(parentId, name) {
    const children = await fetchAllChildren(parentId);

    for (const block of children) {
        if (block.type === 'child_page' && block.child_page.title === name) {
            return block.id;
        }
    }
    return null;
}

// Find Inline DB directly on Page

async function fetchConfigKV(dbId, prefix = 'config') {
    if (!dbId) return {};
    const pages = await fetchAllDatabasePages(dbId);
    const data = {};
    for (const page of pages) {
        const props = page.properties;
        const key = props.Name?.title?.[0]?.plain_text;
        if (!key) continue;

        let val = props.Value?.rich_text?.[0]?.plain_text || '';

        if (props.Media?.files?.length > 0) {
            const rawUrl = props.Media.files[0].file?.url || props.Media.files[0].external?.url;
            if (rawUrl) {
                const ext = path.extname(rawUrl.split('?')[0]) || '.jpg';
                const filename = `${prefix}-${slugify(key)}${ext}`;
                val = await downloadImage(rawUrl, filename);
            }
        }

        data[key] = val;
    }
    return data;
}

async function syncConfig() {
    console.log("Syncing General Configuration...");
    const settingsPageId = await getPageByName(ROOT_PAGE_ID, "Settings");
    if (!settingsPageId) {
        console.warn("Settings page not found!");
        return;
    }

    const configDbId = await findFullPageDb("General Configuration", settingsPageId);

    if (!configDbId) {
        console.warn("General Configuration database not found in Settings!");
        return;
    }

    const siteInfo = await fetchConfigKV(configDbId, 'site');

    const configData = {
        info: siteInfo
    };

    await ensureDir('notion_state/data');
    await fs.writeFile('notion_state/data/site.json', JSON.stringify(configData, null, 2));
}

async function findFullPageDb(name, parentId = ROOT_PAGE_ID) {
    const children = await fetchAllChildren(parentId);
    const db = children.find(b => b.type === 'child_database' && b.child_database.title === name);
    return db ? db.id : null;
}

// New Helper to fetch Info Section Data
async function fetchInfoSectionData(dbId) {
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    const data = {
        title: props.title?.title?.[0]?.plain_text || props.Title?.title?.[0]?.plain_text || '',
        description: props.description?.rich_text?.[0]?.plain_text || props.Description?.rich_text?.[0]?.plain_text || '',
        link: props.link?.url || props.Link?.url || '',
        view_type: props.view_type?.select?.name || props['View Type']?.select?.name || 'col_centered_view',
        visibility: props.visibility?.checkbox ?? true,
    };

    const imageProp = props.image?.files || props.Image?.files;
    if (imageProp?.length > 0) {
        const rawUrl = imageProp[0].file?.url || imageProp[0].external?.url;
        if (rawUrl) {
            const ext = path.extname(rawUrl.split('?')[0]) || '.jpg';
            const filename = `info-${dbId}-${slugify(data.title).slice(0, 20)}${ext}`;
            data.image = await downloadImage(rawUrl, filename);
        }
    }

    return data;
}

// New Helper to fetch Dynamic Section Data (Config only)
async function fetchDynamicSectionData(dbId) {
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    return {
        collection_name: props.collection_name?.title?.[0]?.plain_text || '',
        section_title: props.section_title?.rich_text?.[0]?.plain_text || '',
        view_type: props.view_type?.select?.name || 'list_view',
        visibility: props.visibility?.checkbox ?? true,
    };
}

// Helper to retrieve DB details with explicit version (to ensure properties)
async function fetchDatabaseDetails(databaseId) {
    if (typeof fetch === 'undefined') {
        throw new Error("Global fetch not found. Please use Node.js 18+");
    }
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Notion API Retrieve DB Failed: ${response.status} ${err}`);
    }
    return await response.json();
}

// Updated syncHomePage
async function syncHomePage() {
    console.log("Syncing Home Page...");
    const homePageId = await getPageByName(ROOT_PAGE_ID, "Home Page");
    if (!homePageId) {
        console.warn("Home Page not found!");
        return;
    }

    const sections = [];

    // Fetch all children
    const homeChildrenBlocks = await fetchAllChildren(homePageId);
    const databases = homeChildrenBlocks.filter(b => b.type === 'child_database');

    console.log(`   > Found ${databases.length} databases on Home Page.`);

    for (const dbBlock of databases) {
        const dbId = dbBlock.id;
        const dbTitle = dbBlock.child_database.title;

        console.log(`   > Processing: ${dbTitle}`);

        const dbDetails = await fetchDatabaseDetails(dbId);

        const props = dbDetails.properties || {};

        // Check for explicit section_type first
        const sectionType = props['section_type']?.select?.name || props['Section Type']?.select?.name;

        if (sectionType === 'dynamic_section') {
            const data = await fetchDynamicSectionData(dbId);
            if (data) {
                sections.push({
                    type: 'dynamic_section',
                    id: dbId,
                    title: data.section_title || dbTitle,
                    ...data
                });
            }
        } else if (sectionType === 'info_section') {
            const data = await fetchInfoSectionData(dbId);
            if (data) {
                sections.push({
                    type: 'info_section',
                    id: dbId,
                    title: dbTitle,
                    ...data
                });
            }
        } else {
            // Fallback to property check (legacy/inference)
            if (props['collection_name']) {
                const data = await fetchDynamicSectionData(dbId);
                if (data) {
                    sections.push({
                        type: 'dynamic_section',
                        id: dbId,
                        title: data.section_title || dbTitle,
                        ...data
                    });
                }
            } else if ((props['description'] && props['title']) || (props['Description'] && props['Title'])) {
                const data = await fetchInfoSectionData(dbId);
                if (data) {
                    sections.push({
                        type: 'info_section',
                        id: dbId,
                        title: dbTitle,
                        ...data
                    });
                }
            } else {
                console.log(`     ! Unknown database type: ${dbTitle}`);
            }
        }
    }

    const homeData = { sections };
    await ensureDir('notion_state/data');
    await fs.writeFile('notion_state/data/home.json', JSON.stringify(homeData, null, 2));
}


// Generic Collection Syncer
async function syncAllCollections() {
    console.log("Syncing All Collections...");
    const collectionsPageId = await getPageByName(ROOT_PAGE_ID, "Collections");
    if (!collectionsPageId) {
        console.warn("   ! Collections Page not found in Root");
        return;
    }

    const children = await fetchAllChildren(collectionsPageId);
    const databases = children.filter(b => b.type === 'child_database');

    console.log(`   > Found ${databases.length} collections.`);

    for (const dbBlock of databases) {
        const dbTitle = dbBlock.child_database.title;
        const dbId = dbBlock.id;
        const slug = slugify(dbTitle);

        console.log(`   > Syncing Collection: ${dbTitle} (${slug})...`);

        const pages = await fetchAllDatabasePages(dbId, undefined, [
            { property: 'order_priority', direction: 'descending' }
        ]);

        await ensureDir(`notion_state/content/${slug}`);

        for (const page of pages) {
            const mdBlocks = await n2m.pageToMarkdown(page.id);
            const mdString = n2m.toMarkdownString(mdBlocks);

            const props = page.properties;
            const itemTitle = props.Title?.title?.[0]?.plain_text || 'Untitled';
            const itemSlug = props.Slug?.rich_text?.[0]?.plain_text || slugify(itemTitle);

            // Image/Cover
            const rawImage = props.Image?.files?.[0]?.file?.url || props.Image?.files?.[0]?.external?.url;
            let image = '';
            if (rawImage) {
                const ext = path.extname(rawImage.split('?')[0]) || '.jpg';
                image = await downloadImage(rawImage, `${slug}-${itemSlug}${ext}`);
            }

            const tags = props.Tags?.multi_select?.map(o => o.name) || [];
            const link = props.Link?.url || '';
            const description = props.Description?.rich_text?.[0]?.plain_text || '';
            const order_priority = props.order_priority?.number || props.Order?.number || 0;
            const author_username = props.author_username?.rich_text?.[0]?.plain_text || '';
            const video_embed_link = props.video_embed_link?.url || '';

            const frontmatter = {
                slug: itemSlug,
                title: itemTitle,
                collection: slug,
                date: page.created_time,
                description,
                image,
                cover: { image: image, alt: itemTitle },
                thumbnail: image,
                tags,
                link,
                tools: tags.join(', '),
                order_priority,
                author_username,
                video_embed_link,
            };

            const fileContent = `---\n${JSON.stringify(frontmatter, null, 2)}\n---\n\n${mdString.parent}`;
            await fs.writeFile(`notion_state/content/${slug}/${itemSlug}.md`, fileContent);
        }
    }
}

async function syncNavbarPagesContainer() {
    console.log("Syncing Navbar Pages Container...");
    const pagesContainerId = await getPageByName(ROOT_PAGE_ID, "Navbar Pages");
    if (!pagesContainerId) {
        console.warn("Navbar Pages Container not found!");
        return;
    }

    const children = await fetchAllChildren(pagesContainerId);
    for (const block of children) {
        if (block.type === 'child_page') {
            const pageId = block.id;
            const title = block.child_page.title;
            const slug = slugify(title);

            console.log(`     - Fetching page: ${title}`);
            const mdBlocks = await n2m.pageToMarkdown(pageId);
            const mdString = n2m.toMarkdownString(mdBlocks);

            const frontmatter = {
                title,
                date: new Date().toISOString(),
                menu: "main"
            };

            const fileContent = `---\n${JSON.stringify(frontmatter, null, 2)}\n---\n\n${mdString.parent}`;
            await ensureDir('notion_state/content/navbarPages');
            await fs.writeFile(`notion_state/content/navbarPages/${slug}.md`, fileContent);
        }
    }
}

// --- New: Sync Authors ---
async function syncAuthors() {
    console.log("Syncing Authors...");
    const authorsDbId = await findFullPageDb("Authors");
    if (!authorsDbId) {
        console.warn("Authors database not found!");
        return;
    }

    const pages = await fetchAllDatabasePages(authorsDbId);
    const authors = [];

    for (const page of pages) {
        const props = page.properties;

        const name = props.name?.title?.[0]?.plain_text || '';
        const username = props.username?.rich_text?.[0]?.plain_text || '';
        const email = props.email?.email || '';
        const description = props.description?.rich_text?.[0]?.plain_text || '';
        const instagram_handle = props.instagram_handle?.rich_text?.[0]?.plain_text || '';
        const x_handle = props.x_handle?.rich_text?.[0]?.plain_text || '';
        const github_handle = props.github_handle?.rich_text?.[0]?.plain_text || '';

        let picture = '';
        const picFile = props.picture?.files?.[0];
        if (picFile) {
            const rawUrl = picFile.file?.url || picFile.external?.url;
            if (rawUrl) {
                const ext = path.extname(rawUrl.split('?')[0]) || '.jpg';
                picture = await downloadImage(rawUrl, `author-${slugify(username)}${ext}`);
            }
        }

        authors.push({
            name,
            username,
            email,
            description,
            picture,
            instagram_handle,
            x_handle,
            github_handle,
        });
    }

    await ensureDir('notion_state/data');
    await fs.writeFile('notion_state/data/authors.json', JSON.stringify(authors, null, 2));
}

// --- 5. Sync Collection Settings ---
async function syncCollectionSettings() {
    console.log("Syncing Configure Collections...");
    const settingsPageId = await getPageByName(ROOT_PAGE_ID, "Settings");
    if (!settingsPageId) {
        console.warn("Settings page not found!");
        return;
    }

    const collectionSettingsPageId = await getPageByName(settingsPageId, "Configure Collections");
    if (!collectionSettingsPageId) {
        console.warn("Configure Collections page not found in Settings!");
        return;
    }

    const children = await fetchAllChildren(collectionSettingsPageId);
    const databases = children.filter(b => b.type === 'child_database');

    const settings = {};

    for (const dbBlock of databases) {
        const pages = await fetchAllDatabasePages(dbBlock.id);
        for (const page of pages) {
            const props = page.properties;
            const collectionName = props.collection_name?.title?.[0]?.plain_text || '';
            if (!collectionName) continue;

            settings[collectionName.toLowerCase()] = {
                collection_name: collectionName,
                enable_rss: props.enable_rss?.checkbox ? 'true' : 'false',
                show_newsletter_section: props.show_newsletter_section?.checkbox ? 'true' : 'false',
            };
        }
    }

    await ensureDir('notion_state/data');
    await fs.writeFile('notion_state/data/collection_settings.json', JSON.stringify(settings, null, 2));
}

// --- New: Sync Code Injection ---
async function syncCodeInjection() {
    console.log("Syncing Code Injection...");
    const settingsPageId = await getPageByName(ROOT_PAGE_ID, "Settings");
    if (!settingsPageId) {
        console.warn("Settings page not found!");
        return;
    }

    const codeInjectionPageId = await getPageByName(settingsPageId, "Code");
    if (!codeInjectionPageId) {
        console.warn("Code Injection page not found in Settings!");
        return;
    }

    const children = await fetchAllChildren(codeInjectionPageId);
    const codeBlocks = children
        .filter(b => b.type === 'code')
        .map(b => b.code.rich_text.map(t => t.plain_text).join(''));

    await ensureDir('notion_state/data');
    await fs.writeFile('notion_state/data/code_injection.json', JSON.stringify(codeBlocks, null, 2));
}


async function main() {
    try {
        await syncConfig();
        await syncHomePage();
        await syncNavbarPagesContainer();
        await syncAllCollections();
        await syncAuthors();
        await syncCollectionSettings();
        await syncCodeInjection();
        console.log("Completed sync.");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();
