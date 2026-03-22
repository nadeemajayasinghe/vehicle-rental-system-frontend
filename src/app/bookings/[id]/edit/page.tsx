'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { vehicleService, VehicleResponse } from '@/services/vehicleService';
import { bookingService, BookingResponse } from '@/services/bookingService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BookingEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  
  // Use React.use() to unwrap the params promise (Next.js 15+ requirement for dynamic routes)
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;
  
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Status State
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push(`/login?redirect=/bookings/${bookingId}/edit`);
      return;
    }

    if (user && bookingId) {
      loadBookingDetails();
    }
  }, [user, isAuthLoading, router, bookingId]);

  const loadBookingDetails = async () => {
    try {
      setIsLoading(true);
      const bookingData = await bookingService.getBookingById(bookingId);
      
      // Verify ownership
      if (bookingData.customerEmail !== user?.email) {
        setError('You do not have permission to view this booking.');
        setIsLoading(false);
        return;
      }

      setBooking(bookingData);
      setPickupDate(bookingData.pickupDate);
      setReturnDate(bookingData.returnDate);
      setPickupLocation(bookingData.pickupLocation);
      setReturnLocation(bookingData.returnLocation);
      setSpecialRequests(bookingData.specialRequests || '');

      // Load vehicle data for pricing
      const vehicleData = await vehicleService.getVehicleById(bookingData.vehicleId);
      setVehicle(vehicleData);

    } catch (err) {
      setError('Failed to load booking details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckAvailability = async () => {
    if (!booking || !pickupDate || !returnDate) return;
    
    // If dates haven't changed, no need to check
    if (pickupDate === booking.pickupDate && returnDate === booking.returnDate) {
      setIsAvailable(true);
      return;
    }

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
      const available = await bookingService.checkAvailability(booking.vehicleId, pickupDate, returnDate);
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
    if (!user || !booking || !vehicle || isAvailable !== true) return;

    try {
      setIsSubmitting(true);
      await bookingService.updateBooking(booking.id, {
        vehicleId: booking.vehicleId,
        vehicleName: booking.vehicleName,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        licenseNumber: booking.licenseNumber,
        pickupDate,
        returnDate,
        pickupLocation,
        returnLocation,
        pricePerDay: booking.pricePerDay,
        specialRequests,
        status: booking.status
      });
      
      alert('Booking updated successfully!');
      router.push('/profile');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;

    try {
      setIsCancelling(true);
      await bookingService.updateBookingStatus(booking.id, 'CANCELLED');
      alert('Booking has been cancelled.');
      router.push('/profile');
    } catch (err) {
      console.error('Cancellation failed:', err);
      alert('Failed to cancel booking.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Reset availability when dates change (only if they differ from original)
  useEffect(() => {
    if (booking) {
      if (pickupDate !== booking.pickupDate || returnDate !== booking.returnDate) {
        setIsAvailable(null);
      } else {
        setIsAvailable(true);
      }
    }
  }, [pickupDate, returnDate, booking]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-3 shadow-sm">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span className="text-sm font-medium text-slate-600">Loading booking...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !booking || !vehicle) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-950">Cannot Proceed</h1>
          <p className="text-slate-500">{error || 'Booking information is missing.'}</p>
          <button onClick={() => router.push('/profile')} className="mt-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700">
            Back to Profile
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Only allow editing if status is PENDING
  const canEdit = booking.status === 'PENDING';
  const days = calculateDays();
  const totalAmount = days * vehicle.dailyRate;
  const fallbackImage = `https://placehold.co/800x500/1e293b/3b82f6?text=${encodeURIComponent(vehicle.make + ' ' + vehicle.model)}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">Manage Booking</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                {booking.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500">Reference: #{booking.id.substring(0, 8).toUpperCase()}</p>
          </div>
        </div>

        {!canEdit && (
          <div className="mb-8 rounded-xl bg-blue-50 p-4 border border-blue-100 text-sm text-blue-800 flex gap-3">
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            This booking cannot be modified because its status is {booking.status}.
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">
          {/* Booking Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Trip Details */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">Trip Details</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Pick-up Date *</label>
                    <input 
                      type="date" 
                      required 
                      disabled={!canEdit}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50 disabled:text-slate-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Return Date *</label>
                    <input 
                      type="date" 
                      required 
                      disabled={!canEdit}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                      className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50 disabled:text-slate-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Pick-up Location *</label>
                    <input 
                      type="text" 
                      required 
                      disabled={!canEdit}
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50 disabled:text-slate-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Return Location *</label>
                    <input 
                      type="text" 
                      required 
                      disabled={!canEdit}
                      value={returnLocation}
                      onChange={(e) => setReturnLocation(e.target.value)}
                      className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50 disabled:text-slate-500" 
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
                    disabled={!canEdit}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none disabled:bg-slate-50 disabled:text-slate-500" 
                  />
                </div>
              </div>

              {canEdit && (
                <>
                  <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleCheckAvailability}
                      disabled={!pickupDate || !returnDate || isChecking || (pickupDate === booking.pickupDate && returnDate === booking.returnDate)}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm transition hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isChecking ? 'Checking...' : 'Verify Dates'}
                    </button>
                    
                    {isAvailable === true && (
                      <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Dates confirmed
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 pt-4">
                    <button
                      type="submit"
                      disabled={isAvailable !== true || isSubmitting}
                      className="w-full rounded-xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Updating...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isCancelling}
                      className="w-full rounded-xl border-2 border-red-100 bg-red-50 text-red-600 py-4 text-base font-bold shadow-sm transition hover:bg-red-100 disabled:opacity-50"
                    >
                      {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Booking Summary</h2>
            
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
            
            {!canEdit && (
              <div className="mt-8 rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-sm text-slate-600 font-medium">Need to make changes?</p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Please contact our support team to modify or cancel confirmed or completed bookings.
                </p>
                <a href="tel:+1234567890" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  Call Support
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
