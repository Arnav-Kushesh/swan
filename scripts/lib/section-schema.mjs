// Section Schema — Single source of truth for all section type definitions.
// Used by seed-sections.mjs (to create Notion databases) and sync-sections.mjs (to read data).
// TypeScript interfaces in lib/types.ts should match these definitions.

import { sectionTypeOptions } from './notion-blocks.mjs';

// --- Schema Definition ---

export const SECTION_SCHEMA = {
    info_section: {
        properties: [
            { name: 'title', notionType: 'title', tsType: 'string', required: true, aliases: ['Title'] },
            { name: 'description', notionType: 'rich_text', tsType: 'string', required: true, fullText: true, aliases: ['Description'] },
            { name: 'button_link', notionType: 'url', tsType: 'string', default: '', aliases: ['link'] },
            { name: 'button_text', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'media', notionType: 'files', tsType: 'string', download: true, aliases: ['Media'] },
            {
                name: 'view_type', notionType: 'select', tsType: 'string', default: 'col_centered_view',
                aliases: ['View Type'],
                options: [
                    { name: 'col_centered_view', color: 'blue' },
                    { name: 'col_left_view', color: 'green' },
                    { name: 'row_reverse_view', color: 'yellow' },
                    { name: 'row_view', color: 'purple' },
                ],
            },
            { name: 'media_aspect_ratio', notionType: 'rich_text', tsType: 'string', default: '', normalizeAspectRatio: true },
            { name: 'media_width', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'media_width_mobile', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'html_id', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'html_class', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'enabled', notionType: 'checkbox', tsType: 'boolean', default: true, aliases: ['visibility'] },
        ],
    },

    dynamic_section: {
        properties: [
            { name: 'title', notionType: 'title', tsType: 'string', required: true },
            { name: 'collection_name', notionType: 'rich_text', tsType: 'string', required: true },
            { name: 'description', notionType: 'rich_text', tsType: 'string', default: '', fullText: true },
            {
                name: 'view_type', notionType: 'select', tsType: 'string', default: 'list_view',
                options: [
                    { name: 'list_view', color: 'blue' },
                    { name: 'card_view', color: 'green' },
                    { name: 'grid_view', color: 'yellow' },
                    { name: 'minimal_list_view', color: 'gray' },
                    { name: 'tiny_card_view', color: 'pink' },
                    { name: 'big_card_view', color: 'red' },
                ],
            },
            { name: 'items_in_view', notionType: 'number', tsType: 'number', default: 6 },
            { name: 'top_part_centered', notionType: 'checkbox', tsType: 'boolean', default: false },
            { name: 'html_id', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'html_class', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'enabled', notionType: 'checkbox', tsType: 'boolean', default: true, aliases: ['visibility'] },
        ],
    },

    html_section: {
        properties: [
            { name: 'title', notionType: 'title', tsType: 'string', required: true, aliases: ['Title'] },
            { name: 'description', notionType: 'rich_text', tsType: 'string', default: '', fullText: true },
            { name: 'html_code', notionType: 'code_block', tsType: 'string', required: true },
            { name: 'aspect_ratio', notionType: 'rich_text', tsType: 'string', default: '', normalizeAspectRatio: true },
            { name: 'width', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'width_mobile', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'full_width', notionType: 'checkbox', tsType: 'boolean', default: false },
            { name: 'top_part_centered', notionType: 'checkbox', tsType: 'boolean', default: false },
            { name: 'html_id', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'html_class', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'enabled', notionType: 'checkbox', tsType: 'boolean', default: true, aliases: ['visibility'] },
        ],
    },

    iframe_section: {
        properties: [
            { name: 'title', notionType: 'title', tsType: 'string', required: true, aliases: ['Title'] },
            { name: 'description', notionType: 'rich_text', tsType: 'string', default: '', fullText: true },
            { name: 'url', notionType: 'url', tsType: 'string', required: true, aliases: ['URL'] },
            { name: 'aspect_ratio', notionType: 'rich_text', tsType: 'string', default: '', normalizeAspectRatio: true },
            { name: 'width', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'width_mobile', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'full_width', notionType: 'checkbox', tsType: 'boolean', default: false },
            { name: 'top_part_centered', notionType: 'checkbox', tsType: 'boolean', default: false },
            { name: 'html_id', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'html_class', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'enabled', notionType: 'checkbox', tsType: 'boolean', default: true, aliases: ['visibility'] },
        ],
    },

    video_embed_section: {
        properties: [
            { name: 'title', notionType: 'title', tsType: 'string', required: true, aliases: ['Title'] },
            { name: 'description', notionType: 'rich_text', tsType: 'string', default: '', fullText: true },
            { name: 'url', notionType: 'url', tsType: 'string', required: true, aliases: ['URL'] },
            { name: 'top_part_centered', notionType: 'checkbox', tsType: 'boolean', default: false },
            { name: 'html_id', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'html_class', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'enabled', notionType: 'checkbox', tsType: 'boolean', default: true, aliases: ['visibility'] },
        ],
    },

    media_section: {
        properties: [
            { name: 'title', notionType: 'title', tsType: 'string', required: true, aliases: ['Title'] },
            { name: 'description', notionType: 'rich_text', tsType: 'string', default: '', fullText: true },
            { name: 'media', notionType: 'files', tsType: 'string', download: true, aliases: ['Media'] },
            { name: 'aspect_ratio', notionType: 'rich_text', tsType: 'string', default: '', normalizeAspectRatio: true },
            { name: 'width', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'width_mobile', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'full_width', notionType: 'checkbox', tsType: 'boolean', default: false },
            { name: 'top_part_centered', notionType: 'checkbox', tsType: 'boolean', default: false },
            { name: 'html_id', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'html_class', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'enabled', notionType: 'checkbox', tsType: 'boolean', default: true, aliases: ['visibility'] },
        ],
    },

    mailto_section: {
        properties: [
            { name: 'title', notionType: 'title', tsType: 'string', required: true, aliases: ['Title'] },
            { name: 'subject', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'receiver_email', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'placeholder_text', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'button_text', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'html_id', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'html_class', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'enabled', notionType: 'checkbox', tsType: 'boolean', default: true, aliases: ['visibility'] },
        ],
    },

    newsletter_section: {
        properties: [
            { name: 'title', notionType: 'title', tsType: 'string', required: true, aliases: ['Title'] },
            { name: 'html_id', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'html_class', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'enabled', notionType: 'checkbox', tsType: 'boolean', default: true, aliases: ['visibility'] },
        ],
    },

    gap_section: {
        properties: [
            { name: 'title', notionType: 'title', tsType: 'string', required: true, aliases: ['Title'] },
            { name: 'height', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'mobile_height', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'html_id', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'html_class', notionType: 'rich_text', tsType: 'string', default: '' },
            { name: 'enabled', notionType: 'checkbox', tsType: 'boolean', default: true, aliases: ['visibility'] },
        ],
    },
};

