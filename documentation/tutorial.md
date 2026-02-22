# Swan Tutorial

A step-by-step guide to setting up and customizing your Swan-powered website.

---

## Prerequisites

- Node.js 18+ installed
- A Notion account
- A Notion integration (API key)

---

## Step 1: Initial Setup

1. Clone the repository:
   ```bash
   git clone <repo-url> swan
   cd swan
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```
   NOTION_API_KEY=your_notion_api_key_here
   ROOT_PAGE_ID=your_root_page_id_here
   ```

4. Create a Notion integration at https://www.notion.so/my-integrations and copy the API key.

5. Create a new page in Notion to serve as your root page. Share it with your integration. Copy the page ID from the URL.

---

## Step 2: Seed Your Notion Workspace

Run the seeding script to populate your Notion workspace with the required structure and dummy data:

```bash
npm run seed
```

This creates:
- Home Page with sections (info, dynamic, html, iframe, video_embed, media, mailto, newsletter)
- Navbar Pages (About, Contact) with sections
- Collections (Gallery, Projects, Blogs) with sample items and content
- Settings page with Main Configuration, General Configuration, Social Links, Advanced Configuration, and Configure Collections
- Authors database with sample authors

---

## Step 3: Sync and Build

```bash
npm run sync-and-build
```

Or separately:
```bash
npm run sync    # Fetch from Notion
npm run build   # Build the static site
```

For development:
```bash
npm run dev     # Start dev server at localhost:3000
```

---

## Step 4: Customize Your Content

### Edit Main Configuration

Go to your Notion workspace > Settings > Main Configuration. Edit the single row:

- Change the `title` to your site name
- Update `description` with your meta description
- Update `tagline` with your subtitle
- Set `default_color_mode` to your preferred theme
- Toggle `sidebar_navigation` for sidebar layout
- Upload your `logo`, `favicon`, and `og_image`

### Edit General Configuration

Go to Settings > General Configuration. Toggle the checkboxes:

- `enable_newsletter` — enable newsletter functionality
- `newsletter_form_url` — set your newsletter signup form URL (e.g., from Mailchimp)
- `hide_topbar_logo` / `hide_sidebar_logo` — control logo visibility

### Edit Advanced Configuration

Go to Settings > Advanced Configuration. This controls fine-grained site behavior:

- `limit_theme_selection` — a multi-select field listing which themes users can choose from. Remove themes from the multi-select to prevent users from selecting them in the Settings menu. By default, all 8 themes are available.

### Edit Social Links

Go to Settings > Social Links. Each row has a `name` and `data`:

- Edit existing rows to update your profile URLs
- Add new rows for additional platforms (github, twitter, linkedin, instagram, youtube, facebook, twitch, email)
- For email, put the email address directly (not a URL)

### Edit Home Page Sections

Go to Home Page. Each inline database is a section:

- **Reorder sections** by dragging the databases up/down
- **Hide a section** by unchecking the `enabled` checkbox in the database row
- **Change view type** by editing the `view_type` select in the database row

### Add Collection Items

Go to Collections > [Your Collection]. Add new pages to the database:

1. Set the Title
2. Add a Description
3. Upload an Image
4. Add Tags
5. Set `order_priority` (higher = appears first)
6. Write your content in the page body

---

## Step 5: Add New Section Types

### Add an Info Section

1. Go to your Home Page (or any navbar page)
2. Type `/database` and create an inline database
3. Add properties: `title` (Title), `description` (Rich Text), `link` (URL), `button_text` (Rich Text), `image` (Files), `view_type` (Select), `section_type` (Select), `enabled` (Checkbox)
4. Set `view_type` options: `col_centered_view`, `col_left_view`, `row_view`, `row_reverse_view`
5. Add a row, set `section_type` to `info_section`
6. The image field supports both images and videos (`.mp4`, `.webm`, `.mov`, `.ogg`) — videos render as looping background videos
7. The button is hidden if `link` is empty
8. Check `enabled` to show it

### Add a Dynamic Section

1. Create an inline database with properties: `collection_name` (Title), `section_title` (Rich Text), `description` (Rich Text), `view_type` (Select), `items_in_view` (Number), `top_section_centered` (Checkbox), `section_type` (Select), `enabled` (Checkbox)
2. Set `view_type` options: `list_view`, `card_view`, `grid_view`, `minimal_list_view`, `tiny_card_view`, `big_card_view`
3. Add a row, set `section_type` to `dynamic_section`
4. Set `collection_name` to the name of the collection to display (e.g., "Blogs")
5. Optionally add a `description` — it will only render if provided
6. Check `top_section_centered` to center the title and description
7. Set `items_in_view` to control pagination (default: 6)
8. Check `enabled` to show it

### Add an HTML Section

1. Go to your Home Page (or any navbar page)
2. Type `/database` and create an inline database
3. Add properties: `title` (Title), `height` (Number), `full_width` (Checkbox), `section_type` (Select), `enabled` (Checkbox)
4. Set `section_type` options to include `html_section`
5. Add a row, set `section_type` to `html_section`
6. Open the row as a page
7. Add a code block with your HTML content
8. Optionally set `height` for a custom height in pixels
9. Check `full_width` for edge-to-edge display (removes border radius and border)
10. Check `enabled` to show it

### Add an Iframe Section

1. Create an inline database with properties: `title` (Title), `url` (URL), `height` (Number), `full_width` (Checkbox), `section_type` (Select), `enabled` (Checkbox)
2. Add a row, set `section_type` to `iframe_section`, enter the URL
3. Optionally set `height` for a custom height in pixels (defaults to 16:9 aspect ratio)
4. Check `full_width` for edge-to-edge display (removes border radius and border)
5. Check `enabled` to show it

### Add a Video Embed Section

1. Create an inline database with: `title` (Title), `url` (URL), `section_type` (Select), `enabled` (Checkbox)
2. Add a row, set `section_type` to `video_embed_section`
3. Enter the video embed URL (e.g., `https://www.youtube.com/embed/VIDEO_ID`)
4. Check `enabled` to show it

