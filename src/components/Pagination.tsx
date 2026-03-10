'use client';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPages = () => {
        const pages: (number | '...')[] = [];
        if (totalPages <= 7) {
            for (let i = 0; i < totalPages; i++) pages.push(i);
        } else {
            pages.push(0);
            if (currentPage > 3) pages.push('...');
            for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 4) pages.push('...');
            pages.push(totalPages - 1);
        }
        return pages;
    };

    const btnBase: React.CSSProperties = {
        width: '40px', height: '40px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '10px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.9rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '2px solid var(--border)',
        background: '#fff',
        color: 'var(--text-secondary)',
    };

    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
            {/* Prev */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                style={{
                    ...btnBase,
                    opacity: currentPage === 0 ? 0.4 : 1,
                    cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                }}>
                ‹
            </button>

            {getPages().map((p, i) =>
                p === '...'
                    ? <span key={`dots-${i}`} style={{ color: 'var(--text-muted)', padding: '0 4px' }}>…</span>
                    : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p as number)}
                            style={{
                                ...btnBase,
                                ...(p === currentPage ? {
                                    background: 'var(--primary)',
                                    borderColor: 'var(--primary)',
                                    color: '#fff',
                                    boxShadow: '0 4px 12px rgba(26,43,74,0.3)',
                                } : {}),
                            }}>
                            {(p as number) + 1}
                        </button>
                    )
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                style={{
                    ...btnBase,
                    opacity: currentPage === totalPages - 1 ? 0.4 : 1,
                    cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                }}>
                ›
            </button>
        </div>
    );
}
