
import {
    dummyConfig,
    dummyHomePageSections,
    dummyCollections,
    dummyNavbarPages,
    dummyCollectionSettings,
    dummyAuthors,
    dummyCodeInjection,
} from './dummy-data.mjs';

/**
 * Checks if a block is effectively empty (empty paragraph or heading).
 */
function isEmptyBlock(block) {
    const type = block.type;
    // Only consider text blocks as potentially "empty" safe to ignore
    if (!['paragraph', 'heading_1', 'heading_2', 'heading_3', 'quote', 'callout'].includes(type)) {
        return false;
    }

    const content = block[type];
    const richText = content.rich_text;

    // If no rich text, it's empty
    if (!richText || richText.length === 0) return true;

    // Check if all text elements are just whitespace
    return richText.every(text => !text.plain_text || text.plain_text.trim() === '');
}

/**
 * Checks if the root page is empty and supports seeding.
 */
export async function ensureSiteStructure(rootPageId, notion) {
    if (!rootPageId || !notion) {
        console.log("❌ Missing Root Page ID or Notion Client.");
        return;
    }

    console.log("🔍 Checking root page validity...");

    // Check if root page is empty
    const blocks = await notion.blocks.children.list({ block_id: rootPageId });

    // Filter out empty blocks
    const nonEmptyBlocks = blocks.results.filter(block => !isEmptyBlock(block));

    if (nonEmptyBlocks.length > 0) {
        console.log("Root page is NOT empty. Skipping seeding to prevent data loss.");
        console.log(`ℹ️ Found ${nonEmptyBlocks.length} non-empty blocks on the root page (out of ${blocks.results.length} total).`);
        process.exit(0);
    }

    if (blocks.results.length > 0) {
        console.log(`ℹ️ Found ${blocks.results.length} blocks, but all are empty. Proceeding...`);
    }

    console.log("✅ Root page is ready. Proceeding with seeding...");
    await seedNotion(rootPageId, notion);
}

export async function seedNotion(rootPageId, notion) {
    console.log("🚀 Starting seeding process...");


    await createHomePage(rootPageId, notion);
    await createNavbarPages(rootPageId, notion);


    const collectionsPageId = await createCollectionsPage(rootPageId, notion);
    await createCollections(collectionsPageId, notion);


    await createAuthorDB(rootPageId, notion);

    const settingsPageId = await createSettingsPage(rootPageId, notion);

    // Nest under Settings
    await createConfigDB(settingsPageId, notion);
    await createCollectionSettingsPage(settingsPageId, notion);
    await createCodeInjectionPage(settingsPageId, notion);


    console.log("✨ Seeding process completed successfully!");
}

async function createSettingsPage(rootPageId, notion) {
    console.log("\n📦 Creating Page: Settings...");
    const page = await notion.pages.create({
        parent: { page_id: rootPageId },
        properties: { title: { title: plainText('Settings') } },
        icon: { type: "emoji", emoji: "⚙️" },
    });
    console.log(`   ✅ Settings Page created (ID: ${page.id})`);
    return page.id;
}



// --- Helpers ---

const plainText = (content) => [{ type: 'text', text: { content: content || '' } }];

const heading1 = (content) => ({
    object: 'block',
    type: 'heading_1',
    heading_1: { rich_text: plainText(content) }
});

const heading2 = (content) => ({
    object: 'block',
    type: 'heading_2',
    heading_2: { rich_text: plainText(content) }
});

const heading3 = (content) => ({
    object: 'block',
    type: 'heading_3',
    heading_3: { rich_text: plainText(content) }
});

const textBlock = (content) => ({
    object: 'block',
    type: 'paragraph',
    paragraph: { rich_text: plainText(content) }
});

const bulletedListItem = (content) => ({
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: { rich_text: plainText(content) }
});

const quoteBlock = (content) => ({
    object: 'block',
    type: 'quote',
    quote: { rich_text: plainText(content) }
});

const codeBlock = (content, language = "plain text") => ({
    object: 'block',
    type: 'code',
    code: {
        rich_text: plainText(content),
        language: language
    }
});

