import {
  dummyConfig,
  dummyBasicConfig,
  dummySocialLinks,
  dummyHomePageSections,
  dummyCollections,
  dummyNavbarPages,
  dummyCollectionSettings,
  dummyAuthors,
  dummyCodeInjection,
  dummyCssInjection,
  dummyExtraSections,
  dummyAdvancedConfig,
} from "./dummy-data.mjs";

/**
 * Checks if a block is effectively empty (empty paragraph or heading).
 */
function isEmptyBlock(block) {
  const type = block.type;
  // Only consider text blocks as potentially "empty" safe to ignore
  if (
    ![
      "paragraph",
      "heading_1",
      "heading_2",
      "heading_3",
      "quote",
      "callout",
    ].includes(type)
  ) {
    return false;
  }

  const content = block[type];
  const richText = content.rich_text;

  // If no rich text, it's empty
  if (!richText || richText.length === 0) return true;

  // Check if all text elements are just whitespace
  return richText.every(
    (text) => !text.plain_text || text.plain_text.trim() === "",
  );
}

/**
 * Checks if the root page is empty and supports seeding.
 */
export async function ensureSiteStructure(rootPageId, notion) {
  if (!rootPageId || !notion) {
    console.log("Missing Root Page ID or Notion Client.");
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

// --- Helpers ---

const plainText = (content) => [
  { type: "text", text: { content: content || "" } },
];

const heading1 = (content) => ({
  object: "block",
  type: "heading_1",
  heading_1: { rich_text: plainText(content) },
});

const heading2 = (content) => ({
  object: "block",
  type: "heading_2",
  heading_2: { rich_text: plainText(content) },
});

const heading3 = (content) => ({
  object: "block",
  type: "heading_3",
  heading_3: { rich_text: plainText(content) },
});

const textBlock = (content) => ({
  object: "block",
  type: "paragraph",
  paragraph: { rich_text: plainText(content) },
});

const bulletedListItem = (content) => ({
  object: "block",
  type: "bulleted_list_item",
  bulleted_list_item: { rich_text: plainText(content) },
});

const quoteBlock = (content) => ({
  object: "block",
  type: "quote",
  quote: { rich_text: plainText(content) },
});

const codeBlock = (content, language = "plain text") => ({
  object: "block",
  type: "code",
  code: {
    rich_text: plainText(content),
    language: language,
  },
});

const imageBlock = (url, caption = "") => ({
  object: "block",
  type: "image",
  image: {
    type: "external",
    external: { url },
    caption: caption ? plainText(caption) : [],
  },
});

function buildBlocks(contentArray) {
  if (!contentArray || !Array.isArray(contentArray)) {
    if (typeof contentArray === "string") return [textBlock(contentArray)];
    return [];
  }

  return contentArray.map((item) => {
    switch (item.type) {
      case "heading_1":
        return heading1(item.content);
      case "heading_2":
        return heading2(item.content);
      case "heading_3":
        return heading3(item.content);
      case "paragraph":
        return textBlock(item.content);
      case "bullet_list_item":
        return bulletedListItem(item.content);
      case "quote":
        return quoteBlock(item.content);
      case "code":
        return codeBlock(item.content, item.language);
      case "image":
        return imageBlock(item.url, item.caption);
      default:
        return textBlock(item.content || "");
    }
  });
}

// All section_type select options used across section databases
const sectionTypeOptions = [
  { name: "info_section", color: "gray" },
  { name: "dynamic_section", color: "orange" },
  { name: "html_section", color: "purple" },
  { name: "iframe_section", color: "blue" },
  { name: "video_embed_section", color: "red" },
  { name: "media_section", color: "pink" },
  { name: "mailto_section", color: "green" },
  { name: "newsletter_section", color: "yellow" },
];

// --- 1. Main Configuration ---

async function createBasicConfigDB(parentId, notion) {
  console.log("\nCreating Database: Main Configuration...");

  const db = await notion.databases.create({
    parent: { type: "page_id", page_id: parentId },
    title: plainText("Main Configuration"),
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
    icon: { type: "emoji", emoji: "⚙️" },
  });

  console.log(`   Main Configuration Database created (ID: ${db.id})`);
  console.log("   > Seeding Main Configuration data...");

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

// --- 2. General Configuration (Restructured with individual columns) ---

async function createConfigDB(parentId, notion) {
  console.log("\nCreating Database: General Configuration...");

  const db = await notion.databases.create({
    parent: { type: "page_id", page_id: parentId },
    title: plainText("General Configuration"),
    properties: {
      label: { title: {} },
      disable_logo_in_topbar: { checkbox: {} },
      disable_logo_in_sidebar: { checkbox: {} },
      enable_newsletter: { checkbox: {} },
      mailchimp_form_link: { url: {} },
      mention_this_tool_in_footer: { checkbox: {} },
      show_newsletter_section_on_home: { checkbox: {} },
    },
  });

  await notion.databases.update({
    database_id: db.id,
    icon: { type: "emoji", emoji: "⚙️" },
  });

  console.log(`   General Configuration Database created (ID: ${db.id})`);
  console.log("   > Seeding General Configuration data...");

  await notion.pages.create({
    parent: { database_id: db.id },
    properties: {
      label: { title: plainText("Site Settings") },
      disable_logo_in_topbar: { checkbox: dummyConfig.disable_logo_in_topbar },
      disable_logo_in_sidebar: {
        checkbox: dummyConfig.disable_logo_in_sidebar,
      },
      enable_newsletter: { checkbox: dummyConfig.enable_newsletter },
      mailchimp_form_link: { url: dummyConfig.mailchimp_form_link || null },
      mention_this_tool_in_footer: {
        checkbox: dummyConfig.mention_this_tool_in_footer,
      },
      show_newsletter_section_on_home: {
        checkbox: dummyConfig.show_newsletter_section_on_home,
      },
    },
  });
}

// --- 3. Social Links ---

async function createSocialLinksDB(parentId, notion) {
  console.log("\nCreating Database: Social Links...");

  const db = await notion.databases.create({
    parent: { type: "page_id", page_id: parentId },
    title: plainText("Social Links"),
    properties: {
      name: { title: {} },
      data: { rich_text: {} },
    },
  });

  await notion.databases.update({
    database_id: db.id,
    icon: { type: "emoji", emoji: "🔗" },
  });

  console.log(`   Social Links Database created (ID: ${db.id})`);
  console.log("   > Seeding Social Links data...");

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

// --- 4. Collections ---

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
    video_embed_link: { url: {} },
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
        video_embed_link: { url: item.video_embed_link || null },
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

// --- 5. Navbar Pages ---

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

// --- 6. Home Page & Sections ---

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

// Universal section creator that dispatches to the right function
async function createAnySection(notion, parentId, section) {
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
    link: { url: {} },
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
    media_mobile_width: { rich_text: {} },
    media_desktop_width: { rich_text: {} },
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
      link: { url: item.link || null },
      button_text: { rich_text: plainText(item.button_text || "") },
      view_type: { select: { name: item.view_type } },
      media_aspect_ratio: {
        rich_text: plainText(item.media_aspect_ratio || ""),
      },
      media_mobile_width: {
        rich_text: plainText(item.media_mobile_width || ""),
      },
      media_desktop_width: {
        rich_text: plainText(item.media_desktop_width || ""),
      },
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
  // "collection_name" is the Title field
  const properties = {
    collection_name: { title: {} },
    section_title: { rich_text: {} },
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
    items_shown_at_once: { number: {} },
    top_section_centered: { checkbox: {} },
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
      collection_name: { title: plainText(item.collection_name) },
      section_title: {
        rich_text: plainText(item.section_title || sectionData.title),
      },
      description: { rich_text: plainText(item.description || "") },
      view_type: { select: { name: item.view_type } },
      items_shown_at_once: { number: item.items_shown_at_once || 6 },
      top_section_centered: { checkbox: item.top_section_centered || false },
      section_type: { select: { name: "dynamic_section" } },
      enabled: { checkbox: sectionData.enabled === "true" },
    };

    await notion.pages.create({
      parent: { database_id: db.id },
      properties: props,
    });
  }
}

// --- New Section Types ---

async function createHtmlSection(notion, parentId, sectionData) {
  console.log(`     - Creating HTML Section: ${sectionData.title}`);
  const properties = {
    title: { title: {} },
    height: { number: { format: "number" } },
    full_width: { checkbox: {} },
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
        height: { number: item.height || null },
        full_width: { checkbox: item.full_width || false },
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
    url: { url: {} },
    height: { number: {} },
    full_width: { checkbox: {} },
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
        url: { url: item.url || null },
        height: { number: item.height || null },
        full_width: { checkbox: item.full_width || false },
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
    url: { url: {} },
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
        url: { url: item.url || null },
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
    media: { files: {} },
    height: { number: {} },
    height_on_mobile: { number: {} },
    height_on_desktop: { number: {} },
    full_width: { checkbox: {} },
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
      height: { number: item.height || 400 },
      height_on_mobile: { number: item.height_on_mobile || null },
      height_on_desktop: { number: item.height_on_desktop || null },
      full_width: { checkbox: item.full_width || false },
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
    receiver: { rich_text: {} },
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
        receiver: { rich_text: plainText(item.receiver || "") },
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

// --- 7. Extra Sections for Collection Pages ---

async function createExtraSectionsPage(settingsPageId, notion) {
  console.log("\nCreating Page: Collection Page Extra Sections...");
  const page = await notion.pages.create({
    parent: { page_id: settingsPageId },
    properties: {
      title: { title: plainText("Collection Page Extra Sections") },
    },
    icon: { type: "emoji", emoji: "🧩" },
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

// --- 8. Authors Database ---

async function createAuthorDB(rootPageId, notion) {
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

// --- 9. Collection Settings (single database, one row per collection) ---

async function createCollectionSettingsPage(parentId, notion) {
  console.log("\nCreating Database: Configure Collections...");

  const db = await notion.databases.create({
    parent: { type: "page_id", page_id: parentId },
    title: plainText("Configure Collections"),
    properties: {
      collection_name: { title: {} },
      enable_rss: { checkbox: {} },
      show_newsletter_section: { checkbox: {} },
      show_mailto_section: { checkbox: {} },
    },
  });

  await notion.databases.update({
    database_id: db.id,
    icon: { type: "emoji", emoji: "🔧" },
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
        show_mailto_section: {
          checkbox: settings.show_mailto_section === "true",
        },
      },
    });
  }
}

// --- Advanced Configuration ---

async function createAdvancedConfigDB(parentId, notion) {
  console.log("\nCreating Database: Advanced Configuration...");

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
    title: plainText("Advanced Configuration"),
    properties: {
      label: { title: {} },
      limit_theme_selection: {
        multi_select: { options: themeOptions },
      },
      primary_font: { rich_text: {} },
      secondary_font: { rich_text: {} },
    },
  });

  await notion.databases.update({
    database_id: db.id,
    icon: { type: "emoji", emoji: "⚙️" },
  });

  console.log(`   Advanced Configuration Database created (ID: ${db.id})`);
  console.log("   > Seeding Advanced Configuration data...");

  await notion.pages.create({
    parent: { database_id: db.id },
    properties: {
      label: { title: plainText("Advanced Settings") },
      limit_theme_selection: {
        multi_select: dummyAdvancedConfig.limit_theme_selection.map((t) => ({
          name: t,
        })),
      },
      primary_font: {
        rich_text: plainText(dummyAdvancedConfig.primary_font || "Inter"),
      },
      secondary_font: {
        rich_text: plainText(dummyAdvancedConfig.secondary_font || "Inter"),
      },
    },
  });
}

// --- 10. Code Injection Page ---

async function createCodeInjectionPage(parentId, notion) {
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

// --- 11. CSS Injection Page ---

async function createCssInjectionPage(parentId, notion) {
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
