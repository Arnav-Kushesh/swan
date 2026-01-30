<div align="center"> 
<br/><br/>
<img alt="start-simple-logo" src="https://raw.githubusercontent.com/arnav-kushesh/swan/master/assets/swan.png" height="128"/>
<h3 style="margin-top: 9px;">The Swan Template</h3>

<br/>

![Static Badge](https://img.shields.io/badge/DISCORD-JOIN-blue?style=for-the-badge&logo=discord&labelColor=black&color=%235965f2&link=https://discord.gg/aAsZqZkJKW)

</div> 

# Swan

> **S**tatic **W**ebsite **A**uthored in **N**otion

Swan is a powerful static portfolio website generator that uses Notion as your headless CMS. It combines the ease of editing in Notion with the performance and SEO benefits of a static site built with Next.js.

## Features

- **Dynamic Content Management**: Manage your entire site—projects, blog posts, configurations—directly in Notion.
- **Static Site Generation (SSG)**: Fast, secure, and SEO-friendly. Content is fetched at build time.
- **Kanban Workflows**:
    -   **Projects**: Move items from "Draft" -> "Reviewing" -> "Published".
    -   **Blog**: Write draft posts and publish them simply by dragging a card.
- **Real-time Theming**: Customize colors, fonts, and layout options directly from Notion or via the built-in DevTools.
- **Zero-Config Image Optimization**: Images from Notion are automatically optimized and served efficiently.
- **Resilient**: Builds with fallback data if Notion is unreachable or keys are missing.

---

## Quick Start

### 1. Create a Notion Integration
1.  Go to [Notion My Integrations](https://www.notion.so/my-integrations).
2.  Click **New integration**.
3.  Name it (e.g., "Swan Portfolio").
4.  **Copy the Internal Integration Token**.

### 2. Set Up Your Content
1.  Create a new empty page in Notion.
2.  **Copy the Page ID** from the URL.
3.  **Connect your Integration**: Click the `...` menu (top right) -> Connections -> Search for your integration -> Confirm.

### 3. Use the Template
Clone this repository or use the template button.

### 4. Install & Run
```bash
# 1. Install dependencies
npm install

# 2. Setup Environment
# Create a .env.local file with:
# NOTION_API_KEY=secret_...
# ROOT_PAGE_ID=...

# 3. Seed Notion (One-time setup)
# This creates the necessary databases in your Notion page.
npm run prepare

# 4. Sync Content
npm run sync

# 5. Start Development
npm run dev
```

---

## Notion Structure

The **ROOT_PAGE_ID** page will contain the following structure after running `npm run prepare`:

1.  **Config** (Database): Global site settings (title, description, keywords).
2.  **Home Page** (Page):
    -   **Hero Settings**: Profile bio and layout.
    -   **Section Settings**: Toggle visibility of Projects/Blogs/Gallery.
3.  **Projects** (Database): Kanban board for your portfolio items.
    -   Properties: `Project Name`, `Status`, `Description`, `Tools` (formerly Tech), `Link`, `Thumbnail`.
4.  **Blogs** (Database): Kanban board for your writings.
5.  **Gallery** (Database): A collection of visual assets.

---

## Design Decisions

### Why use static sites rather than SSR?
Static sites offer superior performance and stability. By generating pages and optimizing images at build time, we ensure instant load times and eliminate the risk of hitting Notion's API rate limits during traffic spikes. Your site stays fast and online, regardless of Notion's status.

### Why use Next.js rather than Astro or Hugo?
We chose Next.js to provide a seamless Single Page Application (SPA) experience. After the initial load, navigation is instant and smooth without full page refreshes. While Astro is excellent for static content, Next.js offers robust client-side routing and state management out of the box. We avoided Hugo to leverage the React ecosystem and TypeScript for better maintainability.

### Why use PandaCSS instead of Tailwind?
PandaCSS provides the performance of build-time CSS generation (like Tailwind) but with a much cleaner, type-safe developer experience. It keeps your markup readable by avoiding "class soup" and allows for strictly typed design tokens, making the codebase easier to maintain and scale.
