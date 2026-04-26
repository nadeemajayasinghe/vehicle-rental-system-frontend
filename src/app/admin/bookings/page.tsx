'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService, BookingResponse } from '@/services/bookingService';

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-50 text-green-700 border-green-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function AdminBookingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [toast, setToast] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) router.push('/');
  }, [user, authLoading, router]);

  useEffect(() => { if (user?.role === 'ADMIN') load(); }, [user]);

  async function load() {
    setLoading(true);
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      await bookingService.updateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: status as any } : b));
      showToast(`Booking ${status.toLowerCase()}.`);
    } catch { showToast('Update failed.'); }
    setUpdatingId(null);
  }

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

  const filtered = bookings.filter((b) => {
    const matchSearch = `${b.vehicleName} ${b.customerName} ${b.customerEmail} ${b.id}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || b.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = { ALL: bookings.length, PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0 };
  bookings.forEach((b) => { if (counts[b.status as keyof typeof counts] !== undefined) counts[b.status as keyof typeof counts]++; });

  if (authLoading || loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-sm text-slate-500">Loading bookings...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30">
          {toast}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-900">Bookings</h2>
        <p className="text-sm text-slate-500 mt-1">{filtered.length} of {bookings.length} total bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pending', count: counts.PENDING, color: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'Confirmed', count: counts.CONFIRMED, color: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'Completed', count: counts.COMPLETED, color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Cancelled', count: counts.CANCELLED, color: 'bg-red-50 border-red-200 text-red-700' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-0.5 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customer, vehicle, booking ID..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === s ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'}`}>
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${filter === s ? 'bg-white/25 text-white' : 'bg-blue-50 text-blue-600'}`}>
                {counts[s as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Ref', 'Vehicle', 'Customer', 'Dates', 'Duration', 'Total', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((b) => (
              <tr key={b.id} className="hover:bg-blue-50/20 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-mono text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                    #{b.id.substring(0, 8).toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-800">{b.vehicleName}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-800">{b.customerName}</p>
                  <p className="text-xs text-slate-400">{b.customerEmail}</p>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                  <p>{formatDate(b.pickupDate)}</p>
                  <p className="text-slate-400">→ {formatDate(b.returnDate)}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{b.numberOfDays}d</td>
                <td className="px-4 py-3 font-bold text-blue-700">${b.totalAmount}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[b.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${b.status === 'CONFIRMED' ? 'bg-green-500' : b.status === 'PENDING' ? 'bg-amber-500 animate-pulse' : b.status === 'CANCELLED' ? 'bg-red-500' : 'bg-blue-500'}`} />
                    {b.status.charAt(0) + b.status.slice(1).toLowerCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {b.status === 'PENDING' && (
                      <button onClick={() => updateStatus(b.id, 'CONFIRMED')} disabled={updatingId === b.id}
                        className="rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50 transition whitespace-nowrap">
                        Confirm
                      </button>
                    )}
                    {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                      <button onClick={() => updateStatus(b.id, 'CANCELLED')} disabled={updatingId === b.id}
                        className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50 transition">
                        Cancel
                      </button>
                    )}
                    {b.status === 'CONFIRMED' && (
                      <button onClick={() => updateStatus(b.id, 'COMPLETED')} disabled={updatingId === b.id}
                        className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50 transition">
                        Complete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400 text-sm">No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}