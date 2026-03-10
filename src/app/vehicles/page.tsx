'use client';
import { useState, useEffect, useCallback } from 'react';
import VehicleCard from '@/components/VehicleCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import Pagination from '@/components/Pagination';
import { vehicleService, Vehicle, PaginatedVehicles } from '@/services/vehicleService';

const PAGE_SIZE = 9;

function VehicleGridSkeleton() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card" style={{ overflow: 'hidden' }}>
                    <div className="skeleton" style={{ height: '200px', borderRadius: 0 }} />
                    <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="skeleton" style={{ height: '20px', width: '60px' }} />
                        <div className="skeleton" style={{ height: '22px', width: '80%' }} />
                        <div className="skeleton" style={{ height: '16px', width: '50%' }} />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div className="skeleton" style={{ height: '14px', width: '60px' }} />
                            <div className="skeleton" style={{ height: '14px', width: '60px' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                            <div className="skeleton" style={{ height: '28px', width: '80px' }} />
                            <div className="skeleton" style={{ height: '36px', width: '110px', borderRadius: '50px' }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function VehiclesPage() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<PaginatedVehicles | null>(null);
    const [error, setError] = useState('');

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    // Reset to page 0 on new search/category
    useEffect(() => { setPage(0); }, [debouncedSearch, category]);

    const fetchVehicles = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await vehicleService.getAllVehicles(debouncedSearch, page, PAGE_SIZE);
            setResult(data);
        } catch (e) {
            console.error(e);
            setError('Unable to load vehicles. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, page]);

    useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

    // Client-side category filter from fetched data
    const vehicles: Vehicle[] = result?.content
        ? (category === 'All' ? result.content : result.content.filter(v =>
            v.make?.toLowerCase().includes(category.toLowerCase()) ||
            v.brand?.toLowerCase().includes(category.toLowerCase())
        ))
        : [];

    return (
        <>
            {/* Page Header */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                padding: '60px 24px 80px',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <span className="section-tag" style={{ background: 'rgba(245,166,35,0.15)', color: '#f5a623' }}>
                        Our Fleet
                    </span>
                    <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: '#fff', fontWeight: 800, marginBottom: '12px' }}>
                        All Vehicles
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', maxWidth: '480px' }}>
                        Browse our premium fleet. Use search and filters to find your perfect ride.
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 80px' }}>
                {/* Search + Filter bar */}
                <div style={{
                    background: '#fff',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px 28px',
                    marginTop: '-32px',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border)',
                    marginBottom: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                }}>
                    <SearchBar value={search} onChange={setSearch} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                            Filter by:
                        </span>
                        <CategoryFilter active={category} onChange={setCategory} />
                    </div>
                </div>

                {/* Results count */}
                {!loading && result && (
                    <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Showing <strong>{vehicles.length}</strong> vehicle{vehicles.length !== 1 ? 's' : ''}
                            {debouncedSearch && <> for &quot;<strong>{debouncedSearch}</strong>&quot;</>}
                        </p>
                        {category !== 'All' && (
                            <button onClick={() => setCategory('All')} style={{
                                background: 'none', border: '1px solid var(--border)', borderRadius: '50px',
                                padding: '4px 14px', fontSize: '0.82rem', color: 'var(--text-muted)',
                                cursor: 'pointer',
                            }}>
                                ✕ Clear filter
                            </button>
                        )}
                    </div>
                )}

                {/* Grid */}
                {loading ? (
                    <VehicleGridSkeleton />
                ) : error ? (
                    <div style={{
                        textAlign: 'center', padding: '80px 20px',
                        background: '#fff5f5', borderRadius: 'var(--radius-lg)',
                        border: '1px solid #fed7d7',
                    }}>
                        <p style={{ color: '#c53030', fontSize: '1rem' }}>⚠️ {error}</p>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🚗</div>
                        <h3 style={{ marginBottom: '8px' }}>No vehicles found</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                            Try adjusting your search or removing the category filter.
                        </p>
                        <button onClick={() => { setSearch(''); setCategory('All'); }} className="btn-primary">
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px', marginBottom: '48px' }}>
                            {vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
                        </div>

                        {result && (
                            <Pagination
                                currentPage={page}
                                totalPages={result.totalPages}
                                onPageChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
}
