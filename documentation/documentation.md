# Notion Site Generator Documentation

Notion Site Generator is a Notion-powered static site generator built with Next.js. It turns a Notion workspace into a fully functional portfolio/blog website with zero code changes required.

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

## Section Types

Sections are inline databases placed on the Home Page, Navbar Pages, or Collection Extra Sections pages. Each database must have a `section_type` select property to identify its type.

### Common Properties

All section types support these properties:

| Property | Type | Description |
|----------|------|-------------|
| `section_type` | Select | Identifies the section type |
| `html_id` | Rich Text | Custom HTML `id` attribute applied to the section container. Use this with CSS injection to target individual sections by ID |
| `html_class` | Rich Text | Custom CSS class name(s) applied to the section container. Use this with CSS injection to style individual sections |
| `enabled` | Checkbox | Show/hide the section |

### 1. `info_section`

A static content section with text, image/video, and optional CTA button. If the image is a video file (`.mp4`, `.webm`, `.mov`, `.ogg`), it renders as a looping video with no controls.

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

### 2. `dynamic_section`

Displays items from a collection (blogs, projects, gallery) in various view types.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `collection_name` | Title | Name of the collection to display (e.g., "Blogs") |
| `title` | Rich Text | Display title for the section |
| `description` | Rich Text | Optional description shown below the title |
| `view_type` | Select | Layout: `list_view`, `card_view`, `grid_view`, `minimal_list_view`, `tiny_card_view`, `big_card_view` |
| `items_in_view` | Number | Number of items per page (default: 6) |
| `top_part_centered` | Checkbox | Center the title and description |

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
| `description` | Rich Text | Section description (shown below the title) |
| `aspect_ratio` | Rich Text | Aspect ratio for the section (e.g., `16:9` or `16/9`; default: `16:9`) |
| `width` | Rich Text | Desktop width (e.g., `600px`, `80%`; default: `100%`). Centered when less than 100% |
| `width_mobile` | Rich Text | Mobile width (defaults to `width`) |
| `full_width` | Checkbox | Edge-to-edge display (removes border radius and border) |
| `top_part_centered` | Checkbox | Center-align the title and description |

**How to use:** Open the first row as a page, add a code block with your HTML.

### 4. `iframe_section`

Embeds an external webpage in an iframe.

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

### 5. `video_embed_section`

Embeds a video (YouTube, Vimeo, etc.) using the embed URL.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `description` | Rich Text | Section description (shown below the title) |
| `url` | URL | Video embed URL (e.g., `https://www.youtube.com/embed/VIDEO_ID`) |
| `top_part_centered` | Checkbox | Center-align the title and description |

### 6. `media_section`

Displays an image or a looping video. If the media file is a video (`.mp4`, `.webm`, `.mov`, `.ogg`), it renders as a looping video with no controls. Otherwise, it renders as an image.

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

### 8. `newsletter_section`

Renders a newsletter signup button that links visitors to your signup form. Reads the `newsletter_form_url` from General Configuration.

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

### 9. `gap_section`

Adds vertical spacing between sections. Use this to control the gap between specific sections without affecting the global spacing.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section label (not displayed, for organization only) |
| `height` | Rich Text | Desktop height (e.g., `60`, `60px`, `4rem`; bare numbers treated as pixels) |
| `mobile_height` | Rich Text | Mobile height (defaults to `height`) |

---

## Collections

Collections are full-page databases stored under the "Collections" page. Each item in a collection has:

| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Item title |
| `slug` | Rich Text | URL slug (auto-generated from title if empty) |
| `description` | Rich Text | Short description |
| `thumbnail` | Files | Cover/thumbnail image |
| `tags` | Multi-select | Categorization tags |
| `link` | URL | External link |
| `button_text` | Rich Text | Custom button label |
| `order_priority` | Number | Sort order (higher = first) |
| `author_username` | Rich Text | Author username (links to Authors DB) |
| `video_embed_url` | URL | Optional video embed URL |
| `status` | Select | `draft`, `in_review`, or `published` (only `published` items appear on the site) |

The page content (body) of each item becomes the full article content, rendered as markdown.

During sync, a `dominant_color` is automatically extracted from each item's image for use with the Big Card view type.

### Collection Settings

Per-collection configuration is managed in **Settings > Configure Collections**, a single database with one row per collection:

| Property | Type | Description |
|----------|------|-------------|
| `collection_name` | Title | Name of the collection |
| `enable_rss` | Checkbox | Generate an RSS feed for this collection |
| `show_newsletter_section` | Checkbox | Show newsletter signup on collection pages |
| `show_mailto_comment_section` | Checkbox | Show mailto comment section on collection pages |

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
| `hide_topbar_logo` | Checkbox | Hide logo from the top navbar |
| `hide_sidebar_logo` | Checkbox | Hide logo from the sidebar |
| `enable_newsletter` | Checkbox | Enable newsletter functionality site-wide |
| `newsletter_form_url` | URL | Newsletter signup form URL (e.g., Mailchimp) |
| `mention_this_tool_in_footer` | Checkbox | Show "Made With Notion Site Generator" in the footer |

### Advanced Configuration

Fine-grained control over site behavior with a single row of data.

| Column | Type | Description |
|--------|------|-------------|
| `limit_theme_selection` | Multi-select | Which themes users can choose from (defaults to all 8) |

Remove themes from the multi-select to prevent users from selecting them in the Settings menu.

### Social

Stores social media profiles with one row per social platform.

| Column | Type | Description |
|--------|------|-------------|
| `name` | Title | Social platform name (e.g., `github`) |
| `data` | Rich Text | Profile URL or contact info (e.g., email address) |

Supported: github, twitter, linkedin, instagram, youtube, facebook, twitch, email.

---

## Color Modes

Notion Site Generator supports 8 color themes:

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

Notion Site Generator supports two navigation layouts:

- **Navbar (Top Bar):** Default. Shows logo, navigation links, social icons, settings, and search.
- **Sidebar (Left Panel):** Fixed left sidebar with profile, navigation, social icons, and settings.

Set the default via `sidebar_navigation` in Main Configuration.

---

## Code & CSS Injection

- **HTML Head Code** page (under Settings): Add code blocks containing `<script>` tags or other HTML to inject into `<head>`.
- **CSS Styling** page (under Settings): Add code blocks containing CSS to inject as `<style>` tags in `<head>`. Use this with the `html_id` and `html_class` properties on sections to target individual sections with custom styles.

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
| `instagram_handle_link` | Rich Text | Instagram profile URL |
| `x_handle_link` | Rich Text | X/Twitter profile URL |
| `github_handle_link` | Rich Text | GitHub profile URL |

---

## Collection Page Extra Sections

Extra sections can be added to collection entry pages (blog posts, projects, etc.) via:

**Settings > Collection Page Extra Sections > [Collection Name]**

Each collection name page contains inline databases representing sections. These sections are rendered on every entry page of that collection.

All 10 section types are supported (info, dynamic, html, iframe, video_embed, media, mailto, newsletter, gap).

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

Notion Site Generator includes a built-in search (Cmd+K / Ctrl+K) that searches across all collection items by title, description, collection name, and tags. Uses fuzzy matching with relevance scoring.

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
