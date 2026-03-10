'use client';

const CATEGORIES = ['All', 'Sedan', 'SUV', 'Sports', 'Luxury', 'Electric', 'Van', 'Pickup'];

interface CategoryFilterProps {
    active: string;
    onChange: (cat: string) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
    return (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            {CATEGORIES.map(cat => (
                <button
                    key={cat}
                    onClick={() => onChange(cat)}
                    style={{
                        padding: '8px 20px',
                        borderRadius: '50px',
                        border: active === cat ? '2px solid var(--primary)' : '2px solid var(--border)',
                        background: active === cat ? 'var(--primary)' : '#fff',
                        color: active === cat ? '#fff' : 'var(--text-secondary)',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        fontFamily: 'Inter, sans-serif',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: active === cat ? '0 4px 12px rgba(26,43,74,0.25)' : 'none',
                    }}
                    onMouseEnter={e => {
                        if (active !== cat) {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary)';
                            (e.currentTarget as HTMLButtonElement).style.color = 'var(--primary)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (active !== cat) {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
                            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                        }
                    }}>
                    {cat}
                </button>
            ))}
        </div>
    );
}
