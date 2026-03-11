'use client';

import { useState } from 'react';
import BookingForm from '@/components/BookingForm';
import BookingList from '@/components/BookingList';

export default function BookingPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBookingSuccess = () => {
    // Trigger a refresh of the booking list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Vehicle Rental Booking System
        </h1>
        
        <div className="mb-8">
          <BookingForm onSuccess={handleBookingSuccess} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <BookingList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </main>
  );
}
