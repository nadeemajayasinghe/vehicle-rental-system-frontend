export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address: string;
  contact: string;
  name: string;
};

const DEFAULT_BASE_URL = "http://localhost:8080";

const CUSTOMER_SERVICE_BASE_URL =
  process.env.NEXT_PUBLIC_CUSTOMER_SERVICE_URL ?? DEFAULT_BASE_URL;

const LOGIN_PATH =
  process.env.NEXT_PUBLIC_CUSTOMER_LOGIN_PATH ?? "/customers/login";

const REGISTER_PATH =
  process.env.NEXT_PUBLIC_CUSTOMER_REGISTER_PATH ?? "/customers/register";

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${CUSTOMER_SERVICE_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export async function loginCustomer(payload: LoginRequest) {
  return request<Record<string, unknown>>(LOGIN_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerCustomer(payload: RegisterRequest) {
  return request<Record<string, unknown>>(REGISTER_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
