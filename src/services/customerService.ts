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

export type CustomerProfile = {
  id?: string | number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  contact?: string;
  address?: string;
  createdAt?: string;
  role?: string;
};

const DEFAULT_BASE_URL =
  "https://customer-service.delightfulbush-f9febfc5.southeastasia.azurecontainerapps.io";

const CUSTOMER_SERVICE_BASE_URL =
  process.env.NEXT_PUBLIC_CUSTOMER_SERVICE_URL ?? DEFAULT_BASE_URL;

const LOGIN_PATH =
  process.env.NEXT_PUBLIC_CUSTOMER_LOGIN_PATH ?? "/customers/login";

const REGISTER_PATH =
  process.env.NEXT_PUBLIC_CUSTOMER_REGISTER_PATH ?? "/customers/register";

const PROFILE_PATH =
  process.env.NEXT_PUBLIC_CUSTOMER_PROFILE_PATH ??
  "/customers/{{customerId}}";

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

function resolveProfilePath(customerId: string) {
  return PROFILE_PATH.replace("{{customerId}}", customerId);
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded =
      base64.length % 4 === 0
        ? base64
        : base64.padEnd(base64.length + (4 - (base64.length % 4)), "=");
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function extractCustomerIdFromToken(token: string): string | null {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return null;
  }

  const candidate =
    (typeof payload.customerId === "string" ||
    typeof payload.customerId === "number"
      ? payload.customerId
      : null) ??
    (typeof payload.id === "string" || typeof payload.id === "number"
      ? payload.id
      : null) ??
    (typeof payload.userId === "string" || typeof payload.userId === "number"
      ? payload.userId
      : null) ??
    (typeof payload.sub === "string" || typeof payload.sub === "number"
      ? payload.sub
      : null);

  return candidate !== null && candidate !== undefined
    ? String(candidate)
    : null;
}

export async function getCustomerProfile(customerId?: string) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const storedCustomerId =
    typeof window !== "undefined" ? localStorage.getItem("customerId") : null;
  const finalCustomerId =
    customerId ??
    storedCustomerId ??
    (token ? extractCustomerIdFromToken(token) : null) ??
    "";

  if (!token) {
    throw new Error("You must be logged in to view your profile.");
  }
  if (!finalCustomerId) {
    throw new Error("Customer ID is missing. Please log in again.");
  }

  if (!storedCustomerId && token) {
    localStorage.setItem("customerId", finalCustomerId);
  }

  return request<CustomerProfile>(resolveProfilePath(finalCustomerId), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
