import Link from 'next/link';

export default function CustomersPage() {
    return (
        <>
            <div style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                padding: '60px 24px 80px',
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: '#fff', fontWeight: 800, marginBottom: '12px' }}>
                        Customers
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem' }}>
                        Customer management and profiles.
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 80px' }}>
                <div style={{
                    marginTop: '-40px',
                    background: '#fff',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border)',
                    padding: '64px 40px',
                    textAlign: 'center',
                }}>
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '28px',
                        background: 'rgba(245,166,35,0.08)', border: '2px solid rgba(245,166,35,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 28px', fontSize: '3rem',
                    }}>
                        👥
                    </div>

                    <div style={{
                        display: 'inline-block', background: 'rgba(245,166,35,0.1)',
                        color: '#e09015', fontWeight: 700, fontSize: '0.78rem',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        padding: '6px 18px', borderRadius: '50px', marginBottom: '20px',
                    }}>
                        Coming Soon
                    </div>

                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>
                        Customer Management — In Development
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 12px' }}>
                        The customer portal enables account creation, rental history tracking, loyalty rewards, and personalised preferences for returning customers.
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '36px' }}>
                        This section will be fully integrated once the customer microservice is deployed.
                    </p>

                    <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/" className="btn-outline">← Back to Home</Link>
                        <Link href="/vehicles" className="btn-primary">Browse Vehicles</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
