
// Configuration Page Data
export const dummyConfig = [
  // Top Level
  { field: 'title', value: 'My Notion Portfolio' },
  { field: 'tagline', value: 'Software Engineer & Designer' },
  { field: 'logo', value: '', media: 'https://picsum.photos/id/1015/100/100' },
  { field: 'description', value: 'A portfolio site built with Next.js and Notion.' },

  // Socials
  { field: 'social_github', value: 'https://github.com' },
  { field: 'social_twitter', value: 'https://twitter.com' },
  { field: 'social_linkedin', value: 'https://linkedin.com' },
  { field: 'social_instagram', value: 'https://instagram.com' },
  { field: 'social_youtube', value: 'https://youtube.com' },
  { field: 'social_facebook', value: 'https://facebook.com' },
  { field: 'social_twitch', value: 'https://twitch.tv' },

  // Visibility Flags
  { field: 'disable_logo_in_topbar', value: 'false' },
  { field: 'disable_logo_in_sidebar', value: 'false' },
  // Sidebar
  { field: 'sidebar_navigation', value: 'false' },
  // Site Info
  { field: 'favicon', value: '', media: 'https://picsum.photos/id/1016/512/512' },
  { field: 'keywords', value: 'portfolio, notion, nextjs' },
  { field: 'og_image', value: '', media: 'https://picsum.photos/id/1018/1200/630' },

  // Newsletter & Footer
  { field: 'enable_newsletter', value: 'false' },
  { field: 'mailchimp_form_link', value: '' },
  { field: 'mention_this_tool_in_footer', value: 'true' },
  { field: 'show_newsletter_section_on_home', value: 'false' },
];

/**
 * HOME PAGE SECTIONS
 */

// 1. Hero Section (Info Section)
export const dummyHeroSection = {
  type: 'info_section',
  visibility: 'true',
  title: 'Hero Section',
  data: [
    {
      title: 'Welcome to my portfolio',
      description: 'This is a longer bio paragraph about yourself. I build things with code.',
      link: 'https://example.com/about',
      image: 'https://picsum.photos/id/1025/500/500',
      view_type: 'col_centered_view',
    }
  ]
};

// 2. Dynamic Sections
export const dummyDynamicGallery = {
  type: 'dynamic_section',
  visibility: 'true',
  title: 'My Gallery',
  data: [
    {
      collection_name: 'Gallery',
      section_title: 'My Gallery',
      view_type: 'grid_view',
    }
  ]
};

export const dummyDynamicProjects = {
  type: 'dynamic_section',
  visibility: 'true',
  title: 'Selected Projects',
  data: [
    {
      collection_name: 'Projects',
      section_title: 'Selected Projects',
      view_type: 'card_view',
    }
  ]
};

export const dummyDynamicBlog = {
  type: 'dynamic_section',
  visibility: 'true',
  title: 'Recent Writing',
  data: [
    {
      collection_name: 'Blogs',
      section_title: 'Recent Writing',
      view_type: 'minimal_list_view', // Text only
    }
  ]
};

// The order here determines the order of creation on the Home Page, and thus the default order on the site.
export const dummyHomePageSections = [
  dummyHeroSection,
  dummyDynamicGallery,
  dummyDynamicProjects,
  dummyDynamicBlog
];

/**
 * COLLECTIONS
 * Stored in Root > Collections > [Page] > [Database]
 */

