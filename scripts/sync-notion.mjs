
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local first (Next.js convention), then .env as fallback
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });
const ROOT_PAGE_ID = process.env.ROOT_PAGE_ID;

if (!process.env.NOTION_API_KEY || !ROOT_PAGE_ID) {
    console.error("Missing NOTION_API_KEY or ROOT_PAGE_ID");
    console.log("Please ensure .env exists and is populated.");
    process.exit(1);
}


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

    do {
        const query = { database_id: databaseId };
        if (cursor) query.start_cursor = cursor;
        if (filter) query.filter = filter;
        if (sorts) query.sorts = sorts;

        const response = await notion.databases.query(query);
        results.push(...response.results);
        cursor = response.next_cursor;
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

// --- Fetch Main Configuration (individual columns, single row) ---
async function fetchBasicConfig(dbId) {
    if (!dbId) return {};
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return {};

    const props = pages[0].properties;
    const data = {};

    // Text fields
    data.title = props.title?.title?.[0]?.plain_text || '';
    data.description = props.description?.rich_text?.[0]?.plain_text || '';
    data.tagline = props.tagline?.rich_text?.[0]?.plain_text || '';
    data.keywords = props.keywords?.rich_text?.[0]?.plain_text || '';

    // File fields - download images
    for (const field of ['logo', 'favicon', 'og_image']) {
        const files = props[field]?.files;
        if (files?.length > 0) {
            const rawUrl = files[0].file?.url || files[0].external?.url;
            if (rawUrl) {
                const ext = path.extname(rawUrl.split('?')[0]) || '.jpg';
                const filename = `site-${slugify(field)}${ext}`;
                data[field] = await downloadImage(rawUrl, filename);
            }
        } else {
            data[field] = '';
        }
    }

    // Select fields
    data.default_color_mode = props.default_color_mode?.select?.name || 'light';

    // Checkbox fields in basic config
    data.sidebar_navigation = props.sidebar_navigation?.checkbox ? 'true' : 'false';

    return data;
}

// --- Fetch General Configuration (individual columns with checkboxes, single row) ---
async function fetchGeneralConfig(dbId) {
    if (!dbId) return {};
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return {};

    const props = pages[0].properties;
    const data = {};

    // Checkbox fields -> stored as 'true'/'false' strings for backward compatibility
    const checkboxFields = [
        'disable_logo_in_topbar',
        'disable_logo_in_sidebar',
        'enable_newsletter',
        'mention_this_tool_in_footer',
    ];

    for (const field of checkboxFields) {
        const val = props[field]?.checkbox;
        data[field] = val ? 'true' : 'false';
    }

    // URL fields
    data.mailchimp_form_link = props.mailchimp_form_link?.url || '';

    // Font fields
    data.primary_font = props.primary_font?.rich_text?.[0]?.plain_text || '';
    data.secondary_font = props.secondary_font?.rich_text?.[0]?.plain_text || '';

    return data;
}

// --- Fetch Social Links (name/data columns, one row per social link) ---
async function fetchSocialLinks(dbId) {
    if (!dbId) return {};
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return {};

    const data = {};

    for (const page of pages) {
        const props = page.properties;
        const name = props.name?.title?.[0]?.plain_text || '';
        const linkValue = props.data?.rich_text?.[0]?.plain_text || '';

        if (name) {
            // Store as social_<name> for backward compatibility with SocialIcons component
            data[`social_${name.toLowerCase()}`] = linkValue;
        }
    }

    return data;
}

async function syncConfig() {
    console.log("Syncing Configuration...");
    const settingsPageId = await getPageByName(ROOT_PAGE_ID, "Settings");
    if (!settingsPageId) {
        console.warn("Settings page not found!");
        return;
    }

    // Fetch from all three config databases
    const basicConfigDbId = await findFullPageDb("Main Configuration", settingsPageId);
    const generalConfigDbId = await findFullPageDb("General Configuration", settingsPageId);
    const socialLinksDbId = await findFullPageDb("Social Links", settingsPageId);

    const basicConfig = await fetchBasicConfig(basicConfigDbId);
    const generalConfig = await fetchGeneralConfig(generalConfigDbId);
    const socialLinks = await fetchSocialLinks(socialLinksDbId);

    // Merge all into a single info object for backward compatibility
    const siteInfo = {
        ...basicConfig,
        ...generalConfig,
        ...socialLinks,
    };

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
        button_text: props.button_text?.rich_text?.[0]?.plain_text || '',
        view_type: props.view_type?.select?.name || props['View Type']?.select?.name || 'col_centered_view',
        media_aspect_ratio: props.media_aspect_ratio?.rich_text?.[0]?.plain_text || '',
        media_mobile_width: props.media_mobile_width?.rich_text?.[0]?.plain_text || '',
        media_desktop_width: props.media_desktop_width?.rich_text?.[0]?.plain_text || '',
        enabled: props.enabled?.checkbox ?? props.visibility?.checkbox ?? true,
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
        description: props.description?.rich_text?.[0]?.plain_text || '',
        view_type: props.view_type?.select?.name || 'list_view',
        items_shown_at_once: props.items_shown_at_once?.number || 6,
        top_section_centered: props.top_section_centered?.checkbox ?? false,
        enabled: props.enabled?.checkbox ?? props.visibility?.checkbox ?? true,
    };
}

