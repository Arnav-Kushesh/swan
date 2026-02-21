import { getPosts, getCollectionSettings, getCollectionNames, getHomeData } from '@/lib/data';

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export const dynamic = 'force-static';

export function generateStaticParams() {
    const collectionNames = getCollectionNames();
    return collectionNames.map((name) => ({ collection: name }));
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ collection: string }> }
) {
    const { collection } = await params;

    // Check if RSS is enabled for this collection
    const settings = getCollectionSettings(collection);
    if (settings && settings.enable_rss !== 'true') {
        return new Response('RSS is not enabled for this collection.', { status: 404 });
    }

    const posts = getPosts(collection);
    const homeData = getHomeData();
    const siteTitle = homeData.info?.title || 'My Site';
    const siteDescription = homeData.info?.description || '';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const rssItems = posts.map((post) => {
        const link = `${escapeXml(baseUrl)}/${escapeXml(collection)}/${escapeXml(post.slug)}`;
        const pubDate = post.date ? new Date(post.date).toUTCString() : new Date().toUTCString();
        const image = post.cover?.image || post.image || post.thumbnail;
        const tags = post.tags || [];
        const tagNames = tags.map(t => typeof t === 'string' ? t : (t as { name: string }).name);

        return `
    <item>
      <title><![CDATA[${escapeXml(post.title)}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${escapeXml(post.description || '')}]]></description>${post.author_username ? `
      <author>${escapeXml(post.author_username)}</author>` : ''}${image ? `
      <enclosure url="${escapeXml(image)}" type="image/jpeg"/>` : ''}${tagNames.map(tag => `
      <category><![CDATA[${escapeXml(tag)}]]></category>`).join('')}
    </item>`;
    }).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)} — ${escapeXml(collection)}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(baseUrl)}/rss/${escapeXml(collection)}" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
