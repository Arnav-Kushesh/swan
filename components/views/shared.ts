// Shared helpers and types for view components

import { Post, GalleryItem } from '../../lib/data';

export interface ViewProps {
    visibleItems: (Post | GalleryItem)[];
    paginationButton: React.ReactNode;
}

export function getItemTitle(item: Post | GalleryItem): string {
    if ('name' in item && item.name) return item.name;
    if ('title' in item && item.title) return item.title;
    return '';
}

export function getItemHref(item: Post | GalleryItem): string {
    if ('collection' in item && item.collection) return `/${item.collection}/${item.slug}`;
    return `/${item.slug}`;
}

export function getItemImage(item: Post | GalleryItem): string | undefined {
    if (item.image) return item.image;
    if ('thumbnail' in item && item.thumbnail) return item.thumbnail;
    if ('cover' in item && item.cover?.image) return item.cover.image;
    return undefined;
}

export function getTagName(tag: string | { name: string }): string {
    return typeof tag === 'string' ? tag : tag.name;
}