// New Helper to fetch HTML Section Data
async function fetchHtmlSectionData(dbId) {
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    const title = props.title?.title?.[0]?.plain_text || props.Title?.title?.[0]?.plain_text || '';
    const enabled = props.enabled?.checkbox ?? props.visibility?.checkbox ?? true;

    // Read the page content (code blocks) for html_code
    const children = await fetchAllChildren(page.id);
    const codeBlocks = children
        .filter(b => b.type === 'code')
        .map(b => b.code.rich_text.map(t => t.plain_text).join(''));
    const html_code = codeBlocks.join('\n');

    const height = props.height?.number || null;

    const full_width = props.full_width?.checkbox ?? false;

    return { title, html_code, height, full_width, enabled };
}

// New Helper to fetch Iframe Section Data
async function fetchIframeSectionData(dbId) {
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    return {
        title: props.title?.title?.[0]?.plain_text || props.Title?.title?.[0]?.plain_text || '',
        url: props.url?.url || props.URL?.url || '',
        height: props.height?.number || undefined,
        full_width: props.full_width?.checkbox ?? false,
        enabled: props.enabled?.checkbox ?? props.visibility?.checkbox ?? true,
    };
}

// New Helper to fetch Video Embed Section Data
async function fetchVideoEmbedSectionData(dbId) {
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    return {
        title: props.title?.title?.[0]?.plain_text || props.Title?.title?.[0]?.plain_text || '',
        url: props.url?.url || props.URL?.url || '',
        enabled: props.enabled?.checkbox ?? props.visibility?.checkbox ?? true,
    };
}

// Helper to fetch Media Section Data
async function fetchMediaSectionData(dbId) {
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    // Download media file
    let media = '';
    const mediaFiles = props.media?.files;
    if (mediaFiles && mediaFiles.length > 0) {
        const file = mediaFiles[0];
        const url = file.file?.url || file.external?.url || '';
        if (url) {
            const ext = path.extname(new URL(url).pathname) || '.jpg';
            media = await downloadImage(url, `media-${dbId.slice(0, 8)}${ext}`);
        }
    }

    return {
        title: props.title?.title?.[0]?.plain_text || props.Title?.title?.[0]?.plain_text || '',
        media,
        height: props.height?.number || undefined,
        height_on_mobile: props.height_on_mobile?.number || undefined,
        height_on_desktop: props.height_on_desktop?.number || undefined,
        full_width: props.full_width?.checkbox ?? false,
        enabled: props.enabled?.checkbox ?? props.visibility?.checkbox ?? true,
    };
}

