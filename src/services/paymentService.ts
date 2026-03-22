import axios from "axios";
import { PaymentRequest, PaymentResponse, BookingDetails } from "@/types/payment";

const BOOKING_API = "/api/bookings";

const API = "/api/payments";


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


export const getBookingById = async (bookingId: string): Promise<BookingDetails> => {
  const res = await axios.get<BookingDetails>(`${BOOKING_API}/${bookingId}`);
  return res.data;
};