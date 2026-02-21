# Swan Documentation

Swan is a Notion-powered static site generator built with Next.js. It turns a Notion workspace into a fully functional portfolio/blog website with zero code changes required.

---

## Notion Page Structure

Swan expects the following structure in your Notion workspace:

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
│   └── [Inline DB] Newsletter (newsletter_section)
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
│   ├── Social Links (database)
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

## Section Types

Sections are inline databases placed on the Home Page, Navbar Pages, or Collection Extra Sections pages. Each database must have a `section_type` select property to identify its type.

### 1. `info_section`

A static content section with text, image/video, and optional CTA button. If the image is a video file (`.mp4`, `.webm`, `.mov`, `.ogg`), it renders as a looping video with no controls.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `description` | Rich Text | Section body text |
| `link` | URL | Optional CTA button link (button hidden if empty) |
| `button_text` | Rich Text | Custom button label (defaults to "Explore") |
| `image` | Files | Optional hero/feature image or video |
| `view_type` | Select | Layout: `col_centered_view`, `col_left_view`, `row_view`, `row_reverse_view` |
| `section_type` | Select | Must be `info_section` |
| `enabled` | Checkbox | Show/hide the section |

### 2. `dynamic_section`

Displays items from a collection (blogs, projects, gallery) in various view types.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `collection_name` | Title | Name of the collection to display (e.g., "Blogs") |
| `section_title` | Rich Text | Display title for the section |
| `description` | Rich Text | Optional description shown below the title |
| `view_type` | Select | Layout: `list_view`, `card_view`, `grid_view`, `minimal_list_view`, `tiny_card_view`, `big_card_view` |
| `items_shown_at_once` | Number | Number of items per page (default: 6) |
| `top_section_centered` | Checkbox | Center the title and description |
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

Renders custom HTML inside a sandboxed iframe. The HTML code is stored as a code block inside the first database row's page content.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `height` | Number | Custom height in pixels |
| `full_width` | Checkbox | Edge-to-edge display (removes border radius and border) |
| `section_type` | Select | Must be `html_section` |
| `enabled` | Checkbox | Show/hide the section |

**How to use:** Open the first row as a page, add a code block with your HTML.

### 4. `iframe_section`

Embeds an external webpage in an iframe.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `url` | URL | The URL to embed |
| `height` | Number | Custom height in pixels (defaults to 16:9 aspect ratio) |
| `full_width` | Checkbox | Edge-to-edge display (removes border radius and border) |
| `section_type` | Select | Must be `iframe_section` |
| `enabled` | Checkbox | Show/hide the section |

### 5. `video_embed_section`

Embeds a video (YouTube, Vimeo, etc.) using the embed URL.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `url` | URL | Video embed URL (e.g., `https://www.youtube.com/embed/VIDEO_ID`) |
| `section_type` | Select | Must be `video_embed_section` |
| `enabled` | Checkbox | Show/hide the section |

### 6. `media_section`

Displays an image or a looping video. If the media file is a video (`.mp4`, `.webm`, `.mov`, `.ogg`), it renders as a looping video with no controls. Otherwise, it renders as an image.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `media` | Files | Image or video file |
| `height` | Number | Display height in pixels (default: 400) |
| `full_width` | Checkbox | Edge-to-edge display (removes border radius and border) |
| `section_type` | Select | Must be `media_section` |
| `enabled` | Checkbox | Show/hide the section |

### 7. `mailto_section`

An email-based contact form. When a reader submits the form, their email client opens with a pre-filled subject line and message body.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `subject` | Rich Text | Email subject line |
| `receiver` | Rich Text | Recipient email address |
| `placeholder_text` | Rich Text | Textarea placeholder (defaults to "Share your thoughts...") |
| `button_text` | Rich Text | Submit button label (defaults to "Send") |
| `section_type` | Select | Must be `mailto_section` |
| `enabled` | Checkbox | Show/hide the section |

### 8. `newsletter_section`

Renders a Mailchimp-powered newsletter signup form. Reads the `mailchimp_form_link` from General Configuration.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `section_type` | Select | Must be `newsletter_section` |
| `enabled` | Checkbox | Show/hide the section |

---

## Collections

Collections are full-page databases stored under the "Collections" page. Each item in a collection has:

| Property | Type | Description |
|----------|------|-------------|
| `Title` | Title | Item title |
| `Description` | Rich Text | Short description |
| `Image` | Files | Cover/thumbnail image |
| `Tags` | Multi-select | Categorization tags |
| `Link` | URL | External link |
| `button_text` | Rich Text | Custom button label |
| `order_priority` | Number | Sort order (higher = first) |
| `author_username` | Rich Text | Author username (links to Authors DB) |
| `video_embed_link` | URL | Optional video embed URL |

The page content (body) of each item becomes the full article content, rendered as markdown.

During sync, a `dominant_color` is automatically extracted from each item's image for use with the Big Card view type.

### Collection Settings

Per-collection configuration is managed in **Settings > Configure Collections**, a single database with one row per collection:

| Property | Type | Description |
|----------|------|-------------|
| `collection_name` | Title | Name of the collection |
| `enable_rss` | Checkbox | Generate an RSS feed for this collection |
| `show_newsletter_section` | Checkbox | Show newsletter signup on collection pages |
| `show_mailto_section` | Checkbox | Show mailto section on collection pages |

