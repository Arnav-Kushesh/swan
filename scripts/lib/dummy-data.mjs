
/**
 * MAIN CONFIGURATION
 * Stored in Settings > Main Configuration (Database)
 * Contains site identity fields: title, description, tagline, keywords, logo, favicon, og_image
 */
export const dummyBasicConfig = {
  title: 'My Notion Portfolio',
  description: 'A portfolio site built with Next.js and Notion.',
  tagline: 'Software Engineer & Designer',
  keywords: 'portfolio, notion, nextjs',
  logo: 'https://picsum.photos/id/1015/100/100',
  favicon: 'https://picsum.photos/id/1016/512/512',
  og_image: 'https://picsum.photos/id/1018/1200/630',
  default_color_mode: 'light',
  sidebar_navigation: false,
};

/**
 * SOCIAL LINKS
 * Stored in Settings > Social (Database)
 * Contains all social media URLs
 */
export const dummySocialLinks = [
  { name: 'github', data: 'https://github.com' },
  { name: 'twitter', data: 'https://twitter.com' },
  { name: 'linkedin', data: 'https://linkedin.com' },
  { name: 'instagram', data: 'https://instagram.com' },
  { name: 'youtube', data: 'https://youtube.com' },
  { name: 'facebook', data: 'https://facebook.com' },
  { name: 'twitch', data: 'https://twitch.tv' },
  { name: 'email', data: 'john@example.com' },
];

/**
 * GENERAL CONFIGURATION
 * Stored in Settings > General Configuration (Database)
 * Individual columns with checkboxes for boolean fields
 */
export const dummyConfig = {
  hide_topbar_logo: false,
  hide_sidebar_logo: false,
  enable_newsletter: false,
  newsletter_form_url: '',
  mention_this_tool_in_footer: true,
  primary_font: 'Inter',
  secondary_font: 'Inter',
};

/**
 * HOME PAGE SECTIONS
 */

// 1. Hero Section (Info Section)
export const dummyHeroSection = {
  type: 'info_section',
  enabled: 'true',
  title: 'Hero Section',
  data: [
    {
      title: 'Welcome to my portfolio',
      description: 'This is a longer bio paragraph about yourself. I build things with code.',
      button_link: 'https://example.com/about',
      button_text: 'Explore',
      image: 'https://picsum.photos/id/1025/500/500',
      view_type: 'col_centered_view',
      media_aspect_ratio: '16/9',
      media_height: '400px',
      media_mobile_height: '250px',
    }
  ]
};

// 2. Dynamic Sections
export const dummyDynamicGallery = {
  type: 'dynamic_section',
  enabled: 'true',
  title: 'My Gallery',
  data: [
    {
      collection_name: 'Gallery',
      title: 'My Gallery',
      description: '',
      view_type: 'grid_view',
      items_in_view: 9,
      top_part_centered: false,
    }
  ]
};

export const dummyDynamicProjects = {
  type: 'dynamic_section',
  enabled: 'true',
  title: 'Selected Projects',
  data: [
    {
      collection_name: 'Projects',
      title: 'Selected Projects',
      description: 'A selection of my favorite projects',
      view_type: 'card_view',
      items_in_view: 6,
      top_part_centered: false,
    }
  ]
};

export const dummyDynamicBlog = {
  type: 'dynamic_section',
  enabled: 'true',
  title: 'Recent Writing',
  data: [
    {
      collection_name: 'Blogs',
      title: 'Recent Writing',
      description: '',
      view_type: 'minimal_list_view', // Text only
      items_in_view: 6,
      top_part_centered: false,
    }
  ]
};

// 3. HTML Section (disabled by default)
export const dummyHtmlSection = {
  type: 'html_section',
  enabled: 'false',
  title: 'Custom HTML',
  data: [
    {
      title: 'Custom HTML',
      description: '',
      aspect_ratio: '16/9',
      full_width: false,
      top_part_centered: false,
      html_code: `<div style="font-family: system-ui; padding: 16px;">
  <h2>Hello from user HTML</h2>
  <p>This content is rendered inside an iframe.</p>

  <button id="btn">Click me</button>
  <p id="output"></p>
</div>

<script>
  const btn = document.getElementById('btn');
  const output = document.getElementById('output');

  btn.addEventListener('click', () => {
    output.textContent = 'Button clicked at ' + new Date().toLocaleTimeString();
  });
</script>`,
    }
  ]
};

