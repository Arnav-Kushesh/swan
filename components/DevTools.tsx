'use client';

import { useState, useEffect } from 'react';
import { Settings, X, Save, RefreshCw } from 'lucide-react';
import { css } from '@/styled-system/css';
import { flex, stack } from '@/styled-system/patterns';

import { HomeData } from '@/lib/data';

// We use a subset for editing, but effectively it's the same structure
type Config = HomeData;

export function DevTools() {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<Config | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen && !config) {
            fetchConfig();
        }
    }, [isOpen]);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/config');
            if (res.ok) {
                const data: HomeData = await res.json();
                setConfig(data);
            }
        } catch (error) {
            console.error('Failed to fetch config', error);
        }
    };

    const [statusText, setStatusText] = useState('');
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (loading) {
            setElapsedTime(0);
            interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleRefresh = async () => {
        setLoading(true);
        setStatusText('Pulling from Notion...');

        try {
            const res = await fetch('/api/config/refresh', { method: 'GET' });
            if (!res.ok) throw new Error('Failed to refresh');

            const reader = res.body?.getReader();
            if (!reader) throw new Error('No response stream');

            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value);
                const lines = text.split('\n').filter(Boolean);
                if (lines.length > 0) {
                    setStatusText(lines[lines.length - 1]);
                }
            }

            setMessage('Refreshed! Reloading...');
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error('Failed to refresh config', error);
            setMessage('Error refreshing.');
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!config) return;
        setLoading(true);
        setStatusText('Starting...');

        try {
            const res = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hero: { ...config.hero },
                    projects: {
                        ...config.projects,
                        show_section: ((config.projects.show_section as any) === true || config.projects.show_section === 'true') ? 'true' : 'false',
                    },
                    blogs: {
                        ...config.blogs,
                        show_section: ((config.blogs.show_section as any) === true || config.blogs.show_section === 'true') ? 'true' : 'false',
                        show_images: ((config.blogs.show_images as any) === true || config.blogs.show_images === 'true') ? 'true' : 'false',
                    },
                    gallery: {
                        ...config.gallery,
                        show_section: ((config.gallery.show_section as any) === true || config.gallery.show_section === 'true') ? 'true' : 'false',
                    },
                    info: {
                        site_title: config.info.site_title,
                        default_theme: config.info.default_theme,
                        sidebar_navigation: config.info.sidebar_navigation,
                    },
                }),
            });

            if (!res.ok) throw new Error('Failed to save');

            const reader = res.body?.getReader();
            if (!reader) throw new Error('No response stream');

            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value);
                const lines = text.split('\n').filter(Boolean);
                if (lines.length > 0) {
                    setStatusText(lines[lines.length - 1]); // Show latest line
                }
            }

            setMessage('Saved! Refreshing...');
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error('Failed to save config', error);
            setMessage('Error saving.');
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className={css({
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: 'full',
                    bg: 'text.primary', // Inverted for visibility
                    color: 'bg.primary',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    zIndex: 9999,
                    transition: 'transform 0.2s',
                    _hover: { transform: 'scale(1.1)' },
                })}
            >
                <Settings size={24} />
            </button>
        );
    }

    return (
        <div
            className={css({
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '350px',
                maxHeight: '80vh',
                overflowY: 'auto',
                bg: 'bg.secondary',
                border: '1px solid token(colors.border.default)',
                borderRadius: '12px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                zIndex: 9999,
                p: '20px',
            })}
        >
            <div className={flex({ justify: 'space-between', align: 'center', mb: '20px' })}>
                <div className={flex({ align: 'center', gap: '10px' })}>
                    <h3 className={css({ fontWeight: 'bold', fontSize: '1.2rem' })}>Dev Mode Settings</h3>
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className={css({
                            cursor: 'pointer',
                            p: '4px',
                            color: 'text.secondary',
                            animation: loading ? 'spin 1s linear infinite' : 'none',
                            _hover: { color: 'text.primary' }
                        })}
                        title="Pull latest config from Notion"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
                <button onClick={() => setIsOpen(false)} className={css({ cursor: 'pointer', p: '4px' })}>
                    <X size={20} />
                </button>
            </div>

            {config ? (
                <div className={stack({ gap: '20px' })}>
                    <div>
                        <label className={labelStyle}>Site Title</label>
                        <input
                            type="text"
                            value={config.info.site_title}
                            onChange={(e) => setConfig({ ...config, info: { ...config.info, site_title: e.target.value } })}
                            className={inputStyle}
                        />
                    </div>

                    <div>
                        <label className={labelStyle}>Tagline</label>
                        <input
                            type="text"
                            value={config.hero.tagline}
                            onChange={(e) => setConfig({ ...config, hero: { ...config.hero, tagline: e.target.value } })}
                            className={inputStyle}
                        />
                    </div>

                    <div className={css({ borderTop: '1px solid token(colors.border.default)', pt: '20px' })}>
                        <h4 className={css({ fontWeight: 'bold', mb: '12px', color: 'text.primary' })}>Sections</h4>

                        {/* Projects */}
                        <div className={css({ mb: '16px' })}>
                            <div className={flex({ justify: 'space-between', align: 'center', mb: '8px' })}>
                                <span className={labelStyle} style={{ marginBottom: 0 }}>Projects</span>
                                <div className={flex({ gap: '5px' })}>
                                    <button
                                        onClick={() => setConfig({ ...config, projects: { ...config.projects, show_section: config.projects.show_section === 'true' ? 'false' : 'true' } })}
                                        className={(config.projects.show_section === 'true') ? activeSmallBtn : smallBtn}
                                    >
                                        On
                                    </button>
                                    <button
                                        onClick={() => setConfig({ ...config, projects: { ...config.projects, show_section: 'NO' } })}
                                        className={((config.projects.show_section as any) === false || config.projects.show_section === 'NO') ? activeSmallBtn : smallBtn}
                                    >
                                        Off
                                    </button>
                                </div>
                            </div>
                            <input
                                type="text"
                                placeholder="Section Title"
                                value={config.projects.title}
                                onChange={(e) => setConfig({ ...config, projects: { ...config.projects, title: e.target.value } })}
                                className={inputStyle}
                            />
                        </div>

                        {/* Blogs */}
                        <div className={css({ mb: '16px' })}>
                            <div className={flex({ justify: 'space-between', align: 'center', mb: '8px' })}>
                                <span className={labelStyle} style={{ marginBottom: 0 }}>Blogs</span>
                                <div className={flex({ gap: '5px' })}>
                                    <button
                                        onClick={() => setConfig({ ...config, blogs: { ...config.blogs, show_section: config.blogs.show_section === 'true' ? 'false' : 'true' } })}
                                        className={(config.blogs.show_section === 'true') ? activeSmallBtn : smallBtn}
                                    >
                                        On
                                    </button>
                                    <button
                                        onClick={() => setConfig({ ...config, blogs: { ...config.blogs, show_section: 'NO' } })}
                                        className={((config.blogs.show_section as any) === false || config.blogs.show_section === 'NO') ? activeSmallBtn : smallBtn}
                                    >
                                        Off
                                    </button>
                                </div>
                            </div>
                            <input
                                type="text"
                                placeholder="Section Title"
                                value={config.blogs.title}
                                onChange={(e) => setConfig({ ...config, blogs: { ...config.blogs, title: e.target.value } })}
                                className={inputStyle}
                            />
                            <div className={flex({ align: 'center', gap: '8px', mt: '8px' })}>
                                <span className={css({ fontSize: '0.85rem', color: 'text.secondary' })}>Show Images:</span>
                                <div className={flex({ gap: '5px' })}>
                                    <button
                                        onClick={() => setConfig({ ...config, blogs: { ...config.blogs, show_images: config.blogs.show_images === 'true' ? 'false' : 'true' } })}
                                        className={(config.blogs.show_images === 'true') ? activeSmallBtn : smallBtn}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() => setConfig({ ...config, blogs: { ...config.blogs, show_images: 'false' } })}
                                        className={(config.blogs.show_images === 'false') ? activeSmallBtn : smallBtn}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Gallery */}
                        <div className={css({ mb: '16px' })}>
                            <div className={flex({ justify: 'space-between', align: 'center', mb: '8px' })}>
                                <span className={labelStyle} style={{ marginBottom: 0 }}>Gallery</span>
                                <div className={flex({ gap: '5px' })}>
                                    <button
                                        onClick={() => setConfig({ ...config, gallery: { ...config.gallery, show_section: config.gallery.show_section === 'true' ? 'false' : 'true' } })}
                                        className={(config.gallery?.show_section === 'true') ? activeSmallBtn : smallBtn}
                                    >
                                        On
                                    </button>
                                    <button
                                        onClick={() => setConfig({ ...config, gallery: { ...config.gallery, show_section: 'false' } })}
                                        className={(config.gallery.show_section === 'false') ? activeSmallBtn : smallBtn}
                                    >
                                        Off
                                    </button>
                                </div>
                            </div>
                            <input
                                type="text"
                                placeholder="Section Title"
                                value={config.gallery.title}
                                onChange={(e) => setConfig({ ...config, gallery: { ...config.gallery, title: e.target.value } })}
                                className={inputStyle}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelStyle}>Default Theme</label>
                        <select
                            value={config.info.default_theme}
                            onChange={(e) => setConfig({ ...config, info: { ...config.info, default_theme: e.target.value as 'light' | 'dark' } })}
                            className={inputStyle}
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelStyle}>Sidebar Navigation</label>
                        <div className={flex({ gap: '10px' })}>
                            <button
                                onClick={() => setConfig({ ...config, info: { ...config.info, sidebar_navigation: 'true' } })}
                                className={config.info.sidebar_navigation === 'true' ? activeBtnStyle : btnStyle}
                            >
                                Enabled
                            </button>
                            <button
                                onClick={() => setConfig({ ...config, info: { ...config.info, sidebar_navigation: 'false' } })}
                                className={config.info.sidebar_navigation === 'false' ? activeBtnStyle : btnStyle}
                            >
                                Disabled
                            </button>
                        </div>
                    </div>

                    <div className={css({ borderTop: '1px solid token(colors.border.default)', pt: '20px' })}>
                        <h4 className={css({ fontWeight: 'bold', mb: '12px', color: 'text.primary' })}>Social Links</h4>

                        <div className={stack({ gap: '10px' })}>
                            <div>
                                <label className={labelStyle}>Twitter</label>
                                <input
                                    type="text"
                                    placeholder="https://twitter.com/..."
                                    value={config.hero.twitter || ''}
                                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, twitter: e.target.value } })}
                                    className={inputStyle}
                                />
                            </div>
                            <div>
                                <label className={labelStyle}>GitHub</label>
                                <input
                                    type="text"
                                    placeholder="https://github.com/..."
                                    value={config.hero.github || ''}
                                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, github: e.target.value } })}
                                    className={inputStyle}
                                />
                            </div>
                            <div>
                                <label className={labelStyle}>LinkedIn</label>
                                <input
                                    type="text"
                                    placeholder="https://linkedin.com/..."
                                    value={config.hero.linkedin || ''}
                                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, linkedin: e.target.value } })}
                                    className={inputStyle}
                                />
                            </div>
                            <div>
                                <label className={labelStyle}>Email</label>
                                <input
                                    type="text"
                                    placeholder="hello@example.com"
                                    value={config.hero.email || ''}
                                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, email: e.target.value } })}
                                    className={inputStyle}
                                />
                            </div>
                            <div>
                                <label className={labelStyle}>Instagram</label>
                                <input
                                    type="text"
                                    placeholder="https://instagram.com/..."
                                    value={config.hero.instagram || ''}
                                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, instagram: e.target.value } })}
                                    className={inputStyle}
                                />
                            </div>
                            <div>
                                <label className={labelStyle}>YouTube</label>
                                <input
                                    type="text"
                                    placeholder="https://youtube.com/..."
                                    value={config.hero.youtube || ''}
                                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, youtube: e.target.value } })}
                                    className={inputStyle}
                                />
                            </div>
                            <div>
                                <label className={labelStyle}>Facebook</label>
                                <input
                                    type="text"
                                    placeholder="https://facebook.com/..."
                                    value={config.hero.facebook || ''}
                                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, facebook: e.target.value } })}
                                    className={inputStyle}
                                />
                            </div>
                            <div>
                                <label className={labelStyle}>Twitch</label>
                                <input
                                    type="text"
                                    placeholder="https://twitch.tv/..."
                                    value={config.hero.twitch || ''}
                                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, twitch: e.target.value } })}
                                    className={inputStyle}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={css({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            width: '100%',
                            py: '10px',
                            bg: 'text.primary', // Inverted for max contrast
                            color: 'bg.primary',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            _hover: {
                                opacity: 0.9
                            }
                        })}
                    >
                        <Save size={18} />
                        {loading ? `${statusText || 'Saving...'} (${elapsedTime}s)` : 'Save Changes'}
                    </button>

                    {message && (
                        <p className={css({
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            color: message.includes('Error') || message.includes('Failed') ? 'red.500' : 'green.600'
                        })}>
                            {message}
                        </p>
                    )}
                </div>
            ) : (
                <p>Loading config...</p>
            )}
        </div>
    );
}

