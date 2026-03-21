'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = user
    ? [
        { label: 'Dashboard', href: '/home' },
        { label: 'Vehicles', href: '/vehicles' },
        { label: 'My Profile', href: '/profile' },
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'Vehicles', href: '/vehicles' },
      ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm shadow-slate-200/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/10 transition group-hover:bg-blue-600">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-slate-950">VehicleRent</div>
            <div className="text-xs font-medium uppercase tracking-widest text-slate-400 hidden sm:block">Premium Rentals</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                pathname === link.href
                  ? 'bg-slate-100 text-slate-950'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-slate-100" />
            {user ? (
              <button
                onClick={handleLogout}
                className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
                <Link href="/register" className="rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700" onClick={() => setMobileOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
