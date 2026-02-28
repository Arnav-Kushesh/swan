// Sync Notion — Orchestrator
// Syncs all content from Notion to the local filesystem.

import fs from 'fs/promises';
import path from 'path';
import {
    n2m,
    slugify,
    ensureDir,
    downloadImage,
    fetchAllChildren,
    fetchAllDatabasePages,
    getPageByName,
    findFullPageDb,
    ROOT_PAGE_ID,
} from './lib/sync-helpers.mjs';

import { processSectionsFromPage } from './lib/sync-sections.mjs';
import { readCollectionItemProperties, getCollectionFileProperties } from './lib/section-schema.mjs';

import {
    syncConfig,
    syncCollectionSettings,
    syncCodeInjection,
    syncCssInjection,
    syncAdvancedConfig,
} from './lib/sync-config.mjs';

// --- Sync Home Page ---

async function syncHomePage() {
    console.log("Syncing Home Page...");
    const homePageId = await getPageByName(ROOT_PAGE_ID, "Home Page");
    if (!homePageId) {
        console.warn("Home Page not found!");
        return;
    }

    const sections = await processSectionsFromPage(homePageId);
    console.log(`   > Found ${sections.length} sections on Home Page.`);

    const homeData = { sections };
    await ensureDir('notion_state/data');
    await fs.writeFile('notion_state/data/home.json', JSON.stringify(homeData, null, 2));
}

// --- Sync All Collections ---

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

        const fileProps = getCollectionFileProperties();

        for (const page of pages) {
            const mdBlocks = await n2m.pageToMarkdown(page.id);
            const mdString = n2m.toMarkdownString(mdBlocks);

            const props = page.properties;
            const data = readCollectionItemProperties(props);

            const itemTitle = data.title || 'Untitled';
            const itemSlug = data.slug || slugify(itemTitle);

            // Download file properties (thumbnail)
            let thumbnail = '';
            for (const fileProp of fileProps) {
                const namesToTry = [fileProp.name, ...(fileProp.aliases || [])];
                let fileValue;
                for (const n of namesToTry) {
                    if (props[n]?.files?.[0]) { fileValue = props[n].files[0]; break; }
                }
                if (fileValue) {
                    const rawUrl = fileValue.file?.url || fileValue.external?.url;
                    if (rawUrl) {
                        const ext = path.extname(fileValue.name || '') || path.extname(rawUrl.split('?')[0]) || '.jpg';
                        thumbnail = await downloadImage(rawUrl, `${slug}-${itemSlug}${ext}`);
                    }
                }
            }

            const tags = data.tags || [];

            const frontmatter = {
                slug: itemSlug,
                title: itemTitle,
                collection: slug,
                date: page.created_time,
                description: data.description,
                thumbnail,
                cover: { image: thumbnail, alt: itemTitle },
                tags,
                link: data.link,
                button_text: data.button_text,
                tools: tags.join(', '),
                order_priority: data.order_priority,
                author_username: data.author_username,
                video_embed_url: data.video_embed_url,
                status: data.status,
            };

            const body = mdString?.parent || '';
            const fileContent = `---\n${JSON.stringify(frontmatter, null, 2)}\n---\n\n${body}`;
            await fs.writeFile(`notion_state/content/${slug}/${itemSlug}.md`, fileContent);
        }
    }
}

// --- Sync Navbar Pages ---

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
            // Filter out child_database blocks so inline DB titles don't appear as text
            const filteredMdBlocks = mdBlocks.filter(b => b.type !== 'child_database');
            const mdString = n2m.toMarkdownString(filteredMdBlocks);

            // Also check for inline databases (sections) on the navbar page
            const sections = await processSectionsFromPage(pageId);

            const frontmatter = {
                title,
                date: block.last_edited_time || new Date().toISOString(),
                description: '',
                menu: "main",
                sections: sections.length > 0 ? sections : undefined,
            };

            const body = mdString?.parent || '';
            const fileContent = `---\n${JSON.stringify(frontmatter, null, 2)}\n---\n\n${body}`;
            await ensureDir('notion_state/content/navbarPages');
            await fs.writeFile(`notion_state/content/navbarPages/${slug}.md`, fileContent);
        }
    }
}

// --- Sync Authors ---

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
                const ext = path.extname(picFile.name || '') || path.extname(rawUrl.split('?')[0]) || '.jpg';
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

// --- Sync Extra Sections ---

async function syncExtraSections() {
    console.log("Syncing Collection Page Extra Sections...");
    const settingsPageId = await getPageByName(ROOT_PAGE_ID, "Settings");
    if (!settingsPageId) {
        console.warn("Settings page not found!");
        return;
    }

    const extraSectionsPageId = await getPageByName(settingsPageId, "Collection Page Extra Sections");
    if (!extraSectionsPageId) {
        console.warn("Collection Page Extra Sections page not found in Settings!");
        return;
    }

    const children = await fetchAllChildren(extraSectionsPageId);
    const extraSections = {};

    for (const block of children) {
        if (block.type === 'child_page') {
            const collectionName = block.child_page.title;
            const slug = slugify(collectionName);
            console.log(`     - Processing extra sections for: ${collectionName}`);

            const sections = await processSectionsFromPage(block.id);
            if (sections.length > 0) {
                extraSections[slug] = sections;
            }
        }
    }

    await ensureDir('notion_state/data');
    await fs.writeFile('notion_state/data/extra_sections.json', JSON.stringify(extraSections, null, 2));
}

// --- Main ---

async function main() {
    try {
        await syncConfig();
        await syncHomePage();
        await syncNavbarPagesContainer();
        await syncAllCollections();
        await syncAuthors();
        await syncCollectionSettings();
        await syncCodeInjection();
        await syncCssInjection();
        await syncExtraSections();
        await syncAdvancedConfig();
        console.log("Completed sync.");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();
