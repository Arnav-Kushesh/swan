'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { css } from '@/styled-system/css';
import { Search, X } from 'lucide-react';
import Link from 'next/link';

interface SearchItem {
    slug: string;
    title: string;
    description: string;
    collection: string;
    tags?: string[];
}

interface SearchModalProps {
    items: SearchItem[];
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ items, isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        if (!isOpen) {
            setQuery('');
        }
    }, [isOpen]);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const results = query.trim().length > 0
        ? items.filter(item => {
            const q = query.toLowerCase();
            return (
                item.title.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q) ||
                item.collection.toLowerCase().includes(q) ||
                (item.tags || []).some(t => (typeof t === 'string' ? t : '').toLowerCase().includes(q))
            );
        }).slice(0, 20)
        : [];

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={css({
                    position: 'fixed',
                    inset: 0,
                    bg: 'rgba(0,0,0,0.5)',
                    zIndex: 999,
                    backdropFilter: 'blur(4px)',
                })}
            />

            {/* Modal */}
            <div className={css({
                position: 'fixed',
                top: '15%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                maxWidth: '560px',
                maxHeight: '70vh',
                bg: 'bg.primary',
                border: '1px solid token(colors.border)',
                borderRadius: 'xl',
                boxShadow: '2xl',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            })}>
                {/* Search Input */}
                <div className={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3',
                    padding: '16px',
                    borderBottom: '1px solid token(colors.border.subtle)',
                })}>
                    <Search size={18} className={css({ color: 'text.muted', flexShrink: 0 })} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search across all collections..."
                        className={css({
                            flex: 1,
                            bg: 'transparent',
                            border: 'none',
                            outline: 'none',
                            fontSize: 'md',
                            color: 'text.primary',
                            _placeholder: { color: 'text.muted' },
                        })}
                    />
                    <button
                        onClick={onClose}
                        className={css({
                            cursor: 'pointer',
                            p: '1',
                            borderRadius: 'md',
                            bg: 'transparent',
                            border: 'none',
                            color: 'text.muted',
                            _hover: { bg: 'bg.subtle' },
                        })}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Results */}
                <div className={css({
                    overflowY: 'auto',
                    maxHeight: '50vh',
                    padding: '8px',
                })}>
                    {query.trim().length === 0 && (
                        <p className={css({ textAlign: 'center', color: 'text.muted', fontSize: 'sm', py: '8' })}>
                            Type to search...
                        </p>
                    )}

                    {query.trim().length > 0 && results.length === 0 && (
                        <p className={css({ textAlign: 'center', color: 'text.muted', fontSize: 'sm', py: '8' })}>
                            No results found for &ldquo;{query}&rdquo;
                        </p>
                    )}

                    {results.map((item) => (
                        <Link
                            key={`${item.collection}-${item.slug}`}
                            href={`/${item.collection}/${item.slug}`}
                            onClick={onClose}
                            className={css({
                                display: 'block',
                                padding: '12px',
                                borderRadius: 'lg',
                                transition: 'all 0.15s',
                                textDecoration: 'none',
                                _hover: { bg: 'bg.subtle' },
                            })}
                        >
                            <div className={css({ display: 'flex', alignItems: 'center', gap: '2', marginBottom: '1' })}>
                                <span className={css({
                                    fontSize: 'xs',
                                    bg: 'bg.canvas',
                                    px: '2',
                                    py: '0.5',
                                    borderRadius: 'md',
                                    border: '1px solid token(colors.border)',
                                    textTransform: 'capitalize',
                                })}>
                                    {item.collection}
                                </span>
                                <h4 className={css({ fontWeight: 'semibold', fontSize: 'sm', truncate: true })}>
                                    {item.title}
                                </h4>
                            </div>
                            <p className={css({ color: 'text.muted', fontSize: 'xs', lineClamp: 1 })}>
                                {item.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