const labelStyle = css({
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '600',
    mb: '8px',
    color: 'text.primary',
});

const btnStyle = css({
    flex: 1,
    py: '8px',
    border: '1px solid token(colors.border.default)',
    borderRadius: '6px',
    bg: 'bg.tertiary', // Use tertiary for better contrast against secondary modal bg
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: 'text.primary', // Ensure visible text
    transition: 'background 0.2s',
    _hover: {
        bg: 'border.default',
    },
});

const activeBtnStyle = css({
    flex: 1,
    py: '8px',
    border: '1px solid token(colors.text.primary)', // stronger border
    borderRadius: '6px',
    bg: 'text.primary', // Inverted active state
    color: 'bg.primary', // Inverted text
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
});

const inputStyle = css({
    width: '100%',
    p: '8px 12px',
    borderRadius: '6px',
    border: '1px solid token(colors.border.default)',
    bg: 'bg.canvas',
    fontSize: '0.9rem',
    color: 'text.primary',
    mb: '10px',
});

const smallBtn = css({
    px: '8px',
    py: '4px',
    fontSize: '0.8rem',
    borderRadius: '4px',
    border: '1px solid token(colors.border.default)',
    bg: 'bg.tertiary',
    color: 'text.secondary',
    cursor: 'pointer',
    _hover: { bg: 'border.default', color: 'text.primary' }
});

const activeSmallBtn = css({
    px: '8px',
    py: '4px',
    fontSize: '0.8rem',
    borderRadius: '4px',
    border: '1px solid token(colors.text.primary)',
    bg: 'text.primary',
    color: 'bg.primary',
    fontWeight: 'bold',
    cursor: 'pointer'
});
