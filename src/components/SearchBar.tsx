'use client';
import Image from 'next/image';
import { useRef } from 'react';

interface SearchBarProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search by brand, model, or make...' }: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            borderRadius: '50px',
            border: '2px solid var(--border)',
            padding: '0 20px',
            gap: '10px',
            transition: 'all 0.2s ease',
            boxShadow: 'var(--shadow-sm)',
        }}
            onFocus={() => {
                (document.querySelector('.search-wrap') as HTMLElement)?.style.setProperty('border-color', 'var(--accent)');
                (document.querySelector('.search-wrap') as HTMLElement)?.style.setProperty('box-shadow', '0 0 0 4px rgba(245,166,35,0.15)');
            }}
            onClick={() => inputRef.current?.focus()}
            className="search-wrap">
            <Image src="/magnifying-glass.svg" alt="search" width={18} height={18} style={{ opacity: 0.5, flexShrink: 0 }} />
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                    width: '100%',
                    padding: '14px 0',
                }}
            />
            {value && (
                <button onClick={() => onChange('')} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '4px', color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center',
                }}>
                    <Image src="/close.svg" alt="clear" width={16} height={16} style={{ opacity: 0.5 }} />
                </button>
            )}
        </div>
    );
}
