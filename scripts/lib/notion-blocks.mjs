// Notion Block Helpers
// Utility functions for creating Notion API block objects

export const plainText = (content) => [
    { type: "text", text: { content: content || "" } },
];

export const heading1 = (content) => ({
    object: "block",
    type: "heading_1",
    heading_1: { rich_text: plainText(content) },
});

export const heading2 = (content) => ({
    object: "block",
    type: "heading_2",
    heading_2: { rich_text: plainText(content) },
});

export const heading3 = (content) => ({
    object: "block",
    type: "heading_3",
    heading_3: { rich_text: plainText(content) },
});

export const textBlock = (content) => ({
    object: "block",
    type: "paragraph",
    paragraph: { rich_text: plainText(content) },
});

export const bulletedListItem = (content) => ({
    object: "block",
    type: "bulleted_list_item",
    bulleted_list_item: { rich_text: plainText(content) },
});

export const quoteBlock = (content) => ({
    object: "block",
    type: "quote",
    quote: { rich_text: plainText(content) },
});

export const codeBlock = (content, language = "plain text") => ({
    object: "block",
    type: "code",
    code: {
        rich_text: plainText(content),
        language: language,
    },
});

export const imageBlock = (url, caption = "") => ({
    object: "block",
    type: "image",
    image: {
        type: "external",
        external: { url },
        caption: caption ? plainText(caption) : [],
    },
});

export function buildBlocks(contentArray) {
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
export const sectionTypeOptions = [
    { name: "info_section", color: "gray" },
    { name: "dynamic_section", color: "orange" },
    { name: "html_section", color: "purple" },
    { name: "iframe_section", color: "blue" },
    { name: "video_embed_section", color: "red" },
    { name: "media_section", color: "pink" },
    { name: "mailto_section", color: "green" },
    { name: "newsletter_section", color: "yellow" },
];
