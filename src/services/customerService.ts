import axios from 'axios';


const API_BASE_URL = 'http://api-gateway-alb-1602792189.eu-north-1.elb.amazonaws.com';

const api = axios.create({
  baseURL: `${API_BASE_URL}/customers`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  contact: string;
  address: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface CustomerResponse {
  id: number;
  name: string;
  email: string;
  contact: string;
  address: string;
  role: string;
}

export interface UpdateCustomerRequest {
  name: string;
  contact: string;
  address: string;
}

export interface ServiceHistoryResponse {
  id: number;
  serviceDate: string;
  vehicle: string;
  description: string;
  status: string;
  cost: number;
}

export const customerService = {
  register: async (data: RegisterRequest): Promise<CustomerResponse> => {
    const response = await api.post('/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/login', data);
    return response.data;
  },

  getProfile: async (id: number): Promise<CustomerResponse> => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  updateCustomer: async (id: number, data: UpdateCustomerRequest): Promise<CustomerResponse> => {
    const response = await api.put(`/${id}`, data);
    return response.data;
  },

  deleteCustomer: async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
  },

  getServiceHistory: async (id: number): Promise<ServiceHistoryResponse[]> => {
    const response = await api.get(`/${id}/history`);
    return response.data;
  },
};