const imageBlock = (url, caption = "") => ({
    object: 'block',
    type: 'image',
    image: {
        type: "external",
        external: { url },
        caption: caption ? plainText(caption) : []
    }
});

function buildBlocks(contentArray) {
    if (!contentArray || !Array.isArray(contentArray)) {
        if (typeof contentArray === 'string') return [textBlock(contentArray)];
        return [];
    }

    return contentArray.map(item => {
        switch (item.type) {
            case 'heading_1': return heading1(item.content);
            case 'heading_2': return heading2(item.content);
            case 'heading_3': return heading3(item.content);
            case 'paragraph': return textBlock(item.content);
            case 'bullet_list_item': return bulletedListItem(item.content);
            case 'quote': return quoteBlock(item.content);
            case 'code': return codeBlock(item.content, item.language);
            case 'image': return imageBlock(item.url, item.caption);
            default: return textBlock(item.content || '');
        }
    });
}

// --- 1. Global Config ---

// --- 1. Global Config (Now General Configuration) ---

async function createConfigDB(parentId, notion) {
    console.log("\n📦 Creating Database: Config...");

    const db = await notion.databases.create({
        parent: { type: 'page_id', page_id: parentId },
        title: plainText('General Configuration'),
        initial_data_source: {
            properties: {
                Name: { title: {} }, // Field Name (e.g. social_twitter)
                Value: { rich_text: {} }, // Value
                Media: { files: {} } // For logo
            }
        }
    });

    await notion.databases.update({
        database_id: db.id,
        icon: { type: "emoji", emoji: "⚙️" },
    });

    console.log(`   ✅ Config Database created (ID: ${db.id})`);
    console.log("   > Seeding Config data...");

    // Seed Config Data
    const reversedData = [...dummyConfig].reverse();
    for (const item of reversedData) {
        const props = {
            Name: { title: plainText(item.field) },
            Value: { rich_text: plainText(item.value) }
        };

        if (item.media) {
            props.Media = {
                files: [{ type: "external", name: "Media", external: { url: item.media } }]
            };
        }

        await notion.pages.create({
            parent: { database_id: db.id },
            properties: props
        });
    }
}

// --- 2. Collections ---

async function createCollectionsPage(rootPageId, notion) {
    console.log("\n📦 Creating Page: Collections...");
    const page = await notion.pages.create({
        parent: { page_id: rootPageId },
        properties: { title: { title: plainText('Collections') } },
        icon: { type: "emoji", emoji: "📚" },
    });
    console.log(`   ✅ Collections Page created (ID: ${page.id})`);
    return page.id;
}

async function createCollections(parentId, notion) {
    const sharedSchema = {
        Title: { title: {} },
        Description: { rich_text: {} },
        Image: { files: {} },
        Tags: { multi_select: {} },
        Link: { url: {} },
        order_priority: { number: { format: 'number' } },
        author_username: { rich_text: {} },
        video_embed_link: { url: {} },
        // Rich Content is just the page content
    };

    for (const [name, items] of Object.entries(dummyCollections)) {
        console.log(`\n   > Creating Collection Database: ${name}...`);
        const db = await notion.databases.create({
            parent: { type: 'page_id', page_id: parentId },
            title: plainText(name),
            is_inline: false, // Full page databases for collections
            initial_data_source: { properties: sharedSchema }
        });

        await notion.databases.update({
            database_id: db.id,
            icon: { type: "emoji", emoji: "🗃️" },
        });

        console.log(`     Seeding ${items.length} items into ${name}...`);

        for (const item of items) {
            const props = {
                Title: { title: plainText(item.title) },
                Description: { rich_text: plainText(item.description) },
                Tags: { multi_select: (item.tags || []).map(t => ({ name: t })) },
                Link: { url: item.link || null },
                order_priority: { number: item.order_priority || 0 },
                author_username: { rich_text: plainText(item.author_username || '') },
                video_embed_link: { url: item.video_embed_link || null },
            };

            if (item.image) {
                props.Image = {
                    files: [{ type: "external", name: "Image", external: { url: item.image } }]
                };
            }

            await notion.pages.create({
                parent: { database_id: db.id },
                properties: props,
                children: buildBlocks(item.rich_content)
            });
        }
    }
}

