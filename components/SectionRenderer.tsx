import type { SectionData } from '@/lib/data';
import { InfoSection } from './InfoSection';
import { DynamicSection } from './DynamicSection';
import { HtmlSection } from './HtmlSection';
import { IframeSection } from './IframeSection';
import { VideoEmbedSection } from './VideoEmbedSection';
import { MediaSection } from './MediaSection';
import { MailtoSection } from './MailtoSection';
import { Newsletter } from './Newsletter';

interface SectionRendererProps {
    section: SectionData;
    newsletterFormUrl?: string;
}

export function SectionRenderer({ section, newsletterFormUrl }: SectionRendererProps) {
    // Safety guard: never render disabled sections
    if (section.enabled === false) return null;

    switch (section.type) {
        case 'info_section':
            return <InfoSection data={section} />;
        case 'dynamic_section':
            return <DynamicSection data={section} />;
        case 'html_section':
            return <HtmlSection data={section} />;
        case 'iframe_section':
            return <IframeSection data={section} />;
        case 'video_embed_section':
            return <VideoEmbedSection data={section} />;
        case 'media_section':
            return <MediaSection data={section} />;
        case 'mailto_section':
            return <MailtoSection data={section} />;
        case 'newsletter_section':
            return <Newsletter newsletterFormUrl={newsletterFormUrl} />;
        default:
            return null;
    }
}
