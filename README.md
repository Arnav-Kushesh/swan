# Swan - Notion as a Website 🦢

Swan is a powerful **Notion-to-Website** engine that turns your Notion workspace into a high-performance, static website. Built with **Next.js**, **PandaCSS**, and the **Notion API**, it offers the simplicity of a CMS with the speed of a static site.

![Swan Demo](public/images/demo-placeholder.png)

## ✨ Features

- **Heads-free CMS**: Manage 100% of your content (posts, pages, config) in Notion.
- **Blazing Fast**: Static Site Generation (SSG) ensures instant page loads and perfect SEO.
- **Global Search**: Built-in `Cmd+K` command palette to search all content.
- **Multi-Author**: Support for multiple authors with dedicated profile pages.
- **Rich Content**: Supports video embeds, code blocks, callouts, and more.
- **Newsletter Ready**: Native Mailchimp integration form.
- **Code Injection**: Add Analytics, Ads, or Scripts directly from Notion.
- **Theming**: Toggle between Light/Dark modes and preset color themes.
- **RSS Feeds**: Auto-generated feeds for every content collection.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/swan.git
cd swan
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
*This will create specific Pages and Databases (Home, Settings, Collections) in your root page.*

### 4. Sync & Run
Download content from Notion and start the dev server:
```bash
npm run sync  # Fetches data to notion_state/
npm run dev   # Starts Next.js at localhost:3000
```

---

## 📚 Notion Structure

After seeding, your Notion root page will look like this:

- **🏠 Home Page**: Contains sections displayed on the landing page.
- **⚙️ Settings**: Central configuration hub.
  - **General Configuration**: Site title, descriptions, social links.
  - **Configure Collections**: Toggle RSS, newsletter sections per collection.
  - **Code**: Inject scripts into `<head>`.
- **📚 Collections**: Parent page for content databases (Blogs, Projects, Gallery).
- **📑 Navbar Pages**: Static pages like About, Contact.
- **👤 Authors**: Database of site contributors.

---

## 🛠️ Project Structure

```
swan/
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

## 🎨 Customizing Design

Swan uses **PandaCSS** for styling.

- **Themes**: Edit `app/themes.css` to customize color variables for Light/Dark modes and other presets (Blue, Green, etc.).
- **Styles**: Global styles are in `app/globals.css`.
- **Layout**: Modify `app/layout.tsx` for site-wide structural changes.

## 📦 Deployment

Swan is designed for static hosting.

### Vercel / Netlify
1. Connect your GitHub repository.
2. Set Environment Variables (`NOTION_API_KEY`, `ROOT_PAGE_ID`) in the dashboard.
3. Set the **Build Command**:
   ```bash
   npm run sync-and-build
   ```
4. Set the **Output Directory**: `out`

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) (coming soon).

## 📄 License

MIT © [Arnav Singh](https://github.com/arnavsingh)