// --- 3. Navbar Pages ---

export async function createNavbarPages(rootPageId, notion) {
    console.log("\n📦 Creating Page: Navbar Pages...");
    const page = await notion.pages.create({
        parent: { page_id: rootPageId },
        properties: { title: { title: plainText('Navbar Pages') } },
        icon: { type: "emoji", emoji: "📑" },
    });
    console.log(`   ✅ Navbar Pages Container created (ID: ${page.id})`);

    console.log("   > Seeding Navbar Pages...");
    for (const item of dummyNavbarPages) {
        console.log(`     - Creating Page: ${item.title}`);
        await notion.pages.create({
            parent: { page_id: page.id },
            properties: { title: { title: plainText(item.title) } },
            children: buildBlocks(item.content)
        });
    }
}

// --- 4. Home Page & Sections ---

async function createHomePage(rootPageId, notion) {
    console.log("\n📦 Creating Page: Home Page...");
    const page = await notion.pages.create({
        parent: { page_id: rootPageId },
        properties: { title: { title: plainText('Home Page') } },
        icon: { type: "emoji", emoji: "🏠" },
    });
    console.log(`   ✅ Home Page created (ID: ${page.id})`);

    console.log("   > Creating Info & Dynamic Sections...");

    for (const section of dummyHomePageSections) {
        if (section.type === 'info_section') {
            await createInfoSection(notion, page.id, section);
        } else if (section.type === 'dynamic_section') {
            await createDynamicSection(notion, page.id, section);
        }
        // Add a spacer
        await notion.blocks.children.append({ block_id: page.id, children: [textBlock("")] });
    }
}

async function createInfoSection(notion, parentId, sectionData) {
    console.log(`     - Creating Info Section: ${sectionData.title}`);
    const properties = {
        title: { title: {} },
        description: { rich_text: {} },
        link: { url: {} },
        image: { files: {} },
        view_type: {
            select: {
                options: [
                    { name: 'col_centered_view', color: 'blue' },
                    { name: 'col_left_view', color: 'green' },
                    { name: 'row_reverse_view', color: 'yellow' },
                    { name: 'row_view', color: 'purple' },
                ]
            }
        },
        section_type: {
            select: {
                options: [
                    { name: 'info_section', color: 'gray' },
                    { name: 'dynamic_section', color: 'orange' }
                ]
            }
        },
        visibility: { checkbox: {} }
    };

    const db = await notion.databases.create({
        parent: { type: 'page_id', page_id: parentId },
        title: plainText(sectionData.title),
        is_inline: true,
        initial_data_source: { properties }
    });

    // Seed Data
    if (sectionData.data && sectionData.data.length > 0) {
        const item = sectionData.data[0]; // Info sections usually have 1 item acting as the content
        const props = {
            title: { title: plainText(item.title) },
            description: { rich_text: plainText(item.description) },
            link: { url: item.link || null },
            view_type: { select: { name: item.view_type } },
            section_type: { select: { name: 'info_section' } },
            visibility: { checkbox: sectionData.visibility === 'true' }
        };

        if (item.image) {
            props.image = {
                files: [{ type: "external", name: "Image", external: { url: item.image } }]
            };
        }

        await notion.pages.create({
            parent: { database_id: db.id },
            properties: props
        });
    }
}

async function createDynamicSection(notion, parentId, sectionData) {
    console.log(`     - Creating Dynamic Section: ${sectionData.title}`);
    // "collection_name" is the Title field
    const properties = {
        collection_name: { title: {} },
        section_title: { rich_text: {} },
        view_type: {
            select: {
                options: [
                    { name: 'list_view', color: 'blue' },
                    { name: 'card_view', color: 'green' },
                    { name: 'grid_view', color: 'yellow' },
                    { name: 'minimal_list_view', color: 'gray' },
                ]
            }
        },
        section_type: {
            select: {
                options: [
                    { name: 'info_section', color: 'gray' },
                    { name: 'dynamic_section', color: 'orange' }
                ]
            }
        },
        visibility: { checkbox: {} }
    };

    const db = await notion.databases.create({
        parent: { type: 'page_id', page_id: parentId },
        title: plainText(sectionData.title),
        is_inline: true,
        initial_data_source: { properties }
    });

    // Seed Data
    if (sectionData.data && sectionData.data.length > 0) {
        const item = sectionData.data[0];
        const props = {
            collection_name: { title: plainText(item.collection_name) },
            section_title: { rich_text: plainText(item.section_title || sectionData.title) },
            view_type: { select: { name: item.view_type } },
            section_type: { select: { name: 'dynamic_section' } },
            visibility: { checkbox: sectionData.visibility === 'true' }
        };

        await notion.pages.create({
            parent: { database_id: db.id },
            properties: props
        });
    }
}

