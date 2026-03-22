"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const shortRef = bookingId ? bookingId.substring(0, 8).toUpperCase() : null;

  return (
    <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
      {/* Animated checkmark */}
      <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
        <div className="h-20 w-20 bg-green-200 rounded-full flex items-center justify-center animate-ping absolute opacity-30" />
        <svg className="h-10 w-10 text-green-600 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
      <p className="text-slate-500 leading-relaxed mb-6">
        Your transaction has been completed. A confirmation receipt will be sent to your email.
      </p>

      {shortRef && (
        <div className="mb-8 rounded-xl bg-slate-50 border border-slate-200 px-6 py-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Booking Reference</p>
          <p className="text-2xl font-mono font-bold text-slate-800 tracking-widest">#{shortRef}</p>
        </div>
      )}

      {/* Step completion */}
      <div className="mb-8 flex items-center gap-2 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <span className="text-xs font-semibold text-green-600">Booked</span>
        </div>
        <div className="h-px w-6 bg-green-300" />
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <span className="text-xs font-semibold text-green-600">Paid</span>
        </div>
        <div className="h-px w-6 bg-green-300" />
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <span className="text-xs font-semibold text-green-600">Confirmed</span>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/profile?tab=bookings"
          className="block w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
        >
          View My Bookings
        </Link>
        <Link
          href="/vehicles"
          className="block w-full py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
        >
          Browse More Vehicles
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <Suspense
          fallback={
            <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
              <div className="h-10 w-10 rounded-full border-4 border-green-100 border-t-green-600 animate-spin mx-auto" />
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}