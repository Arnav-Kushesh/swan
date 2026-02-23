// Seed Config
// Functions for creating config/settings databases in Notion

import { plainText, textBlock, codeBlock } from "./notion-blocks.mjs";
import { createAnySection } from "./seed-sections.mjs";
import {
    dummyConfig,
    dummyBasicConfig,
    dummySocialLinks,
    dummyAuthors,
    dummyCollectionSettings,
    dummyCodeInjection,
    dummyCssInjection,
    dummyExtraSections,
    dummyAdvancedConfig,
} from "./dummy-data.mjs";

// --- 1. Main Config ---

export async function createBasicConfigDB(parentId, notion) {
    console.log("\nCreating Database: Main Config...");

    const db = await notion.databases.create({
        parent: { type: "page_id", page_id: parentId },
        title: plainText("Main Config"),
        properties: {
            title: { title: {} },
            description: { rich_text: {} },
            tagline: { rich_text: {} },
            keywords: { rich_text: {} },
            logo: { files: {} },
            favicon: { files: {} },
            og_image: { files: {} },
            default_color_mode: {
                select: {
                    options: [
                        { name: "light", color: "default" },
                        { name: "dark", color: "gray" },
                        { name: "cream", color: "yellow" },
                        { name: "pink", color: "pink" },
                        { name: "blue", color: "blue" },
                        { name: "purple", color: "purple" },
                        { name: "red", color: "red" },
                        { name: "green", color: "green" },
                    ],
                },
            },
            sidebar_navigation: { checkbox: {} },
        },
    });

    await notion.databases.update({
        database_id: db.id,
        icon: { type: "emoji", emoji: "🔩" },
    });

    console.log(`   Main Config Database created (ID: ${db.id})`);
    console.log("   > Seeding Main Config data...");

    const props = {
        title: { title: plainText(dummyBasicConfig.title) },
        description: { rich_text: plainText(dummyBasicConfig.description) },
        tagline: { rich_text: plainText(dummyBasicConfig.tagline) },
        keywords: { rich_text: plainText(dummyBasicConfig.keywords) },
        default_color_mode: {
            select: { name: dummyBasicConfig.default_color_mode },
        },
        sidebar_navigation: { checkbox: dummyBasicConfig.sidebar_navigation },
    };

    if (dummyBasicConfig.logo) {
        props.logo = {
            files: [
                {
                    type: "external",
                    name: "Logo",
                    external: { url: dummyBasicConfig.logo },
                },
            ],
        };
    }

    if (dummyBasicConfig.favicon) {
        props.favicon = {
            files: [
                {
                    type: "external",
                    name: "Favicon",
                    external: { url: dummyBasicConfig.favicon },
                },
            ],
        };
    }

    if (dummyBasicConfig.og_image) {
        props.og_image = {
            files: [
                {
                    type: "external",
                    name: "OG Image",
                    external: { url: dummyBasicConfig.og_image },
                },
            ],
        };
    }

    await notion.pages.create({
        parent: { database_id: db.id },
        properties: props,
    });
}

// --- 2. General Config ---

export async function createConfigDB(parentId, notion) {
    console.log("\nCreating Database: General Config...");

    const db = await notion.databases.create({
        parent: { type: "page_id", page_id: parentId },
        title: plainText("General Config"),
        properties: {
            label: { title: {} },
            hide_topbar_logo: { checkbox: {} },
            hide_sidebar_logo: { checkbox: {} },
            enable_newsletter: { checkbox: {} },
            newsletter_form_url: { url: {} },
            mention_this_tool_in_footer: { checkbox: {} },
            primary_font: { rich_text: {} },
            secondary_font: { rich_text: {} },
        },
    });

    await notion.databases.update({
        database_id: db.id,
        icon: { type: "emoji", emoji: "🗜️" },
    });

    console.log(`   General Config Database created (ID: ${db.id})`);
    console.log("   > Seeding General Config data...");

    await notion.pages.create({
        parent: { database_id: db.id },
        properties: {
            label: { title: plainText("Site Settings") },
            hide_topbar_logo: { checkbox: dummyConfig.hide_topbar_logo },
            hide_sidebar_logo: {
                checkbox: dummyConfig.hide_sidebar_logo,
            },
            enable_newsletter: { checkbox: dummyConfig.enable_newsletter },
            newsletter_form_url: { url: dummyConfig.newsletter_form_url || null },
            mention_this_tool_in_footer: {
                checkbox: dummyConfig.mention_this_tool_in_footer,
            },
            primary_font: {
                rich_text: plainText(dummyConfig.primary_font || "Inter"),
            },
            secondary_font: {
                rich_text: plainText(dummyConfig.secondary_font || "Inter"),
            },
        },
    });
}

