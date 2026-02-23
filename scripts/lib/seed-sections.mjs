// Seed Sections
// Functions for creating section databases in Notion (Info, Dynamic, HTML, Iframe, VideoEmbed, Media, Mailto, Newsletter)

import {
    plainText,
    textBlock,
    codeBlock,
    buildBlocks,
    sectionTypeOptions,
} from "./notion-blocks.mjs";

// Universal section creator that dispatches to the right function
export async function createAnySection(notion, parentId, section) {
    if (section.type === "info_section") {
        await createInfoSection(notion, parentId, section);
    } else if (section.type === "dynamic_section") {
        await createDynamicSection(notion, parentId, section);
    } else if (section.type === "html_section") {
        await createHtmlSection(notion, parentId, section);
    } else if (section.type === "iframe_section") {
        await createIframeSection(notion, parentId, section);
    } else if (section.type === "video_embed_section") {
        await createVideoEmbedSection(notion, parentId, section);
    } else if (section.type === "media_section") {
        await createMediaSection(notion, parentId, section);
    } else if (section.type === "mailto_section") {
        await createMailtoSection(notion, parentId, section);
    } else if (section.type === "newsletter_section") {
        await createNewsletterSection(notion, parentId, section);
    }
}

async function createInfoSection(notion, parentId, sectionData) {
    console.log(`     - Creating Info Section: ${sectionData.title}`);
    const properties = {
        title: { title: {} },
        description: { rich_text: {} },
        button_link: { url: {} },
        button_text: { rich_text: {} },
        image: { files: {} },
        view_type: {
            select: {
                options: [
                    { name: "col_centered_view", color: "blue" },
                    { name: "col_left_view", color: "green" },
                    { name: "row_reverse_view", color: "yellow" },
                    { name: "row_view", color: "purple" },
                ],
            },
        },
        media_aspect_ratio: { rich_text: {} },
        media_height: { rich_text: {} },
        media_mobile_height: { rich_text: {} },
        section_type: {
            select: { options: sectionTypeOptions },
        },
        enabled: { checkbox: {} },
    };

    const db = await notion.databases.create({
        parent: { type: "page_id", page_id: parentId },
        title: plainText(sectionData.title),
        is_inline: true,
        properties,
    });

    // Seed Data
    if (sectionData.data && sectionData.data.length > 0) {
        const item = sectionData.data[0]; // Info sections usually have 1 item acting as the content
        const props = {
            title: { title: plainText(item.title) },
            description: { rich_text: plainText(item.description) },
            button_link: { url: item.button_link || null },
            button_text: { rich_text: plainText(item.button_text || "") },
            view_type: { select: { name: item.view_type } },
            media_aspect_ratio: {
                rich_text: plainText(item.media_aspect_ratio || ""),
            },
            media_height: { rich_text: plainText(item.media_height || "") },
            media_mobile_height: { rich_text: plainText(item.media_mobile_height || "") },
            section_type: { select: { name: "info_section" } },
            enabled: { checkbox: sectionData.enabled === "true" },
        };

        if (item.image) {
            props.image = {
                files: [
                    { type: "external", name: "Image", external: { url: item.image } },
                ],
            };
        }

        await notion.pages.create({
            parent: { database_id: db.id },
            properties: props,
        });
    }
}

async function createDynamicSection(notion, parentId, sectionData) {
    console.log(`     - Creating Dynamic Section: ${sectionData.title}`);
    const properties = {
        title: { title: {} },
        collection_name: { rich_text: {} },
        description: { rich_text: {} },
        view_type: {
            select: {
                options: [
                    { name: "list_view", color: "blue" },
                    { name: "card_view", color: "green" },
                    { name: "grid_view", color: "yellow" },
                    { name: "minimal_list_view", color: "gray" },
                    { name: "tiny_card_view", color: "pink" },
                    { name: "big_card_view", color: "red" },
                ],
            },
        },
        items_in_view: { number: {} },
        top_part_centered: { checkbox: {} },
        section_type: {
            select: { options: sectionTypeOptions },
        },
        enabled: { checkbox: {} },
    };

    const db = await notion.databases.create({
        parent: { type: "page_id", page_id: parentId },
        title: plainText(sectionData.title),
        is_inline: true,
        properties,
    });

    // Seed Data
    if (sectionData.data && sectionData.data.length > 0) {
        const item = sectionData.data[0];
        const props = {
            title: { title: plainText(item.title || sectionData.title) },
            collection_name: { rich_text: plainText(item.collection_name) },
            description: { rich_text: plainText(item.description || "") },
            view_type: { select: { name: item.view_type } },
            items_in_view: { number: item.items_in_view || 6 },
            top_part_centered: { checkbox: item.top_part_centered || false },
            section_type: { select: { name: "dynamic_section" } },
            enabled: { checkbox: sectionData.enabled === "true" },
        };

        await notion.pages.create({
            parent: { database_id: db.id },
            properties: props,
        });
    }
}

