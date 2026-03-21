'use client';

import React, { useState } from 'react';
import { bookingService } from '@/services/bookingService';

const AvailabilityChecker: React.FC = () => {
  const [vehicleId, setVehicleId] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicleId.trim() || !pickupDate || !returnDate) {
      setError('Please fill in all fields');
      return;
    }

    if (new Date(pickupDate) >= new Date(returnDate)) {
      setError('Return date must be after pickup date');
      return;
    }

    setChecking(true);
    setError(null);
    setResult(null);

    try {
      const isAvailable = await bookingService.checkVehicleAvailability(
        vehicleId,
        pickupDate,
        returnDate
      );
      setResult(isAvailable);
    } catch (err) {
      console.error('Availability check error:', err);
      setError('Failed to check availability. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const handleReset = () => {
    setVehicleId('');
    setPickupDate('');
    setReturnDate('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Check Vehicle Availability</h2>
      
      <form onSubmit={handleCheck} className="space-y-4">
        <div>
          <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-800 mb-1">
            Vehicle ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="vehicleId"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            placeholder="Enter vehicle ID..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-800 mb-1">
              Pickup Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="pickupDate"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-600"
            />
          </div>

          <div>
            <label htmlFor="returnDate" className="block text-sm font-medium text-gray-800 mb-1">
              Return Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="returnDate"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={pickupDate || new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-600"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={checking}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {checking ? 'Checking...' : 'Check Availability'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Result Display */}
        {result !== null && (
          <div
            className={`p-4 rounded-md border ${
              result
                ? 'bg-green-50 border-green-300 text-green-800'
                : 'bg-red-50 border-red-300 text-red-800'
            }`}
          >
            <div className="flex items-center">
              {result ? (
                <>
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-800">Vehicle is Available!</p>
                    <p className="text-sm">
                      This vehicle is available for the selected dates. You can proceed with the booking.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-800">Vehicle is Not Available</p>
                    <p className="text-sm">
                      This vehicle is already booked for the selected dates. Please choose different dates or another vehicle.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default AvailabilityChecker;
