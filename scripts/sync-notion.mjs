import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import fs from 'fs/promises';
import { existsSync, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import dotenv from 'dotenv';
import https from 'https';

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

        // Simple check: if file exists, we might skip. But Notion URLs expire, so we should re-download if it's a signed URL.
        // However, generic "Is this the same image?" is hard without hashing.
        // For static site generation, downloading every time is safer for correctness, but slower.
        // Let's download every time for now to ensure freshness.

        // NOTE: In a real app, you might check if the file exists and is recent, or hash the URL.

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

        const buffer = Buffer.from(await response.arrayBuffer());
        await fs.writeFile(filepath, buffer);

        console.log(`     -> Downloaded: ${filename}`);
        return `/images/${filename}`;
    } catch (error) {
        console.error(`     ! Failed to download ${filename}:`, error.message);
        return url; // Fallback to original URL
    }
}

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

async function fetchAllDatabasePages(databaseId, filter) {
    if (!databaseId) {
        console.warn("   ! fetchAllDatabasePages called with missing ID");
        return [];
    }
    let results = [];
    let cursor = undefined;

    // Check if global fetch is available (Node 18+)
    if (typeof fetch === 'undefined') {
        throw new Error("Global fetch not found. Please use Node.js 18+");
    }

    do {
        const body = {
            start_cursor: cursor,
        };
        if (filter) body.filter = filter;

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
    // This is naive, finding a child page by title requires iterating or search. 
    // Search is better but global. Let's try to search by parent + title if possible, 
    // or just list children and filter if it's a small site. 
    // For robust 'Config' finding, let's look at recent pages or assume structure.

    // Better approach: Use Search API restricted to immediate children if possible? No.
    // We will list children of ROOT.

    for (const block of children) {
        if (block.type === 'child_page' && block.child_page.title === name) {
            return block.id;
        }
    }
    return null;
}

// Find Inline DB directly on Page
async function findInlineDbOnPage(parentId, dbTitle) {
    const children = await fetchAllChildren(parentId);
    const db = children.find(b =>
        b.type === 'child_database' && b.child_database.title === dbTitle
    );
    return db ? db.id : null;
}

async function fetchConfigKV(dbId, prefix = 'config') {
    if (!dbId) return {};
    const pages = await fetchAllDatabasePages(dbId);
    const data = {};
    for (const page of pages) {
        // Assume Name (Title) and Value (RichText) and optional Media (Files)
        const props = page.properties;
        const key = props.Name?.title?.[0]?.plain_text;
        if (!key) continue;

        let val = props.Value?.rich_text?.[0]?.plain_text || '';

        // If there's a file, prefer that or add it
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
    console.log("Syncing Config...");
    // Find the Config Database directly (Full Page)
    const configDbId = await findFullPageDb("Config");

    if (!configDbId) {
        console.warn("Config database not found! (Checking for legacy page...)");
        // Fallback or just warn? Given we want to enforce full page, let's just warn.
        // But if the user hasn't run seed yet, it won't be there.
        // The script relies on existing structure.
        return;
    }

    const siteInfo = await fetchConfigKV(configDbId, 'site');

    const configData = {
        info: siteInfo
    };

    await ensureDir('data');
    await fs.writeFile('data/site.json', JSON.stringify(configData, null, 2));
}

async function syncHomePage() {
    console.log("Syncing Home Page...");
    const homePageId = await getPageByName(ROOT_PAGE_ID, "Home Page");
    if (!homePageId) {
        console.warn("Home Page not found!");
        return;
    }

    const sections = {};

    // Hero
    const heroDbId = await findInlineDbOnPage(homePageId, "Hero Settings");
    sections.hero = await fetchConfigKV(heroDbId, 'hero');

    // Projects Config
    const projConfigDbId = await findInlineDbOnPage(homePageId, "Projects Settings");
    sections.projects = await fetchConfigKV(projConfigDbId, 'proj-config');

    // Blogs Config
    const blogsConfigDbId = await findInlineDbOnPage(homePageId, "Blogs Settings");
    sections.blogs = await fetchConfigKV(blogsConfigDbId, 'blog-config');

    // Gallery Settings
    const galleryConfigDbId = await findInlineDbOnPage(homePageId, "Gallery Settings");
    if (galleryConfigDbId) {
        sections.gallery = await fetchConfigKV(galleryConfigDbId, 'gallery-config');
    } else {
        sections.gallery = { show_section: 'NO', title: 'Gallery' }; // Default fallback
    }

    await ensureDir('data');
    await fs.writeFile('data/home.json', JSON.stringify(sections, null, 2));

    // Sync Sub Pages (Children of Home Page that are pages)
    console.log("   > Syncing Sub Pages...");
    const homeChildren = await fetchAllChildren(homePageId);
    for (const block of homeChildren) {
        if (block.type === 'child_page') {
            const pageId = block.id;
            const title = block.child_page.title;
            const slug = slugify(title);

            console.log(`     - Fetching page: ${title}`);
            const mdBlocks = await n2m.pageToMarkdown(pageId);
            const mdString = n2m.toMarkdownString(mdBlocks);

            // Simple frontmatter
            const frontmatter = {
                title,
                date: new Date().toISOString(),
                menu: "main"
            };

            const fileContent = `---
${JSON.stringify(frontmatter, null, 2)}
---

${mdString.parent}
`;
            await ensureDir('content');
            await fs.writeFile(`content/${slug}.md`, fileContent);
        }
    }
}

async function findFullPageDb(name) {
    const children = await fetchAllChildren(ROOT_PAGE_ID);
    const db = children.find(b => b.type === 'child_database' && b.child_database.title === name);
    return db ? db.id : null;
}

async function syncProjects() {
    console.log("Syncing Projects...");
    const dbId = await findFullPageDb("Projects");
    if (!dbId) {
        console.warn("Projects database not found!");
        return;
    }

    const pages = await fetchAllDatabasePages(dbId, {
        property: 'Status',
        select: {
            equals: 'Published' // Only sync published
        }
    });

    await ensureDir('content/projects');

    for (const page of pages) {
        const props = page.properties;
        const title = props['Project Name']?.title?.[0]?.plain_text || 'Untitled';
        const slug = slugify(title);

        const rawThumb = props.Thumbnail?.files?.[0]?.file?.url || props.Thumbnail?.files?.[0]?.external?.url;
        let thumbnail = '';
        if (rawThumb) {
            const ext = path.extname(rawThumb.split('?')[0]) || '.jpg';
            thumbnail = await downloadImage(rawThumb, `project-${slug}-thumb${ext}`);
        }

        const frontmatter = {
            title,
            date: page.created_time,
            description: props.Description?.rich_text?.[0]?.plain_text || '',
            tools: props.Tools?.rich_text?.[0]?.plain_text || props.Tech?.rich_text?.[0]?.plain_text || '',
            link: props.Link?.url || '',
            thumbnail,
        };

        const mdContent = `---
${JSON.stringify(frontmatter, null, 2)}
---
`;
        // Projects in this model imply just cards, but if they have content we can fetch it.
        // Skipping block content for now as per "card" design, but can be added via n2m.toMarkdown

        await fs.writeFile(`content/projects/${slug}.md`, mdContent);
    }
}

async function syncBlogs() {
    console.log("Syncing Blogs...");
    const dbId = await findFullPageDb("Blogs");
    if (!dbId) {
        console.warn("Blogs database not found!");
        return;
    }

    const pages = await fetchAllDatabasePages(dbId, {
        property: 'Status',
        select: {
            equals: 'Published'
        }
    });

    await ensureDir('content/blogs');

    for (const page of pages) {
        const props = page.properties;
        const title = props.Title?.title?.[0]?.plain_text || 'Untitled';
        const slug = slugify(title);

        const rawCover = props.Cover?.files?.[0]?.file?.url || props.Cover?.files?.[0]?.external?.url;
        let coverUrl = '';
        if (rawCover) {
            const ext = path.extname(rawCover.split('?')[0]) || '.jpg';
            coverUrl = await downloadImage(rawCover, `blog-${slug}-cover${ext}`);
        }

        const frontmatter = {
            title,
            date: props['Published Date']?.date?.start || page.created_time,
            summary: props.Summary?.rich_text?.[0]?.plain_text || '',
            cover: {
                image: coverUrl,
                alt: title
            }
        };

        const mdBlocks = await n2m.pageToMarkdown(page.id);
        const mdString = n2m.toMarkdownString(mdBlocks);

        const fileContent = `---
${JSON.stringify(frontmatter, null, 2)}
---

${mdString.parent}
`;
        await fs.writeFile(`content/blogs/${slug}.md`, fileContent);
    }
}

async function syncGallery() {
    console.log("Syncing Gallery...");
    const dbId = await findFullPageDb("Gallery");
    if (!dbId) {
        console.warn("Gallery database not found!");
        return;
    }

    const pages = await fetchAllDatabasePages(dbId);

    await ensureDir('content/gallery');

    for (const page of pages) {
        const props = page.properties;
        const name = props.Name?.title?.[0]?.plain_text || 'Untitled';
        const slug = slugify(name);

        const rawImage = props.Image?.files?.[0]?.file?.url || props.Image?.files?.[0]?.external?.url;
        let imageUrl = '';
        if (rawImage) {
            const ext = path.extname(rawImage.split('?')[0]) || '.jpg';
            imageUrl = await downloadImage(rawImage, `gallery-${slug}${ext}`);
        }

        const link = props.Link?.url || '';

        const frontmatter = {
            name,
            image: imageUrl,
            link
        };

        // Galleries are usually just visual, but we'll save as MD for consistency
        const fileContent = `---
${JSON.stringify(frontmatter, null, 2)}
---
`;
        await fs.writeFile(`content/gallery/${slug}.md`, fileContent);
    }
}

async function main() {
    try {
        await syncConfig();
        await syncHomePage();
        await syncProjects();
        await syncBlogs();
        await syncGallery();
        console.log("Completed sync.");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();