async function createHtmlSection(notion, parentId, sectionData) {
    console.log(`     - Creating HTML Section: ${sectionData.title}`);
    const properties = {
        title: { title: {} },
        description: { rich_text: {} },
        height: { rich_text: {} },
        mobile_height: { rich_text: {} },
        full_width: { checkbox: {} },
        top_part_centered: { checkbox: {} },
        section_type: {
            select: { options: sectionTypeOptions },
        },
        enabled: { checkbox: {} },
    };

    const db = await notion.databases.create({
        parent: { type: "page_id", page_id: parentId },
        title: plainText(sectionData.title),
        is_inline: true,
        properties,
    });

    if (sectionData.data && sectionData.data.length > 0) {
        const item = sectionData.data[0];
        await notion.pages.create({
            parent: { database_id: db.id },
            properties: {
                title: { title: plainText(item.title || sectionData.title) },
                description: { rich_text: plainText(item.description || "") },
                height: { rich_text: plainText(item.height || "") },
                mobile_height: { rich_text: plainText(item.mobile_height || "") },
                full_width: { checkbox: item.full_width || false },
                top_part_centered: { checkbox: item.top_part_centered || false },
                section_type: { select: { name: "html_section" } },
                enabled: { checkbox: sectionData.enabled === "true" },
            },
            // The HTML code goes as a code block inside the page
            children: item.html_code ? [codeBlock(item.html_code, "html")] : [],
        });
    }
}

async function createIframeSection(notion, parentId, sectionData) {
    console.log(`     - Creating Iframe Section: ${sectionData.title}`);
    const properties = {
        title: { title: {} },
        description: { rich_text: {} },
        url: { url: {} },
        height: { rich_text: {} },
        mobile_height: { rich_text: {} },
        full_width: { checkbox: {} },
        top_part_centered: { checkbox: {} },
        section_type: {
            select: { options: sectionTypeOptions },
        },
        enabled: { checkbox: {} },
    };

    const db = await notion.databases.create({
        parent: { type: "page_id", page_id: parentId },
        title: plainText(sectionData.title),
        is_inline: true,
        properties,
    });

    if (sectionData.data && sectionData.data.length > 0) {
        const item = sectionData.data[0];
        await notion.pages.create({
            parent: { database_id: db.id },
            properties: {
                title: { title: plainText(item.title || sectionData.title) },
                description: { rich_text: plainText(item.description || "") },
                url: { url: item.url || null },
                height: { rich_text: plainText(item.height || "") },
                mobile_height: { rich_text: plainText(item.mobile_height || "") },
                full_width: { checkbox: item.full_width || false },
                top_part_centered: { checkbox: item.top_part_centered || false },
                section_type: { select: { name: "iframe_section" } },
                enabled: { checkbox: sectionData.enabled === "true" },
            },
        });
    }
}

async function createVideoEmbedSection(notion, parentId, sectionData) {
    console.log(`     - Creating Video Embed Section: ${sectionData.title}`);
    const properties = {
        title: { title: {} },
        description: { rich_text: {} },
        url: { url: {} },
        top_part_centered: { checkbox: {} },
        section_type: {
            select: { options: sectionTypeOptions },
        },
        enabled: { checkbox: {} },
    };

    const db = await notion.databases.create({
        parent: { type: "page_id", page_id: parentId },
        title: plainText(sectionData.title),
        is_inline: true,
        properties,
    });

    if (sectionData.data && sectionData.data.length > 0) {
        const item = sectionData.data[0];
        await notion.pages.create({
            parent: { database_id: db.id },
            properties: {
                title: { title: plainText(item.title || sectionData.title) },
                description: { rich_text: plainText(item.description || "") },
                url: { url: item.url || null },
                top_part_centered: { checkbox: item.top_part_centered || false },
                section_type: { select: { name: "video_embed_section" } },
                enabled: { checkbox: sectionData.enabled === "true" },
            },
        });
    }
}

