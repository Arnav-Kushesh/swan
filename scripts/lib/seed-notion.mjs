// Seed Notion — Orchestrator
// Seeds a Notion workspace with the full site structure and dummy data.

import {
  dummyCollections,
  dummyNavbarPages,
  dummyHomePageSections,
} from "./dummy-data.mjs";

import { plainText, textBlock, buildBlocks } from "./notion-blocks.mjs";
import { createAnySection } from "./seed-sections.mjs";
import {
  createBasicConfigDB,
  createConfigDB,
  createSocialLinksDB,
  createAuthorDB,
  createCollectionSettingsPage,
  createAdvancedConfigDB,
  createCodeInjectionPage,
  createCssInjectionPage,
  createExtraSectionsPage,
} from "./seed-config.mjs";

// --- Helpers ---

// Checks if a block is effectively empty (empty paragraph or heading).
function isEmptyBlock(block) {
  if (
    block.type === "paragraph" &&
    (!block.paragraph.rich_text || block.paragraph.rich_text.length === 0)
  ) {
    return true;
  }

  const headingTypes = ["heading_1", "heading_2", "heading_3"];
  if (headingTypes.includes(block.type)) {
    const richText = block[block.type]?.rich_text;
    if (!richText || richText.length === 0) {
      return true;
    }
  }

  return false;
}

// --- Main Entry Points ---

// Checks if the root page is empty and supports seeding.
export async function ensureSiteStructure(rootPageId, notion) {
  if (!rootPageId) {
    console.error("ROOT_PAGE_ID is not set.");
    return;
  }

  console.log("Checking root page validity...");

  // Check if root page is empty
  const blocks = await notion.blocks.children.list({ block_id: rootPageId });

  // Filter out empty blocks
  const nonEmptyBlocks = blocks.results.filter((block) => !isEmptyBlock(block));

  if (nonEmptyBlocks.length > 0) {
    console.log(
      "Root page is NOT empty. Skipping seeding to prevent data loss.",
    );
    console.log(
      `Found ${nonEmptyBlocks.length} non-empty blocks on the root page (out of ${blocks.results.length} total).`,
    );
    process.exit(0);
  }

  if (blocks.results.length > 0) {
    console.log(
      `Found ${blocks.results.length} blocks, but all are empty. Proceeding...`,
    );
  }

  console.log("Root page is ready. Proceeding with seeding...");
  await seedNotion(rootPageId, notion);
}

export async function seedNotion(rootPageId, notion) {
  console.log("Starting seeding process...");

  await createHomePage(rootPageId, notion);
  await createNavbarPages(rootPageId, notion);

  const collectionsPageId = await createCollectionsPage(rootPageId, notion);
  await createCollections(collectionsPageId, notion);

  await createAuthorDB(rootPageId, notion);

  const settingsPageId = await createSettingsPage(rootPageId, notion);

  // Nest under Settings
  await createBasicConfigDB(settingsPageId, notion);
  await createConfigDB(settingsPageId, notion);
  await createAdvancedConfigDB(settingsPageId, notion);

  await createSocialLinksDB(settingsPageId, notion);
  await createCollectionSettingsPage(settingsPageId, notion);
  await createExtraSectionsPage(settingsPageId, notion);

  await createCodeInjectionPage(settingsPageId, notion);
  await createCssInjectionPage(settingsPageId, notion);

  console.log("Seeding process completed successfully!");
}

// --- Page Creators ---

async function createSettingsPage(rootPageId, notion) {
  console.log("\nCreating Page: Settings...");
  const page = await notion.pages.create({
    parent: { page_id: rootPageId },
    properties: { title: { title: plainText("Settings") } },
    icon: { type: "emoji", emoji: "⚙️" },
  });
  console.log(`   Settings Page created (ID: ${page.id})`);
  return page.id;
}

