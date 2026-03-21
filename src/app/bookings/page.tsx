'use client';

import { useState } from 'react';
import Link from 'next/link';
import BookingList from '@/components/BookingList';
import BookingFilters from '@/components/BookingFilters';
import { BookingResponse } from '@/types/booking';

export default function BookingsPage() {
  const [filteredBookings, setFilteredBookings] = useState<BookingResponse[] | null>(null);

  const handleFilter = (bookings: BookingResponse[]) => {
    setFilteredBookings(bookings);
  };

  const handleReset = () => {
    setFilteredBookings(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            All Bookings
          </h1>
          <Link
            href="/booking"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            + Create New Booking
          </Link>
        </div>

        <BookingFilters onFilter={handleFilter} onReset={handleReset} />

        <div className="bg-white rounded-lg shadow-md p-6">
          <BookingList filteredBookings={filteredBookings} />
        </div>
      </div>
    </main>
  );
}
