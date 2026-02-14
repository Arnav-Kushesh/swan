import { getHomeData, getPosts, getGalleryItems } from '@/lib/data';
import { InfoSection } from '@/components/InfoSection';
import { DynamicSection } from '@/components/DynamicSection';
import { Newsletter } from '@/components/Newsletter';
import { css } from '@/styled-system/css';
import { container } from '@/styled-system/patterns';

const mainStyle = css({ pb: '100px' });
const sectionContainerStyle = container({ py: '60px' });

export default function Home() {
    const homeData = getHomeData();
    const sections = (homeData.sections || []).filter(section => section.visibility !== false);
    const showNewsletter =
        homeData.info?.show_newsletter_section_on_home === 'true' &&
        homeData.info?.enable_newsletter === 'true';

    return (
        <main className={mainStyle}>
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '0' })}>
                {sections.map((section) => {
                    if (section.type === 'info_section') {
                        return <InfoSection key={section.id} data={section} />;
                    } else if (section.type === 'dynamic_section') {
                        return <DynamicSection key={section.id} data={section} />;
                    }
                    return null;
                })}
            </div>

            {showNewsletter && (
                <Newsletter mailchimpFormLink={homeData.info?.mailchimp_form_link} />
            )}
        </main>
    );
}