// --- Collection Item Schema ---
// Single source of truth for collection item (post/project/gallery) database properties.
// All field names use snake_case. Aliases provide backward compatibility with old PascalCase names.

export const COLLECTION_ITEM_SCHEMA = {
    properties: [
        { name: 'title', notionType: 'title', tsType: 'string', required: true, aliases: ['Title'] },
        { name: 'slug', notionType: 'rich_text', tsType: 'string', default: '', aliases: ['Slug'] },
        { name: 'description', notionType: 'rich_text', tsType: 'string', default: '', aliases: ['Description'] },
        { name: 'thumbnail', notionType: 'files', tsType: 'string', download: true, aliases: ['Thumbnail'] },
        { name: 'tags', notionType: 'multi_select', tsType: 'string[]', default: [], aliases: ['Tags'] },
        { name: 'link', notionType: 'url', tsType: 'string', default: '', aliases: ['Link'] },
        { name: 'button_text', notionType: 'rich_text', tsType: 'string', default: '' },
        { name: 'order_priority', notionType: 'number', tsType: 'number', default: 0, aliases: ['Order'] },
        { name: 'author_username', notionType: 'rich_text', tsType: 'string', default: '' },
        { name: 'video_embed_url', notionType: 'url', tsType: 'string', default: '' },
        {
            name: 'status', notionType: 'select', tsType: 'string', default: 'published',
            options: [
                { name: 'draft', color: 'gray' },
                { name: 'in_review', color: 'brown' },
                { name: 'published', color: 'green' },
                { name: 'archived', color: 'red' },
            ],
        },
    ],
};

// --- Helper Functions ---

// Extract full plain text from a Notion rich_text array (joins all segments)
function getFullText(richTextArray) {
    if (!richTextArray || !Array.isArray(richTextArray)) return '';
    return richTextArray.map(t => t.plain_text).join('');
}

// Normalize aspect ratio from Notion format (16:9) to CSS format (16/9)
function normalizeAspectRatio(value) {
    if (!value) return value;
    return value.replace(':', '/');
}

/**
 * Generate Notion database properties object from schema.
 * Used by seed-sections.mjs to create databases.
 */
