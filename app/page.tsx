import { getHomeData } from '@/lib/data';
import { SectionRenderer } from '@/components/SectionRenderer';
import { Newsletter } from '@/components/Newsletter';
import { css } from '@/styled-system/css';

export default function Home() {
    const homeData = getHomeData();
    const sections = (homeData.sections || []).filter(section => section.enabled !== false);
    const showNewsletter =
        homeData.info?.show_newsletter_section_on_home === 'true' &&
        homeData.info?.enable_newsletter === 'true';

    return (
        <main className={css({ pb: '60px' })}>
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '0' })}>
                {sections.map((section) => (
                    <SectionRenderer key={section.id} section={section} mailchimpFormLink={homeData.info?.mailchimp_form_link} />
                ))}
            </div>

            {showNewsletter && (
                <Newsletter mailchimpFormLink={homeData.info?.mailchimp_form_link} />
            )}
        </main>
    );
}
