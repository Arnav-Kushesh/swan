# Swan — System Architecture & Mechanism

This document describes the technical architecture, data flow, and update mechanisms of Swan.

---

## Architecture Overview

```
┌────────────────┐     sync-notion.mjs     ┌────────────────┐     Next.js Build     ┌────────────────┐
│   Notion CMS   │ ──────────────────────► │  Local State   │ ────────────────────► │  Static Site   │
│  (Source of     │     (Script fetches     │  notion_state/ │     (SSG reads data,  │  .next/out/    │
│   Truth)        │      content + data)    │  ├── data/     │      renders pages)   │  (HTML/JS/CSS) │
│                 │                         │  └── content/  │                       │                │
└────────────────┘                         └────────────────┘                       └────────────────┘
```

## Data Flow

### 1. Notion → Local State (`npm run sync`)

The `scripts/sync-notion.mjs` script connects to the Notion API and downloads:

| Data Source | Output Location | Format |
|---|---|---|
| General Configuration | `notion_state/data/site.json` | JSON key-value pairs (Synced from Settings > General Configuration) |
| Home Page sections | `notion_state/data/home.json` | JSON section array |
| Collection items | `notion_state/content/{collection}/*.md` | Markdown with frontmatter |
| Authors database | `notion_state/data/authors.json` | JSON array |
| Configure Collections | `notion_state/data/collection_settings.json` | JSON key-value (Synced from Settings > Configure Collections) |
| Code Injection | `notion_state/data/code_injection.json` | JSON string array (Synced from Settings > Code) |
| CSS Injection | `notion_state/data/css_injection.json` | JSON string array (Synced from Settings > CSS) |
| Navbar Pages | `notion_state/content/navbarPages/*.md` | Markdown with frontmatter |
| Images | `public/images/*` | Downloaded binary files |

### 2. Local State → Next.js Pages (`lib/data.ts`)

The data access layer reads from the local filesystem:

- `getHomeData()` → Merges `home.json` + `site.json`
- `getPosts(collection)` → Reads all `.md` files from `content/{collection}/`
- `getAuthors()` → Reads `authors.json`
- `getCollectionSettings(name)` → Reads `collection_settings.json`
- `getCodeInjection()` → Reads `code_injection.json`
- `getCssInjection()` → Reads `css_injection.json`
- `getAllPosts()` → Aggregates all collections for search

### 3. Next.js SSG → Static Site (`npm run build`)

Next.js generates static HTML/CSS/JS at build time:

- Each collection entry becomes a static page at `/{collection}/{slug}`
- Author pages at `/author/{username}`
- RSS feeds at `/rss/{collection}`
- Search index is baked into the client-side bundle

## Update Mechanism

```
1. User edits content in Notion
2. Run `npm run sync` to pull changes
3. Run `npm run build` to regenerate static site
4. Deploy to hosting (Vercel, Netlify, etc.)

Combined: `npm run sync-and-build` does steps 2-3 together
```

> **Crucial**: Because this is a Static Site, you **must trigger a new build/deployment** on your hosting platform (Netlify, Vercel) whenever you update content in Notion. The site will not update dynamically on its own.

For continuous deployment, set up a webhook or cron job that triggers the build pipeline when Notion content changes.

## Key Design Decisions

### SSG over SSR
- **No runtime dependency on Notion API**: Site works even if Notion is down
- **No API rate limits**: All data is pre-fetched
- **Maximum performance**: Pure static files served from CDN
- **Security**: No server-side API keys exposed at runtime

### Client-Side Search
- Search index is built at compile time from all posts
- No external search service (Algolia, etc.) required
- Triggered via `Cmd+K` / `Ctrl+K` shortcut
- Searches across title, description, tags, and collection name

### Code Injection
- Raw HTML/script content from a Notion page (Settings > Code)
- Injected into `<head>` as `<script>` tags during build
- Enables analytics, ads, and custom meta tags without code changes

### CSS Injection
- Raw CSS content from a Notion page (Settings > CSS)
- Injected into `<head>` as `<style>` tags during build
- Enables custom styling overrides without code changes

## Error Handling

- **Missing data files**: Functions return empty arrays/objects (graceful degradation)
- **Image download failures**: Falls back to original remote URL
- **Missing authors**: `AuthorInfo` component silently renders nothing
- **RSS disabled**: Returns 404 for disabled collections

## Performance Considerations

- **Pagination**: "Show More" pattern (6 items per page) prevents loading thousands of cards
- **Image optimization**: Images are downloaded locally during sync for faster serving
- **Static generation**: Zero API calls at runtime; entire site is pre-rendered
- **Bundle size**: Search index is minimal (title + description + tags per post)
