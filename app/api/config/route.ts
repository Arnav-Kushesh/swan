import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getHomeData } from '@/lib/data';
import { updateNotionConfig } from '@/lib/notion-server';

// Force dynamic route since we are reading/writing files


export async function GET() {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = getHomeData();
    return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const sendStep = (msg: string) => {
                controller.enqueue(encoder.encode(msg + '\n'));
            };

            try {
                sendStep('Updating Local Config...');

                const dataDir = path.join(process.cwd(), 'data');
                const homePath = path.join(dataDir, 'home.json');
                const sitePath = path.join(dataDir, 'site.json');

                // Update home.json
                if (fs.existsSync(homePath)) {
                    const homeData = JSON.parse(fs.readFileSync(homePath, 'utf8'));
                    if (body.hero) homeData.hero = { ...homeData.hero, ...body.hero };
                    if (body.blogs) homeData.blogs = { ...homeData.blogs, ...body.blogs };
                    fs.writeFileSync(homePath, JSON.stringify(homeData, null, 2));
                }

                // Update site.json
                if (fs.existsSync(sitePath)) {
                    const siteData = JSON.parse(fs.readFileSync(sitePath, 'utf8'));
                    if (body.info) siteData.info = { ...siteData.info, ...body.info };
                    fs.writeFileSync(sitePath, JSON.stringify(siteData, null, 2));
                }

                // Notion Write-Back
                if (process.env.NOTION_API_KEY && process.env.ROOT_PAGE_ID) {
                    sendStep('Syncing to Notion...');
                    await updateNotionConfig(body);
                    sendStep('Notion Sync Complete.');
                } else {
                    sendStep('Skipping Notion (Env Missing).');
                }

                sendStep('Success!');
                controller.close();
            } catch (error) {
                console.error('Error saving config:', error);
                sendStep('Error: Failed to save.');
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