// 4. Iframe Section (disabled by default)
export const dummyIframeSection = {
  type: 'iframe_section',
  enabled: 'false',
  title: 'Embedded Page',
  data: [
    {
      title: 'Example Website',
      description: '',
      url: 'https://example.com',
      aspect_ratio: '16/9',
      full_width: false,
      top_part_centered: false,
    }
  ]
};

// 5. Video Embed Section (disabled by default)
export const dummyVideoEmbedSection = {
  type: 'video_embed_section',
  enabled: 'false',
  title: 'Featured Video',
  data: [
    {
      title: 'Featured Video',
      description: '',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      top_part_centered: false,
    }
  ]
};

// 6. Mailto Section (disabled by default)
export const dummyMailtoSection = {
  type: 'mailto_section',
  enabled: 'false',
  title: 'Leave a Comment',
  data: [
    {
      title: 'Leave a Comment',
      subject: 'Feedback on my portfolio',
      receiver_email: 'john@example.com',
      placeholder_text: 'Share your thoughts...',
      button_text: 'Send',
    }
  ]
};

// 7. Newsletter Section (disabled by default)
export const dummyMediaSection = {
  type: 'media_section',
  enabled: 'false',
  title: 'Media',
  data: [
    {
      title: 'Media',
      description: '',
      media: 'https://picsum.photos/id/1035/1200/600',
      aspect_ratio: '16/9',
      full_width: false,
      top_part_centered: false,
    }
  ]
};

export const dummyNewsletterSection = {
  type: 'newsletter_section',
  enabled: 'false',
  title: 'Newsletter',
  data: [
    {
      title: 'Newsletter',
    }
  ]
};

