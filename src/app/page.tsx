'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/home');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight text-slate-950">VehicleRent</div>
              <div className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">Calm mobility</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(248,250,252,0))]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Effortless booking for everyday and premium rides
            </div>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Premium car rental with a calmer, cleaner experience.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Discover, reserve, and manage vehicles in one place with a polished flow built for speed, trust, and comfort.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 transition hover:bg-slate-800"
              >
                Start Booking
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
              >
                Learn More
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ['500+', 'Premium vehicles'],
                ['50K+', 'Happy customers'],
                ['24/7', 'Customer support'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/40 backdrop-blur">
                  <div className="text-2xl font-semibold tracking-tight text-slate-950">{value}</div>
                  <div className="mt-1 text-sm text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 h-24 w-24 rounded-full bg-blue-200/60 blur-3xl" />
            <div className="absolute -right-6 bottom-10 h-28 w-28 rounded-full bg-slate-300/40 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-200">Current availability</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">Drive with confidence</h2>
                </div>
                <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">
                  Live fleet
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  ['Executive Sedan', 'Ready in 12 min', 'Blue comfort package'],
                  ['Compact City', 'Ready now', 'Best for quick trips'],
                  ['Luxury SUV', 'Ready in 25 min', 'Family and long-distance'],
                ].map(([title, status, meta]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold">{title}</p>
                        <p className="mt-1 text-sm text-slate-300">{meta}</p>
                      </div>
                      <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-100">
                        {status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-white p-5 text-slate-950">
                <p className="text-sm font-medium text-slate-500">Average booking time</p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <div className="text-4xl font-semibold tracking-tight">2 min</div>
                  <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Faster than traditional desk booking
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">Why choose us</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Designed to feel premium without being complicated
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Every step is simplified, from discovering the right vehicle to checking your history after the trip.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-950">Wide Selection</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Browse vehicles that match your plans, from efficient city cars to elevated executive options.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-950">Instant Booking</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Move from choice to confirmation in minutes with a flow that stays clear and responsive.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-950">Secure and Safe</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Our fleet is maintained and protected so the experience feels dependable before you even start driving.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white px-8 py-12 shadow-sm sm:px-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">Ready to drive</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Join thousands of customers choosing a cleaner rental experience.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Create your account, browse the fleet, and keep every booking detail in one place.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
            Create Your Account
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8">
          <p>© 2026 VehicleRent. All rights reserved.</p>
          <p>White, black, and blue with a calm modern feel.</p>
        </div>
      </footer>
    </div>
  );
}
