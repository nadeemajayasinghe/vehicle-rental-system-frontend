'use client';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/vehicles', label: 'Vehicles' },
    { href: '/booking', label: 'Booking' },
    { href: '/customers', label: 'Customers' },
    { href: '/payment', label: 'Payment' },
];

const socialLinks = [
    { href: '#', icon: '/facebook.svg', label: 'Facebook' },
    { href: '#', icon: '/twitter.svg', label: 'Twitter' },
    { href: '#', icon: '/linkedin.svg', label: 'LinkedIn' },
    { href: '#', icon: '/github.svg', label: 'GitHub' },
    { href: '#', icon: '/discord.svg', label: 'Discord' },
];

export default function Footer() {
    return (
        <footer style={{
            background: 'linear-gradient(180deg, #0f1e35 0%, #0a1528 100%)',
            color: 'rgba(255,255,255,0.7)',
            paddingTop: '60px',
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                {/* Top row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '40px',
                    paddingBottom: '48px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}>
                    {/* Brand */}
                    <div>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: 'linear-gradient(135deg, #f5a623, #e09015)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Image src="/car-logo.svg" alt="DriveEase" width={22} height={22}
                                    style={{ filter: 'brightness(0) invert(1)' }} />
                            </div>
                            <span style={{
                                fontFamily: 'Poppins, sans-serif', fontWeight: 800,
                                fontSize: '1.3rem', color: '#ffffff',
                            }}>
                                Drive<span style={{ color: '#f5a623' }}>Ease</span>
                            </span>
                        </Link>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '20px' }}>
                            Premium car rental service delivering unmatched comfort, quality, and reliability across Sri Lanka.
                        </p>
                        {/* Social icons */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {socialLinks.map(s => (
                                <a key={s.label} href={s.href} aria-label={s.label} style={{
                                    width: '36px', height: '36px',
                                    background: 'rgba(255,255,255,0.08)',
                                    borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(245,166,35,0.2)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)'; }}>
                                    <Image src={s.icon} alt={s.label} width={16} height={16}
                                        style={{ filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Navigation
                        </h4>
                        <ul style={{ listStyle: 'none' }}>
                            {navLinks.map(l => (
                                <li key={l.href} style={{ marginBottom: '10px' }}>
                                    <Link href={l.href} style={{
                                        color: 'rgba(255,255,255,0.65)',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        transition: 'color 0.2s',
                                    }}
                                        onMouseEnter={e => { (e.target as HTMLAnchorElement).style.color = '#f5a623'; }}
                                        onMouseLeave={e => { (e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)'; }}>
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Services
                        </h4>
                        <ul style={{ listStyle: 'none' }}>
                            {['Car Rental', 'Chauffeur Service', 'Airport Transfers', 'Corporate Hire', 'Long-term Leasing'].map(s => (
                                <li key={s} style={{ marginBottom: '10px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>{s}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Contact
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { icon: '📍', text: '123 Galle Road, Colombo 03, Sri Lanka' },
                                { icon: '📞', text: '+94 11 234 5678' },
                                { icon: '✉️', text: 'info@driveease.lk' },
                                { icon: '⏰', text: 'Mon–Sat · 8AM – 8PM' },
                            ].map(c => (
                                <div key={c.text} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '0.9rem' }}>{c.icon}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>{c.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom row */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    flexWrap: 'wrap',
                    gap: '12px',
                }}>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                        © {new Date().getFullYear()} DriveEase. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
                            <a key={t} href="#" style={{
                                fontSize: '0.85rem',
                                color: 'rgba(255,255,255,0.4)',
                                textDecoration: 'none',
                                transition: 'color 0.2s',
                            }}
                                onMouseEnter={e => { (e.target as HTMLAnchorElement).style.color = '#f5a623'; }}
                                onMouseLeave={e => { (e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)'; }}>
                                {t}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