// The order here determines the order of creation on the Home Page, and thus the default order on the site.
export const dummyHomePageSections = [
  dummyHeroSection,
  dummyDynamicGallery,
  dummyDynamicProjects,
  dummyDynamicBlog,
  dummyHtmlSection,
  dummyIframeSection,
  dummyVideoEmbedSection,
  dummyMediaSection,
  dummyMailtoSection,
  dummyNewsletterSection,
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
      status: 'published',
      rich_content: [
        { type: 'paragraph', content: 'This photograph was taken during an early morning hike through the Appalachian mountains. The light was perfect, casting long shadows across the valley below.' },
        { type: 'paragraph', content: 'I used a wide-angle lens to capture the full expanse of the landscape. The clouds were rolling in just as the sun broke through, creating a dramatic contrast.' },
      ],
    },
    {
      title: 'City Lights',
      description: 'The city comes alive at night. A long exposure shot.',
      image: 'https://picsum.photos/seed/city/600/600',
      tags: ['Urban', 'Night'],
      link: '',
      order_priority: 5,
      author_username: 'johndoe',
      status: 'published',
      rich_content: [
        { type: 'paragraph', content: 'A long exposure photograph of the downtown skyline at night. The trails of car headlights create streaks of white and red across the frame.' },
        { type: 'paragraph', content: 'Shot from a rooftop parking garage, this image captures the energy and vibrancy of the city after dark.' },
      ],
    },
    {
      title: 'Ocean Breeze',
      description: 'Calm waves hitting the shore during sunset.',
      image: 'https://picsum.photos/seed/ocean/600/600',
      tags: ['Nature', 'Water'],
      link: '',
      order_priority: 4,
      author_username: 'janedoe',
      status: 'published',
      rich_content: [
        { type: 'paragraph', content: 'The golden hour at the beach is always magical. This shot captures the moment when the sun dips below the horizon and the sky turns shades of orange and purple.' },
      ],
    },
    {
      title: 'Forest Mist',
      description: 'Early morning mist rolling through the pine trees.',
      image: 'https://picsum.photos/seed/forest/600/600',
      tags: ['Nature', 'Forest'],
      link: '',
      order_priority: 3,
      author_username: 'janedoe',
      status: 'published',
      rich_content: [
        { type: 'paragraph', content: 'Taken at dawn in a Pacific Northwest forest. The mist weaves between the towering pine trees, creating an ethereal atmosphere.' },
      ],
    },
    {
      title: 'Desert Dunes',
      description: 'Layered sand dunes under the bright sun.',
      image: 'https://picsum.photos/seed/desert/600/600',
      tags: ['Nature', 'Desert'],
      link: '',
      order_priority: 2,
      author_username: 'johndoe',
      status: 'published',
      rich_content: [
        { type: 'paragraph', content: 'The Sahara Desert stretches endlessly in every direction. The wind sculpts the dunes into elegant curves and ridges that shift with each passing day.' },
      ],
    },
    {
      title: 'Urban Architecture',
      description: 'Modern lines and glass facades.',
      image: 'https://picsum.photos/seed/architecture/600/600',
      tags: ['Architecture', 'Urban'],
      link: '',
      order_priority: 1,
      author_username: 'janedoe',
      status: 'published',
      rich_content: [
        { type: 'paragraph', content: 'Contemporary architecture at its finest. These glass and steel structures reflect the sky and surrounding buildings, creating a kaleidoscope of shapes and colors.' },
      ],
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
      status: 'published',
      video_embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      rich_content: [
        { type: 'heading_2', content: 'About This Project' },
        { type: 'paragraph', content: 'This project transforms a Notion workspace into a fully functional portfolio website. It uses the Notion API to fetch content and Next.js for static site generation.' },
        { type: 'heading_2', content: 'Features' },
        { type: 'bullet_list_item', content: 'Automatic content syncing from Notion' },
        { type: 'bullet_list_item', content: 'Multiple collection types (blogs, projects, gallery)' },
        { type: 'bullet_list_item', content: 'Theming and customization support' },
      ],
    },
    {
      title: 'AI Chatbot',
      description: 'A conversational AI interface using OpenAI API.',
      image: 'https://picsum.photos/seed/ai/800/600',
      tags: ['Python', 'OpenAI', 'React'],
      link: 'https://github.com',
      order_priority: 5,
      author_username: 'janedoe',
      status: 'published',
      rich_content: [
        { type: 'paragraph', content: 'An intelligent chatbot that uses the OpenAI API to generate context-aware responses. Built with a React frontend and Python backend.' },
        { type: 'paragraph', content: 'The chatbot supports multi-turn conversations and can be customized with different personas and knowledge bases.' },
      ],
    },
    {
      title: 'E-commerce Store',
      description: 'Full-featured online store with Stripe integration.',
      image: 'https://picsum.photos/seed/ecommerce/800/600',
      tags: ['React', 'Stripe', 'Node.js'],
      link: 'https://github.com',
      order_priority: 4,
      author_username: 'johndoe',
      status: 'published',
      rich_content: [
        { type: 'paragraph', content: 'A complete e-commerce solution with product listings, shopping cart, checkout flow, and payment processing via Stripe.' },
        { type: 'paragraph', content: 'Includes an admin dashboard for managing products, orders, and customer data.' },
      ],
    },
    {
      title: 'Task Manager',
      description: 'Productivity app to organize daily tasks and goals.',
      image: 'https://picsum.photos/seed/task/800/600',
      tags: ['Vue.js', 'Firebase'],
      link: 'https://github.com',
      order_priority: 3,
      author_username: 'janedoe',
      status: 'published',
      rich_content: [
        { type: 'paragraph', content: 'A productivity application built with Vue.js and Firebase. Features drag-and-drop task organization, due dates, and priority levels.' },
      ],
    },
    {
      title: 'Weather App',
      description: 'Real-time weather forecasts using geolocation.',
      image: 'https://picsum.photos/seed/weather/800/600',
      tags: ['JavaScript', 'API'],
      link: 'https://github.com',
      order_priority: 2,
      author_username: 'johndoe',
      status: 'published',
      rich_content: [
        { type: 'paragraph', content: 'A weather application that uses geolocation to provide real-time forecasts. Displays temperature, humidity, wind speed, and a 7-day outlook.' },
      ],
    },
    {
      title: 'Finance Tracker',
      description: 'Track income and expenses with visual charts.',
      image: 'https://picsum.photos/seed/finance/800/600',
      tags: ['React', 'D3.js'],
      link: 'https://github.com',
      order_priority: 1,
      author_username: 'janedoe',
      status: 'published',
      rich_content: [
        { type: 'paragraph', content: 'A personal finance tracker that visualizes income and expenses with interactive D3.js charts. Supports multiple accounts and budget categories.' },
      ],
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
      status: 'published',
      rich_content: [
        { type: 'paragraph', content: 'Welcome to my blog! This is my first post and I am excited to share my thoughts and experiences with you.' },
        { type: 'paragraph', content: 'I have been working as a software engineer for several years now, and I have learned a lot along the way. This blog will be a place for me to document my journey and share what I have learned.' },
        { type: 'heading_2', content: 'What to Expect' },
        { type: 'paragraph', content: 'I plan to write about web development, programming languages, and the tools I use daily. Stay tuned for more content!' },
      ],
    },
    {
      title: 'The Future of Web Dev',
      description: 'Thoughts on where the industry is heading with AI and new frameworks.',
      image: 'https://picsum.photos/seed/webdev/1000/600',
      tags: ['Tech', 'Opinion'],
      link: '',
      order_priority: 5,
      author_username: 'janedoe',
      status: 'published',
      video_embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      rich_content: [
        { type: 'paragraph', content: 'The web development landscape is evolving rapidly. With the rise of AI-powered tools and new JavaScript frameworks, developers need to stay adaptable.' },
        { type: 'paragraph', content: 'In this post, I explore some of the trends I see shaping the future of our industry and what skills will be most valuable going forward.' },
      ],
    },
    {
      title: 'Mastering CSS Grid',
      description: 'A comprehensive guide to building complex layouts with CSS Grid.',
      image: 'https://picsum.photos/seed/css/1000/600',
      tags: ['CSS', 'Tutorial'],
      link: '',
      order_priority: 4,
      author_username: 'johndoe',
      status: 'published',
      rich_content: [
        { type: 'paragraph', content: 'CSS Grid is one of the most powerful layout systems available in CSS. In this tutorial, I will walk you through the fundamentals and show you how to build complex, responsive layouts.' },
        { type: 'heading_2', content: 'Getting Started' },
        { type: 'paragraph', content: 'To use CSS Grid, you simply need to set display: grid on a container element. From there, you can define rows and columns using grid-template-rows and grid-template-columns.' },
      ],
    },
    {
      title: 'Why I Use Next.js',
      description: 'The benefits of server-side rendering and static site generation.',
      image: 'https://picsum.photos/seed/nextjs/1000/600',
      tags: ['Next.js', 'React'],
      link: '',
      order_priority: 3,
      author_username: 'janedoe',
      status: 'published',
      rich_content: [
        { type: 'paragraph', content: 'Next.js has become my go-to framework for building React applications. The built-in support for server-side rendering and static site generation makes it incredibly versatile.' },
        { type: 'paragraph', content: 'In this post, I share the reasons why I chose Next.js for my projects and how it has improved my development workflow.' },
      ],
    },
    {
      title: 'Remote Work Tips',
      description: 'How to stay productive and maintain a healthy work-life balance.',
      image: 'https://picsum.photos/seed/remote/1000/600',
      tags: ['Productivity', 'Lifestyle'],
      link: '',
      order_priority: 2,
      author_username: 'johndoe',
      status: 'published',
      rich_content: [
        { type: 'paragraph', content: 'Working remotely offers many benefits, but it also comes with unique challenges. Here are some tips I have gathered over the years to stay productive and maintain a healthy work-life balance.' },
        { type: 'bullet_list_item', content: 'Set up a dedicated workspace' },
        { type: 'bullet_list_item', content: 'Establish a consistent routine' },
        { type: 'bullet_list_item', content: 'Take regular breaks' },
      ],
    },
    {
      title: 'Learning Rust',
      description: 'My experience diving into systems programming with Rust.',
      image: 'https://picsum.photos/seed/rust/1000/600',
      tags: ['Rust', 'Programming'],
      link: '',
      order_priority: 1,
      author_username: 'janedoe',
      status: 'published',
      rich_content: [
        { type: 'paragraph', content: 'Rust has been on my radar for a while, and I finally decided to take the plunge. In this post, I share my experience learning Rust as someone coming from a JavaScript background.' },
        { type: 'paragraph', content: 'The ownership model and borrow checker were initially challenging, but they have fundamentally changed how I think about memory management.' },
      ],
    }
  ]
};

