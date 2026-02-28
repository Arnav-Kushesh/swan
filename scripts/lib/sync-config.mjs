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
import {
    readPropertiesFromSchema,
    getFilePropertiesFromSchema,
    MAIN_CONFIG_SCHEMA,
    GENERAL_CONFIG_SCHEMA,
    SOCIAL_SCHEMA,
    ADVANCED_CONFIG_SCHEMA,
    COLLECTION_SETTINGS_SCHEMA,
} from './section-schema.mjs';

// --- Fetch Main Config ---

async function fetchBasicConfig(dbId) {
    if (!dbId) return {};
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return {};

    const props = pages[0].properties;
    const data = readPropertiesFromSchema(MAIN_CONFIG_SCHEMA, props);

    // Download file fields
    for (const fileProp of getFilePropertiesFromSchema(MAIN_CONFIG_SCHEMA)) {
        const files = props[fileProp.name]?.files;
        if (files?.length > 0) {
            const rawUrl = files[0].file?.url || files[0].external?.url;
            if (rawUrl) {
                const ext = path.extname(rawUrl.split('?')[0]) || '.jpg';
                const filename = `site-${slugify(fileProp.name)}${ext}`;
                data[fileProp.name] = await downloadImage(rawUrl, filename);
            }
        } else {
            data[fileProp.name] = '';
        }
    }

    // Convert checkbox to string for backward compatibility
    data.sidebar_navigation = data.sidebar_navigation ? 'true' : 'false';

    return data;
}

// --- Fetch General Config ---

async function fetchGeneralConfig(dbId) {
    if (!dbId) return {};
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return {};

    const props = pages[0].properties;
    const data = readPropertiesFromSchema(GENERAL_CONFIG_SCHEMA, props);

    // Convert checkbox fields to 'true'/'false' strings for backward compatibility
    for (const propDef of GENERAL_CONFIG_SCHEMA.properties) {
        if (propDef.notionType === 'checkbox') {
            data[propDef.name] = data[propDef.name] ? 'true' : 'false';
        }
    }

    return data;
}

// --- Fetch Social ---

async function fetchSocialLinks(dbId) {
    if (!dbId) return {};
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return {};

    const data = {};

    for (const page of pages) {
        const row = readPropertiesFromSchema(SOCIAL_SCHEMA, page.properties);
        if (row.name) {
            // Store as social_<name> for backward compatibility with SocialIcons component
            data[`social_${row.name.toLowerCase()}`] = row.data;
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
    const basicConfigDbId = await findFullPageDb("Main Configuration", settingsPageId);
    const generalConfigDbId = await findFullPageDb("General Configuration", settingsPageId);
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
        const row = readPropertiesFromSchema(COLLECTION_SETTINGS_SCHEMA, page.properties);
        if (!row.collection_name) continue;

        // Convert checkbox fields to 'true'/'false' strings for backward compatibility
        for (const propDef of COLLECTION_SETTINGS_SCHEMA.properties) {
            if (propDef.notionType === 'checkbox') {
                row[propDef.name] = row[propDef.name] ? 'true' : 'false';
            }
        }

        settings[row.collection_name.toLowerCase()] = row;
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
    let config = {};

    if (pages.length > 0) {
        config = readPropertiesFromSchema(ADVANCED_CONFIG_SCHEMA, pages[0].properties);
    }

    await ensureDir('notion_state/data');
    await fs.writeFile('notion_state/data/advanced_config.json', JSON.stringify(config, null, 2));
}
