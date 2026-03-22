import axios from 'axios';

const api = axios.create({
  baseURL: `/api/bookings`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface BookingRequest {
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  licenseNumber: string;
  pickupDate: string; // YYYY-MM-DD
  returnDate: string; // YYYY-MM-DD
  pickupLocation: string;
  returnLocation: string;
  pricePerDay: number;
  specialRequests?: string;
  status?: string;
}

export interface BookingResponse {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  licenseNumber: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  numberOfDays: number;
  pricePerDay: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  specialRequests: string;
  createdAt: string;
  updatedAt: string;
}

export const bookingService = {
  createBooking: async (data: BookingRequest): Promise<BookingResponse> => {
    const response = await api.post<BookingResponse>('', data);
    return response.data;
  },

  getBookingById: async (id: string): Promise<BookingResponse> => {
    const response = await api.get<BookingResponse>(`/${id}`);
    return response.data;
  },

  getAllBookings: async (): Promise<BookingResponse[]> => {
    const response = await api.get<BookingResponse[]>('');
    return response.data;
  },

  getBookingsByCustomerEmail: async (email: string): Promise<BookingResponse[]> => {
    const response = await api.get<BookingResponse[]>(`/customer/${email}`);
    return response.data;
  },

  updateBooking: async (id: string, data: BookingRequest): Promise<BookingResponse> => {
    const response = await api.put<BookingResponse>(`/${id}`, data);
    return response.data;
  },

  updateBookingStatus: async (id: string, status: string): Promise<BookingResponse> => {
    const response = await api.put<BookingResponse>(`/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  deleteBooking: async (id: string): Promise<void> => {
    await api.delete(`/${id}`);
  },

  checkAvailability: async (
    vehicleId: string,
    pickupDate: string,
    returnDate: string
  ): Promise<boolean> => {
    const response = await api.get<{ available: boolean }>('/check-availability', {
      params: { vehicleId, pickupDate, returnDate },
    });
    return response.data.available;
  },
};
