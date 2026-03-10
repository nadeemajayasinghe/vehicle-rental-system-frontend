'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Vehicle } from '@/services/vehicleService';

interface VehicleCardProps {
    vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
    const [liked, setLiked] = useState(false);

    const fallbackImg = '/hero.png';

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Favorite */}
            <button
                onClick={() => setLiked(!liked)}
                style={{
                    position: 'absolute', top: '12px', right: '12px', zIndex: 2,
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none', borderRadius: '50%',
                    width: '34px', height: '34px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'transform 0.2s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                aria-label="Toggle favourite">
                <Image
                    src={liked ? '/heart-filled.svg' : '/heart-outline.svg'}
                    alt="favourite"
                    width={18} height={18}
                />
            </button>

            {/* Image */}
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden', background: 'var(--surface-3)' }}>
                <Image
                    src={vehicle.imageUrl || fallbackImg}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onError={e => { (e.target as HTMLImageElement).src = fallbackImg; }}
                    sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
                    unoptimized
                />
                {/* Year badge */}
                <span style={{
                    position: 'absolute', bottom: '10px', left: '10px',
                    background: 'rgba(15,30,53,0.85)',
                    color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                    padding: '3px 10px', borderRadius: '50px',
                    backdropFilter: 'blur(6px)',
                }}>
                    {vehicle.year}
                </span>
            </div>

            {/* Content */}
            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
                {/* Make tag */}
                <span className="badge badge-accent">{vehicle.make}</span>

                {/* Title */}
                <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '2px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {vehicle.brand} {vehicle.model}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {vehicle.plateNumber} &bull; {vehicle.color}
                    </p>
                </div>

                {/* Specs row */}
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Image src="/tire.svg" alt="mileage" width={14} height={14} style={{ opacity: 0.6 }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            {vehicle.mileage.toLocaleString()} km
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Image src="/gas.svg" alt="fuel" width={14} height={14} style={{ opacity: 0.6 }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Petrol</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Image src="/steering-wheel.svg" alt="drive" width={14} height={14} style={{ opacity: 0.6 }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Auto</span>
                    </div>
                </div>

                {/* Price + CTA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '6px' }}>
                    <div>
                        <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Poppins, sans-serif' }}>
                            ${vehicle.dailyRate}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}> /day</span>
                    </div>
                    <Link href={`/vehicles/${vehicle.id}`} className="btn-outline" style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
                        View Details
                        <Image src="/right-arrow.svg" alt="" width={12} height={12} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
