
import { css } from '@/styled-system/css';
import { DynamicSectionData, getPosts } from '@/lib/data';

// Server Component (can fetch data)
import { InteractiveSection } from './InteractiveSection';

export function DynamicSection({ data }: { data: DynamicSectionData }) {
    const { collection_name, view_type, title, description, items_in_view, top_part_centered } = data;
    const collectionSlug = collection_name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    // Generic fetch
    const items = getPosts(collectionSlug);

    // If no items found, maybe return null or empty section?
    if (!items || items.length === 0) return null;

    return (
        <section className={css({ mb: '40px' })}>
            <InteractiveSection
                sectionId={data.id}
                title={title}
                description={description}
                items={items}
                initialViewType={view_type || 'list_view'}
                itemsPerPage={items_in_view || 6}
                centered={top_part_centered}
            />
        </section>
    );
}
