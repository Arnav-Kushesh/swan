import type { SectionData } from '@/lib/data';
import { InfoSection } from './InfoSection';
import { DynamicSection } from './DynamicSection';
import { HtmlSection } from './HtmlSection';
import { IframeSection } from './IframeSection';
import { VideoEmbedSection } from './VideoEmbedSection';
import { MailBasedCommentSection } from './MailBasedCommentSection';
import { Newsletter } from './Newsletter';
import { getHomeData } from '@/lib/data';

export function SectionRenderer({ section }: { section: SectionData }) {
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
        case 'mail_based_comment_section':
            return <MailBasedCommentSection data={section} />;
        case 'newsletter_section': {
            const homeData = getHomeData();
            return <Newsletter mailchimpFormLink={homeData.info?.mailchimp_form_link} />;
        }
        default:
            return null;
    }
}
