import axios from "axios";
import { PaymentRequest, PaymentResponse } from "@/types/payment";

const API = "http://localhost:8080/payments";

export const createPayment = async (data: PaymentRequest) => {
  const res = await axios.post<PaymentResponse>(API, data);
  return res.data;
};

export const getPaymentById = async (id: number) => {
  const res = await axios.get<PaymentResponse>(`${API}/${id}`);
  return res.data;
};

export const getByBookingId = async (bookingId: string) => {
  const res = await axios.get<PaymentResponse>(
    `${API}/booking/${bookingId}`
  );
  return res.data;
};

export const refundPayment = async (id: number) => {
  const res = await axios.put<PaymentResponse>(`${API}/${id}/refund`);
  return res.data;
};