export function buildNotionProperties(sectionType) {
    const schema = SECTION_SCHEMA[sectionType];
    if (!schema) return {};

    const notionTypeMap = {
        title: { title: {} },
        rich_text: { rich_text: {} },
        checkbox: { checkbox: {} },
        url: { url: {} },
        number: { number: {} },
        files: { files: {} },
    };

    const properties = {};
    for (const prop of schema.properties) {
        if (prop.notionType === 'code_block') continue; // not a DB property

        if (prop.notionType === 'select' && prop.options) {
            properties[prop.name] = { select: { options: prop.options } };
        } else {
            properties[prop.name] = notionTypeMap[prop.notionType];
        }
    }

    // Always include section_type
    properties.section_type = { select: { options: sectionTypeOptions } };

    return properties;
}

/**
 * Read a single property value from Notion page properties.
 * Tries the canonical name first, then aliases.
 */
export function readNotionProperty(props, propDef) {
    const namesToTry = [propDef.name, ...(propDef.aliases || [])];

    let value;
    for (const n of namesToTry) {
        const p = props[n];
        if (p === undefined) continue;

        switch (propDef.notionType) {
            case 'title':
                value = p.title?.[0]?.plain_text;
                break;
            case 'rich_text':
                value = propDef.fullText
                    ? getFullText(p.rich_text)
                    : p.rich_text?.[0]?.plain_text;
                // Fallback: some databases have rich_text field as title type
                if ((value === undefined || value === null) && p.title) {
                    value = p.title?.[0]?.plain_text;
                }
                break;
            case 'checkbox':
                value = p.checkbox;
                break;
            case 'select':
                value = p.select?.name;
                break;
            case 'url':
                value = p.url;
                break;
            case 'number':
                value = p.number;
                break;
            case 'email':
                value = p.email;
                break;
            case 'multi_select':
                value = p.multi_select?.map(o => o.name);
                break;
            case 'files':
                value = p.files; // raw array; caller handles download
                break;
        }
        if (value !== undefined && value !== null) break;
    }

    // Apply default if no value found
    if (value === undefined || value === null) {
        value = propDef.default !== undefined ? propDef.default : '';
    }

    // Normalize aspect ratio if flagged
    if (propDef.normalizeAspectRatio && typeof value === 'string') {
        value = normalizeAspectRatio(value);
    }

    return value;
}

/**
 * Read all simple properties (non-files, non-code_block) for a section type.
 * Used by sync-sections.mjs.
 */
export function readAllProperties(sectionType, props) {
    const schema = SECTION_SCHEMA[sectionType];
    if (!schema) return {};

    const result = {};
    for (const propDef of schema.properties) {
        if (propDef.notionType === 'code_block') continue;
        if (propDef.notionType === 'files') continue;
        result[propDef.name] = readNotionProperty(props, propDef);
    }
    return result;
}

/**
 * Get file-type property definitions for a section type.
 */
export function getFileProperties(sectionType) {
    const schema = SECTION_SCHEMA[sectionType];
    if (!schema) return [];
    return schema.properties.filter(p => p.notionType === 'files');
}

/**
 * Get code_block-type property definitions for a section type.
 */
export function getCodeBlockProperties(sectionType) {
    const schema = SECTION_SCHEMA[sectionType];
    if (!schema) return [];
    return schema.properties.filter(p => p.notionType === 'code_block');
}

// --- Theme Options (shared by Main Config and Advanced Config) ---

export const THEME_OPTIONS = [
    { name: 'light', color: 'default' },
    { name: 'dark', color: 'gray' },
    { name: 'cream', color: 'yellow' },
    { name: 'pink', color: 'pink' },
    { name: 'blue', color: 'blue' },
    { name: 'purple', color: 'purple' },
    { name: 'red', color: 'red' },
    { name: 'green', color: 'green' },
];

// --- Author Schema ---

export const AUTHOR_SCHEMA = {
    properties: [
        { name: 'name', notionType: 'title', tsType: 'string', required: true },
        { name: 'username', notionType: 'rich_text', tsType: 'string', default: '' },
        { name: 'email', notionType: 'email', tsType: 'string', default: '' },
        { name: 'description', notionType: 'rich_text', tsType: 'string', default: '' },
        { name: 'picture', notionType: 'files', tsType: 'string', download: true },
        { name: 'instagram_handle_link', notionType: 'rich_text', tsType: 'string', default: '' },
        { name: 'x_handle_link', notionType: 'rich_text', tsType: 'string', default: '' },
        { name: 'github_handle_link', notionType: 'rich_text', tsType: 'string', default: '' },
    ],
};

// --- Main Configuration Schema ---

