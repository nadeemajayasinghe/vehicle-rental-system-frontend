'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import BookingForm from '@/components/BookingForm';
import { bookingService } from '@/services/bookingService';
import { BookingResponse } from '@/types/booking';

export default function EditBookingPage() {
  const router = useRouter();
  const params = useParams();
  
  // Handle params.id which could be string or string array
  const bookingId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      console.log('Raw params:', params);
      console.log('Booking ID:', bookingId);
      
      if (!bookingId) {
        setError('Booking ID is missing from URL');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await bookingService.getBookingById(bookingId);
        console.log('Fetched booking data:', data);
        setBooking(data);
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to fetch booking details. Please ensure your backend is running on http://localhost:8081';
        setError(errorMessage);
        console.error('Error fetching booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleUpdateSuccess = () => {
    // Redirect to bookings list after successful update
    setTimeout(() => {
      router.push('/bookings');
    }, 1500);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading booking...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            <strong>Error:</strong> {error || 'Booking not found'}
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded mb-4">
            <strong>Troubleshooting:</strong>
            <ul className="list-disc ml-5 mt-2">
              <li>Ensure your Spring Boot backend is running on http://localhost:8081</li>
              <li>Check if booking ID {bookingId} exists in your database</li>
              <li>Check browser console (F12) for detailed error messages</li>
            </ul>
          </div>
          <Link
            href="/bookings"
            className="inline-block px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Bookings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Edit Booking
          </h1>
          <Link
            href="/bookings"
            className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-semibold"
          >
            Back to Bookings
          </Link>
        </div>
        
        <BookingForm 
          bookingId={bookingId} 
          initialData={booking}
          onSuccess={handleUpdateSuccess} 
        />
      </div>
    </main>
  );
}
