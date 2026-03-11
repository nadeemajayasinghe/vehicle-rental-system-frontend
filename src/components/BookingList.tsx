'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookingResponse } from '@/types/booking';
import { bookingService } from '@/services/bookingService';

interface BookingListProps {
  refreshTrigger?: number;
  filteredBookings?: BookingResponse[] | null;
}

export default function BookingList({ refreshTrigger, filteredBookings }: BookingListProps) {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filteredBookings === null || filteredBookings === undefined) {
      fetchBookings();
    } else {
      setBookings(filteredBookings);
      setLoading(false);
    }
  }, [refreshTrigger, filteredBookings]);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to update the status to ${newStatus}?`)) {
      return;
    }

    try {
      setUpdatingStatus(bookingId);
      const updatedBooking = await bookingService.updateBookingStatus(bookingId, newStatus);
      
      // Update the local state
      setBookings(bookings.map((b) => (b.id === bookingId ? updatedBooking : b)));
      
      alert('Status updated successfully!');
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await bookingService.deleteBooking(id);
      setBookings(bookings.filter((b) => b.id !== id));
    } catch (err) {
      alert('Failed to delete booking');
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
        <button
          onClick={fetchBookings}
          className="ml-4 text-sm underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No bookings found. Create your first booking!
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Bookings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Vehicle</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">License</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Dates</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Locations</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Price/Day</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{booking.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="font-medium">{booking.vehicleName}</div>
                  <div className="text-xs text-gray-500">{booking.vehicleId}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{booking.customerName}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="text-xs">{booking.customerEmail}</div>
                  <div className="text-xs text-gray-500">{booking.customerPhone}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{booking.licenseNumber}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="text-xs">
                    <span className="font-medium">From:</span> {formatDate(booking.pickupDate)}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">To:</span> {formatDate(booking.returnDate)}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="text-xs">
                    <span className="font-medium">Pickup:</span> {booking.pickupLocation}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Return:</span> {booking.returnLocation}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">${booking.pricePerDay.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm">
                  {updatingStatus === booking.id ? (
                    <span className="text-xs text-gray-500">Updating...</span>
                  ) : (
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${getStatusColor(booking.status)}`}
                      disabled={updatingStatus === booking.id}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  )}
                </td>
                <td className="px-4 py-3 text-sm space-x-2">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View
                  </button>
                  <Link
                    href={`/booking/${booking.id}`}
                    className="text-green-600 hover:text-green-800 font-medium"
                    onClick={() => console.log('Navigating to edit booking with ID:', booking.id)}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing booking details */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="font-semibold">{selectedBooking.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-lg mb-2">Vehicle Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Vehicle ID</p>
                      <p className="font-medium">{selectedBooking.vehicleId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vehicle Name</p>
                      <p className="font-medium">{selectedBooking.vehicleName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price Per Day</p>
                      <p className="font-medium">${selectedBooking.pricePerDay.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-lg mb-2">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedBooking.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedBooking.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedBooking.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">License Number</p>
                      <p className="font-medium">{selectedBooking.licenseNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-lg mb-2">Booking Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Pickup Date</p>
                      <p className="font-medium">{formatDate(selectedBooking.pickupDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Return Date</p>
                      <p className="font-medium">{formatDate(selectedBooking.returnDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pickup Location</p>
                      <p className="font-medium">{selectedBooking.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Return Location</p>
                      <p className="font-medium">{selectedBooking.returnLocation}</p>
                    </div>
                  </div>
                </div>

                {selectedBooking.specialRequests && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-lg mb-2">Special Requests</h4>
                    <p className="text-gray-700">{selectedBooking.specialRequests}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
