// Sync Sections
// Functions for fetching section data from Notion databases

import path from 'path';
import {
    downloadImage,
    fetchAllChildren,
    fetchAllDatabasePages,
    fetchDatabaseDetails,
} from './sync-helpers.mjs';

// --- Section Data Fetchers ---

export async function fetchInfoSectionData(dbId) {
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    const data = {
        title: props.title?.title?.[0]?.plain_text || props.Title?.title?.[0]?.plain_text || '',
        description: props.description?.rich_text?.[0]?.plain_text || props.Description?.rich_text?.[0]?.plain_text || '',
        button_link: props.button_link?.url || props.link?.url || '',
        button_text: props.button_text?.rich_text?.[0]?.plain_text || '',
        view_type: props.view_type?.select?.name || props['View Type']?.select?.name || 'col_centered_view',
        media_aspect_ratio: props.media_aspect_ratio?.rich_text?.[0]?.plain_text || '',
        media_height: props.media_height?.number || undefined,
        media_mobile_height: props.media_mobile_height?.number || undefined,
        enabled: props.enabled?.checkbox ?? props.visibility?.checkbox ?? true,
    };

    const imageProp = props.image?.files || props.Image?.files;
    if (imageProp?.length > 0) {
        const rawUrl = imageProp[0].file?.url || imageProp[0].external?.url;
        if (rawUrl) {
            const ext = path.extname(rawUrl.split('?')[0]) || '.jpg';
            const slugify = (text) => text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
            const filename = `info-${dbId}-${slugify(data.title).slice(0, 20)}${ext}`;
            data.image = await downloadImage(rawUrl, filename);
        }
    }

    return data;
}

export async function fetchDynamicSectionData(dbId) {
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    return {
        collection_name: props.collection_name?.rich_text?.[0]?.plain_text || props.collection_name?.title?.[0]?.plain_text || '',
        title: props.title?.title?.[0]?.plain_text || '',
        description: props.description?.rich_text?.[0]?.plain_text || '',
        view_type: props.view_type?.select?.name || 'list_view',
        items_in_view: props.items_in_view?.number || 6,
        top_part_centered: props.top_part_centered?.checkbox ?? false,
        enabled: props.enabled?.checkbox ?? props.visibility?.checkbox ?? true,
    };
}

export async function fetchHtmlSectionData(dbId) {
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

    const aspect_ratio = props.aspect_ratio?.rich_text?.[0]?.plain_text || '';

    const full_width = props.full_width?.checkbox ?? false;

    const description = props.description?.rich_text?.[0]?.plain_text || '';
    const top_part_centered = props.top_part_centered?.checkbox ?? false;

    return { title, description, html_code, aspect_ratio, full_width, top_part_centered, enabled };
}

export async function fetchIframeSectionData(dbId) {
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    return {
        title: props.title?.title?.[0]?.plain_text || props.Title?.title?.[0]?.plain_text || '',
        description: props.description?.rich_text?.[0]?.plain_text || '',
        url: props.url?.url || props.URL?.url || '',
        aspect_ratio: props.aspect_ratio?.rich_text?.[0]?.plain_text || '',
        full_width: props.full_width?.checkbox ?? false,
        top_part_centered: props.top_part_centered?.checkbox ?? false,
        enabled: props.enabled?.checkbox ?? props.visibility?.checkbox ?? true,
    };
}

export async function fetchVideoEmbedSectionData(dbId) {
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    return {
        title: props.title?.title?.[0]?.plain_text || props.Title?.title?.[0]?.plain_text || '',
        description: props.description?.rich_text?.[0]?.plain_text || '',
        url: props.url?.url || props.URL?.url || '',
        top_part_centered: props.top_part_centered?.checkbox ?? false,
        enabled: props.enabled?.checkbox ?? props.visibility?.checkbox ?? true,
    };
}

export async function fetchMediaSectionData(dbId) {
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
        description: props.description?.rich_text?.[0]?.plain_text || '',
        media,
        aspect_ratio: props.aspect_ratio?.rich_text?.[0]?.plain_text || '',
        full_width: props.full_width?.checkbox ?? false,
        top_part_centered: props.top_part_centered?.checkbox ?? false,
        enabled: props.enabled?.checkbox ?? props.visibility?.checkbox ?? true,
    };
}

export async function fetchMailtoSectionData(dbId) {
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    return {
        title: props.title?.title?.[0]?.plain_text || props.Title?.title?.[0]?.plain_text || '',
        subject: props.subject?.rich_text?.[0]?.plain_text || '',
        receiver_email: props.receiver_email?.rich_text?.[0]?.plain_text || '',
        placeholder_text: props.placeholder_text?.rich_text?.[0]?.plain_text || '',
        button_text: props.button_text?.rich_text?.[0]?.plain_text || '',
        enabled: props.enabled?.checkbox ?? props.visibility?.checkbox ?? true,
    };
}

export async function fetchNewsletterSectionData(dbId) {
    const pages = await fetchAllDatabasePages(dbId);
    if (pages.length === 0) return null;

    const page = pages[0];
    const props = page.properties;

    return {
        title: props.title?.title?.[0]?.plain_text || props.Title?.title?.[0]?.plain_text || '',
        enabled: props.enabled?.checkbox ?? props.visibility?.checkbox ?? true,
    };
}

// --- Section Processing ---

export async function processSectionsFromPage(pageId) {
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
            if (data) section = { type: 'dynamic_section', id: dbId, title: data.title || dbTitle, ...data };
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
                if (data) section = { type: 'dynamic_section', id: dbId, title: data.title || dbTitle, ...data };
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
