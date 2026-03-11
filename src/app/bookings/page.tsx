'use client';

import Link from 'next/link';
import BookingList from '@/components/BookingList';

export default function BookingsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            All Bookings
          </h1>
          <Link
            href="/booking"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            + Create New Booking
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <BookingList />
        </div>
      </div>
    </main>
  );
}
