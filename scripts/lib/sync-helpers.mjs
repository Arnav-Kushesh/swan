// Sync Helpers
// Shared utilities for syncing Notion data: client initialization, pagination, file I/O

import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local first (Next.js convention), then .env as fallback
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

export const notion = new Client({ auth: process.env.NOTION_API_KEY });
export const n2m = new NotionToMarkdown({ notionClient: notion });
export const ROOT_PAGE_ID = process.env.ROOT_PAGE_ID;

if (!process.env.NOTION_API_KEY || !ROOT_PAGE_ID) {
    console.error("Missing NOTION_API_KEY or ROOT_PAGE_ID");
    console.log("Please ensure .env exists and is populated.");
    process.exit(1);
}

// --- Utility Functions ---

export const slugify = (text) => text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

export async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}

export async function downloadImage(url, filename) {
    if (!url) return '';
    try {
        await ensureDir('public/images');
        const filepath = path.join('public/images', filename);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText} `);

        const buffer = Buffer.from(await response.arrayBuffer());
        await fs.writeFile(filepath, buffer);

        console.log(`     -> Downloaded: ${filename} `);
        return `/images/${filename}`;
    } catch (error) {
        console.error(`     ! Failed to download ${filename}: `, error.message);
        return url; // Fallback to original URL
    }
}

// Custom Transformer for Content Images
n2m.setCustomTransformer('image', async (block) => {
    const { image } = block;
    const url = image.file?.url || image.external?.url;
    if (!url) return '';

    const caption = image.caption?.map(c => c.plain_text).join('') || '';

    try {
        const ext = path.extname(new URL(url).pathname) || '.jpg';
        const filename = `content-${block.id.slice(0, 8)}${ext}`;
        const localUrl = await downloadImage(url, filename);

        return `![${caption}](${localUrl})`;
    } catch (e) {
        console.warn(`    ! Failed to transform/download content image ${block.id}: ${e.message}`);
        return `![${caption}](${url})`; // Fallback to remote URL
    }
});

// --- Pagination Helpers ---

export async function fetchAllChildren(blockId) {
    let results = [];
    let cursor = undefined;
    do {
        const response = await notion.blocks.children.list({
            block_id: blockId,
            start_cursor: cursor
        });
        results.push(...response.results);
        cursor = response.next_cursor;
    } while (cursor);
    return results;
}

export async function fetchAllDatabasePages(databaseId, filter, sorts) {
    if (!databaseId) {
        console.warn("   ! fetchAllDatabasePages called with missing ID");
        return [];
    }
    let results = [];
    let cursor = undefined;

    do {
        const query = { database_id: databaseId };
        if (cursor) query.start_cursor = cursor;
        if (filter) query.filter = filter;
        if (sorts) query.sorts = sorts;

        const response = await notion.databases.query(query);
        results.push(...response.results);
        cursor = response.next_cursor;
    } while (cursor);
    return results;
}

// --- Data Extractors ---

export async function getPageByName(parentId, name) {
    const children = await fetchAllChildren(parentId);

    for (const block of children) {
        if (block.type === 'child_page' && block.child_page.title === name) {
            return block.id;
        }
    }
    return null;
}

export async function findFullPageDb(name, parentId = ROOT_PAGE_ID) {
    const children = await fetchAllChildren(parentId);
    const db = children.find(b => b.type === 'child_database' && b.child_database.title === name);
    return db ? db.id : null;
}

export async function fetchDatabaseDetails(databaseId) {
    return await notion.databases.retrieve({ database_id: databaseId });
}