async function createCollectionsPage(rootPageId, notion) {
  console.log("\nCreating Page: Collections...");
  const page = await notion.pages.create({
    parent: { page_id: rootPageId },
    properties: { title: { title: plainText("Collections") } },
    icon: { type: "emoji", emoji: "📚" },
  });
  console.log(`   Collections Page created (ID: ${page.id})`);
  return page.id;
}

async function createCollections(parentId, notion) {
  const sharedSchema = {
    Title: { title: {} },
    Slug: { rich_text: {} },
    Description: { rich_text: {} },
    Image: { files: {} },
    Tags: { multi_select: {} },
    Link: { url: {} },
    button_text: { rich_text: {} },
    order_priority: { number: { format: "number" } },
    author_username: { rich_text: {} },
    video_embed_url: { url: {} },
    status: {
      select: {
        options: [
          { name: "draft", color: "gray" },
          { name: "in_review", color: "yellow" },
          { name: "published", color: "green" },
          { name: "archived", color: "red" },
        ],
      },
    },
  };

  for (const [name, items] of Object.entries(dummyCollections)) {
    console.log(`\n   > Creating Collection Database: ${name}...`);
    const db = await notion.databases.create({
      parent: { type: "page_id", page_id: parentId },
      title: plainText(name),
      is_inline: false, // Full page databases for collections
      properties: sharedSchema,
    });

    await notion.databases.update({
      database_id: db.id,
      icon: { type: "emoji", emoji: "🗃️" },
    });

    console.log(`     Seeding ${items.length} items into ${name}...`);

    for (const item of items) {
      const itemSlug = item.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const props = {
        Title: { title: plainText(item.title) },
        Slug: { rich_text: plainText(itemSlug) },
        Description: { rich_text: plainText(item.description) },
        Tags: { multi_select: (item.tags || []).map((t) => ({ name: t })) },
        Link: { url: item.link || null },
        button_text: { rich_text: plainText(item.button_text || "") },
        order_priority: { number: item.order_priority || 0 },
        author_username: { rich_text: plainText(item.author_username || "") },
        video_embed_url: { url: item.video_embed_url || null },
        status: { select: { name: item.status || "published" } },
      };

      if (item.image) {
        props.Image = {
          files: [
            { type: "external", name: "Image", external: { url: item.image } },
          ],
        };
      }

      await notion.pages.create({
        parent: { database_id: db.id },
        properties: props,
        children: buildBlocks(item.rich_content),
      });
    }
  }
}

export async function createNavbarPages(rootPageId, notion) {
  console.log("\nCreating Page: Navbar Pages...");
  const page = await notion.pages.create({
    parent: { page_id: rootPageId },
    properties: { title: { title: plainText("Navbar Pages") } },
    icon: { type: "emoji", emoji: "📑" },
  });
  console.log(`   Navbar Pages Container created (ID: ${page.id})`);

  console.log("   > Seeding Navbar Pages...");
  for (const item of dummyNavbarPages) {
    console.log(`     - Creating Page: ${item.title}`);
    const navPage = await notion.pages.create({
      parent: { page_id: page.id },
      properties: { title: { title: plainText(item.title) } },
      children: buildBlocks(item.content),
    });

    // Add section databases if defined
    if (item.sections && item.sections.length > 0) {
      for (const section of item.sections) {
        await createAnySection(notion, navPage.id, section);
        await notion.blocks.children.append({
          block_id: navPage.id,
          children: [textBlock("")],
        });
      }
    }
  }
}

async function createHomePage(rootPageId, notion) {
  console.log("\nCreating Page: Home Page...");
  const page = await notion.pages.create({
    parent: { page_id: rootPageId },
    properties: { title: { title: plainText("Home Page") } },
    icon: { type: "emoji", emoji: "🏠" },
  });
  console.log(`   Home Page created (ID: ${page.id})`);

  console.log("   > Creating Info & Dynamic Sections...");

  for (const section of dummyHomePageSections) {
    await createAnySection(notion, page.id, section);
    // Add a spacer
    await notion.blocks.children.append({
      block_id: page.id,
      children: [textBlock("")],
    });
  }
}
