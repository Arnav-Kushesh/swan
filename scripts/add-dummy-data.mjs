import 'dotenv/config'; // Loads .env or .env.local if configured? dotenv/config loads .env by default. Next.js uses .env.local.
import { Client } from '@notionhq/client';
import { ensureSiteStructure } from './lib/seed-notion.mjs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local specifically since Next.js uses it
dotenv.config({ path: '.env.local' });

async function main() {
    const apiKey = process.env.NOTION_API_KEY;
    const rootPageId = process.env.ROOT_PAGE_ID;

    if (!apiKey || !rootPageId) {
        console.error("Error: NOTION_API_KEY or ROOT_PAGE_ID not found in environment variables.");
        console.log("Please ensure .env.local exists and is populated.");
        process.exit(1);
    }

    console.log("Connecting to Notion...");
    const notion = new Client({ auth: apiKey });

    try {
        await ensureSiteStructure(rootPageId, notion);
    } catch (error) {
        console.error("Failed to seed Notion data:", error);
        process.exit(1);
    }
}

main();