/**
 * COLLECTION SETTINGS
 * Stored in Settings > Configure Collections > [Inline DB per collection]
 */
export const dummyCollectionSettings = {
  Gallery: { collection_name: 'Gallery', enable_rss: 'false', show_newsletter_section: 'false', show_mailto_comment_section: 'true' },
  Projects: { collection_name: 'Projects', enable_rss: 'true', show_newsletter_section: 'false', show_mailto_comment_section: 'true' },
  Blogs: { collection_name: 'Blogs', enable_rss: 'true', show_newsletter_section: 'true', show_mailto_comment_section: 'true' },
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
  '<!-- Notion Zero Code Injection: Add your analytics, meta tags, or custom scripts here -->',
];

/**
 * CSS INJECTION
 * CSS code blocks to inject as <style> tags in <head>
 */
export const dummyCssInjection = [
  '/* Notion Zero CSS Injection: Add your custom styles here */',
];

export const dummyAdvancedConfig = {
  limit_theme_selection: ['light', 'dark', 'blue', 'purple', 'pink', 'red', 'green', 'cream'],
};

export const dummyNavbarPages = [
  {
    title: 'About',
    content: [
      { type: 'heading_1', content: 'About Me' },
      { type: 'paragraph', content: 'I am a passionate developer building open source projects.' },
    ],
    sections: [
      {
        type: 'html_section',
        enabled: 'false',
        title: 'About HTML Widget',
        data: [{
          title: 'About HTML Widget',
          html_code: '<div style="font-family: system-ui; padding: 16px;"><p>Custom HTML on the About page.</p></div>',
        }]
      },
      {
        type: 'iframe_section',
        enabled: 'false',
        title: 'About Embed',
        data: [{ title: 'About Embed', url: 'https://example.com' }]
      },
      {
        type: 'video_embed_section',
        enabled: 'false',
        title: 'About Video',
        data: [{ title: 'About Video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }]
      },
      {
        type: 'newsletter_section',
        enabled: 'false',
        title: 'About Newsletter',
        data: [{ title: 'About Newsletter' }]
      },
    ]
  },
  {
    title: 'Contact',
    content: [
      { type: 'heading_1', content: 'Contact' },
      { type: 'paragraph', content: 'Reach out to me on social media.' },
    ],
    sections: [
      {
        type: 'html_section',
        enabled: 'false',
        title: 'Contact HTML Widget',
        data: [{
          title: 'Contact HTML Widget',
          html_code: '<div style="font-family: system-ui; padding: 16px;"><p>Custom HTML on the Contact page.</p></div>',
        }]
      },
      {
        type: 'iframe_section',
        enabled: 'false',
        title: 'Contact Embed',
        data: [{ title: 'Contact Embed', url: 'https://example.com' }]
      },
      {
        type: 'video_embed_section',
        enabled: 'false',
        title: 'Contact Video',
        data: [{ title: 'Contact Video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }]
      },
      {
        type: 'newsletter_section',
        enabled: 'false',
        title: 'Contact Newsletter',
        data: [{ title: 'Contact Newsletter' }]
      },
    ]
  }
];

/**
 * EXTRA SECTIONS FOR COLLECTION PAGES
 * Stored in Root > Settings > Collection Page Extra Sections > [Page per collection] > [Inline DBs]
 */
export const dummyExtraSections = {
  Gallery: [
    {
      type: 'html_section',
      enabled: 'false',
      title: 'Gallery Extra HTML',
      data: [{
        title: 'Gallery Extra HTML',
        html_code: '<div style="font-family: system-ui; padding: 16px;"><p>Extra HTML section for Gallery pages.</p></div>',
      }]
    },
    {
      type: 'iframe_section',
      enabled: 'false',
      title: 'Gallery Extra Embed',
      data: [{ title: 'Gallery Extra Embed', url: 'https://example.com' }]
    },
    {
      type: 'video_embed_section',
      enabled: 'false',
      title: 'Gallery Extra Video',
      data: [{ title: 'Gallery Extra Video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }]
    },
  ],
  Projects: [
    {
      type: 'html_section',
      enabled: 'false',
      title: 'Projects Extra HTML',
      data: [{
        title: 'Projects Extra HTML',
        html_code: '<div style="font-family: system-ui; padding: 16px;"><p>Extra HTML section for Project pages.</p></div>',
      }]
    },
    {
      type: 'iframe_section',
      enabled: 'false',
      title: 'Projects Extra Embed',
      data: [{ title: 'Projects Extra Embed', url: 'https://example.com' }]
    },
    {
      type: 'video_embed_section',
      enabled: 'false',
      title: 'Projects Extra Video',
      data: [{ title: 'Projects Extra Video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }]
    },
  ],
  Blogs: [
    {
      type: 'html_section',
      enabled: 'false',
      title: 'Blogs Extra HTML',
      data: [{
        title: 'Blogs Extra HTML',
        html_code: '<div style="font-family: system-ui; padding: 16px;"><p>Extra HTML section for Blog pages.</p></div>',
      }]
    },
    {
      type: 'iframe_section',
      enabled: 'false',
      title: 'Blogs Extra Embed',
      data: [{ title: 'Blogs Extra Embed', url: 'https://example.com' }]
    },
    {
      type: 'video_embed_section',
      enabled: 'false',
      title: 'Blogs Extra Video',
      data: [{ title: 'Blogs Extra Video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }]
    },
  ],
};