export const MAIN_CONFIG_SCHEMA = {
    properties: [
        { name: 'title', notionType: 'title', tsType: 'string', required: true },
        { name: 'description', notionType: 'rich_text', tsType: 'string', default: '' },
        { name: 'tagline', notionType: 'rich_text', tsType: 'string', default: '' },
        { name: 'keywords', notionType: 'rich_text', tsType: 'string', default: '' },
        { name: 'logo', notionType: 'files', tsType: 'string', download: true },
        { name: 'favicon', notionType: 'files', tsType: 'string', download: true },
        { name: 'og_image', notionType: 'files', tsType: 'string', download: true },
        { name: 'default_color_mode', notionType: 'select', tsType: 'string', default: 'light', options: THEME_OPTIONS },
        { name: 'sidebar_navigation', notionType: 'checkbox', tsType: 'boolean', default: false },
    ],
};

// --- General Configuration Schema ---

export const GENERAL_CONFIG_SCHEMA = {
    properties: [
        { name: 'label', notionType: 'title', tsType: 'string', required: true },
        { name: 'hide_topbar_logo', notionType: 'checkbox', tsType: 'boolean', default: false },
        { name: 'hide_sidebar_logo', notionType: 'checkbox', tsType: 'boolean', default: false },
        { name: 'enable_newsletter', notionType: 'checkbox', tsType: 'boolean', default: false },
        { name: 'newsletter_form_url', notionType: 'url', tsType: 'string', default: '' },
        { name: 'mention_this_tool_in_footer', notionType: 'checkbox', tsType: 'boolean', default: false },
        { name: 'primary_font', notionType: 'rich_text', tsType: 'string', default: '' },
        { name: 'secondary_font', notionType: 'rich_text', tsType: 'string', default: '' },
    ],
};

// --- Social Schema ---

export const SOCIAL_SCHEMA = {
    properties: [
        { name: 'name', notionType: 'title', tsType: 'string', required: true },
        { name: 'data', notionType: 'rich_text', tsType: 'string', default: '' },
    ],
};

// --- Advanced Configuration Schema ---

export const ADVANCED_CONFIG_SCHEMA = {
    properties: [
        { name: 'label', notionType: 'title', tsType: 'string', required: true },
        { name: 'limit_theme_selection', notionType: 'multi_select', tsType: 'string[]', default: [], options: THEME_OPTIONS },
    ],
};

// --- Collection Settings Schema ---

export const COLLECTION_SETTINGS_SCHEMA = {
    properties: [
        { name: 'collection_name', notionType: 'title', tsType: 'string', required: true },
        { name: 'enable_rss', notionType: 'checkbox', tsType: 'boolean', default: false },
        { name: 'show_newsletter_section', notionType: 'checkbox', tsType: 'boolean', default: false },
        { name: 'show_mailto_comment_section', notionType: 'checkbox', tsType: 'boolean', default: false },
    ],
};

// --- Generic Schema Helpers ---

/**
 * Generate Notion database properties object from any schema definition.
 * Used by seed scripts to create databases.
 */
export function buildPropertiesFromSchema(schema) {
    const notionTypeMap = {
        title: { title: {} },
        rich_text: { rich_text: {} },
        checkbox: { checkbox: {} },
        url: { url: {} },
        number: { number: { format: 'number' } },
        files: { files: {} },
        multi_select: { multi_select: {} },
        email: { email: {} },
    };

    const properties = {};
    for (const prop of schema.properties) {
        if (prop.notionType === 'code_block') continue;

        if (prop.notionType === 'select' && prop.options) {
            properties[prop.name] = { select: { options: prop.options } };
        } else if (prop.notionType === 'multi_select' && prop.options) {
            properties[prop.name] = { multi_select: { options: prop.options } };
        } else {
            properties[prop.name] = notionTypeMap[prop.notionType];
        }
    }
    return properties;
}

/**
 * Read all simple properties (non-files, non-code_block) from a Notion page using a schema.
 * Returns an object with snake_case keys.
 */
export function readPropertiesFromSchema(schema, props) {
    const result = {};
    for (const propDef of schema.properties) {
        if (propDef.notionType === 'code_block') continue;
        if (propDef.notionType === 'files') continue;
        result[propDef.name] = readNotionProperty(props, propDef);
    }
    return result;
}

/**
 * Get file-type property definitions from any schema.
 */
export function getFilePropertiesFromSchema(schema) {
    return schema.properties.filter(p => p.notionType === 'files');
}

// --- Collection Item Helpers (convenience wrappers) ---

export function buildCollectionProperties() {
    return buildPropertiesFromSchema(COLLECTION_ITEM_SCHEMA);
}

export function readCollectionItemProperties(props) {
    return readPropertiesFromSchema(COLLECTION_ITEM_SCHEMA, props);
}

export function getCollectionFileProperties() {
    return getFilePropertiesFromSchema(COLLECTION_ITEM_SCHEMA);
}
