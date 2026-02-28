<div align="center">
<br/><br/>
<img alt="notion-site-generator-logo" src="https://raw.githubusercontent.com/arnav-kushesh/notion-site-generator/master/assets/notion-site-generator.png" height="128"/>
<h3 style="margin-top: 9px;">Notion Site Generator</h3>

<br/>

[![Join Discord](https://img.shields.io/badge/Discord-Join-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/aAsZqZkJKW)

</div>

**Build a website from Notion with zero code, zero setup, zero stress & Zero learning curve**

Notion Site Generator is a powerful **Notion-to-Website** engine that turns your Notion notes into a high-performance, static website. Built with **Next.js**, **PandaCSS**, and the **Notion API**.

**Why use "Notion Site Generator"?** Connect it to Netlify (or any static host), provide your Notion API key, and you have a live website — no coding, no frameworks to learn, no servers to manage.

## Features

- **Notion as CMS**: Manage 100% of your content (posts, pages, config) in Notion.
- **Fast**: Static Site Generation (SSG) ensures instant page loads and perfect SEO.
- **Collections**: Create multiple content collections (blogs, projects, galleries) with different display views.
- **Global Search**: Built-in `Cmd+K` command palette to search all content with fuzzy matching.
- **Multi-Author**: Support for multiple authors with dedicated profile pages.
- **Rich Content**: Supports video embeds, code blocks, callouts, and more.
- **10 Section Types**: Info, Dynamic, HTML, Iframe, Video Embed, Media, Mailto, Newsletter, and Gap sections.
- **6 View Types for Dynamic Sections**: List, Card, Grid, Minimal List, Tiny Card, and Big Card views.
- **Newsletter Ready**: Native Mailchimp integration form with per-collection and per-page control.
- **Code & CSS Injection**: Add Analytics, Ads, or custom styles directly from Notion. Use `html_id` and `html_class` on any section to target it with custom CSS.
- **8 Color Themes**: Light, Dark, Blue, Purple, Pink, Red, Green, and Cream — with optional theme restriction via Advanced Configuration.
- **Two Navigation Modes**: Top navbar or left sidebar — configurable from Notion.
- **RSS Feeds**: Auto-generated feeds for every content collection.
- **SEO Optimized**: Static generation with sitemap, meta tags, OpenGraph images, and keywords.
- **Email Contact System**: Email-based messaging via `mailto_section` — no databases, no servers, no third-party scripts.
- **Media Section**: Display images or looping videos with configurable height and full-width mode.
- **Content Freedom**: You own your content. No vendor lock-in, no monthly fees. Host anywhere for free.

---

## Use Cases

### Blog Site

Notion Site Generator is a natural fit for blogging. Write your posts in Notion, tag and categorize them, assign authors, and publish as a fast static blog with RSS feeds and newsletter signups. No WordPress, no Substack — just Notion and a static site that you fully own.

### Startup Website

Use Notion Site Generator to build your startup's website entirely from Notion. Create landing pages with `info_section` hero blocks, embed demo videos with `video_embed_section`, add a newsletter signup with `newsletter_section`, and inject your analytics and ad scripts via code injection. Your marketing team can update content in Notion without touching code, and every change goes live with a single rebuild.

### Portfolio Site

Showcase your work using Notion Site Generator's collections and multiple view types (grid, card, list, minimal list, tiny card, big card). Create a Gallery for photography, a Projects collection for case studies, and a Blogs collection for writing — each with its own display style, RSS feed, and author attribution.

### Your Own YouTube Alternative

Host your videos on any platform (Vimeo, Bunny Stream, your own server) and embed them on your Notion Site Generator site using the `video_embed_section` feature, `media_section` for looping background videos, or the `video_embed_url` property on collection items. Unlike YouTube, **no one can censor or demonetize your content**. You control the entire experience — the page layout, the branding, the ads. Monetize freely by placing Google AdSense or any ad network script via `html_section` blocks right alongside your videos, or inject ad scripts globally via the HTML Head Code page. Your content, your platform, your revenue — without a middleman taking a cut or deciding what's allowed.

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/arnav-kushesh/notion-site-generator.git
cd notion-site-generator
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the root directory:

```bash
NOTION_API_KEY=secret_your_notion_integration_key
ROOT_PAGE_ID=your_root_page_id
```

> **Tip**: obtain your API key from [Notion Integrations](https://www.notion.so/my-integrations) and share your root page with the integration.

### 3. Seed Notion (One-time Setup)

Run the seed script to automatically create the required database structure in your Notion page:

```bash
npm run seed
```

> **Note**: If you encounter broken images in your Notion workspace, run `npm run seed` again to update them with fresh placeholders.
> _This will create specific Pages and Databases (Home, Settings, Collections) in your root page._

### 4. Sync & Run

Download content from Notion and start the dev server:

```bash
npm run sync  # Fetches data to notion_state/
npm run dev   # Starts Next.js at localhost:3000
```

---

## Project Structure

```
notion-site-generator/
├── app/                 # Next.js App Router pages
├── components/          # React UI components
├── lib/                 # Utilities & Data Fetching
├── scripts/             # Node.js scripts for Notion Sync
│   ├── lib/             # Seeding logic
│   └── sync-notion.mjs  # Main sync script
├── notion_state/        # Local cache of Notion content (JSON/MD)
├── public/              # Static assets & downloaded images
└── panda.config.mjs     # Design system configuration
```

---

## Notion Page Structure

Notion Site Generator expects the following structure in your Notion workspace:

```
Root Page
├── Home Page
│   ├── [Inline DB] Hero Section (info_section)
│   ├── [Inline DB] My Gallery (dynamic_section)
│   ├── [Inline DB] Selected Projects (dynamic_section)
│   ├── [Inline DB] Recent Writing (dynamic_section)
│   ├── [Inline DB] Custom HTML (html_section)
│   ├── [Inline DB] Embedded Page (iframe_section)
│   ├── [Inline DB] Featured Video (video_embed_section)
│   ├── [Inline DB] Media (media_section)
│   ├── [Inline DB] Contact Form (mailto_section)
│   ├── [Inline DB] Newsletter (newsletter_section)
│   └── [Inline DB] Gap (gap_section)
├── Navbar Pages
│   ├── About (page, can contain inline DB sections)
│   └── Contact (page, can contain inline DB sections)
├── Collections
│   ├── Gallery (database)
│   ├── Projects (database)
│   └── Blogs (database)
├── Settings
│   ├── Main Configuration (database)
│   ├── General Configuration (database)
│   ├── Social (database)
│   ├── Advanced Configuration (database)
│   ├── Configure Collections (database)
│   ├── Collection Page Extra Sections
│   │   ├── Gallery (page with inline DB sections)
│   │   ├── Projects (page with inline DB sections)
│   │   └── Blogs (page with inline DB sections)
│   ├── HTML Head Code (page with code blocks)
│   └── CSS Styling (page with code blocks)
└── Authors (database)
```

---

## Collections

Collections are full-page databases stored under the "Collections" page. Notion Site Generator ships with three default collections — **Gallery**, **Projects**, and **Blogs** — but you can configure any number of them.

Each item in a collection has:

| Property          | Type         | Description                                                                      |
| ----------------- | ------------ | -------------------------------------------------------------------------------- |
| `title`           | Title        | Item title                                                                       |
| `slug`            | Rich Text    | URL slug (auto-generated from title if empty)                                    |
| `description`     | Rich Text    | Short description                                                                |
| `thumbnail`       | Files        | Cover/thumbnail image                                                            |
| `tags`            | Multi-select | Categorization tags                                                              |
| `link`            | URL          | External link                                                                    |
| `button_text`     | Rich Text    | Custom button label                                                              |
| `order_priority`  | Number       | Sort order (higher = first)                                                      |
| `author_username` | Rich Text    | Author username (links to Authors DB)                                            |
| `video_embed_url` | URL          | Optional video embed URL                                                         |
| `status`          | Select       | `draft`, `in_review`, or `published` (only `published` items appear on the site) |

The page content (body) of each item becomes the full article content, rendered as markdown. You can write rich content using all of Notion's block types — headings, paragraphs, images, code blocks, callouts, quotes, bullet lists, numbered lists, toggle blocks, and more.

During sync, a `dominant_color` is automatically extracted from each item's image for use with the Big Card view type.

### Collection Settings

Per-collection configuration is managed in **Settings > Configure Collections**, a single database with one row per collection:

| Property                      | Type     | Description                                     |
| ----------------------------- | -------- | ----------------------------------------------- |
| `collection_name`             | Title    | Name of the collection                          |
| `enable_rss`                  | Checkbox | Generate an RSS feed for this collection        |
| `show_newsletter_section`     | Checkbox | Show newsletter signup on collection pages      |
| `show_mailto_comment_section` | Checkbox | Show mailto comment section on collection pages |

### Collection Page Extra Sections

Extra sections can be added to every entry page of a collection via **Settings > Collection Page Extra Sections > [Collection Name]**. Each collection has a dedicated page where you place inline database sections. These are rendered on every entry page of that collection, giving you the ability to add related content, CTAs, or ads to all posts.

All 10 section types are supported.

---

## Section Types

> Note: For HTML, Iframe, and Media sections, we use `aspect_ratio` instead of fixed heights. `aspect_ratio` allows maintaining size easily across all screens, as setting a pixel height for every device is impractical. Sections will span full width (or parent width) and height will automatically be calculated based on the aspect ratio.

Sections are inline databases placed on the Home Page, Navbar Pages, or Collection Extra Sections pages. Each database must have a `section_type` select property to identify its type.

### 1. `info_section`

A static content section with text, image/video, and optional CTA button. Use it for hero sections, about blurbs, feature highlights, or any static content block. If the image is a video file (`.mp4`, `.webm`, `.mov`, `.ogg`), it will render as a looping video with no controls.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `description` | Rich Text | Section body text |
| `button_link` | URL | Optional CTA button link (button hidden if empty) |
| `button_text` | Rich Text | Custom button label (defaults to "Explore") |
| `media` | Files | Optional hero/feature image or video |
| `view_type` | Select | Layout: `col_centered_view`, `col_left_view`, `row_view`, `row_reverse_view` |
| `media_aspect_ratio` | Rich Text | Aspect ratio for the media (e.g., `16:9` or `16/9`; default: `16:9`) |
| `media_width` | Rich Text | Desktop width for the media (e.g., `400px`, `50%`; default: `100%`). Centered when less than 100% |
| `media_width_mobile` | Rich Text | Mobile width for the media (defaults to `media_width`) |
| `html_id` | Rich Text | Custom HTML `id` applied to the section container. Target with `#your-id` in CSS |
| `html_class` | Rich Text | Custom CSS class name(s) for the section container |
| `section_type` | Select | Must be `info_section` |
| `enabled` | Checkbox | Show/hide the section |

### 2. `dynamic_section`

Displays items from a collection (blogs, projects, gallery) in various view types. This is how you showcase your content on the homepage or any page.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `collection_name` | Title | Name of the collection to display (e.g., "Blogs") |
| `title` | Rich Text | Display title for the section |
| `description` | Rich Text | Optional description shown below the title |
| `view_type` | Select | Layout: `list_view`, `card_view`, `grid_view`, `minimal_list_view`, `tiny_card_view`, `big_card_view` |
| `items_in_view` | Number | Number of items per page (default: 6) |
| `top_part_centered` | Checkbox | Center the title and description |
| `html_id` | Rich Text | Custom HTML `id` applied to the section container. Target with `#your-id` in CSS |
| `html_class` | Rich Text | Custom CSS class name(s) for the section container |
| `section_type` | Select | Must be `dynamic_section` |
| `enabled` | Checkbox | Show/hide the section |

**View Types:**

- **`list_view`**: Full-width list with image, title, description, and date
- **`card_view`**: 3-column grid with image, title, description, and tags
- **`grid_view`**: 3-column image grid with title overlay
- **`minimal_list_view`**: Text-only list with title, description, and date
- **`tiny_card_view`**: 5-column grid of small square image thumbnails (no text)
- **`big_card_view`**: 2-column grid with large images and gradient backgrounds using the item's dominant color

### 3. `html_section`

Renders custom HTML inside a sandboxed iframe. This is one of Notion Site Generator's most powerful features — it lets you embed **anything** that can be expressed as HTML directly from Notion.

**Use cases:**

- **Ads**: Embed Google AdSense or any ad network script
- **Widgets**: Embed calendars, forms, social feeds, or third-party widgets
- **Custom UI**: Build custom interactive elements with HTML/CSS/JS
- **Embeds**: Any embed code that doesn't fit into an iframe URL

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `description` | Rich Text | Section description (shown below the title) |
| `aspect_ratio` | Rich Text | Aspect ratio for the section (e.g., `16:9` or `16/9`; default: `16:9`) |
| `width` | Rich Text | Desktop width (e.g., `600px`, `80%`; default: `100%`). Centered when less than 100% |
| `width_mobile` | Rich Text | Mobile width (defaults to `width`) |
| `full_width` | Checkbox | Edge-to-edge display (removes border radius and border) |
| `top_part_centered` | Checkbox | Center-align the title and description |
| `html_id` | Rich Text | Custom HTML `id` applied to the section container. Target with `#your-id` in CSS |
| `html_class` | Rich Text | Custom CSS class name(s) for the section container |
| `section_type` | Select | Must be `html_section` |
| `enabled` | Checkbox | Show/hide the section |

**How to add HTML:** Open the first row as a page in Notion, then add a code block with your HTML content.

### 4. `iframe_section`

Embeds an external webpage in an iframe. Use this to embed any website, tool, or service directly into your page.

**Use cases:**

- Embed a Typeform, Google Form, or Calendly widget
- Show a live demo or external tool
- Embed a Figma file, CodePen, or Google Map

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `description` | Rich Text | Section description (shown below the title) |
| `url` | URL | The URL to embed |
| `aspect_ratio` | Rich Text | Aspect ratio for the section (e.g., `16:9` or `16/9`; default: `16:9`) |
| `width` | Rich Text | Desktop width (e.g., `600px`, `80%`; default: `100%`). Centered when less than 100% |
| `width_mobile` | Rich Text | Mobile width (defaults to `width`) |
| `full_width` | Checkbox | Edge-to-edge display (removes border radius and border) |
| `top_part_centered` | Checkbox | Center-align the title and description |
| `html_id` | Rich Text | Custom HTML `id` applied to the section container. Target with `#your-id` in CSS |
| `html_class` | Rich Text | Custom CSS class name(s) for the section container |
| `section_type` | Select | Must be `iframe_section` |
| `enabled` | Checkbox | Show/hide the section |

### 5. `video_embed_section`

Embeds a video (YouTube, Vimeo, etc.) using the embed URL. Videos play inline on your site — viewers stay on your page instead of being redirected to YouTube.

**Use cases:**

- Feature a YouTube intro video on your homepage
- Embed tutorial or demo videos on project pages
- Create a video portfolio section

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `description` | Rich Text | Section description (shown below the title) |
| `url` | URL | Video embed URL (e.g., `https://www.youtube.com/embed/VIDEO_ID`) |
| `top_part_centered` | Checkbox | Center-align the title and description |
| `html_id` | Rich Text | Custom HTML `id` applied to the section container. Target with `#your-id` in CSS |
| `html_class` | Rich Text | Custom CSS class name(s) for the section container |
| `section_type` | Select | Must be `video_embed_section` |
| `enabled` | Checkbox | Show/hide the section |

### 6. `media_section`

Displays an image or a looping video. If the media file is a video (`.mp4`, `.webm`, `.mov`, `.ogg`), it renders as a looping video with no controls. Otherwise, it renders as an image.

**Use cases:**

- Hero background videos
- Full-width banner images
- Ambient looping video sections

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `description` | Rich Text | Section description (shown below the title) |
| `media` | Files | Image or video file |
| `aspect_ratio` | Rich Text | Aspect ratio for the section (e.g., `16:9` or `16/9`; default: `16:9`) |
| `width` | Rich Text | Desktop width (e.g., `600px`, `80%`; default: `100%`). Centered when less than 100% |
| `width_mobile` | Rich Text | Mobile width (defaults to `width`) |
| `full_width` | Checkbox | Edge-to-edge display (removes border radius and border) |
| `top_part_centered` | Checkbox | Center-align the title and description |
| `html_id` | Rich Text | Custom HTML `id` applied to the section container. Target with `#your-id` in CSS |
| `html_class` | Rich Text | Custom CSS class name(s) for the section container |
| `section_type` | Select | Must be `media_section` |
| `enabled` | Checkbox | Show/hide the section |

### 7. `mailto_section`

An email-based contact form. When a reader submits the form, their email client opens with a pre-filled subject line and message body.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `subject` | Rich Text | Email subject line (used in the mailto link, not displayed in the UI) |
| `receiver_email` | Rich Text | Recipient email address |
| `placeholder_text` | Rich Text | Textarea placeholder (defaults to "Share your thoughts...") |
| `button_text` | Rich Text | Submit button label (defaults to "Send") |
| `html_id` | Rich Text | Custom HTML `id` applied to the section container. Target with `#your-id` in CSS |
| `html_class` | Rich Text | Custom CSS class name(s) for the section container |
| `section_type` | Select | Must be `mailto_section` |
| `enabled` | Checkbox | Show/hide the section |

### 8. `newsletter_section`

Renders a newsletter signup button that links visitors to your signup form. This section reads the `newsletter_form_url` from your General Configuration. Add it to the homepage, navbar pages, or collection extra sections.

**How to set up the newsletter:**

1. Go to an email marketing platform like [Brevo](https://www.brevo.com/) (recommended — clean interface and works smoothly), [Mailchimp](https://mailchimp.com/), [ConvertKit](https://convertkit.com/), [Buttondown](https://buttondown.com/), or any other service
2. Create an account and set up an audience/mailing list
3. Generate a signup form or landing page — most platforms have a "Signup Forms" or "Landing Pages" section where you can create one
4. Copy the URL of that form or landing page
5. In your Notion workspace, go to **Settings > General Configuration** and paste the URL into the `newsletter_form_url` field
6. Make sure `enable_newsletter` is checked in the same configuration

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section title |
| `html_id` | Rich Text | Custom HTML `id` applied to the section container. Target with `#your-id` in CSS |
| `html_class` | Rich Text | Custom CSS class name(s) for the section container |
| `section_type` | Select | Must be `newsletter_section` |
| `enabled` | Checkbox | Show/hide the section |

### 9. `gap_section`

Adds vertical spacing between sections. Use this to control the gap between specific sections without affecting the global spacing.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section label (not displayed, for organization only) |
| `height` | Rich Text | Desktop height (e.g., `60`, `60px`, `4rem`; bare numbers treated as pixels) |
| `mobile_height` | Rich Text | Mobile height (defaults to `height`) |
| `html_id` | Rich Text | Custom HTML `id` applied to the section container. Target with `#your-id` in CSS |
| `html_class` | Rich Text | Custom CSS class name(s) for the section container |
| `section_type` | Select | Must be `gap_section` |
| `enabled` | Checkbox | Show/hide the section |

---

## Configuration

Notion Site Generator's configuration is split across multiple databases under the Settings page. This keeps concerns separated and makes each settings page focused and easy to manage.

### Main Configuration

The "Main Configuration" database stores your site's identity and branding. It has individual columns for each setting with a single row of data.

| Column               | Type      | Description                                                        |
| -------------------- | --------- | ------------------------------------------------------------------ |
| `title`              | Title     | Site title                                                         |
| `description`        | Rich Text | Meta description                                                   |
| `tagline`            | Rich Text | Site tagline/subtitle                                              |
| `keywords`           | Rich Text | SEO keywords                                                       |
| `logo`               | Files     | Site logo                                                          |
| `favicon`            | Files     | Favicon image                                                      |
| `og_image`           | Files     | OpenGraph image for social sharing                                 |
| `default_color_mode` | Select    | Default theme (light, dark, blue, purple, pink, red, green, cream) |
| `sidebar_navigation` | Checkbox  | Enable sidebar navigation by default                               |

### General Configuration

The "General Configuration" database stores feature flags and toggles. All boolean fields use checkboxes.

| Column                        | Type      | Description                                          |
| ----------------------------- | --------- | ---------------------------------------------------- |
| `hide_topbar_logo`            | Checkbox  | Hide logo from the top navbar                        |
| `hide_sidebar_logo`           | Checkbox  | Hide logo from the sidebar                           |
| `enable_newsletter`           | Checkbox  | Enable newsletter functionality site-wide            |
| `newsletter_form_url`         | URL       | Newsletter signup form URL (e.g., Mailchimp)         |
| `mention_this_tool_in_footer` | Checkbox  | Show "Made With Notion Site Generator" in the footer |
| `primary_font`                | Rich Text | Primary font family name                             |
| `secondary_font`              | Rich Text | Secondary font family name                           |

> **Tip:** All fonts available on [Google Fonts](https://fonts.google.com/) are supported. Just type the font name (e.g., `Outfit`, `Roboto`, `Playfair Display`) and it will be automatically imported — no code changes needed.

### Advanced Configuration

The "Advanced Configuration" database allows fine-grained control over site behavior. It has a single row of data.

| Column                  | Type         | Description                                                                |
| ----------------------- | ------------ | -------------------------------------------------------------------------- |
| `limit_theme_selection` | Multi-select | Which themes users can choose from (defaults to all 8 if all are selected) |

Remove themes from the multi-select to prevent users from selecting them in the Settings menu.

### Social

The "Social" database stores your social media profiles and contact links. It has two columns — `name` and `data` — with one row per social link.

| Column | Type      | Description                                       |
| ------ | --------- | ------------------------------------------------- |
| `name` | Title     | Social platform name (e.g., `github`)             |
| `data` | Rich Text | Profile URL or contact info (e.g., email address) |

Supported social platforms: github, twitter, linkedin, instagram, youtube, facebook, twitch, email.

---

## Design Customization

### Color Themes

Notion Site Generator supports 8 color themes:

| Theme    | Type  | Description                |
| -------- | ----- | -------------------------- |
| `light`  | Light | Clean white/gray (default) |
| `cream`  | Light | Warm white/cream           |
| `pink`   | Light | Berry pink/purple          |
| `dark`   | Dark  | Dark mode                  |
| `blue`   | Dark  | Midnight blue              |
| `purple` | Dark  | Deep purple                |
| `red`    | Dark  | Sunset red                 |
| `green`  | Dark  | Forest green               |

Set the default via `default_color_mode` in Main Configuration. Users can switch themes via the Settings menu in the navbar/sidebar, and the choice persists in their browser's localStorage.

To restrict which themes are available to users, edit the `limit_theme_selection` multi-select in Advanced Configuration.

### Navigation Modes

Notion Site Generator supports two navigation layouts:

- **Navbar (Top Bar):** Default. Shows logo, navigation links, social icons, settings, and search.
- **Sidebar (Left Panel):** Fixed left sidebar with profile, navigation, social icons, and settings.

Set the default via the `sidebar_navigation` checkbox in Main Configuration.

### CSS Injection

Add custom CSS directly from Notion via **Settings > CSS Styling**. Add code blocks containing CSS — they are injected as `<style>` tags in `<head>`. This lets you customize fonts, colors, layouts, or any aspect of the design without touching code.

### Themes CSS

Edit `app/themes.css` to customize the color variables for each theme. Global styles are in `app/globals.css`.

---

## Monetization & Ads

Notion Site Generator gives you full control over monetization without any code changes:

- **Google AdSense / Ad Networks**: Add your ad scripts via **Settings > HTML Head Code** (code injection) or use an `html_section` to place ad units anywhere on your pages.
- **Affiliate Links**: Add affiliate links directly in your Notion content or in `html_section` blocks.
- **Sponsored Content**: No restrictions — you have full control over your content and layout.
- **Newsletter Monetization**: Use the built-in Mailchimp integration to build an email list.

Unlike platforms like Medium or Substack, Notion Site Generator doesn't take a cut of anything. Your ads, your revenue, your content.

---

## Content Freedom

Notion Site Generator is built on the principle that **you own your content**:

- **No vendor lock-in**: Your content lives in Notion and is synced as Markdown files. You can export it anytime.
- **No monthly fees**: Host on Vercel, Netlify, GitHub Pages, or any static host for free.
- **No restrictions**: Custom themes, code injection, custom HTML sections — no limitations on what you can build.
- **No middleman**: Direct email-based contact, your own ad scripts, your own analytics.
- **Full SEO control**: Meta descriptions, keywords, OpenGraph images, auto-generated sitemap — all managed from Notion.

---

## RSS Feeds

RSS feeds are auto-generated for collections with `enable_rss` checked in their collection settings (Configure Collections). Access them at `/rss/[collection-name]`.

This enables readers to subscribe to your content using any RSS reader (Feedly, Inoreader, etc.) and helps with content syndication.

---

## SEO

Notion Site Generator is optimized for search engines out of the box:

- **Static Generation**: Every page is pre-rendered as static HTML, giving search engines clean, fast-loading content to crawl.
- **Auto-generated Sitemap**: A `sitemap.xml` is generated at build time covering all pages, collection items, and author profiles.
- **Meta Tags**: Title, description, and keywords are set from your Main Configuration and per-page properties.
- **OpenGraph Images**: Set a site-wide `og_image` in Main Configuration for social sharing previews.
- **Clean URLs**: SEO-friendly URLs like `/blogs/my-post-title` and `/author/username`.
- **RSS Feeds**: Search engines can discover your RSS feeds for indexing.

---

## Code Injection

- **HTML Head Code** page (under Settings): Add code blocks containing `<script>` tags or any HTML to inject into `<head>`. Use this for analytics (Google Analytics, Plausible, Fathom), ad scripts, custom meta tags, or any third-party integrations.
- **CSS Styling** page (under Settings): Add code blocks containing CSS to inject as `<style>` tags in `<head>`.

---

## Authors

The Authors database stores author profiles:

| Property           | Type      | Description                                     |
| ------------------ | --------- | ----------------------------------------------- |
| `name`             | Title     | Display name                                    |
| `username`         | Rich Text | Unique username (used to link posts to authors) |
| `email`            | Email     | Contact email                                   |
| `description`      | Rich Text | Bio                                             |
| `picture`          | Files     | Profile picture                                 |
| `instagram_handle` | Rich Text | Instagram username                              |
| `x_handle`         | Rich Text | X/Twitter username                              |
| `github_handle`    | Rich Text | GitHub username                                 |

Each author gets a profile page at `/author/{username}` that lists all their published work.

---

## Navbar Pages

Navbar pages (About, Contact, etc.) appear as links in the navigation. Each page can contain:

1. **Rich text content** written in Notion (headings, paragraphs, images, etc.)
2. **Inline database sections** — any section type can be added to a navbar page, rendered below the page content

To add a navbar page, create a new child page under "Navbar Pages" in Notion.

---

## Search

Notion Site Generator includes a built-in search (Cmd+K / Ctrl+K) that searches across all collection items by title, description, collection name, and tags. The search uses fuzzy matching with relevance scoring. The search index is built at compile time — no external search service required.

---

## Experiment Panel

A floating "Experiment" button in the bottom-right corner (dev mode only) opens a panel for trying out different settings:

- **Section Views:** Change the view type of any homepage section in real time
  - _Info sections:_ `col_centered_view`, `col_left_view`, `row_view`, `row_reverse_view`
  - _Dynamic sections:_ `list_view`, `card_view`, `grid_view`, `minimal_list_view`, `tiny_card_view`, `big_card_view`
- **Color Mode:** Switch between all 8 themes (not restricted by Advanced Configuration)
- **Sidebar Toggle:** Enable/disable sidebar navigation

Changes made via the Experiment panel are **temporary** and will not persist after a page refresh.

---

## Data Flow

```
Notion Workspace
    ↓ npm run sync
notion_state/ (local JSON + Markdown cache)
    ↓ npm run build
Static HTML/CSS/JS (Next.js static export)
```

1. **Sync:** Fetches all data from Notion API, downloads images, extracts dominant colors, converts pages to markdown
2. **Build:** Next.js reads from `notion_state/` and generates a fully static site
3. **Deploy:** Upload the `out/` directory to any static hosting (Vercel, Netlify, GitHub Pages, etc.)

---

## Deployment

Notion Site Generator is designed for static hosting.

### Vercel / Netlify

1. Connect your GitHub repository.
2. Set Environment Variables (`NOTION_API_KEY`, `ROOT_PAGE_ID`) in the dashboard.
3. Set the **Build Command**:
   ```bash
   npm run sync-and-build
   ```
4. Set the **Output Directory**: `out`

### Updating Content from Notion

Since Notion Site Generator is a Static Site Generator (SSG), changes in Notion do NOT appear automatically. You must **trigger a fresh build** (or redeploy) in your hosting dashboard (Netlify/Vercel) to fetch and render new content.

---

## Contributing

Contributions are welcome!

## License

MIT © [Arnav Kushesh](https://github.com/arnav-kushesh)