### Add a Media Section

1. Create an inline database with: `title` (Title), `media` (Files), `height` (Number), `full_width` (Checkbox), `section_type` (Select), `enabled` (Checkbox)
2. Add a row, set `section_type` to `media_section`
3. Upload an image or video file (`.mp4`, `.webm`, `.mov`, `.ogg` render as looping video)
4. Optionally set `height` for display height in pixels (default: 400)
5. Check `full_width` for edge-to-edge display (removes border radius and border)
6. Check `enabled` to show it

### Add a Mailto Section

1. Create an inline database with: `title` (Title), `subject` (Rich Text), `receiver` (Rich Text), `placeholder_text` (Rich Text), `button_text` (Rich Text), `section_type` (Select), `enabled` (Checkbox)
2. Add a row, set `section_type` to `mailto_section`
3. Enter the `subject` (email subject line) and `receiver` (recipient email address)
4. Optionally set `placeholder_text` (defaults to "Share your thoughts...") and `button_text` (defaults to "Send")
5. Check `enabled` to show it

### Add a Newsletter Section

1. Create an inline database with: `section_type` (Select), `enabled` (Checkbox)
2. Add a row, set `section_type` to `newsletter_section`
3. Go to [Mailchimp](https://mailchimp.com/) (or any email marketing service), create a signup form, and copy the form URL
4. In General Configuration, paste the URL into `newsletter_form_url` and check `enable_newsletter`
5. Check `enabled` to show it

---

## Step 6: Configure Collection Settings

Go to Settings > Configure Collections. This is a single database with one row per collection:

- `enable_rss` — generate an RSS feed for the collection
- `show_newsletter_section` — show newsletter signup on collection entry pages
- `show_mailto_comment_section` — show mailto contact form on collection entry pages

---

## Step 7: Add Extra Sections to Collection Pages

Extra sections appear on every entry page of a collection.

1. Go to Settings > Collection Page Extra Sections
2. Open the page for your collection (e.g., "Blogs")
3. Add inline databases for each section you want
4. Configure them the same way as Home Page sections
5. Run `npm run sync` to pick up changes

All 8 section types are supported: info, dynamic, html, iframe, video_embed, media, mailto, newsletter.

---

## Step 8: Customize Themes

Swan ships with 8 color themes: light, cream, pink, dark, blue, purple, red, green.

**To set the default theme:**
1. Go to Settings > Main Configuration
2. Set `default_color_mode` to your preferred theme name

**To restrict available themes:**
1. Go to Settings > Advanced Configuration
2. Edit the `limit_theme_selection` multi-select — remove themes you don't want users to access
3. Only themes listed will appear in the Settings menu

**To try themes temporarily:**
1. Click the "Experiment" button (bottom-right corner, dev mode only)
2. Select a color mode — changes won't persist after refresh
3. Note: The Experiment panel shows all themes regardless of restrictions

**To permanently change via the Settings menu:**
1. Click the settings icon in the navbar/sidebar
2. Select a theme — this saves to the browser's localStorage

---

## Step 9: Configure Navigation

**Sidebar vs Navbar:**
- Check `sidebar_navigation` in Main Configuration for sidebar mode
- Uncheck it for top navbar mode

**Add Navbar Pages:**
1. Go to Navbar Pages in your Notion workspace
2. Create a new child page (e.g., "Portfolio")
3. Write your content
4. Optionally add inline database sections
5. Run `npm run sync`

---

## Step 10: Add Authors

1. Go to the Authors database
2. Add a new row with:
   - `name`: Display name
   - `username`: Unique identifier (used in collection items)
   - `email`: Contact email (enables the "Message Author" feature)
   - `description`: Short bio
   - `picture`: Profile photo
3. In collection items, set `author_username` to link to the author

---

## Step 11: Code & CSS Injection

**Add custom scripts:**
1. Go to Settings > HTML Head Code
2. Add a code block with your script (e.g., analytics snippet, ad code)

**Add custom CSS:**
1. Go to Settings > CSS Styling
2. Add a code block with your CSS

These are injected into the `<head>` of every page.

---

## Step 12: Deploy

After building, deploy the `out/` directory to any static hosting:

**Vercel:**
```bash
npx vercel --prod
```

**Netlify:**
Upload the `out/` folder or connect your git repository.

**GitHub Pages:**
Push the `out/` folder to the `gh-pages` branch.

---

## Common Workflows

### Update content
```bash
npm run sync && npm run build
```

### Development mode
```bash
npm run dev
```

### Full rebuild from scratch
```bash
npm run sync-and-build
```

---

## Tips

- **Section order** on the Home Page is determined by the order of inline databases in Notion
- **Disabled sections** (`enabled` unchecked) are synced but not rendered
- **The Experiment panel** is great for testing section view types, color modes, and sidebar toggle without committing to changes
- **Collection item order** is controlled by `order_priority` (higher = first), then by creation date
- **Images** are automatically downloaded and stored locally during sync
- **Dominant colors** are automatically extracted from collection item images during sync (used by `big_card_view`)
- **Social links** use `rich_text` for the `data` column, so you can store both URLs and email addresses
- **Video support**: Info sections and media sections detect video files by extension (`.mp4`, `.webm`, `.mov`, `.ogg`) and render them as looping videos
- **Full-width sections**: HTML, iframe, and media sections support a `full_width` checkbox for edge-to-edge display
