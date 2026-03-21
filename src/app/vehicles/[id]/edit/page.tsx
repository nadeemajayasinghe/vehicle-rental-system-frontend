'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { vehicleService, VehicleRequest, VehicleResponse } from '@/services/vehicleService';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function EditVehiclePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
  const [form, setForm] = useState<VehicleRequest | null>(null);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await vehicleService.getVehicleById(id);
        setVehicle(data);
        setForm({
          make: data.make,
          brand: data.brand,
          model: data.model,
          year: data.year,
          plateNumber: data.plateNumber,
          dailyRate: data.dailyRate,
          mileage: data.mileage,
          color: data.color,
          imageUrl: data.imageUrl || '',
          description: data.description || '',
        });
      } catch {
        setError('Failed to load vehicle.');
      } finally {
        setLoadingVehicle(false);
      }
    };
    void load();
  }, [id]);

  if (!authLoading && (!user || !isAdmin)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-950">Access Denied</h1>
          <p className="text-slate-500">You must be an admin to edit vehicles.</p>
          <Link href="/vehicles" className="mt-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            Back to Fleet
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loadingVehicle) {
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

  if (!form || !vehicle) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-950">Vehicle Not Found</h1>
          <Link href="/vehicles" className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            Back to Fleet
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => prev ? ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }) : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setError('');
    if (!form.make || !form.brand || !form.model || !form.plateNumber || !form.color) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      setSubmitting(true);
      await vehicleService.updateVehicle(id, form);
      setSuccess(true);
      setTimeout(() => router.push(`/vehicles/${id}`), 1500);
    } catch {
      setError('Failed to update vehicle. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Page header */}
      <div className="bg-slate-950 text-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href="/vehicles" className="hover:text-white">Vehicles</Link>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <Link href={`/vehicles/${id}`} className="hover:text-white">{vehicle.make} {vehicle.model}</Link>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span className="text-white">Edit</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight">Edit Vehicle</h1>
          <p className="mt-2 text-slate-400">Update the details for {vehicle.make} {vehicle.model} ({vehicle.plateNumber})</p>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Vehicle updated successfully! Redirecting...</span>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">Basic Information</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              <EditField label="Make *" name="make" value={form.make} onChange={handleChange} placeholder="e.g. Toyota" />
              <EditField label="Brand *" name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Toyota" />
              <EditField label="Model *" name="model" value={form.model} onChange={handleChange} placeholder="e.g. Camry" />
              <EditField label="Year *" name="year" type="number" value={form.year} onChange={handleChange} min={1990} max={new Date().getFullYear() + 1} />
              <EditField label="Color *" name="color" value={form.color} onChange={handleChange} placeholder="e.g. Pearl White" />
              <EditField label="Plate Number *" name="plateNumber" value={form.plateNumber} onChange={handleChange} placeholder="e.g. CAR-1234" />
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">Pricing & Condition</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <EditField label="Daily Rate ($) *" name="dailyRate" type="number" value={form.dailyRate} onChange={handleChange} min={0} step={0.01} />
              <EditField label="Mileage (km) *" name="mileage" type="number" value={form.mileage} onChange={handleChange} min={0} />
            </div>
          </div>

          {/* Media */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">Media & Description</h2>
            <div className="space-y-5">
              <EditField label="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://example.com/car.jpg" />
              {form.imageUrl && (
                <div className="overflow-hidden rounded-xl border border-slate-200 h-48">
                  <img src={form.imageUrl} alt="Preview" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe this vehicle..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href={`/vehicles/${id}`}
              className="flex-1 flex items-center justify-center rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || success}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

function EditField({
  label, name, value, onChange, type = 'text', placeholder, min, max, step,
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}
