"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPayment, getBookingById } from "@/services/paymentService";
import { PaymentMethod, BookingDetails } from "@/types/payment";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormErrors { [key: string]: string; }

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCardNumber = (v: string) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
};

const getCardType = (n: string): "visa" | "mastercard" | "amex" | null => {
  const r = n.replace(/\s/g, "");
  if (/^4/.test(r)) return "visa";
  if (/^5[1-5]/.test(r)) return "mastercard";
  if (/^3[47]/.test(r)) return "amex";
  return null;
};

// ─── Sub-Components ───────────────────────────────────────────────────────────
function CardPreview({ cardType, cardNumber, cardHolder, expiry, method }: {
  cardType: ReturnType<typeof getCardType>;
  cardNumber: string; cardHolder: string; expiry: string;
  method: "CREDIT_CARD" | "DEBIT_CARD";
}) {
  return (
    <div className="mb-6 h-48 w-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-lg relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="h-10 w-12 rounded-md bg-gradient-to-br from-amber-400 to-amber-200 opacity-80" />
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {method === "CREDIT_CARD" ? "Credit" : "Debit"}
          </p>
          <div className="mt-1 h-6 font-bold capitalize">
            {cardType || "Card"}
          </div>
        </div>
      </div>

      <div className="mt-8 relative z-10">
        <p className="text-xl font-mono tracking-[0.2em] text-slate-100">
          {cardNumber.padEnd(19, "•") || "•••• •••• •••• ••••"}
        </p>
      </div>

      <div className="mt-6 flex justify-between items-end relative z-10">
        <div>
          <p className="text-[8px] uppercase tracking-wider text-slate-400">Card Holder</p>
          <p className="text-sm font-semibold tracking-wide uppercase truncate max-w-[180px]">
            {cardHolder || "Your Name"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[8px] uppercase tracking-wider text-slate-400">Expires</p>
          <p className="text-sm font-mono font-semibold">{expiry || "MM/YY"}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PaymentForm() {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>("CREDIT_CARD");
  const [rentalId, setRentalId] = useState("");
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  async function lookupBooking(id: string) {
    const trimmed = id.trim();
    if (!trimmed) return;
    setBookingLoading(true);
    setBookingError("");
    setBookingDetails(null);
    try {
      const booking = await getBookingById(trimmed);
      setBookingDetails(booking);
      setAmount(String(booking.totalAmount));
    } catch {
      setBookingError("Booking not found. Check the ID.");
      setAmount("");
    } finally {
      setBookingLoading(false);
    }
  }

  function clearBooking() {
    setBookingDetails(null);
    setBookingError("");
    setRentalId("");
    setAmount("");
  }

  const isCard = method === "CREDIT_CARD" || method === "DEBIT_CARD";
  const cardType = getCardType(cardNumber);

  const METHODS = [
    { value: "CREDIT_CARD" as PaymentMethod, label: "Credit Card", icon: "💳" },
    { value: "DEBIT_CARD" as PaymentMethod, label: "Debit Card", icon: "🏦" },
    { value: "CASH" as PaymentMethod, label: "Cash", icon: "💵" },
  ];

  function validate() {
    const e: FormErrors = {};
    if (!rentalId.trim()) e.rentalId = "Required";
    if (!amount || Number(amount) <= 0) e.amount = "Invalid amount";
    if (isCard) {
      if (cardNumber.replace(/\s/g, "").length < 13) e.cardNumber = "Invalid card number";
      if (!cardHolder.trim()) e.cardHolder = "Required";
      if (!/^\d{2}\/\d{2}$/.test(expiry)) e.expiry = "MM/YY required";
      if (cvv.length < 3) e.cvv = "Invalid";
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        paymentMethod: method,
        amount: Number(amount),
        currency: "LKR",
        bookingId: rentalId,
        ...(isCard && {
          cardNumber: cardNumber.replace(/\s/g, "").slice(-4).padStart(16, "*"),
          expiryDate: expiry,
          cvv: "***",
          cardHolderName: cardHolder,
          ...(email && { email }),
        }),
      };
      const res = await createPayment(payload as any);
      router.push(res.status === "SUCCESS" ? "/payment/success" : "/payment/failed");
    } catch {
      router.push("/payment/failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900">Checkout</h2>
        <p className="text-sm text-slate-500 mt-1">Select your payment method and confirm booking.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Methods */}
        <div className="grid grid-cols-3 gap-3">
          {METHODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => { setMethod(m.value); setErrors({}); }}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border-2 transition-all ${
                method === m.value 
                  ? "border-blue-600 bg-blue-50 text-blue-600" 
                  : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
              }`}
            >
              <span className="text-xl mb-1">{m.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-tight">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Card Preview (Only for card methods) */}
        {isCard && (
          <CardPreview 
            cardType={cardType} 
            cardNumber={cardNumber} 
            cardHolder={cardHolder} 
            expiry={expiry} 
            method={method as "CREDIT_CARD" | "DEBIT_CARD"} 
          />
        )}

        {/* Booking & Amount Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Booking ID
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Booking ID"
                value={rentalId}
                onChange={(e) => {
                  setRentalId(e.target.value);
                  if (bookingDetails) clearBooking();
                  if (bookingError) setBookingError("");
                }}
                onBlur={() => { if (rentalId.trim() && !bookingDetails) lookupBooking(rentalId); }}
                className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-sm font-medium ${
                  errors.rentalId || bookingError
                    ? "border-red-300 bg-red-50 text-red-900 focus:border-red-500"
                    : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white"
                }`}
                readOnly={bookingLoading}
              />
              {bookingLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
              )}
            </div>
            {bookingError && <p className="mt-1.5 text-[10px] font-medium text-red-500">{bookingError}</p>}
            {errors.rentalId && <p className="mt-1.5 text-[10px] font-medium text-red-500">Required</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Amount (LKR)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => !bookingDetails && setAmount(e.target.value)}
              readOnly={!!bookingDetails}
              className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-sm font-bold ${
                bookingDetails 
                  ? "border-green-200 bg-green-50 text-green-700" 
                  : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white"
              }`}
            />
          </div>
        </div>

        {/* Booking Details Summary */}
        {bookingDetails && (
          <div className="p-4 rounded-xl border border-green-100 bg-green-50/50 space-y-1">
            <p className="text-xs font-bold text-green-800">{bookingDetails.vehicleName}</p>
            <p className="text-[10px] text-green-600 leading-relaxed">
              {bookingDetails.customerName} • {bookingDetails.pickupDate} to {bookingDetails.returnDate}
            </p>
          </div>
        )}

        {/* Card Details (Only for card methods) */}
        {isCard && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Card Number</label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-sm font-mono ${
                  errors.cardNumber ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Card Holder Name</label>
              <input
                type="text"
                placeholder="Name on card"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-sm font-semibold uppercase ${
                  errors.cardHolder ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white"
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-sm font-mono ${
                    errors.expiry ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CVV</label>
                <input
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-sm font-mono ${
                    errors.cvv ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Cash Message */}
        {method === "CASH" && (
          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center space-y-2">
            <span className="text-3xl">🤝</span>
            <p className="text-sm font-bold text-slate-800">Pay at Location</p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[200px] mx-auto">
              Confirm your reservation now and pay when you pick up your vehicle.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            method === "CASH" ? "Confirm Reservation" : `Pay ${amount ? `LKR ${Number(amount).toLocaleString()}` : "Now"}`
          )}
        </button>

        <p className="text-[10px] text-center text-slate-400 font-medium tracking-tight">
          🔒 Secure 256-bit SSL Encrypted Payment
        </p>
      </form>
    </div>
  );
}