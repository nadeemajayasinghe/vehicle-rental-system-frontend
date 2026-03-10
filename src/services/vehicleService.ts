import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const VEHICLE_API = `${API_BASE}/api/v1/vehicles`;

// ── Types ────────────────────────────────────────────
export interface Vehicle {
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

export interface PaginatedVehicles {
  content: Vehicle[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface StandardResponse<T> {
  code: number;
  message: string;
  data: T;
}

// ── API calls ─────────────────────────────────────────
export const vehicleService = {
  /**
   * Get paginated list of vehicles with optional search
   * GET /api/v1/vehicles/list?searchText=&page=0&size=9
   */
  async getAllVehicles(
    searchText = '',
    page = 0,
    size = 9
  ): Promise<PaginatedVehicles> {
    const { data } = await axios.get<StandardResponse<PaginatedVehicles>>(
      `${VEHICLE_API}/list`,
      { params: { searchText, page, size } }
    );
    return data.data;
  },

  /**
   * Get single vehicle by id
   * GET /api/v1/vehicles/{id}
   */
  async getVehicleById(id: string): Promise<Vehicle> {
    const { data } = await axios.get<StandardResponse<Vehicle>>(
      `${VEHICLE_API}/${id}`
    );
    return data.data;
  },
};

export default vehicleService;
