# Swan — Use Cases

Swan is a powerful, open-source static website generator that uses **Notion as a headless CMS**. Below are the key use cases it enables.

---

## 1. Personal Blogging with Notion

Write your blog posts directly in Notion and publish them as a beautiful, fast static website. No database setup, no CMS dashboard — just Notion.

- **Markdown-powered content**: Write rich content with images, code blocks, embeds, and more
- **Tagging & categorization**: Use Notion's multi-select properties for tags
- **Author attribution**: Link posts to author profiles with social links
- **RSS feeds**: Auto-generated RSS for reader subscriptions
- **Newsletter integration**: Built-in Mailchimp signup on blog pages via `show_newsletter_section` in collection settings

## 2. Portfolio & Project Showcase

Build a professional portfolio with project cards, descriptions, links, and cover images — all managed in Notion.

- **Multiple view types**: Grid, Card, List, and Minimal List views
- **Customizable ordering**: Use `order_priority` to control the display order
- **External links**: Link projects to GitHub repos or live demos
- **Video embeds**: Showcase project demos with inline video players

## 3. Video Content Hosting

Embed videos from YouTube, Vimeo, or any platform directly into your content pages.

- **Video embed support**: Add a `video_embed_url` to any collection item
- **Dedicated video sections**: Use `video_embed_section` to feature videos on any page
- **Inline playback**: Videos play directly on your site, not redirecting to external platforms
- **Thumbnail fallback**: If no video is provided, displays the cover image

## 4. Multi-Author Publishing

Support multiple authors on a single site. Each author gets a profile page with bio and social links.

- **Author profiles**: `/author/{username}` pages with published work
- **Per-post attribution**: Each post links to its author
- **Contact integration**: "Message the Author" via email at the bottom of posts

## 5. Newsletter & Subscriber Growth

Integrate newsletter signups directly into your site.

- **Newsletter sections**: Add `newsletter_section` to any page (homepage, navbar pages, collection extra sections)
- **Per-collection control**: Toggle `show_newsletter_section` per collection in Configure Collections
- **Easy setup**: Go to Mailchimp (or any email service), create a signup form, and paste the URL into `newsletter_form_url` in General Configuration

## 6. Ad & Monetization Support

Inject custom scripts (Google Ads, analytics, tracking pixels) via the **HTML Head Code** page, or embed ad units directly using `html_section`.

- **Code injection**: Add scripts in Notion (Settings > HTML Head Code), they appear in `<head>`
- **Inline ads**: Use `html_section` to place ad units anywhere on your pages
- **Analytics**: Google Analytics, Plausible, Fathom, etc.
- **Ad networks**: Google AdSense or any ad script
- **Custom styling**: Override or extend the site's design via CSS code blocks in Settings > CSS Styling
- **No revenue sharing**: Unlike Medium or Substack, Swan doesn't take a cut

## 7. Content Ownership & Independence

Unlike platforms like Medium, Substack, or WordPress.com:

- **You own your content**: It's stored in Notion and synced as Markdown files
- **No vendor lock-in**: Export from Notion anytime; your Markdown is yours
- **Full control**: Custom themes, code injection, HTML sections, layout — no restrictions
- **No monthly fees**: Host on Vercel, Netlify, or any static host for free
- **Your ads, your revenue**: No middleman between you and your monetization

## 8. Custom Embeds & Interactive Content

Swan's `html_section` and `iframe_section` give you the flexibility to embed anything:

- **HTML sections**: Embed custom HTML/CSS/JS — forms, widgets, interactive demos, maps, social feeds
- **Iframe sections**: Embed external websites, Figma files, Google Maps, Calendly, or any URL
- **Video embeds**: Feature YouTube or Vimeo videos inline on any page
- **No code deployment needed**: All content and embeds are managed from Notion

## 9. SEO-Optimized Static Sites

Swan generates fully static HTML pages optimized for search engines:

- **Pre-rendered pages**: Every page is static HTML — fast to load and easy to crawl
- **Auto-generated sitemap**: `sitemap.xml` covers all pages, collections, and author profiles
- **Meta tags**: Title, description, keywords, OpenGraph images — all from Notion
- **Clean URLs**: SEO-friendly paths like `/blogs/my-post` and `/author/username`
- **RSS feeds**: Discoverable feeds for search engine indexing

## 10. Global Search

Full-text search across all collections, accessible from any page via the search icon or `Cmd+K` / `Ctrl+K`.

- **Client-side**: No external API or search service needed
- **Indexed at build time**: Fast, offline-capable search
- **Cross-collection**: Searches posts, projects, blogs, and galleries simultaneously
