# Swan — Use Cases

Swan is a powerful, open-source static website generator that uses **Notion as a headless CMS**. Below are the key use cases it enables.

---

## 1. Personal Blogging with Notion

Write your blog posts directly in Notion and publish them as a beautiful, fast static website. No database setup, no CMS dashboard — just Notion.

- **Markdown-powered content**: Write rich content with images, code blocks, embeds, and more
- **Tagging & categorization**: Use Notion's multi-select properties for tags
- **Author attribution**: Link posts to author profiles with social links
- **RSS feeds**: Auto-generated RSS for reader subscriptions

## 2. Portfolio & Project Showcase

Build a professional portfolio with project cards, descriptions, links, and cover images — all managed in Notion.

- **Multiple view types**: Grid, Card, List, and Minimal List views
- **Customizable ordering**: Use `order_priority` to control the display order
- **External links**: Link projects to GitHub repos or live demos

## 3. Video Content Hosting (YouTube Alternative)

Embed videos from YouTube, Vimeo, or any platform directly into your content pages.

- **Video embed support**: Add a `video_embed_link` to any collection item
- **Inline playback**: Videos play directly on your site, not redirecting to external platforms
- **Thumbnail fallback**: If no video is provided, displays the cover image

## 4. Multi-Author Publishing

Support multiple authors on a single site. Each author gets a profile page with bio and social links.

- **Author profiles**: `/author/{username}` pages with published work
- **Per-post attribution**: Each post links to its author
- **Contact integration**: "Message the Author" via email at the bottom of posts

## 5. Newsletter & Subscriber Growth

Integrate newsletter signups directly into your site.

- **Newsletter Integration**: Native support for Mailchimp forms. Toggle the section on the homepage with `show_newsletter_section_on_home`. or per-collection
- **Control from Notion**: Toggle `enable_newsletter` and `show_newsletter_section_on_home` in your General Configuration database

## 6. Ad & Monetization Support

Inject custom scripts (Google Ads, analytics, tracking pixels) via the **Code Injection** page.

- **No code deployment needed**: Add scripts in Notion, they appear in `<head>`
- **Analytics**: Google Analytics, Plausible, Fathom, etc.
- **Ad networks**: Google AdSense or any ad script

## 7. Content Ownership & Independence

Unlike platforms like Medium, Substack, or WordPress.com:

- **You own your content**: It's stored in Notion and rendered as static files
- **No vendor lock-in**: Export from Notion anytime; your Markdown is yours
- **Full control**: Custom themes, code injection, layout — no restrictions
- **No monthly fees**: Host on Vercel, Netlify, or any static host for free

## 8. Global Search

Full-text search across all collections, accessible from any page via the search icon or `Cmd+K` / `Ctrl+K`.

- **Client-side**: No external API or search service needed
- **Indexed at build time**: Fast, offline-capable search
- **Cross-collection**: Searches posts, projects, blogs, and galleries simultaneously
