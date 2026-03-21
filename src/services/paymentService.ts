import axios from "axios";
import { PaymentRequest, PaymentResponse } from "@/types/payment";

const BASE_URL = "http://api-gateway-alb-1602792189.eu-north-1.elb.amazonaws.com";
const API = `${BASE_URL}/payments`;

export const createPayment = async (data: PaymentRequest) => {
  const res = await axios.post<PaymentResponse>(API, data);
  console.log(res.data);
  return res.data;
};

export const getPaymentById = async (id: number) => {
  const res = await axios.get<PaymentResponse>(`${API}/${id}`);
  return res.data;
};

export const getByBookingId = async (bookingId: string) => {
  const res = await axios.get<PaymentResponse>(`${API}/booking/${bookingId}`);
  return res.data;
};

export const refundPayment = async (id: number) => {
  const res = await axios.put<PaymentResponse>(`${API}/${id}/refund`);
  return res.data;
};