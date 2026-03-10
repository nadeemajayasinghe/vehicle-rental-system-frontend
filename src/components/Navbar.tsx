'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/vehicles', label: 'Vehicles' },
    { href: '/booking', label: 'Booking' },
    { href: '/customers', label: 'Customers' },
    { href: '/payment', label: 'Payment' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            transition: 'all 0.3s ease',
            background: scrolled
                ? 'rgba(15, 30, 53, 0.97)'
                : 'rgba(15, 30, 53, 0.65)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
        }}>
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '70px',
            }}>
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #f5a623, #e09015)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Image src="/car-logo.svg" alt="DriveEase" width={22} height={22}
                            style={{ filter: 'brightness(0) invert(1)' }} />
                    </div>
                    <span style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 800,
                        fontSize: '1.3rem',
                        color: '#ffffff',
                        letterSpacing: '-0.02em',
                    }}>
                        Drive<span style={{ color: '#f5a623' }}>Ease</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    className="desktop-nav">
                    {navLinks.map(l => (
                        <Link key={l.href} href={l.href} style={{
                            color: 'rgba(255,255,255,0.85)',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            padding: '8px 16px',
                            borderRadius: '50px',
                            transition: 'all 0.2s ease',
                        }}
                            onMouseEnter={e => {
                                (e.target as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)';
                                (e.target as HTMLAnchorElement).style.color = '#ffffff';
                            }}
                            onMouseLeave={e => {
                                (e.target as HTMLAnchorElement).style.background = 'transparent';
                                (e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.85)';
                            }}>
                            {l.label}
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link href="/booking" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.88rem' }}>
                        Book Now
                    </Link>
                    {/* Hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            display: 'none',
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '8px', color: '#fff',
                        }}
                        className="hamburger-btn"
                        aria-label="Toggle menu">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            {menuOpen
                                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                                : <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>
                            }
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{
                    background: 'rgba(15, 30, 53, 0.98)',
                    backdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    padding: '12px 24px 20px',
                }}>
                    {navLinks.map(l => (
                        <Link key={l.href} href={l.href}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                display: 'block',
                                color: 'rgba(255,255,255,0.85)',
                                textDecoration: 'none',
                                fontSize: '1rem',
                                fontWeight: 500,
                                padding: '12px 0',
                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                            }}>
                            {l.label}
                        </Link>
                    ))}
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
        </nav>
    );
}
