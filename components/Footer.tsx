
'use client';

import { css } from '@/styled-system/css';
import Link from 'next/link';
import { useGlobalConfig } from '@/components/providers/GlobalConfigProvider';

export function Footer() {
    const { config } = useGlobalConfig();
    const showSwanLink = config.info?.mention_this_tool_in_footer !== 'false';

    return (
        <footer className={css({
            py: '40px',
            mt: '80px',
            borderTop: '1px solid token(colors.border.subtle)',
            textAlign: 'center',
            color: 'text.muted',
            fontSize: 'sm',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
        })}>
            {showSwanLink && (
                <Link
                    href="https://github.com/arnav-kushesh/swan"
                    target="_blank"
                    className={css({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'color 0.2s',
                        _hover: { color: 'text.primary' }
                    })}
                >
                    <p>Generated using <strong>Swan</strong></p>
                </Link>
            )}
        </footer>
    );
}