async function createMediaSection(notion, parentId, sectionData) {
    console.log(`     - Creating Media Section: ${sectionData.title}`);
    const properties = {
        title: { title: {} },
        description: { rich_text: {} },
        media: { files: {} },
        height: { rich_text: {} },
        mobile_height: { rich_text: {} },
        full_width: { checkbox: {} },
        top_part_centered: { checkbox: {} },
        section_type: {
            select: { options: sectionTypeOptions },
        },
        enabled: { checkbox: {} },
    };

    const db = await notion.databases.create({
        parent: { type: "page_id", page_id: parentId },
        title: plainText(sectionData.title),
        is_inline: true,
        properties,
    });

    if (sectionData.data && sectionData.data.length > 0) {
        const item = sectionData.data[0];
        const props = {
            title: { title: plainText(item.title || sectionData.title) },
            description: { rich_text: plainText(item.description || "") },
            height: { rich_text: plainText(item.height || "400px") },
            mobile_height: { rich_text: plainText(item.mobile_height || "") },
            full_width: { checkbox: item.full_width || false },
            top_part_centered: { checkbox: item.top_part_centered || false },
            section_type: { select: { name: "media_section" } },
            enabled: { checkbox: sectionData.enabled === "true" },
        };

        if (item.media) {
            props.media = {
                files: [
                    { type: "external", name: "Media", external: { url: item.media } },
                ],
            };
        }

        await notion.pages.create({
            parent: { database_id: db.id },
            properties: props,
        });
    }
}

async function createMailtoSection(notion, parentId, sectionData) {
    console.log(`     - Creating Mailto Section: ${sectionData.title}`);
    const properties = {
        title: { title: {} },
        subject: { rich_text: {} },
        receiver_email: { rich_text: {} },
        placeholder_text: { rich_text: {} },
        button_text: { rich_text: {} },
        section_type: {
            select: { options: sectionTypeOptions },
        },
        enabled: { checkbox: {} },
    };

    const db = await notion.databases.create({
        parent: { type: "page_id", page_id: parentId },
        title: plainText(sectionData.title),
        is_inline: true,
        properties,
    });

    if (sectionData.data && sectionData.data.length > 0) {
        const item = sectionData.data[0];
        await notion.pages.create({
            parent: { database_id: db.id },
            properties: {
                title: { title: plainText(item.title || sectionData.title) },
                subject: { rich_text: plainText(item.subject || "") },
                receiver_email: { rich_text: plainText(item.receiver_email || "") },
                placeholder_text: { rich_text: plainText(item.placeholder_text || "") },
                button_text: { rich_text: plainText(item.button_text || "") },
                section_type: { select: { name: "mailto_section" } },
                enabled: { checkbox: sectionData.enabled === "true" },
            },
        });
    }
}

async function createNewsletterSection(notion, parentId, sectionData) {
    console.log(`     - Creating Newsletter Section: ${sectionData.title}`);
    const properties = {
        title: { title: {} },
        section_type: {
            select: { options: sectionTypeOptions },
        },
        enabled: { checkbox: {} },
    };

    const db = await notion.databases.create({
        parent: { type: "page_id", page_id: parentId },
        title: plainText(sectionData.title),
        is_inline: true,
        properties,
    });

    if (sectionData.data && sectionData.data.length > 0) {
        const item = sectionData.data[0];
        await notion.pages.create({
            parent: { database_id: db.id },
            properties: {
                title: { title: plainText(item.title || sectionData.title) },
                section_type: { select: { name: "newsletter_section" } },
                enabled: { checkbox: sectionData.enabled === "true" },
            },
        });
    }
}