// --- 5. Authors Database ---

async function createAuthorDB(rootPageId, notion) {
    console.log("\n📦 Creating Database: Authors...");

    const db = await notion.databases.create({
        parent: { type: 'page_id', page_id: rootPageId },
        title: plainText('Authors'),
        initial_data_source: {
            properties: {
                name: { title: {} },
                username: { rich_text: {} },
                email: { email: {} },
                description: { rich_text: {} },
                picture: { files: {} },
                instagram_handle: { rich_text: {} },
                x_handle: { rich_text: {} },
                github_handle: { rich_text: {} },
            }
        }
    });

    await notion.databases.update({
        database_id: db.id,
        icon: { type: "emoji", emoji: "👤" },
    });

    console.log(`   ✅ Authors Database created (ID: ${db.id})`);
    console.log("   > Seeding Authors data...");

    const seededUsernames = new Set();

    for (const author of dummyAuthors) {
        if (seededUsernames.has(author.username)) {
            console.warn(`Original warning: Skipping duplicate author username: ${author.username}`);
            continue;
        }
        seededUsernames.add(author.username);

        const props = {
            name: { title: plainText(author.name) },
            username: { rich_text: plainText(author.username) },
            email: { email: author.email },
            description: { rich_text: plainText(author.description) },
            instagram_handle: { rich_text: plainText(author.instagram_handle || '') },
            x_handle: { rich_text: plainText(author.x_handle || '') },
            github_handle: { rich_text: plainText(author.github_handle || '') },
        };

        if (author.picture) {
            props.picture = {
                files: [{ type: "external", name: "Picture", external: { url: author.picture } }]
            };
        }

        await notion.pages.create({
            parent: { database_id: db.id },
            properties: props
        });
    }
}

// --- 6. Collection Settings Page ---

async function createCollectionSettingsPage(parentId, notion) {
    console.log("\n📦 Creating Page: Configure Collections...");
    const page = await notion.pages.create({
        parent: { page_id: parentId },
        properties: { title: { title: plainText('Configure Collections') } },
        icon: { type: "emoji", emoji: "🔧" },
    });
    console.log(`   ✅ Configure Collections Page created (ID: ${page.id})`);

    // Create one inline DB per collection
    for (const [name, settings] of Object.entries(dummyCollectionSettings)) {
        console.log(`   > Creating Collection Settings DB: ${name}...`);

        const db = await notion.databases.create({
            parent: { type: 'page_id', page_id: page.id },
            title: plainText(`${name} Settings`),
            is_inline: true,
            initial_data_source: {
                properties: {
                    collection_name: { title: {} },
                    enable_rss: { checkbox: {} },
                    show_newsletter_section: { checkbox: {} },
                }
            }
        });

        // Seed the settings row
        await notion.pages.create({
            parent: { database_id: db.id },
            properties: {
                collection_name: { title: plainText(settings.collection_name) },
                enable_rss: { checkbox: settings.enable_rss === 'true' },
                show_newsletter_section: { checkbox: settings.show_newsletter_section === 'true' },
            }
        });
    }
}

// --- 7. Code Injection Page ---

async function createCodeInjectionPage(parentId, notion) {
    console.log("\n📦 Creating Page: Code Injection...");

    const children = dummyCodeInjection.map(code => codeBlock(code, 'html'));

    const page = await notion.pages.create({
        parent: { page_id: parentId },
        properties: { title: { title: plainText('Code') } },
        icon: { type: "emoji", emoji: "🤖" },
        children: children,
    });

    console.log(`   ✅ Code Injection Page created (ID: ${page.id})`);
}
