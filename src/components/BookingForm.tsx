'use client';

import { useState, useEffect } from 'react';
import { BookingRequest, BookingResponse } from '@/types/booking';
import { bookingService } from '@/services/bookingService';

interface BookingFormProps {
  onSuccess?: () => void;
  bookingId?: string;
  initialData?: BookingResponse;
}

export default function BookingForm({ onSuccess, bookingId, initialData }: BookingFormProps) {
  const isEditMode = !!bookingId;
  const [formData, setFormData] = useState<BookingRequest>({
    vehicleId: '',
    vehicleName: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    licenseNumber: '',
    pickupDate: '',
    returnDate: '',
    pickupLocation: '',
    returnLocation: '',
    pricePerDay: 0,
    status: 'PENDING',
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        vehicleId: initialData.vehicleId,
        vehicleName: initialData.vehicleName,
        customerName: initialData.customerName,
        customerEmail: initialData.customerEmail,
        customerPhone: initialData.customerPhone,
        licenseNumber: initialData.licenseNumber,
        pickupDate: initialData.pickupDate,
        returnDate: initialData.returnDate,
        pickupLocation: initialData.pickupLocation,
        returnLocation: initialData.returnLocation,
        pricePerDay: initialData.pricePerDay,
        status: initialData.status,
        specialRequests: initialData.specialRequests || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pricePerDay' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (isEditMode && bookingId) {
        await bookingService.updateBooking(bookingId, formData);
        setSuccess(true);
      } else {
        await bookingService.createBooking(formData);
        setSuccess(true);
        setFormData({
          vehicleId: '',
          vehicleName: '',
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          licenseNumber: '',
          pickupDate: '',
          returnDate: '',
          pickupLocation: '',
          returnLocation: '',
          pricePerDay: 0,
          status: 'PENDING',
          specialRequests: '',
        });
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(isEditMode ? 'Failed to update booking. Please try again.' : 'Failed to create booking. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode ? 'Edit Booking' : 'Create New Booking'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {isEditMode ? 'Booking updated successfully!' : 'Booking created successfully!'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle Information */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Vehicle Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="vehicleId"
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., VEH-001"
              />
            </div>

            <div>
              <label htmlFor="vehicleName" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="vehicleName"
                name="vehicleName"
                value={formData.vehicleName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Toyota Camry"
              />
            </div>

            <div>
              <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700 mb-1">
                Price Per Day ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="pricePerDay"
                name="pricePerDay"
                value={formData.pricePerDay || ''}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 50.00"
              />
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., John Doe"
              />
            </div>

            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Customer Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., john@example.com"
              />
            </div>

            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Customer Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 0771234567"
              />
            </div>

            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                License Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., LIC-123456"
              />
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Booking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="pickupDate"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
                Return Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="pickupLocation"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Colombo"
              />
            </div>

            <div>
              <label htmlFor="returnLocation" className="block text-sm font-medium text-gray-700 mb-1">
                Return Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="returnLocation"
                name="returnLocation"
                value={formData.returnLocation}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Kandy"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Need child seat"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {loading ? (isEditMode ? 'Updating Booking...' : 'Creating Booking...') : (isEditMode ? 'Update Booking' : 'Create Booking')}
        </button>
      </form>
    </div>
  );
}
