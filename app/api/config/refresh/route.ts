
import { NextRequest, NextResponse } from 'next/server';
import { pullConfigFromNotion } from '@/lib/notion-server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const sendStep = (msg: string) => {
                controller.enqueue(encoder.encode(msg + '\n'));
            };

            try {
                await pullConfigFromNotion(sendStep);
                controller.close();
            } catch (error) {
                console.error('Error refreshing config:', error);
                sendStep('Error: Failed to refresh.');
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