---

## Configuration

### Main Configuration

Stores your site's identity and branding as individual columns with a single row of data.

| Column | Type | Description |
|--------|------|-------------|
| `title` | Title | Site title |
| `description` | Rich Text | Meta description |
| `tagline` | Rich Text | Site tagline/subtitle |
| `keywords` | Rich Text | SEO keywords |
| `logo` | Files | Site logo |
| `favicon` | Files | Favicon image |
| `og_image` | Files | OpenGraph image for social sharing |
| `default_color_mode` | Select | Default theme (light, dark, blue, purple, pink, red, green, cream) |
| `sidebar_navigation` | Checkbox | Enable sidebar navigation by default |

### General Configuration

Stores feature flags and toggles as individual checkbox/URL columns with a single row of data.

| Column | Type | Description |
|--------|------|-------------|
| `disable_logo_in_topbar` | Checkbox | Hide logo from the top navbar |
| `disable_logo_in_sidebar` | Checkbox | Hide logo from the sidebar |
| `enable_newsletter` | Checkbox | Enable newsletter functionality site-wide |
| `mailchimp_form_link` | URL | Mailchimp form URL |
| `mention_this_tool_in_footer` | Checkbox | Show "Built with Swan" in the footer |
| `show_newsletter_section_on_home` | Checkbox | Show a newsletter section on the homepage |

### Advanced Configuration

Fine-grained control over site behavior with a single row of data.

| Column | Type | Description |
|--------|------|-------------|
| `limit_theme_selection` | Multi-select | Which themes users can choose from (defaults to all 8) |

Remove themes from the multi-select to prevent users from selecting them in the Settings menu.

### Social Links

Stores social media profiles with one row per social platform.

| Column | Type | Description |
|--------|------|-------------|
| `name` | Title | Social platform name (e.g., `github`) |
| `data` | Rich Text | Profile URL or contact info (e.g., email address) |

Supported: github, twitter, linkedin, instagram, youtube, facebook, twitch, email.

---

## Color Modes

Swan supports 8 color themes:

| Theme | Type | Description |
|-------|------|-------------|
| `light` | Light | Clean white/gray (default) |
| `cream` | Light | Warm white/cream |
| `pink` | Light | Berry pink/purple |
| `dark` | Dark | Dark mode |
| `blue` | Dark | Midnight blue |
| `purple` | Dark | Deep purple |
| `red` | Dark | Sunset red |
| `green` | Dark | Forest green |

Set the default via `default_color_mode` in Main Configuration. Users can change themes via the Settings menu or the Experiment panel.

To restrict which themes are available to users, edit the `limit_theme_selection` multi-select in Advanced Configuration.

---

## Navigation Modes

Swan supports two navigation layouts:

- **Navbar (Top Bar):** Default. Shows logo, navigation links, social icons, settings, and search.
- **Sidebar (Left Panel):** Fixed left sidebar with profile, navigation, social icons, and settings.

Set the default via `sidebar_navigation` in Main Configuration.

---

## Code & CSS Injection

- **HTML Head Code** page (under Settings): Add code blocks containing `<script>` tags or other HTML to inject into `<head>`.
- **CSS Styling** page (under Settings): Add code blocks containing CSS to inject as `<style>` tags in `<head>`.

---

## Authors

The Authors database stores author profiles:

| Property | Type | Description |
|----------|------|-------------|
| `name` | Title | Display name |
| `username` | Rich Text | Unique username (used to link posts to authors) |
| `email` | Email | Contact email |
| `description` | Rich Text | Bio |
| `picture` | Files | Profile picture |
| `instagram_handle` | Rich Text | Instagram username |
| `x_handle` | Rich Text | X/Twitter username |
| `github_handle` | Rich Text | GitHub username |

---

## Collection Page Extra Sections

Extra sections can be added to collection entry pages (blog posts, projects, etc.) via:

**Settings > Collection Page Extra Sections > [Collection Name]**

Each collection name page contains inline databases representing sections. These sections are rendered on every entry page of that collection.

All 9 section types are supported (info, dynamic, html, iframe, video_embed, media, mailto, newsletter).

---

## Navbar Page Sections

Navbar pages (About, Contact, etc.) can also contain inline database sections. Any inline database on a navbar page that has a `section_type` property will be rendered as a section below the page content.

---

## Experiment Panel

A floating "Experiment" button in the bottom-right corner (dev mode only) opens a panel for trying out different settings:

- **Section Views:** Change the view type of any homepage section in real time
  - *Info sections:* `col_centered_view`, `col_left_view`, `row_view`, `row_reverse_view`
  - *Dynamic sections:* `list_view`, `card_view`, `grid_view`, `minimal_list_view`, `tiny_card_view`, `big_card_view`
- **Color Mode:** Switch between all 8 themes (not restricted by Advanced Configuration)
- **Sidebar Toggle:** Enable/disable sidebar navigation

Changes made via the Experiment panel are **temporary** and will not persist after a page refresh.

---

## RSS Feeds

RSS feeds are auto-generated for collections with `enable_rss` checked in their collection settings. Access them at `/rss/[collection-name]`.

---

## Search

Swan includes a built-in search (Cmd+K / Ctrl+K) that searches across all collection items by title, description, collection name, and tags. Uses fuzzy matching with relevance scoring.

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
