'use client';

import React, { useState } from 'react';
import { BookingResponse } from '@/types/booking';

interface BookingFiltersProps {
  onFilter: (bookings: BookingResponse[]) => void;
  onReset: () => void;
}

const BookingFilters: React.FC<BookingFiltersProps> = ({ onFilter, onReset }) => {
  const [filterType, setFilterType] = useState<'email' | 'vehicleId' | 'status'>('email');
  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!filterValue.trim()) {
      setError('Please enter a filter value');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bookingService = (await import('@/services/bookingService')).bookingService;
      let results: BookingResponse[] = [];

      switch (filterType) {
        case 'email':
          results = await bookingService.getBookingsByEmail(filterValue);
          break;
        case 'vehicleId':
          results = await bookingService.getBookingsByVehicleId(filterValue);
          break;
        case 'status':
          results = await bookingService.getBookingsByStatus(filterValue);
          break;
      }

      onFilter(results);
      
      if (results.length === 0) {
        setError('No bookings found with the specified filter');
      }
    } catch (err) {
      console.error('Filter error:', err);
      setError('Failed to filter bookings. Please check your backend and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilterValue('');
    setError(null);
    onReset();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Filter Bookings</h2>
      
      <form onSubmit={handleFilter} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filter Type Selection */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter By
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'email' | 'vehicleId' | 'status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="email">Customer Email</option>
              <option value="vehicleId">Vehicle ID</option>
              <option value="status">Status</option>
            </select>
          </div>

          {/* Filter Value Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {filterType === 'email' && 'Email Address'}
              {filterType === 'vehicleId' && 'Vehicle ID'}
              {filterType === 'status' && 'Status'}
            </label>
            
            {filterType === 'status' ? (
              <select
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select status...</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            ) : (
              <input
                type="text"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder={
                  filterType === 'email' 
                    ? 'Enter customer email...' 
                    : 'Enter vehicle ID...'
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Filtering...' : 'Apply Filter'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>

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

export default BookingFilters;
