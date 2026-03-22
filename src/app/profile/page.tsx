'use client';

import { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { customerService } from '@/services/customerService';
import { bookingService, BookingResponse } from '@/services/bookingService';
import { getByBookingId } from '@/services/paymentService';
import { PaymentResponse } from '@/types/payment';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard({ booking, payment }: { booking: BookingResponse; payment: PaymentResponse | null }) {
  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

  const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-green-50 text-green-700 border-green-200',
    PENDING:   'bg-amber-50 text-amber-700 border-amber-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  const payStatusColors: Record<string, string> = {
    SUCCESS:  'bg-green-50 text-green-700 border-green-200',
    PENDING:  'bg-amber-50 text-amber-700 border-amber-200',
    FAILED:   'bg-red-50 text-red-700 border-red-200',
    REFUNDED: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const isPendingPayment = booking.status === 'PENDING';

  return (
    <div className={`rounded-2xl border bg-white shadow-sm transition hover:shadow-md overflow-hidden ${
      isPendingPayment ? 'border-blue-200 ring-1 ring-blue-100' : 'border-slate-200'
    }`}>
      {/* Top accent stripe — blue for all, brighter for pending */}
      <div className={`h-1 w-full ${
        isPendingPayment
          ? 'bg-gradient-to-r from-blue-500 to-blue-400'
          : booking.status === 'CONFIRMED'
          ? 'bg-gradient-to-r from-blue-600 to-indigo-500'
          : booking.status === 'COMPLETED'
          ? 'bg-gradient-to-r from-blue-400 to-cyan-400'
          : booking.status === 'CANCELLED'
          ? 'bg-gradient-to-r from-slate-300 to-slate-200'
          : 'bg-gradient-to-r from-blue-600 to-indigo-600'
      }`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">{booking.vehicleName}</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">#{booking.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              statusColors[booking.status] || 'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                booking.status === 'PENDING'   ? 'bg-blue-500 animate-pulse' :
                booking.status === 'CONFIRMED' ? 'bg-green-500' :
                booking.status === 'CANCELLED' ? 'bg-red-400' : 'bg-blue-500'
              }`} />
              {booking.status === 'PENDING' ? 'Pending Payment' : booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
            </span>
            {payment && (
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                payStatusColors[payment.status] || ''
              }`}>
                💳 {payment.paymentMethod.replace('_', ' ')} · {payment.status}
              </span>
            )}
          </div>
        </div>

        {/* Dates & Location */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1">Pick-up</p>
            <p className="font-semibold text-slate-800 text-xs">{formatDate(booking.pickupDate)}</p>
            <p className="text-xs text-slate-500 truncate mt-0.5">{booking.pickupLocation}</p>
          </div>
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1">Return</p>
            <p className="font-semibold text-slate-800 text-xs">{formatDate(booking.returnDate)}</p>
            <p className="text-xs text-slate-500 truncate mt-0.5">{booking.returnLocation}</p>
          </div>
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1">Duration</p>
            <p className="font-semibold text-slate-800">{booking.numberOfDays} day{booking.numberOfDays !== 1 ? 's' : ''}</p>
            <p className="text-xs text-slate-500 mt-0.5">${booking.pricePerDay}/day</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-3 text-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mb-1">Total</p>
            <p className="text-lg font-bold">${booking.totalAmount}</p>
            {payment?.status === 'SUCCESS' ? (
              <p className="text-[10px] text-blue-200 font-semibold mt-0.5">✓ Paid</p>
            ) : (
              <p className="text-[10px] text-blue-300 mt-0.5">{booking.numberOfDays}d × ${booking.pricePerDay}</p>
            )}
          </div>
        </div>

        {/* Pay Now CTA */}
        {isPendingPayment && (
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-blue-100">
            <p className="text-xs text-blue-600 font-medium">Complete payment to confirm your reservation</p>
            <Link
              href={`/payment?bookingId=${booking.id}`}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 active:scale-95"
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
  );
}

// ─── Bookings Tab ──────────────────────────────────────────────────────────────
function BookingsTab({ email }: { email: string }) {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [payments, setPayments] = useState<Record<string, PaymentResponse>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'>('ALL');

  useEffect(() => {
    async function load() {
      try {
        const data = await bookingService.getBookingsByCustomerEmail(email);
        const sorted = data.sort((a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        setBookings(sorted);

        // Fetch payment info for each booking (best-effort)
        const payMap: Record<string, PaymentResponse> = {};
        await Promise.allSettled(
          sorted.map(async (b) => {
            try {
              const p = await getByBookingId(b.id);
              if (p) payMap[b.id] = p;
            } catch { /* no payment yet */ }
          })
        );
        setPayments(payMap);
      } catch (e) {
        console.error('Failed to load bookings', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [email]);

  const filtered = filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter);
  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;

  const FILTERS = [
    { key: 'ALL', label: 'All' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ] as const;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm text-slate-500">Loading your bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Pending alert */}
      {pendingCount > 0 && (
        <div className="rounded-2xl bg-blue-600 p-4 flex items-center gap-4 shadow-lg shadow-blue-600/20">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">{pendingCount} booking{pendingCount > 1 ? 's' : ''} awaiting payment</p>
            <p className="text-xs text-blue-200 mt-0.5">Complete payment to confirm your reservation.</p>
          </div>
          <div className="h-2 w-2 rounded-full bg-white animate-pulse shrink-0" />
        </div>
      )}

      {/* Filter pills */}
      {bookings.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const count = f.key === 'ALL' ? bookings.length : bookings.filter((b) => b.status === f.key).length;
            if (f.key !== 'ALL' && count === 0) return null;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  filter === f.key
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {f.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  filter === f.key ? 'bg-white/25 text-white' : 'bg-blue-50 text-blue-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Booking list */}
      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <p className="text-slate-500 mb-1 font-semibold text-slate-800">No bookings yet</p>
          <p className="text-sm text-slate-400 mb-6">Start your journey by browsing our fleet.</p>
          <Link href="/vehicles" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500">
            Browse Vehicles
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-400 text-sm">No {filter.toLowerCase()} bookings found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <BookingCard key={b.id} booking={b} payment={payments[b.id] ?? null} />
          ))}
        </div>
      )}

      <Link href="/vehicles" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Book Another Vehicle
      </Link>
    </div>
  );
}

// ─── Main Page (reads ?tab= param) ────────────────────────────────────────────
function ProfileContent() {
  const { user, isLoading: authLoading, updateUser, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>(
    searchParams.get('tab') === 'bookings' ? 'bookings' : 'profile'
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) setFormData({ name: user.name, contact: user.contact, address: user.address });
  }, [user]);

  // Sync tab from URL changes
  useEffect(() => {
    if (searchParams.get('tab') === 'bookings') setActiveTab('bookings');
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true); setError(''); setSuccess('');
    try {
      const updated = await customerService.updateCustomer(user.id, formData);
      updateUser(updated);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: unknown) {
      const msg = axios.isAxiosError<{ message?: string }>(err) ? err.response?.data?.message : undefined;
      setError(msg || 'Failed to update profile');
    } finally { setIsLoading(false); }
  };

  const handleDelete = async () => {
    if (!user) return;
    setIsLoading(true); setError('');
    try {
      await customerService.deleteCustomer(user.id);
      logout(); router.push('/login');
    } catch (err: unknown) {
      const msg = axios.isAxiosError<{ message?: string }>(err) ? err.response?.data?.message : undefined;
      setError(msg || 'Failed to delete account');
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Account</h1>
            <p className="mt-1 text-slate-500">Manage your profile and view your bookings.</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {(['profile', 'bookings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3.5 px-6 text-sm font-semibold border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab === 'profile' ? 'Profile Settings' : 'My Bookings'}
              </button>
            ))}
          </div>

          {/* Alerts */}
          {error && activeTab === 'profile' && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                    <p className="mt-0.5 text-sm text-slate-500">Your account details and contact information</p>
                  </div>
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      Edit Profile
                    </button>
                  )}
                </div>
                <div className="px-6 py-6">
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {[
                        { id: 'name', label: 'Full Name', type: 'text' },
                        { id: 'contact', label: 'Contact Number', type: 'tel' },
                      ].map((f) => (
                        <div key={f.id}>
                          <label htmlFor={f.id} className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                          <input id={f.id} name={f.id} type={f.type} required value={(formData as any)[f.id]} onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
                        </div>
                      ))}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email (cannot be changed)</label>
                        <input id="email" type="email" value={user.email} disabled className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed" />
                      </div>
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                        <textarea id="address" name="address" required value={formData.address} onChange={handleChange} rows={3}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={isLoading}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition">
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={() => { setIsEditing(false); setFormData({ name: user.name, contact: user.contact, address: user.address }); setError(''); setSuccess(''); }}
                          className="flex-1 bg-white text-slate-700 font-semibold py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 transition">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <dl className="space-y-1 divide-y divide-slate-100">
                      {[
                        { label: 'Full Name', value: user.name },
                        { label: 'Email Address', value: user.email },
                        { label: 'Contact Number', value: user.contact },
                        { label: 'Address', value: user.address },
                        { label: 'Member Type', value: <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{user.role}</span> },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between py-3">
                          <dt className="text-sm font-medium text-slate-500">{row.label}</dt>
                          <dd className="text-sm font-semibold text-slate-900 text-right max-w-xs">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
                <div className="px-6 py-5 bg-red-50">
                  <h3 className="text-base font-bold text-red-900 mb-1">Danger Zone</h3>
                  <p className="text-sm text-red-700 mb-4">Once you delete your account, there is no going back.</p>
                  {!showDeleteConfirm ? (
                    <button onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2 text-sm font-semibold text-red-700 border border-red-300 hover:bg-red-100 rounded-lg transition-colors">
                      Delete Account
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-red-900">Are you sure?</p>
                      <button onClick={handleDelete} disabled={isLoading} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg transition">
                        {isLoading ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                      <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg transition">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && <BookingsTab email={user.email} />}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
