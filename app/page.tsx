import { getHomeData } from '@/lib/data';
import { SectionRenderer } from '@/components/SectionRenderer';
import { css } from '@/styled-system/css';

export default function Home() {
    const homeData = getHomeData();
    const sections = (homeData.sections || []).filter(section => section.enabled !== false);

    return (
        <main className={css({ pb: '60px' })}>
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '0' })}>
                {sections.map((section) => (
                    <SectionRenderer key={section.id} section={section} newsletterFormUrl={homeData.info?.newsletter_form_url} />
                ))}
            </div>
        </main>
    );
}
