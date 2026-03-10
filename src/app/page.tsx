import Image from 'next/image';
import Link from 'next/link';
import VehicleCard from '@/components/VehicleCard';
import { vehicleService } from '@/services/vehicleService';

async function getFeaturedVehicles() {
  try {
    const data = await vehicleService.getAllVehicles('', 0, 6);
    return data.content;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredVehicles = await getFeaturedVehicles();

  const stats = [
    { value: '500+', label: 'Vehicles' },
    { value: '20+', label: 'Locations' },
    { value: '50K+', label: 'Happy Clients' },
    { value: '4.9★', label: 'Rating' },
  ];

  const features = [
    { icon: '/steering-wheel.svg', title: 'Premium Fleet', desc: 'Hand-picked vehicles serviced to the highest standard for a premium driving experience.' },
    { icon: '/gas.svg', title: 'Fully Fuelled', desc: 'Every vehicle is delivered with a full tank so your journey starts seamlessly.' },
    { icon: '/tire.svg', title: 'Always Maintained', desc: 'Regular inspections and tyre checks ensure every ride is safe and smooth.' },
    { icon: '/model-icon.png', title: 'Latest Models', desc: 'Drive the newest models from top brands with the latest safety technologies.' },
  ];

  return (
    <>
      {/* ── Hero ──────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="/hero-bg.png"
            alt="Hero background"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
            quality={85}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(10,21,40,0.92) 0%, rgba(15,30,53,0.78) 50%, rgba(26,43,74,0.55) 100%)',
          }} />
        </div>

        {/* Pattern overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.05 }}>
          <Image src="/pattern.png" alt="" fill style={{ objectFit: 'cover' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1280px', margin: '0 auto', padding: '80px 24px', width: '100%' }}>
          <div style={{ maxWidth: '660px' }}>
            <span className="section-tag" style={{ background: 'rgba(245,166,35,0.15)', color: '#f5a623', marginBottom: '24px', display: 'inline-block' }}>
              🚗 Sri Lanka&apos;s #1 Car Rental
            </span>
            <h1 style={{
              fontSize: 'clamp(2.6rem, 6vw, 4.2rem)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '24px',
              letterSpacing: '-0.03em',
            }}>
              Find Your <span style={{ color: '#f5a623' }}>Perfect</span> Drive Today
            </h1>
            <p style={{
              fontSize: '1.15rem',
              color: 'rgba(255,255,255,0.78)',
              marginBottom: '40px',
              lineHeight: 1.7,
            }}>
              Premium vehicles for every journey. Transparent pricing, seamless booking, and unmatched service — wherever the road takes you.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/vehicles" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                Browse Vehicles
                <Image src="/right-arrow.svg" alt="" width={16} height={16} style={{ filter: 'brightness(0) invert(1)' }} />
              </Link>
              <Link href="/booking" className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                Book Now
              </Link>
            </div>
          </div>

          {/* Hero car float */}
          <div style={{
            position: 'absolute',
            right: '0', bottom: '-20px',
            width: 'clamp(300px, 45vw, 680px)',
            display: 'none',
          }} className="hero-car">
            <Image src="/hero.png" alt="Featured car" width={680} height={440}
              style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))' }}
              className="animate-float" priority />
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            maxWidth: '1280px', margin: '0 auto', padding: '24px',
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px',
          }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 900, color: '#f5a623', fontFamily: 'Poppins, sans-serif' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (min-width: 1024px) { .hero-car { display: block !important; } }
        `}</style>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: 'var(--surface-2)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <span className="section-tag">Why DriveEase</span>
          <h2 className="section-title">The DriveEase Difference</h2>
          <p className="section-subtitle">
            We go beyond just handing over keys — every detail is meticulously handled so you can focus on the journey.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '28px' }}>
            {features.map(f => (
              <div key={f.title} className="card" style={{ padding: '36px 28px', textAlign: 'center', cursor: 'default' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(26,43,74,0.08), rgba(26,43,74,0.04))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  border: '1px solid var(--border)',
                }}>
                  <Image src={f.icon} alt={f.title} width={36} height={36} style={{ opacity: 0.8 }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Vehicles ───────────────────────────── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="section-tag">Our Fleet</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Popular Vehicles</h2>
            </div>
            <Link href="/vehicles" className="btn-outline">
              View All Vehicles
              <Image src="/right-arrow.svg" alt="" width={14} height={14} />
            </Link>
          </div>

          {featuredVehicles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                No vehicles available right now. Please ensure the backend is running.
              </p>
              <Link href="/vehicles" className="btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
                Browse All Vehicles
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' }}>
              {featuredVehicles.map(v => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────── */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04 }}>
          <Image src="/pattern.png" alt="" fill style={{ objectFit: 'cover' }} />
        </div>
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Ready to Hit the Road?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', marginBottom: '36px' }}>
            Browse our full fleet and find the perfect vehicle for your next adventure.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/vehicles" className="btn-primary">Explore Fleet</Link>
            <Link href="/booking" className="btn-secondary">Make a Booking</Link>
          </div>
        </div>
      </section>
    </>
  );
}
