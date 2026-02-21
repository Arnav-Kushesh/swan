import { getPosts, getCollectionSettings, getCollectionNames, getHomeData } from '@/lib/data';

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
        const link = `${baseUrl}/${collection}/${post.slug}`;
        const pubDate = post.date ? new Date(post.date).toUTCString() : new Date().toUTCString();
        const image = post.cover?.image || post.image || post.thumbnail;
        const tags = post.tags || [];

        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.description || ''}]]></description>${post.author_username ? `
      <author>${post.author_username}</author>` : ''}${image ? `
      <enclosure url="${image}" type="image/jpeg"/>` : ''}${tags.map(tag => `
      <category><![CDATA[${tag}]]></category>`).join('')}
    </item>`;
    }).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteTitle} — ${collection}</title>
    <link>${baseUrl}</link>
    <description>${siteDescription}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss/${collection}" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
