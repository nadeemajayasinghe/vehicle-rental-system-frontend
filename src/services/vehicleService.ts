import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://api-gateway-alb-1602792189.eu-north-1.elb.amazonaws.com';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/vehicles`,
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

export interface VehicleRequest {
  make: string;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  dailyRate: number;
  mileage: number;
  color: string;
  imageUrl: string;
  description: string;
}

export interface VehicleResponse {
  id: string;
  make: string;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  dailyRate: number;
  mileage: number;
  color: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedVehicleResponse {
  dataList: VehicleResponse[];
  dataCount: number;
}

export interface StandardResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const vehicleService = {
  getAllVehicles: async (
    searchText: string = '',
    page: number = 0,
    size: number = 12
  ): Promise<PaginatedVehicleResponse> => {
    const response = await api.get<StandardResponse<PaginatedVehicleResponse>>('/list', {
      params: { searchText, page, size },
    });
    return response.data.data;
  },

  getVehicleById: async (id: string): Promise<VehicleResponse> => {
    const response = await api.get<StandardResponse<VehicleResponse>>(`/${id}`);
    return response.data.data;
  },

  createVehicle: async (data: VehicleRequest): Promise<void> => {
    await api.post('', data);
  },

  updateVehicle: async (id: string, data: VehicleRequest): Promise<void> => {
    await api.put(`/${id}`, data);
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await api.delete(`/${id}`);
  },
};
