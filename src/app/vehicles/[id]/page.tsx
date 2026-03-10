import Image from 'next/image';
import Link from 'next/link';
import { vehicleService } from '@/services/vehicleService';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function VehicleDetailPage({ params }: Props) {
    const { id } = await params;

    let vehicle;
    try {
        vehicle = await vehicleService.getVehicleById(id);
    } catch {
        notFound();
    }

    const specs = [
        { label: 'Make', value: vehicle.make },
        { label: 'Brand', value: vehicle.brand },
        { label: 'Model', value: vehicle.model },
        { label: 'Year', value: vehicle.year.toString() },
        { label: 'Plate Number', value: vehicle.plateNumber },
        { label: 'Color', value: vehicle.color },
        { label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} km` },
        { label: 'Daily Rate', value: `$${vehicle.dailyRate} / day` },
    ];

    return (
        <>
            {/* Breadcrumb */}
            <div style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', padding: '14px 24px' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
                    <span>›</span>
                    <Link href="/vehicles" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Vehicles</Link>
                    <span>›</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{vehicle.brand} {vehicle.model}</span>
                </div>
            </div>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 80px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}
                    className="detail-grid">

                    {/* Left – Image */}
                    <div>
                        <div style={{
                            position: 'relative', height: '400px', borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden', background: 'var(--surface-3)',
                            boxShadow: 'var(--shadow-xl)',
                        }}>
                            <Image
                                src={vehicle.imageUrl || '/hero.png'}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width:768px) 100vw, 50vw"
                                onError={undefined}
                                unoptimized
                            />
                            {/* Year overlay */}
                            <div style={{
                                position: 'absolute', top: '16px', left: '16px',
                                background: 'rgba(15,30,53,0.85)', backdropFilter: 'blur(8px)',
                                color: '#fff', fontWeight: 700, padding: '6px 16px',
                                borderRadius: '50px', fontSize: '0.9rem',
                            }}>
                                {vehicle.year}
                            </div>
                        </div>

                        {/* Specs mini-icons */}
                        <div style={{
                            display: 'flex', gap: '16px', marginTop: '20px',
                            background: 'var(--surface-2)', borderRadius: 'var(--radius-md)',
                            padding: '18px 24px', border: '1px solid var(--border)',
                        }}>
                            {[
                                { icon: '/tire.svg', label: `${vehicle.mileage.toLocaleString()} km` },
                                { icon: '/gas.svg', label: 'Petrol' },
                                { icon: '/steering-wheel.svg', label: 'Automatic' },
                            ].map(spec => (
                                <div key={spec.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                    <Image src={spec.icon} alt={spec.label} width={20} height={20} style={{ opacity: 0.65 }} />
                                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{spec.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right – Info */}
                    <div>
                        <span className="badge badge-accent" style={{ marginBottom: '14px', fontSize: '0.82rem' }}>
                            {vehicle.make}
                        </span>
                        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                            {vehicle.brand} {vehicle.model}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '28px' }}>
                            {vehicle.plateNumber} &bull; {vehicle.color}
                        </p>

                        {/* Price */}
                        <div style={{
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                            borderRadius: 'var(--radius-md)', padding: '20px 24px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            marginBottom: '32px',
                        }}>
                            <div>
                                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', marginBottom: '4px' }}>Daily Rate</p>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                    <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#f5a623', fontFamily: 'Poppins, sans-serif' }}>
                                        ${vehicle.dailyRate}
                                    </span>
                                    <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>/day</span>
                                </div>
                            </div>
                            <Link href={`/booking?vehicleId=${vehicle.id}`} className="btn-primary" style={{ fontSize: '0.95rem', padding: '14px 28px' }}>
                                Book This Vehicle
                                <Image src="/right-arrow.svg" alt="" width={14} height={14} style={{ filter: 'brightness(0) invert(1)' }} />
                            </Link>
                        </div>

                        {/* Specs table */}
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Specifications
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                            {specs.map((s, i) => (
                                <div key={s.label} style={{
                                    display: 'flex',
                                    background: i % 2 === 0 ? '#fff' : 'var(--surface-2)',
                                    padding: '12px 20px',
                                }}>
                                    <span style={{ width: '140px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.88rem', flexShrink: 0 }}>
                                        {s.label}
                                    </span>
                                    <span style={{ color: 'var(--text-primary)', fontSize: '0.92rem', fontWeight: 500 }}>{s.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        {vehicle.description && (
                            <div style={{ marginTop: '28px' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    About this vehicle
                                </h3>
                                <p style={{ fontSize: '0.93rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                                    {vehicle.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </>
    );
}