// Helper to fetch Mailto Section Data
async function fetchMailtoSectionData(dbId) {
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    return {
        title: props.title?.title?.[0]?.plain_text || props.Title?.title?.[0]?.plain_text || '',
        subject: props.subject?.rich_text?.[0]?.plain_text || '',
        receiver: props.receiver?.rich_text?.[0]?.plain_text || '',
        placeholder_text: props.placeholder_text?.rich_text?.[0]?.plain_text || '',
        button_text: props.button_text?.rich_text?.[0]?.plain_text || '',
        enabled: props.enabled?.checkbox ?? props.visibility?.checkbox ?? true,
    };
}

// New Helper to fetch Newsletter Section Data
async function fetchNewsletterSectionData(dbId) {
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    return {
        title: props.title?.title?.[0]?.plain_text || props.Title?.title?.[0]?.plain_text || '',
        enabled: props.enabled?.checkbox ?? props.visibility?.checkbox ?? true,
    };
}

// Helper to retrieve DB details
async function fetchDatabaseDetails(databaseId) {
    return await notion.databases.retrieve({ database_id: databaseId });
}

// Reusable: process all section databases on a given page
async function processSectionsFromPage(pageId) {
    const sections = [];
    const childrenBlocks = await fetchAllChildren(pageId);
    const databases = childrenBlocks.filter(b => b.type === 'child_database');

    for (const dbBlock of databases) {
        const dbId = dbBlock.id;
        const dbTitle = dbBlock.child_database.title;

        console.log(`   > Processing: ${dbTitle}`);

        // Fetch database schema to check if section_type property exists
        const dbDetails = await fetchDatabaseDetails(dbId);
        const schemaProps = dbDetails.properties || {};

        // Read section_type from the first row of the database (not from schema)
        let sectionType = null;
        if (schemaProps['section_type'] || schemaProps['Section Type']) {
            const rows = await fetchAllDatabasePages(dbId);
            if (rows.length > 0) {
                const rowProps = rows[0].properties;
                sectionType = rowProps['section_type']?.select?.name || rowProps['Section Type']?.select?.name || null;
            }
        }

        // Also check schema for fallback property-based detection
        const props = schemaProps;

        let section = null;

        if (sectionType === 'dynamic_section') {
            const data = await fetchDynamicSectionData(dbId);
            if (data) section = { type: 'dynamic_section', id: dbId, title: data.section_title || dbTitle, ...data };
        } else if (sectionType === 'info_section') {
            const data = await fetchInfoSectionData(dbId);
            if (data) section = { type: 'info_section', id: dbId, title: dbTitle, ...data };
        } else if (sectionType === 'html_section') {
            const data = await fetchHtmlSectionData(dbId);
            if (data) section = { type: 'html_section', id: dbId, title: dbTitle, ...data };
        } else if (sectionType === 'iframe_section') {
            const data = await fetchIframeSectionData(dbId);
            if (data) section = { type: 'iframe_section', id: dbId, title: dbTitle, ...data };
        } else if (sectionType === 'video_embed_section') {
            const data = await fetchVideoEmbedSectionData(dbId);
            if (data) section = { type: 'video_embed_section', id: dbId, title: dbTitle, ...data };
        } else if (sectionType === 'media_section') {
            const data = await fetchMediaSectionData(dbId);
            if (data) section = { type: 'media_section', id: dbId, title: dbTitle, ...data };
        } else if (sectionType === 'mailto_section') {
            const data = await fetchMailtoSectionData(dbId);
            if (data) section = { type: 'mailto_section', id: dbId, title: dbTitle, ...data };
        } else if (sectionType === 'newsletter_section') {
            const data = await fetchNewsletterSectionData(dbId);
            if (data) section = { type: 'newsletter_section', id: dbId, title: dbTitle, ...data };
        } else {
            // Fallback to property check (legacy/inference)
            if (props['collection_name']) {
                const data = await fetchDynamicSectionData(dbId);
                if (data) section = { type: 'dynamic_section', id: dbId, title: data.section_title || dbTitle, ...data };
            } else if ((props['description'] && props['title']) || (props['Description'] && props['Title'])) {
                const data = await fetchInfoSectionData(dbId);
                if (data) section = { type: 'info_section', id: dbId, title: dbTitle, ...data };
            } else {
                console.log(`     ! Unknown database type: ${dbTitle}`);
            }
        }

        if (section) sections.push(section);
    }

    return sections;
}

