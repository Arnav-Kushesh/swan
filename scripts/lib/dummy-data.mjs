export const dummySiteInfo = [
  { field: 'site_title', value: 'My Notion Portfolio' },
  { field: 'site_description', value: 'A portfolio site built with Next.js and Notion.' },
  { field: 'favicon', value: 'https://example.com/favicon.ico' },
  { field: 'keywords', value: 'portfolio, notion, nextjs' },
  { field: 'og_image', value: 'https://example.com/og-image.png' },
  { field: 'sidebar_navigation', value: 'false' },
];


export const dummyHero = [
  { field: 'tagline', value: 'Welcome to my portfolio based on Notion.' },
  { field: 'long_bio', value: 'This is a longer bio paragraph about yourself.' },
  { field: 'profile_image', value: '', media: 'https://placedog.net/500' },
  { field: 'location', value: 'San Francisco, CA' },
  { field: 'email', value: 'hello@example.com' },
  { field: 'twitter', value: 'https://twitter.com' },
  { field: 'github', value: 'https://github.com' },
  { field: 'linkedin', value: 'https://linkedin.com' },
];

export const dummyProjectConfig = [
  { field: 'title', value: 'My Projects' },
  { field: 'show_section', value: 'true' },
  { field: 'view_type', value: 'Grid' },
];

export const dummyBlogConfig = [
  { field: 'title', value: 'Latest Writings' },
  { field: 'show_section', value: 'true' },
  { field: 'view_type', value: 'List' },
];

export const dummyGalleryConfig = [
  { field: 'title', value: 'Gallery' },
  { field: 'show_section', value: 'true' },
];

export const dummyProjects = {
  'Work in Progress': [
    {
      title: 'Notion Portfolio',
      description: 'A static site generated from Notion.',
      tools: 'Next.js, Notion API',
      link: 'https://github.com',
      image: 'https://placedog.net/800/600',
    },
  ],
  'Live': [
    {
      title: 'Cool App',
      description: 'A live application.',
      tools: 'React, Node.js',
      link: 'https://example.com',
      image: 'https://placedog.net/800/600',
    },
  ],
  'Abandoned': [],
};

const date = new Date().toISOString().split('T')[0];

export const dummyBlogs = {
  'Live': [
    {
      title: 'Hello World',
      summary: 'This is a sample blog post.',
      date: date,
      coverImage: 'https://placedog.net/1000/600',
      content: 'This is the content of the dummy blog post.',
    },
  ],
  'Drafts': [],
  'In Review': [],
  'Archive': [],
};

export const dummyGalleryItems = [
  {
    name: 'Mountain View',
    image: 'https://placedog.net/600/600',
    link: 'https://unsplash.com',
  },
  {
    name: 'City Lights',
    image: 'https://placedog.net/601/601',
    link: '',
  },
  {
    name: 'Ocean Waves',
    image: 'https://placedog.net/602/602',
    link: '',
  },
  {
    name: 'Forest Path',
    image: 'https://placedog.net/603/603',
    link: '',
  },
  {
    name: 'Desert Dunes',
    image: 'https://placedog.net/604/604',
    link: '',
  },
  {
    name: 'Starry Night',
    image: 'https://placedog.net/605/605',
    link: '',
  }
];
