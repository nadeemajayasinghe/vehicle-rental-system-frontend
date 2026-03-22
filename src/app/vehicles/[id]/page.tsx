'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { vehicleService, VehicleResponse } from '@/services/vehicleService';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await vehicleService.getVehicleById(id);
        setVehicle(data);
      } catch {
        setError('Vehicle not found or failed to load.');
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [id]);

  const handleDelete = async () => {
    if (!vehicle) return;
    if (!confirm(`Delete "${vehicle.make} ${vehicle.model}"? This cannot be undone.`)) return;
    try {
      setDeleting(true);
      await vehicleService.deleteVehicle(vehicle.id);
      router.push('/vehicles');
    } catch {
      alert('Failed to delete vehicle.');
      setDeleting(false);
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-3 shadow-sm">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span className="text-sm font-medium text-slate-600">Loading vehicle...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-950">Vehicle Not Found</h1>
          <p className="text-slate-500">{error}</p>
          <Link href="/vehicles" className="mt-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700">
            Back to Fleet
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const fallbackImage = `https://placehold.co/800x500/1e293b/3b82f6?text=${encodeURIComponent(vehicle.make + ' ' + vehicle.model)}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-950">Home</Link>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <Link href="/vehicles" className="hover:text-slate-950">Vehicles</Link>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span className="font-medium text-slate-950">{vehicle.make} {vehicle.model}</span>
          </nav>
        </div>
      </div>

      <main className="flex-1 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          {/* Left */}
          <div>
            <div className="overflow-hidden rounded-2xl bg-slate-200 shadow-xl">
              <img
                src={vehicle.imageUrl || fallbackImage}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="h-96 w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
              />
            </div>

            {vehicle.description && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Description</h2>
                <p className="mt-3 leading-7 text-slate-600">{vehicle.description}</p>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Specifications</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { label: 'Make', value: vehicle.make },
                  { label: 'Brand', value: vehicle.brand },
                  { label: 'Model', value: vehicle.model },
                  { label: 'Year', value: vehicle.year.toString() },
                  { label: 'Color', value: vehicle.color },
                  { label: 'Plate', value: vehicle.plateNumber },
                  { label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} km` },
                  { label: 'Daily Rate', value: `$${vehicle.dailyRate}` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 font-semibold text-slate-950">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right – sticky booking panel */}
          <div className="lg:sticky lg:top-28">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{vehicle.brand}</span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{vehicle.make} {vehicle.model}</h1>
              <p className="mt-1 text-slate-500">{vehicle.year} · {vehicle.color} · {vehicle.plateNumber}</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-bold text-slate-950">${vehicle.dailyRate}</span>
                <span className="text-slate-500">/ day</span>
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-sm text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Available for booking
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6 space-y-3">
                {user ? (
                  <Link
                    href={`/bookings/create?vehicleId=${vehicle.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Book This Vehicle
                  </Link>
                ) : (
                  <Link href="/login" className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500">
                    Sign In to Book
                  </Link>
                )}
                <Link href="/vehicles" className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  ← Back to Fleet
                </Link>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { icon: '🛡️', title: 'Fully Insured', desc: 'Comprehensive coverage' },
                { icon: '⚡', title: 'Instant Booking', desc: 'Confirm in 2 minutes' },
                { icon: '📞', title: '24/7 Support', desc: 'Always here for you' },
                { icon: '💰', title: 'No Hidden Fees', desc: 'Transparent pricing' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <span className="text-2xl">{icon}</span>
                  <p className="mt-2 text-sm font-semibold text-slate-950">{title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
                </div>
              ))}
            </div>

            {isAdmin && (
              <div className="mt-4 flex gap-3">
                <Link
                  href={`/vehicles/${vehicle.id}/edit`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                >
                  {deleting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" /> : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
