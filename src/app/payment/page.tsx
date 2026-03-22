import { Suspense } from "react";
import PaymentForm from "@/components/PaymentForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Step Progress */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                ✓
              </div>
              <span className="text-sm font-semibold text-green-600">Booking Details</span>
            </div>
            <div className="h-px flex-1 bg-blue-200" />
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-600/30">
                2
              </div>
              <span className="text-sm font-semibold text-blue-600">Payment</span>
            </div>
            <div className="h-px flex-1 bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-xs font-bold text-slate-400">
                3
              </div>
              <span className="text-sm font-medium text-slate-400">Confirmed</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl">
          <Suspense
            fallback={
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-10 flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                <p className="text-sm font-medium text-slate-500">Loading payment details...</p>
              </div>
            }
          >
            <PaymentForm />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}