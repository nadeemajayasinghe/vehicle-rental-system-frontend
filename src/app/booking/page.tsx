'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BookingForm from '@/components/BookingForm';
import AvailabilityChecker from '@/components/AvailabilityChecker';

export default function BookingPage() {
  const router = useRouter();

  const handleBookingSuccess = () => {
    // Redirect to bookings list page after successful creation
    setTimeout(() => {
      router.push('/bookings');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Create New Booking
          </h1>
          <Link
            href="/bookings"
            className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-semibold"
          >
            View All Bookings
          </Link>
        </div>

        {/* Availability Checker */}
        <div className="mb-8">
          <AvailabilityChecker />
        </div>
        
        {/* Booking Form */}
        <BookingForm onSuccess={handleBookingSuccess} />
      </div>
    </main>
  );
}