// --- 3. Social ---

export async function createSocialLinksDB(parentId, notion) {
    console.log("\nCreating Database: Social...");

    const db = await notion.databases.create({
        parent: { type: "page_id", page_id: parentId },
        title: plainText("Social"),
        properties: {
            name: { title: {} },
            data: { rich_text: {} },
        },
    });

    await notion.databases.update({
        database_id: db.id,
        icon: { type: "emoji", emoji: "🔗" },
    });

    console.log(`   Social Database created (ID: ${db.id})`);
    console.log("   > Seeding Social data...");

    // Create one row per social link
    const reversedLinks = [...dummySocialLinks].reverse();
    for (const link of reversedLinks) {
        await notion.pages.create({
            parent: { database_id: db.id },
            properties: {
                name: { title: plainText(link.name) },
                data: { rich_text: plainText(link.data || "") },
            },
        });
    }
}

// --- Authors Database ---

export async function createAuthorDB(rootPageId, notion) {
    console.log("\nCreating Database: Authors...");

    const db = await notion.databases.create({
        parent: { type: "page_id", page_id: rootPageId },
        title: plainText("Authors"),
        properties: {
            name: { title: {} },
            username: { rich_text: {} },
            email: { email: {} },
            description: { rich_text: {} },
            picture: { files: {} },
            instagram_handle: { rich_text: {} },
            x_handle: { rich_text: {} },
            github_handle: { rich_text: {} },
        },
    });

    await notion.databases.update({
        database_id: db.id,
        icon: { type: "emoji", emoji: "👤" },
    });

    console.log(`   Authors Database created (ID: ${db.id})`);
    console.log("   > Seeding Authors data...");

    const seededUsernames = new Set();

    for (const author of dummyAuthors) {
        if (seededUsernames.has(author.username)) {
            console.warn(
                `Original warning: Skipping duplicate author username: ${author.username}`,
            );
            continue;
        }
        seededUsernames.add(author.username);

        const props = {
            name: { title: plainText(author.name) },
            username: { rich_text: plainText(author.username) },
            email: { email: author.email },
            description: { rich_text: plainText(author.description) },
            instagram_handle: { rich_text: plainText(author.instagram_handle || "") },
            x_handle: { rich_text: plainText(author.x_handle || "") },
            github_handle: { rich_text: plainText(author.github_handle || "") },
        };

        if (author.picture) {
            props.picture = {
                files: [
                    {
                        type: "external",
                        name: "Picture",
                        external: { url: author.picture },
                    },
                ],
            };
        }

        await notion.pages.create({
            parent: { database_id: db.id },
            properties: props,
        });
    }
}

// --- Collection Settings ---

export async function createCollectionSettingsPage(parentId, notion) {
    console.log("\nCreating Database: Configure Collections...");

    const db = await notion.databases.create({
        parent: { type: "page_id", page_id: parentId },
        title: plainText("Configure Collections"),
        properties: {
            collection_name: { title: {} },
            enable_rss: { checkbox: {} },
            show_newsletter_section: { checkbox: {} },
            show_mailto_comment_section: { checkbox: {} },
        },
    });

    await notion.databases.update({
        database_id: db.id,
        icon: { type: "emoji", emoji: "🗃️" },
    });

    console.log(`   Configure Collections Database created (ID: ${db.id})`);
    console.log("   > Seeding Collection Settings data...");

    // Create one row per collection
    const entries = Object.entries(dummyCollectionSettings);
    const reversedEntries = [...entries].reverse();
    for (const [, settings] of reversedEntries) {
        await notion.pages.create({
            parent: { database_id: db.id },
            properties: {
                collection_name: { title: plainText(settings.collection_name) },
                enable_rss: { checkbox: settings.enable_rss === "true" },
                show_newsletter_section: {
                    checkbox: settings.show_newsletter_section === "true",
                },
                show_mailto_comment_section: {
                    checkbox: settings.show_mailto_comment_section === "true",
                },
            },
        });
    }
}

