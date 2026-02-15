# Swan Project Limitations & Roadmap

## 1. Image Optimization (Critical)
-   **Current State**: The project uses standard `<img>` tags throughout (`GenericList.tsx`, `page.tsx`). Images are downloaded from Notion "as-is".
-   **Problem**: If a user uploads a 5MB image to Notion, the website serves a 5MB image. This kills performance and LCP (Largest Contentful Paint).
-   **Recommendation**: Migrate to `next/image` to automatically resize, compress, and serve images in WebP/AVIF formats.

## 2. Sync Scalability
-   **Current State**: `scripts/sync-notion.mjs` fetches **all** pages from every database on every run.
-   **Problem**: As content grows (e.g., >500 blogs), the sync script will take exponentially longer and may hit Notion API rate limits or Vercel build timeouts.
-   **Recommendation**: Implement "incremental sync" (cache `last_edited_time` and only fetch updates) or use separate build steps.

## 3. Search Scalability
-   **Current State**: Search is client-side. The entire index (Titles, Descriptions, Tags for *all* posts) is likely loaded into the DOM or a JSON chunk on load.
-   **Problem**: For thousands of posts, this search index becomes a large payload, slowing down initial page load.
-   **Recommendation**: Move to server-side search (API route) or use a dedicated search service (Algolia/Fuse.js worker) for large datasets.

## 4. Static Regeneration (ISR)
-   **Current State**: Pure Static Site Generation (SSG).
-   **Problem**: Every typo fix in Notion requires a full site rebuild (approx. 1-2 minutes).
-   **Recommendation**: Next.js ISR (Incremental Static Regeneration) could allow per-page updates without full rebuilds, but requires a running server (Node.js) rather than pure static export.

## 5. Preview Mode
-   **Current State**: No way to preview a Notion draft before publishing.
-   **Problem**: Editors cannot see how a post looks until it's published and built.
-   **Recommendation**: Implement Next.js Preview Mode with a specific token to view draft pages live.
