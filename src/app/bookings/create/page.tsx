'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { vehicleService, VehicleResponse } from '@/services/vehicleService';
import { bookingService } from '@/services/bookingService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get('vehicleId');
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Status State
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push(`/login?redirect=/bookings/create${vehicleId ? `?vehicleId=${vehicleId}` : ''}`);
      return;
    }

    if (user && vehicleId) {
      loadVehicle();
    } else if (!vehicleId) {
      setError('No vehicle selected for booking.');
      setIsLoading(false);
    }
  }, [user, isAuthLoading, router, vehicleId]);

  const loadVehicle = async () => {
    try {
      if (vehicleId) {
        const data = await vehicleService.getVehicleById(vehicleId);
        setVehicle(data);
      }
    } catch (err) {
      setError('Failed to load vehicle details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckAvailability = async () => {
    if (!vehicleId || !pickupDate || !returnDate) return;
    
    // Validate dates
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      alert('Pickup date cannot be in the past');
      return;
    }
    if (end < start) {
      alert('Return date must be after pickup date');
      return;
    }

    try {
      setIsChecking(true);
      const available = await bookingService.checkAvailability(vehicleId, pickupDate, returnDate);
      setIsAvailable(available);
      if (!available) {
        alert('Vehicle is not available for the selected dates. Please try different dates.');
      }
    } catch (err) {
      console.error('Availability check failed:', err);
      alert('Failed to check availability. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays; // Minimum 1 day
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !vehicle || isAvailable !== true) return;

    try {
      setIsSubmitting(true);
      await bookingService.createBooking({
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.make} ${vehicle.model}`,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.contact,
        licenseNumber,
        pickupDate,
        returnDate,
        pickupLocation,
        returnLocation,
        pricePerDay: vehicle.dailyRate,
        specialRequests,
        status: 'PENDING'
      });
      
      router.push('/bookings');
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Failed to complete booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset availability when dates change
  useEffect(() => {
    setIsAvailable(null);
  }, [pickupDate, returnDate]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-3 shadow-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm font-medium text-slate-600">Preparing booking...</span>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-4 min-h-[60vh]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-950">Cannot Proceed</h1>
        <p className="text-slate-500">{error || 'Vehicle information is missing.'}</p>
        <button onClick={() => router.push('/vehicles')} className="mt-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700">
          Browse Vehicles
        </button>
      </div>
    );
  }

  const days = calculateDays();
  const totalAmount = days * vehicle.dailyRate;
  const fallbackImage = `https://placehold.co/800x500/1e293b/3b82f6?text=${encodeURIComponent(vehicle.make + ' ' + vehicle.model)}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Complete Your Booking</h1>
        <p className="mt-2 text-sm text-slate-500">Provide your details to reserve the {vehicle.make} {vehicle.model}.</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">
        {/* Booking Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Driver Details */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">Driver Details</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Full Name</label>
                  <input type="text" value={user?.name || ''} disabled className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email Address</label>
                  <input type="email" value={user?.email || ''} disabled className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                  <input type="tel" value={user?.contact || ''} disabled className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">License Number *</label>
                  <input 
                    type="text" 
                    required 
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="Enter driver's license"
                    className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600" 
                  />
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">Trip Details</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Pick-up Date *</label>
                  <input 
                    type="date" 
                    required 
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Return Date *</label>
                  <input 
                    type="date" 
                    required 
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Pick-up Location *</label>
                  <input 
                    type="text" 
                    required 
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="City, Airport, or Address"
                    className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Return Location *</label>
                  <input 
                    type="text" 
                    required 
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    placeholder="City, Airport, or Address"
                    className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600" 
                  />
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">Additional Information</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700">Special Requests (Optional)</label>
                <textarea 
                  rows={3} 
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="E.g., Child seat required, extra luggage space needed"
                  className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none" 
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center border-t border-slate-100">
              <button
                type="button"
                onClick={handleCheckAvailability}
                disabled={!pickupDate || !returnDate || isChecking}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm transition hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChecking ? 'Checking...' : 'Check Availability'}
              </button>
              
              {isAvailable === true && (
                <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Vehicle is available!
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isAvailable !== true || isSubmitting}
              className="w-full rounded-xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Confirming Booking...' : 'Confirm & Book'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>
          
          <div className="flex gap-4 mb-6">
            <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
              <img src={vehicle.imageUrl || fallbackImage} alt={vehicle.make} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{vehicle.make} {vehicle.model}</p>
              <p className="text-xs text-slate-500">{vehicle.year} · {vehicle.color}</p>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Daily Rate</span>
              <span className="font-semibold text-slate-900">${vehicle.dailyRate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Duration</span>
              <span className="font-semibold text-slate-900">{days} Day{days !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="border-t border-slate-100 pt-4 flex justify-between">
              <span className="font-bold text-slate-900">Total Due</span>
              <span className="text-2xl font-bold text-slate-900">${totalAmount}</span>
            </div>
          </div>
          
          <div className="mt-8 rounded-xl bg-slate-50 p-4 border border-slate-100">
            <div className="flex gap-3">
              <svg className="h-5 w-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-xs text-slate-500 leading-relaxed">
                By confirming this booking, you agree to our Terms of Service and Cancellation Policy. Payment will be processed upon vehicle pickup.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingCreatePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={
          <div className="flex flex-1 items-center justify-center min-h-[60vh]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        }>
          <BookingForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
