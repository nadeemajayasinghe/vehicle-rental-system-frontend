import { Booking, BookingRequest, BookingResponse } from '@/types/booking';

const API_BASE_URL = 'http://localhost:8081/api/bookings';

export const bookingService = {
  // Get all bookings
  getAllBookings: async (): Promise<BookingResponse[]> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get booking by ID
  getBookingById: async (id: string): Promise<BookingResponse> => {
    try {
      console.log(`Fetching booking from: ${API_BASE_URL}/${id}`);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Received booking data:', data);
      return data;
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      throw error;
    }
  },

  // Create a new booking
  createBooking: async (booking: BookingRequest): Promise<BookingResponse> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Update booking
  updateBooking: async (id: string, booking: Partial<Booking>): Promise<BookingResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating booking ${id}:`, error);
      throw error;
    }
  },

  // Delete booking
  deleteBooking: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting booking ${id}:`, error);
      throw error;
    }
  },

  // Get bookings by customer ID
  getBookingsByCustomerId: async (customerId: string): Promise<BookingResponse[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching bookings for customer ${customerId}:`, error);
      throw error;
    }
  },

  // Get bookings by vehicle ID
  getBookingsByVehicleId: async (vehicleId: string): Promise<BookingResponse[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicle/${vehicleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching bookings for vehicle ${vehicleId}:`, error);
      throw error;
    }
  },

  // Get bookings by customer email
  getBookingsByEmail: async (email: string): Promise<BookingResponse[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching bookings for email ${email}:`, error);
      throw error;
    }
  },

  // Get bookings by status
  getBookingsByStatus: async (status: string): Promise<BookingResponse[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/status/${status}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching bookings with status ${status}:`, error);
      throw error;
    }
  },

  // Update booking status only
  updateBookingStatus: async (id: string, status: string): Promise<BookingResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/status?status=${status}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating status for booking ${id}:`, error);
      throw error;
    }
  },

  // Check vehicle availability
  checkVehicleAvailability: async (
    vehicleId: string,
    pickupDate: string,
    returnDate: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/availability?vehicleId=${encodeURIComponent(vehicleId)}&pickupDate=${pickupDate}&returnDate=${returnDate}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error checking availability for vehicle ${vehicleId}:`, error);
      throw error;
    }
  },
};