// Updated syncHomePage
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
            const button_text = props.button_text?.rich_text?.[0]?.plain_text || '';

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
                button_text,
                tools: tags.join(', '),
                order_priority,
                author_username,
                video_embed_link,
            };

            const body = mdString?.parent || '';
            const fileContent = `---\n${JSON.stringify(frontmatter, null, 2)}\n---\n\n${body}`;
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

    const configureCollectionsDbId = await findFullPageDb("Configure Collections", settingsPageId);
    if (!configureCollectionsDbId) {
        console.warn("Configure Collections database not found in Settings!");
        return;
    }

    const pages = await fetchAllDatabasePages(configureCollectionsDbId);
    const settings = {};

    for (const page of pages) {
        const props = page.properties;
        const collectionName = props.collection_name?.title?.[0]?.plain_text || '';
        if (!collectionName) continue;

        settings[collectionName.toLowerCase()] = {
            collection_name: collectionName,
            enable_rss: props.enable_rss?.checkbox ? 'true' : 'false',
            show_newsletter_section: props.show_newsletter_section?.checkbox ? 'true' : 'false',
            show_mailto_comment_section: props.show_mailto_comment_section?.checkbox ? 'true' : 'false',
        };
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

    const codeInjectionPageId = await getPageByName(settingsPageId, "HTML Head Code") || await getPageByName(settingsPageId, "HTML Code") || await getPageByName(settingsPageId, "Code");
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

// --- New: Sync CSS Injection ---
async function syncCssInjection() {
    console.log("Syncing CSS Injection...");
    const settingsPageId = await getPageByName(ROOT_PAGE_ID, "Settings");
    if (!settingsPageId) {
        console.warn("Settings page not found!");
        return;
    }

    const cssInjectionPageId = await getPageByName(settingsPageId, "CSS Styling") || await getPageByName(settingsPageId, "CSS");
    if (!cssInjectionPageId) {
        console.warn("CSS Injection page not found in Settings!");
        return;
    }

    const children = await fetchAllChildren(cssInjectionPageId);
    const codeBlocks = children
        .filter(b => b.type === 'code')
        .map(b => b.code.rich_text.map(t => t.plain_text).join(''));

    await ensureDir('notion_state/data');
    await fs.writeFile('notion_state/data/css_injection.json', JSON.stringify(codeBlocks, null, 2));
}


// --- New: Sync Extra Sections for Collection Pages ---
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

async function syncAdvancedConfig() {
    console.log("Syncing Advanced Configuration...");
    const settingsPageId = await getPageByName(ROOT_PAGE_ID, "Settings");
    if (!settingsPageId) {
        console.warn("Settings page not found!");
        return;
    }

    const advancedConfigDbId = await findFullPageDb("Advanced Configuration", settingsPageId);
    if (!advancedConfigDbId) {
        console.warn("Advanced Configuration database not found in Settings!");
        return;
    }

    const pages = await fetchAllDatabasePages(advancedConfigDbId);
    const config = {};

    if (pages.length > 0) {
        const props = pages[0].properties;
        config.limit_theme_selection = props.limit_theme_selection?.multi_select?.map(o => o.name) || [];
    }

    await ensureDir('notion_state/data');
    await fs.writeFile('notion_state/data/advanced_config.json', JSON.stringify(config, null, 2));
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
