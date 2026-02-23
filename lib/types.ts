export interface InfoConfig {
    title: string;
    description: string;
    logo?: string;
    favicon?: string;
    keywords?: string;
    og_image?: string;
    sidebar_navigation?: string;
    tagline?: string;
    default_color_mode?: string;
    hide_sidebar_logo?: string;
    hide_topbar_logo?: string;
    social_github?: string;
    social_twitter?: string;
    social_linkedin?: string;
    social_email?: string;
    social_instagram?: string;
    social_youtube?: string;
    social_facebook?: string;
    social_twitch?: string;
    enable_newsletter?: string;
    newsletter_form_url?: string;
    mention_this_tool_in_footer?: string;
    primary_font?: string;
    secondary_font?: string;
}

export interface InfoSectionData {
    type: 'info_section';
    id: string;
    title: string;
    description: string;
    button_link?: string;
    button_text?: string;
    image?: string;
    view_type?: 'col_centered_view' | 'col_left_view' | 'row_reverse_view' | 'row_view';
    media_aspect_ratio?: string;
    media_height?: string;
    media_mobile_height?: string;
    enabled?: boolean;
}

export interface DynamicSectionData {
    type: 'dynamic_section';
    id: string;
    title: string;
    description?: string;
    collection_name: string;
    view_type?: 'list_view' | 'card_view' | 'grid_view' | 'minimal_list_view' | 'tiny_card_view' | 'big_card_view';
    items_in_view?: number;
    top_part_centered?: boolean;
    enabled?: boolean;
}

export interface HtmlSectionData {
    type: 'html_section';
    id: string;
    title: string;
    description?: string;
    html_code: string;
    height?: string;
    mobile_height?: string;
    full_width?: boolean;
    top_part_centered?: boolean;
    enabled?: boolean;
}

export interface IframeSectionData {
    type: 'iframe_section';
    id: string;
    title: string;
    description?: string;
    url: string;
    height?: string;
    mobile_height?: string;
    full_width?: boolean;
    top_part_centered?: boolean;
    enabled?: boolean;
}

export interface VideoEmbedSectionData {
    type: 'video_embed_section';
    id: string;
    title: string;
    description?: string;
    url: string;
    top_part_centered?: boolean;
    enabled?: boolean;
}

export interface MediaSectionData {
    type: 'media_section';
    id: string;
    title: string;
    description?: string;
    media?: string;
    height?: string;
    mobile_height?: string;
    full_width?: boolean;
    top_part_centered?: boolean;
    enabled?: boolean;
}

export interface MailtoSectionData {
    type: 'mailto_section';
    id: string;
    title: string;
    subject: string;
    receiver_email: string;
    placeholder_text?: string;
    button_text?: string;
    enabled?: boolean;
}

export interface NewsletterSectionData {
    type: 'newsletter_section';
    id: string;
    title: string;
    enabled?: boolean;
}

export type SectionData = InfoSectionData | DynamicSectionData | HtmlSectionData | IframeSectionData | VideoEmbedSectionData | MediaSectionData | MailtoSectionData | NewsletterSectionData;

export interface HomeData {
    info?: InfoConfig;
    sections: SectionData[];
}

export interface Post {
    slug: string;
    title: string;
    date: string;
    description: string;
    content: string;
    cover?: {
        image?: string;
        alt?: string;
    };
    thumbnail?: string;
    image?: string;
    link?: string;
    button_text?: string;
    tools?: string;
    collection?: string;
    order_priority?: number;
    tags?: string[];
    author_username?: string;
    video_embed_url?: string;
    status?: 'draft' | 'in_review' | 'published' | 'archived';
}

export interface GalleryItem {
    slug: string;
    name: string;
    image: string;
    link?: string;
    content?: string;
}

export interface Author {
    name: string;
    username: string;
    email: string;
    description: string;
    picture: string;
    instagram_handle: string;
    x_handle: string;
    github_handle: string;
}

export interface CollectionSettings {
    collection_name: string;
    enable_rss: string;
    show_newsletter_section: string;
    show_mailto_comment_section: string;
}

export interface NavbarPageData extends Post {
    sections?: SectionData[];
}

export interface AdvancedConfig {
    limit_theme_selection?: string[];
}
