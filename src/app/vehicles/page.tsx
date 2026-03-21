'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { vehicleService, VehicleResponse } from '@/services/vehicleService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function VehiclesPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 9;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const loadVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await vehicleService.getAllVehicles(debouncedSearch, page, pageSize);
      setVehicles(data.dataList ?? []);
      setTotalElements(data.dataCount ?? 0);
      setTotalPages(Math.ceil((data.dataCount ?? 0) / pageSize));
    } catch {
      setError('Failed to load vehicles. Please check the server connection.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    void loadVehicles();
  }, [loadVehicles]);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Page header */}
        <div className="bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">Our Fleet</p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Browse Vehicles
                </h1>
                <p className="mt-3 text-slate-400">
                  {totalElements > 0 ? `${totalElements} vehicles available` : 'Explore our premium fleet'}
                </p>
              </div>
              {isAdmin && (
                <Link
                  href="/vehicles/create"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Vehicle
                </Link>
              )}
            </div>

            {/* Search bar */}
            <div className="mt-8 relative max-w-lg">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by make, model, brand…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full rounded-full border border-white/15 bg-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-400 backdrop-blur transition focus:border-blue-500 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText('')}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Loading */}
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white overflow-hidden">
                  <div className="h-52 bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                    <div className="h-3 bg-slate-200 rounded-full w-1/2" />
                    <div className="h-3 bg-slate-200 rounded-full w-2/3" />
                    <div className="h-10 bg-slate-200 rounded-xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-950">Failed to load vehicles</h2>
              <p className="mt-2 text-sm text-slate-500">{error}</p>
              <button
                onClick={() => void loadVehicles()}
                className="mt-6 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && vehicles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-950">No vehicles found</h2>
              <p className="mt-2 text-sm text-slate-500">
                {debouncedSearch ? `No results for "${debouncedSearch}"` : 'No vehicles in the fleet yet.'}
              </p>
              {debouncedSearch && (
                <button
                  onClick={() => setSearchText('')}
                  className="mt-6 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Clear Search
                </button>
              )}
              {isAdmin && !debouncedSearch && (
                <Link
                  href="/vehicles/create"
                  className="mt-6 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Add First Vehicle
                </Link>
              )}
            </div>
          )}

          {/* Vehicle grid */}
          {!isLoading && !error && vehicles.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} isAdmin={isAdmin} onDelete={() => void loadVehicles()} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                        i === page
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function VehicleCard({
  vehicle,
  isAdmin,
  onDelete,
}: {
  vehicle: VehicleResponse;
  isAdmin: boolean;
  onDelete: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${vehicle.make} ${vehicle.model}"? This cannot be undone.`)) return;
    try {
      setDeleting(true);
      await vehicleService.deleteVehicle(vehicle.id);
      onDelete();
    } catch {
      alert('Failed to delete vehicle.');
    } finally {
      setDeleting(false);
    }
  };

  const fallbackImage = `https://placehold.co/600x400/1e293b/3b82f6?text=${encodeURIComponent(vehicle.make + ' ' + vehicle.model)}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={vehicle.imageUrl || fallbackImage}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        {/* Daily rate badge */}
        <div className="absolute bottom-3 left-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          ${vehicle.dailyRate}/day
        </div>
        {/* Color dot */}
        <div className="absolute right-3 top-3 rounded-full border border-white/30 bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          {vehicle.color}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">{vehicle.brand}</p>
          <h3 className="mt-1 text-lg font-bold text-slate-950">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{vehicle.year} · {vehicle.plateNumber}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-slate-50 px-3 py-2.5">
            <p className="text-xs text-slate-400">Mileage</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-950">{vehicle.mileage.toLocaleString()} km</p>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2.5">
            <p className="text-xs text-slate-400">Daily Rate</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-950">${vehicle.dailyRate}</p>
          </div>
        </div>

        {vehicle.description && (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">{vehicle.description}</p>
        )}

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <Link
            href={`/vehicles/${vehicle.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-950 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            View Details
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          {isAdmin && (
            <>
              <Link
                href={`/vehicles/${vehicle.id}/edit`}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                title="Edit"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                title="Delete"
              >
                {deleting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                ) : (
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
