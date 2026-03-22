'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { customerService } from '@/services/customerService';
import { bookingService, BookingResponse } from '@/services/bookingService';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isLoading: authLoading, updateUser, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        contact: user.contact,
        address: user.address,
      });
      loadBookings(user.email);
    }
  }, [user]);

  const loadBookings = async (email: string) => {
    try {
      setBookingsLoading(true);
      const data = await bookingService.getBookingsByCustomerEmail(email);
      const sortedData = data.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setBookings(sortedData);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-200"><span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>Confirmed</span>;
      case 'PENDING':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>Pending</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200"><span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>Cancelled</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200"><span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>Completed</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await customerService.updateCustomer(user.id, formData);
      updateUser(updatedUser);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      setError(message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    setIsLoading(true);
    setError('');

    try {
      await customerService.deleteCustomer(user.id);
      logout();
      router.push('/login');
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      setError(message || 'Failed to delete account');
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-blue-600">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Account
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your personal information, account settings, and bookings.
            </p>
          </div>

          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Bookings
            </button>
          </div>

          {error && activeTab === 'profile' && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {activeTab === 'profile' ? (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Personal Information
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Your account details and contact information
                    </p>
                  </div>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="px-6 py-6">
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address (Cannot be changed)
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Number
                        </label>
                        <input
                          id="contact"
                          name="contact"
                          type="tel"
                          required
                          value={formData.contact}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                        />
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              name: user.name,
                              contact: user.contact,
                              address: user.address,
                            });
                            setError('');
                            setSuccess('');
                          }}
                          className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg border border-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <dl className="space-y-5">
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <dt className="text-sm font-medium text-gray-600">
                          Full Name
                        </dt>
                        <dd className="text-sm text-gray-900 font-medium">
                          {user.name}
                        </dd>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <dt className="text-sm font-medium text-gray-600">
                          Email Address
                        </dt>
                        <dd className="text-sm text-gray-900 font-medium">
                          {user.email}
                        </dd>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <dt className="text-sm font-medium text-gray-600">
                          Contact Number
                        </dt>
                        <dd className="text-sm text-gray-900 font-medium">
                          {user.contact}
                        </dd>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <dt className="text-sm font-medium text-gray-600">
                          Member Type
                        </dt>
                        <dd className="text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.role}
                          </span>
                        </dd>
                      </div>
                      <div className="flex justify-between py-3">
                        <dt className="text-sm font-medium text-gray-600">
                          Address
                        </dt>
                        <dd className="text-sm text-gray-900 font-medium text-right max-w-xs">
                          {user.address}
                        </dd>
                      </div>
                    </dl>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden mt-6">
                <div className="px-6 py-5 bg-red-50">
                  <h3 className="text-lg font-semibold text-red-900">
                    Danger Zone
                  </h3>
                  <div className="mt-4 space-y-4">
                    <p className="text-sm text-red-700">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                  </div>
                  <div className="mt-4">
                    {!showDeleteConfirm ? (
                      <button 
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 text-sm font-medium text-red-700 hover:text-red-800 hover:bg-red-100 border border-red-300 rounded-lg transition-colors"
                      >
                        Delete Account
                      </button>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <p className="text-sm font-medium text-red-900">
                          Are you sure?
                        </p>
                        <button
                          onClick={handleDelete}
                          disabled={isLoading}
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-lg transition-colors disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {bookingsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                  <p className="text-gray-500 mb-4">You have no bookings yet.</p>
                  <Link href="/vehicles" className="text-blue-600 font-medium hover:underline">
                    Browse Vehicles to Book
                  </Link>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center transition-all hover:shadow-md">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{booking.vehicleName}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-gray-500 mb-4">Ref: #{booking.id.substring(0, 8).toUpperCase()}</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Pick-up:</span> {formatDate(booking.pickupDate)}
                        </div>
                        <div>
                          <span className="font-medium">Return:</span> {formatDate(booking.returnDate)}
                        </div>
                        <div>
                          <span className="font-medium">Total:</span> ${booking.totalAmount}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
                      {booking.status === 'PENDING' && (
                        <Link 
                          href={`/bookings/${booking.id}/edit`}
                          className="px-4 py-2 text-sm font-medium text-center text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                        >
                          Edit / Cancel Booking
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
