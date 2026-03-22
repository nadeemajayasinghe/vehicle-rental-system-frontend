import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
          <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Payment Successful!</h1>
          <p className="text-slate-500 mb-10 leading-relaxed">
            Your transaction has been completed successfully. A confirmation receipt has been sent to your email.
          </p>
          <div className="space-y-3">
            <Link 
              href="/home" 
              className="block w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link 
              href="/vehicles" 
              className="block w-full py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
            >
              Browse More Vehicles
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}