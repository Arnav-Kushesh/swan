// Sync Config
// Functions for syncing configuration data from Notion

import fs from 'fs/promises';
import path from 'path';
import {
    slugify,
    ensureDir,
    downloadImage,
    fetchAllChildren,
    fetchAllDatabasePages,
    getPageByName,
    findFullPageDb,
    ROOT_PAGE_ID,
} from './sync-helpers.mjs';

// --- Fetch Main Config ---

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

// --- Fetch General Config ---

async function fetchGeneralConfig(dbId) {
    if (!dbId) return {};
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return {};

    const props = pages[0].properties;
    const data = {};

    // Checkbox fields -> stored as 'true'/'false' strings for backward compatibility
    const checkboxFields = [
        'hide_topbar_logo',
        'hide_sidebar_logo',
        'enable_newsletter',
        'mention_this_tool_in_footer',
    ];

    for (const field of checkboxFields) {
        const val = props[field]?.checkbox;
        data[field] = val ? 'true' : 'false';
    }

    // URL fields
    data.newsletter_form_url = props.newsletter_form_url?.url || '';

    // Font fields
    data.primary_font = props.primary_font?.rich_text?.[0]?.plain_text || '';
    data.secondary_font = props.secondary_font?.rich_text?.[0]?.plain_text || '';

    return data;
}

// --- Fetch Social ---

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

// --- Sync Functions ---

export async function syncConfig() {
    console.log("Syncing Configuration...");
    const settingsPageId = await getPageByName(ROOT_PAGE_ID, "Settings");
    if (!settingsPageId) {
        console.warn("Settings page not found!");
        return;
    }

    // Fetch from all three config databases
    const basicConfigDbId = await findFullPageDb("Main Config", settingsPageId);
    const generalConfigDbId = await findFullPageDb("General Config", settingsPageId);
    const socialLinksDbId = await findFullPageDb("Social", settingsPageId);

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

export async function syncCollectionSettings() {
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

export async function syncCodeInjection() {
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

export async function syncCssInjection() {
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

export async function syncAdvancedConfig() {
    console.log("Syncing Advanced Config...");
    const settingsPageId = await getPageByName(ROOT_PAGE_ID, "Settings");
    if (!settingsPageId) {
        console.warn("Settings page not found!");
        return;
    }

    const advancedConfigDbId = await findFullPageDb("Advanced Config", settingsPageId);
    if (!advancedConfigDbId) {
        console.warn("Advanced Config database not found in Settings!");
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