// --- Advanced Config ---

export async function createAdvancedConfigDB(parentId, notion) {
    console.log("\nCreating Database: Advanced Config...");

    const themeOptions = [
        { name: "light", color: "default" },
        { name: "cream", color: "yellow" },
        { name: "pink", color: "pink" },
        { name: "dark", color: "gray" },
        { name: "blue", color: "blue" },
        { name: "purple", color: "purple" },
        { name: "red", color: "red" },
        { name: "green", color: "green" },
    ];

    const db = await notion.databases.create({
        parent: { type: "page_id", page_id: parentId },
        title: plainText("Advanced Config"),
        properties: {
            label: { title: {} },
            limit_theme_selection: {
                multi_select: { options: themeOptions },
            },
        },
    });

    await notion.databases.update({
        database_id: db.id,
        icon: { type: "emoji", emoji: "🛠️" },
    });

    console.log(`   Advanced Config Database created (ID: ${db.id})`);
    console.log("   > Seeding Advanced Config data...");

    await notion.pages.create({
        parent: { database_id: db.id },
        properties: {
            label: { title: plainText("Advanced Settings") },
            limit_theme_selection: {
                multi_select: dummyAdvancedConfig.limit_theme_selection.map((t) => ({
                    name: t,
                })),
            },
        },
    });
}

// --- Extra Sections for Collection Pages ---

export async function createExtraSectionsPage(settingsPageId, notion) {
    console.log("\nCreating Page: Collection Page Extra Sections...");
    const page = await notion.pages.create({
        parent: { page_id: settingsPageId },
        properties: {
            title: { title: plainText("Collection Page Extra Sections") },
        },
        icon: { type: "emoji", emoji: "🗂️" },
    });
    console.log(`   Collection Page Extra Sections created (ID: ${page.id})`);

    // Create a page per collection with inline DB sections
    for (const [collectionName, sections] of Object.entries(dummyExtraSections)) {
        console.log(`   > Creating extra sections page for: ${collectionName}...`);
        const collectionPage = await notion.pages.create({
            parent: { page_id: page.id },
            properties: { title: { title: plainText(collectionName) } },
        });

        for (const section of sections) {
            await createAnySection(notion, collectionPage.id, section);
            await notion.blocks.children.append({
                block_id: collectionPage.id,
                children: [textBlock("")],
            });
        }
    }
}

// --- Code Injection Page ---

export async function createCodeInjectionPage(parentId, notion) {
    console.log("\nCreating Page: Code Injection...");

    const children = dummyCodeInjection.map((code) => codeBlock(code, "html"));

    const page = await notion.pages.create({
        parent: { page_id: parentId },
        properties: { title: { title: plainText("HTML Head Code") } },
        icon: { type: "emoji", emoji: "🤖" },
        children: children,
    });

    console.log(`   Code Injection Page created (ID: ${page.id})`);
}

// --- CSS Injection Page ---

export async function createCssInjectionPage(parentId, notion) {
    console.log("\nCreating Page: CSS Injection...");

    const children = dummyCssInjection.map((code) => codeBlock(code, "css"));

    const page = await notion.pages.create({
        parent: { page_id: parentId },
        properties: { title: { title: plainText("CSS Styling") } },
        icon: { type: "emoji", emoji: "🎨" },
        children: children,
    });

    console.log(`   CSS Injection Page created (ID: ${page.id})`);
}
