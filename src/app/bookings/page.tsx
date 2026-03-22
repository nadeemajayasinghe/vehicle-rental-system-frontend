'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService, BookingResponse } from '@/services/bookingService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function BookingsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login?redirect=/bookings');
      return;
    }

    if (user) {
      loadBookings();
    }
  }, [user, isAuthLoading, router]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      setError('');
      if (user?.email) {
        const data = await bookingService.getBookingsByCustomerEmail(user.email);
        const sortedData = data.sort((a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        setBookings(sortedData);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setError('Failed to load your bookings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-200"><span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>Confirmed</span>;
      case 'PENDING':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200"><span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>Pending Payment</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200"><span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>Cancelled</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200"><span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>Completed</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-3 shadow-sm">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span className="text-sm font-medium text-slate-600">Loading your bookings...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">My Bookings</h1>
            <p className="mt-2 text-sm text-slate-500">Manage your past and upcoming vehicle rentals.</p>
          </div>
          <Link
            href="/vehicles"
            className="hidden sm:flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500"
          >
            Book Another Vehicle
          </Link>
        </div>

        {/* Pending payment alert banner */}
        {pendingCount > 0 && (
          <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
              <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-800">
                {pendingCount} booking{pendingCount > 1 ? 's' : ''} awaiting payment
              </p>
              <p className="text-xs text-amber-600 mt-0.5">Complete your payment to confirm your reservation.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 rounded-xl bg-red-50 p-4 border border-red-100 text-sm text-red-600">
            {error}
          </div>
        )}

        {bookings.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 mb-4">
              <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-950">No bookings yet</h3>
            <p className="mt-1 text-slate-500 max-w-sm mx-auto">You haven't made any vehicle reservations yet. Ready for your next adventure?</p>
            <Link href="/vehicles" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500">
              Browse Fleet
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className={`group relative flex flex-col lg:flex-row overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
                  booking.status === 'PENDING'
                    ? 'border-amber-200 ring-1 ring-amber-100'
                    : 'border-slate-200'
                }`}
              >
                {/* PENDING stripe accent */}
                {booking.status === 'PENDING' && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-500 rounded-l-2xl" />
                )}

                <div className="flex-1 p-6 pl-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-950 group-hover:text-blue-600 transition-colors">
                        {booking.vehicleName}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">Booking Reference: #{booking.id.substring(0, 8).toUpperCase()}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-6 mt-6 lg:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Pick-up</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">{formatDate(booking.pickupDate)}</p>
                      <p className="mt-0.5 text-xs text-slate-500 truncate">{booking.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Return</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">{formatDate(booking.returnDate)}</p>
                      <p className="mt-0.5 text-xs text-slate-500 truncate">{booking.returnLocation}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Duration</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">
                        {booking.numberOfDays} Day{booking.numberOfDays !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0 lg:border-l border-slate-100 lg:pl-6 col-span-2 lg:col-span-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Amount</p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">${booking.totalAmount}</p>
                    </div>
                  </div>

                  {/* Pay Now CTA for pending bookings */}
                  {booking.status === 'PENDING' && (
                    <div className="mt-5 pt-4 border-t border-amber-100 flex items-center justify-between gap-3">
                      <p className="text-xs text-amber-600 font-medium">
                        ⚠ Payment required to confirm your reservation
                      </p>
                      <Link
                        href={`/payment?bookingId=${booking.id}`}
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-amber-500/30 transition hover:bg-amber-600 active:scale-95 z-10 relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Pay Now
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