export const dummyCollections = {
  Gallery: [
    {
      title: 'Mountain View',
      description: 'I took this photo while hiking in the mountains.',
      image: 'https://picsum.photos/seed/mountain/600/600',
      tags: ['Nature', 'Photography'],
      link: 'https://unsplash.com',
      order_priority: 6,
      author_username: 'johndoe',
    },
    {
      title: 'City Lights',
      description: 'The city comes alive at night. A long exposure shot.',
      image: 'https://picsum.photos/seed/city/600/600',
      tags: ['Urban', 'Night'],
      link: '',
      order_priority: 5,
      author_username: 'johndoe',
    },
    {
      title: 'Ocean Breeze',
      description: 'Calm waves hitting the shore during sunset.',
      image: 'https://picsum.photos/seed/ocean/600/600',
      tags: ['Nature', 'Water'],
      link: '',
      order_priority: 4,
      author_username: 'janedoe',
    },
    {
      title: 'Forest Mist',
      description: 'Early morning mist rolling through the pine trees.',
      image: 'https://picsum.photos/seed/forest/600/600',
      tags: ['Nature', 'Forest'],
      link: '',
      order_priority: 3,
      author_username: 'janedoe',
    },
    {
      title: 'Desert Dunes',
      description: 'Layered sand dunes under the bright sun.',
      image: 'https://picsum.photos/seed/desert/600/600',
      tags: ['Nature', 'Desert'],
      link: '',
      order_priority: 2,
      author_username: 'johndoe',
    },
    {
      title: 'Urban Architecture',
      description: 'Modern lines and glass facades.',
      image: 'https://picsum.photos/seed/architecture/600/600',
      tags: ['Architecture', 'Urban'],
      link: '',
      order_priority: 1,
      author_username: 'janedoe',
    }
  ],
  Projects: [
    {
      title: 'Notion Portfolio',
      description: 'A static site generated from Notion content, built with Next.js.',
      image: 'https://picsum.photos/seed/notion/800/600',
      tags: ['Next.js', 'Notion API'],
      link: 'https://github.com',
      order_priority: 6,
      author_username: 'johndoe',
      video_embed_link: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      title: 'AI Chatbot',
      description: 'A conversational AI interface using OpenAI API.',
      image: 'https://picsum.photos/seed/ai/800/600',
      tags: ['Python', 'OpenAI', 'React'],
      link: 'https://github.com',
      order_priority: 5,
      author_username: 'janedoe',
    },
    {
      title: 'E-commerce Store',
      description: 'Full-featured online store with Stripe integration.',
      image: 'https://picsum.photos/seed/ecommerce/800/600',
      tags: ['React', 'Stripe', 'Node.js'],
      link: 'https://github.com',
      order_priority: 4,
      author_username: 'johndoe',
    },
    {
      title: 'Task Manager',
      description: 'Productivity app to organize daily tasks and goals.',
      image: 'https://picsum.photos/seed/task/800/600',
      tags: ['Vue.js', 'Firebase'],
      link: 'https://github.com',
      order_priority: 3,
      author_username: 'janedoe',
    },
    {
      title: 'Weather App',
      description: 'Real-time weather forecasts using geolocation.',
      image: 'https://picsum.photos/seed/weather/800/600',
      tags: ['JavaScript', 'API'],
      link: 'https://github.com',
      order_priority: 2,
      author_username: 'johndoe',
    },
    {
      title: 'Finance Tracker',
      description: 'Track income and expenses with visual charts.',
      image: 'https://picsum.photos/seed/finance/800/600',
      tags: ['React', 'D3.js'],
      link: 'https://github.com',
      order_priority: 1,
      author_username: 'janedoe',
    }
  ],
  Blogs: [
    {
      title: 'Hello World',
      description: 'Welcome to my first blog post! In this post, I will share my journey.',
      image: 'https://picsum.photos/seed/hello/1000/600',
      tags: ['Personal', 'Update'],
      link: '',
      order_priority: 6,
      author_username: 'johndoe',
    },
    {
      title: 'The Future of Web Dev',
      description: 'Thoughts on where the industry is heading with AI and new frameworks.',
      image: 'https://picsum.photos/seed/webdev/1000/600',
      tags: ['Tech', 'Opinion'],
      link: '',
      order_priority: 5,
      author_username: 'janedoe',
      video_embed_link: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      title: 'Mastering CSS Grid',
      description: 'A comprehensive guide to building complex layouts with CSS Grid.',
      image: 'https://picsum.photos/seed/css/1000/600',
      tags: ['CSS', 'Tutorial'],
      link: '',
      order_priority: 4,
      author_username: 'johndoe',
    },
    {
      title: 'Why I Use Next.js',
      description: 'The benefits of server-side rendering and static site generation.',
      image: 'https://picsum.photos/seed/nextjs/1000/600',
      tags: ['Next.js', 'React'],
      link: '',
      order_priority: 3,
      author_username: 'janedoe',
    },
    {
      title: 'Remote Work Tips',
      description: 'How to stay productive and maintain a healthy work-life balance.',
      image: 'https://picsum.photos/seed/remote/1000/600',
      tags: ['Productivity', 'Lifestyle'],
      link: '',
      order_priority: 2,
      author_username: 'johndoe',
    },
    {
      title: 'Learning Rust',
      description: 'My experience diving into systems programming with Rust.',
      image: 'https://picsum.photos/seed/rust/1000/600',
      tags: ['Rust', 'Programming'],
      link: '',
      order_priority: 1,
      author_username: 'janedoe',
    }
  ]
};

/**
 * COLLECTION SETTINGS
 * Stored in Root > Collection Settings > [Inline DB per collection]
 */
export const dummyCollectionSettings = {
  Gallery: { collection_name: 'Gallery', enable_rss: 'false', show_newsletter_section: 'false' },
  Projects: { collection_name: 'Projects', enable_rss: 'true', show_newsletter_section: 'false' },
  Blogs: { collection_name: 'Blogs', enable_rss: 'true', show_newsletter_section: 'true' },
};

/**
 * AUTHORS
 * Stored in Root > Authors (Database)
 */
export const dummyAuthors = [
  {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    description: 'Full-stack developer, open source enthusiast, and coffee addict.',
    picture: 'https://picsum.photos/seed/johndoe/200/200',
    instagram_handle: 'johndoe',
    x_handle: 'johndoe',
    github_handle: 'johndoe',
  },
  {
    name: 'Jane Doe',
    username: 'janedoe',
    email: 'jane@example.com',
    description: 'Designer and frontend developer with a passion for beautiful interfaces.',
    picture: 'https://picsum.photos/seed/janedoe/200/200',
    instagram_handle: 'janedoe',
    x_handle: 'janedoe',
    github_handle: 'janedoe',
  }
];

/**
 * CODE INJECTION
 * Content blocks to inject into <head>
 */
export const dummyCodeInjection = [
  '<!-- Swan Code Injection: Add your analytics, meta tags, or custom scripts here -->',
];

export const dummyNavbarPages = [
  {
    title: 'About',
    content: [
      { type: 'heading_1', content: 'About Me' },
      { type: 'paragraph', content: 'I am a passionate developer building open source projects.' },
    ]
  },
  {
    title: 'Contact',
    content: [
      { type: 'heading_1', content: 'Contact' },
      { type: 'paragraph', content: 'Reach out to me on social media.' },
    ]
  }
];
