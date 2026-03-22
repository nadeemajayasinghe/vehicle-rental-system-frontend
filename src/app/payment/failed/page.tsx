"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function FailedContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  return (
    <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
      <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
        <div className="h-20 w-20 bg-red-200 rounded-full flex items-center justify-center absolute opacity-30" />
        <svg className="h-10 w-10 text-red-600 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Failed</h1>
      <p className="text-slate-500 leading-relaxed mb-8">
        We couldn&apos;t process your payment. Your booking is saved — retry below or view it in your profile.
      </p>

      {bookingId && (
        <div className="mb-8 rounded-xl bg-amber-50 border border-amber-200 px-6 py-4">
          <div className="flex items-center gap-2 justify-center mb-1">
            <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Your Booking is Saved</p>
          </div>
          <p className="text-[11px] text-amber-600">
            Booking #{bookingId.substring(0, 8).toUpperCase()} — Retry payment below.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <Link
          href={bookingId ? `/payment?bookingId=${bookingId}` : "/payment"}
          className="block w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Try Again
        </Link>
        <Link
          href="/profile?tab=bookings"
          className="block w-full py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
        >
          View My Bookings
        </Link>
      </div>
    </div>
  );
}

export default function FailedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <Suspense
          fallback={
            <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
              <div className="h-10 w-10 rounded-full border-4 border-red-100 border-t-red-600 animate-spin mx-auto" />
            </div>
          }
        >
          <FailedContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}